import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import moment from 'moment-timezone';
import lodash from 'lodash';
import axios from 'axios';
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { verifyToken } from '../state/services/authService';
import { getWarehouses } from '../state/services/warehouseService';
import { getBookings, getUserDateFilterField, alliedBooking, stBooking, getSTLabel, getAlliedLabel, allTrigger, updateBooking } from '../state/services/bookingService';
import { getBookingLines } from '../state/services/bookingLinesService';
import { getBookingLineDetails } from '../state/services/bookingLineDetailsService';
import TooltipItem from '../components/Tooltip/TooltipComponent';
import { API_HOST, STATIC_HOST, HTTP_PROTOCOL } from '../config';

class AllBookingsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            bookings: [],
            bookingLines: [],
            bookingLineDetails: [],
            warehouses: [],
            mainDate: '',
            userDateFilterField: '',
            selectedWarehouseId: 0,
            sortField: 'id',
            sortDirection: -1,
            itemCountPerPage: 10,
            filterInputs: {},
            selectedBookingIds: [],
            additionalInfoOpens: [],
            bookingLinesInfoOpens: [],
            bookingLinesQtyTotal: 0,
            bookingLineDetailsQtyTotal: 0,
        };

        this.togglePopover = this.togglePopover.bind(this);
    }

    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        getBookings: PropTypes.func.isRequired,
        updateBooking: PropTypes.func.isRequired,
        getBookingLines: PropTypes.func.isRequired,
        getBookingLineDetails: PropTypes.func.isRequired,
        getWarehouses: PropTypes.func.isRequired,
        getUserDateFilterField: PropTypes.func.isRequired,
        allTrigger: PropTypes.func.isRequired,
        alliedBooking: PropTypes.func.isRequired,
        stBooking: PropTypes.func.isRequired,
        getSTLabel: PropTypes.func.isRequired,
        getAlliedLabel: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
    };

    componentDidMount() {
        const token = localStorage.getItem('token');
        const currentRoute = this.props.location.pathname;

        if (token && token.length > 0) {
            this.props.verifyToken();
        } else {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.history.push('/');
        }

        if (this.props.redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.history.push('/');
        }

        const today = localStorage.getItem('today');
        let mainDate = '';
        let dateParam = '';

        if (today) {
            mainDate = moment(today, 'YYYY-MM-DD').toDate();
            dateParam = moment(today, 'YYYY-MM-DD').format('YYYY-MM-DD');
        } else {
            mainDate = moment().tz('Australia/Sydney').toDate();
            dateParam = moment().tz('Australia/Sydney').format('YYYY-MM-DD');
        }

        this.setState({ mainDate: moment(mainDate).format('YYYY-MM-DD') });

        this.props.getBookings(dateParam, 0, this.state.itemCountPerPage);
        this.props.getWarehouses();
        this.props.getUserDateFilterField();
    }

    componentWillMount() {
        // document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        // document.removeEventListener('mousedown', this.handleClickOutside);
    }

    componentWillReceiveProps(newProps) {
        const { bookings, bookingsCnt, bookingLines, bookingLineDetails, warehouses, userDateFilterField, redirect, needUpdateBookings } = newProps;
        const currentRoute = this.props.location.pathname;

        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.history.push('/');
        }

        if (bookings) {
            this.setState({ bookings, bookingsCnt });
        }

        if (bookingLineDetails) {
            this.setState({bookingLineDetails: this.calcBookingLineDetail(bookingLineDetails)});
        }

        if (bookingLines) {
            this.setState({bookingLines: this.calcBookingLine(bookingLines)});
        }

        if (warehouses) {
            this.setState({ warehouses });
        }

        if (userDateFilterField) {
            this.setState({ userDateFilterField });
        }

        if (needUpdateBookings) {
            const {mainDate, itemCountPerPage, sortDirection, selectedWarehouseId} = this.state;
            let sortField = this.state.sortField;
            let warehouseId = 0;

            if (sortDirection < 0)
                sortField = '-' + sortField;

            if (selectedWarehouseId !== 'all')
                warehouseId = selectedWarehouseId;

            this.props.getBookings(mainDate, warehouseId, itemCountPerPage, sortField);
        }
    }

    calcBookingLine(bookingLines) {
        let bookingLinesQtyTotal = 0;

        let newBookingLines = bookingLines.map((bookingLine) => {
            if (bookingLine.e_weightUOM === 'Gram' || bookingLine.e_weightUOM === 'Grams')
                bookingLine['total_kgs'] = bookingLine.e_qty * bookingLine.e_weightPerEach / 1000;
            else if (bookingLine.e_weightUOM === 'Kilogram' || bookingLine.e_weightUOM === 'Kilograms')
                bookingLine['total_kgs'] = bookingLine.e_qty * bookingLine.e_weightPerEach;
            else if (bookingLine.e_weightUOM === 'Kg' || bookingLine.e_weightUOM === 'Kgs')
                bookingLine['total_kgs'] = bookingLine.e_qty * bookingLine.e_weightPerEach;
            else if (bookingLine.e_weightUOM === 'Ton' || bookingLine.e_weightUOM === 'Tons')
                bookingLine['total_kgs'] = bookingLine.e_qty * bookingLine.e_weightPerEach;
            else
                bookingLine['total_kgs'] = bookingLine.e_qty * bookingLine.e_weightPerEach;

            if (bookingLine.e_dimUOM === 'CM')
                bookingLine['cubic_meter'] = bookingLine.e_qty * bookingLine.e_dimLength * bookingLine.e_dimWidth * bookingLine.e_dimHeight / 1000000;
            else if (bookingLine.e_dimUOM === 'Meter')
                bookingLine['cubic_meter'] = bookingLine.e_qty * bookingLine.e_dimLength * bookingLine.e_dimWidth * bookingLine.e_dimHeight / 1000000000;

            bookingLinesQtyTotal += bookingLine.e_qty;

            return bookingLine;
        });

        this.setState({ bookingLinesQtyTotal });
        return newBookingLines;
    }

    calcBookingLineDetail(bookingLineDetails) {
        let bookingLineDetailsQtyTotal = 0;

        let newBookingLineDetails = bookingLineDetails.map((bookingLineDetail) => {
            bookingLineDetailsQtyTotal += bookingLineDetail.quantity;

            return bookingLineDetail;
        });

        this.setState({ bookingLineDetailsQtyTotal });
        return newBookingLineDetails;
    }

    onDateChange(date) {
        const {selectedWarehouseId, itemCountPerPage} = this.state;
        const mainDate = moment(date).format('YYYY-MM-DD');

        if (selectedWarehouseId === 'all') {
            this.props.getBookings(mainDate, 0, itemCountPerPage);
        } else {
            this.props.getBookings(mainDate, selectedWarehouseId, itemCountPerPage);
        }

        localStorage.setItem('today', mainDate);
        this.setState({ mainDate, sortField: 'id', sortDirection: 1 });
    }

    onWarehouseSelected(e) {
        const {mainDate, itemCountPerPage, sortDirection} = this.state;
        const selectedWarehouseId = e.target.value;
        let sortField = this.state.sortField;
        let warehouseId = 0;

        if (sortDirection < 0)
            sortField = '-' + sortField;

        if (selectedWarehouseId !== 'all')
            warehouseId = selectedWarehouseId;

        this.props.getBookings(mainDate, warehouseId, itemCountPerPage, sortField);
        this.setState({ selectedWarehouseId });
    }

    onItemCountPerPageChange(e) {
        console.log('@80 - ', e.target.value);
        // const {mainDate, selectedWarehouseId} = this.state;
        // const itemCountPerPage = e.target.value;
        //
        // if (selectedWarehouseId === 'all') {
        //     this.props.getBookings(mainDate);
        // } else {
        //     this.props.getBookings(mainDate, selectedWarehouseId, itemCountPerPage);
        // }
        //
        // this.setState({ itemCountPerPage });
    }

    onChangeSortField(fieldName) {
        const {mainDate, selectedWarehouseId, itemCountPerPage} = this.state;
        let sortField = this.state.sortField;
        let sortDirection = this.state.sortDirection;
        let warehouseId = 0;

        if (fieldName === sortField)
            sortDirection = -1 * sortDirection;
        else
            sortDirection = -1;

        if (sortDirection < 0)
            sortField = '-' + sortField;

        if (selectedWarehouseId !== 'all')
            warehouseId = selectedWarehouseId;

        this.setState({ sortField: fieldName, sortDirection });

        if (sortDirection < 0)
            fieldName = '-' + fieldName;

        this.props.getBookings(mainDate, warehouseId, itemCountPerPage, fieldName);
    }

    onChangeFilterInput(e) {
        const {mainDate, selectedWarehouseId, itemCountPerPage} = this.state;
        let sortField = this.state.sortField;
        let sortDirection = this.state.sortDirection;
        let filterInputs = this.state.filterInputs;
        let warehouseId = 0;

        if (sortDirection < 0)
            sortField = '-' + sortField;

        if (selectedWarehouseId !== 'all')
            warehouseId = selectedWarehouseId;

        filterInputs[e.target.name] = e.target.value;
        this.props.getBookings(mainDate, warehouseId, itemCountPerPage, sortField, filterInputs);
        this.setState({filterInputs});
    }

    showAdditionalInfo(bookingId) {
        let additionalInfoOpens = this.state.additionalInfoOpens;
        let flag = additionalInfoOpens['additional-info-popup-' + bookingId];
        additionalInfoOpens = [];

        if (flag)
            additionalInfoOpens['additional-info-popup-' + bookingId] = false;
        else
            additionalInfoOpens['additional-info-popup-' + bookingId] = true;

        this.setState({ additionalInfoOpens, bookingLinesInfoOpens: [], bookingLineDetails: [] });
    }

    getPKBookingIdFromId(id) {
        const {bookings} = this.state;
        let pkBookingId = 0;

        for (let i = 0; i < bookings.length; i++) {
            if (bookings[i].id === id) {
                pkBookingId = bookings[i].pk_booking_id;
                break;
            }
        }

        return pkBookingId;
    }

    showBookingLinesInfo(bookingId) {
        const pkBookingId = this.getPKBookingIdFromId(bookingId);

        this.props.getBookingLines(pkBookingId);
        this.props.getBookingLineDetails(pkBookingId);

        let bookingLinesInfoOpens = this.state.bookingLinesInfoOpens;
        let flag = bookingLinesInfoOpens['booking-lines-info-popup-' + bookingId];
        bookingLinesInfoOpens = [];

        if (flag)
            bookingLinesInfoOpens['booking-lines-info-popup-' + bookingId] = false;
        else
            bookingLinesInfoOpens['booking-lines-info-popup-' + bookingId] = true;

        this.setState({ bookingLinesInfoOpens, additionalInfoOpens: [], bookingLineDetails: [] });
    }

    clearActivePopoverVar() {
        this.setState({ additionalInfoOpens: [], bookingLinesInfoOpens: [], bookingLineDetails: [] });
    }

    togglePopover() {
        this.clearActivePopoverVar();
    }

    onCheck(e, id) {
        if (!e.target.checked) {
            this.setState({selectedBookingIds: lodash.difference(this.state.selectedBookingIds, [id])});
        } else {
            this.setState({selectedBookingIds: lodash.union(this.state.selectedBookingIds, [id])});
        }
    }

    onClickAllTrigger() {
        this.props.allTrigger();
    }

    onClickBook() {
        const { selectedBookingIds, bookings } = this.state;
        const st_name = 'startrack';
        const allied_name = 'allied';

        if (selectedBookingIds.length == 0) {
            alert('Please check only one booking!');
        } else if (selectedBookingIds.length > 1) {
            alert('Please check only one booking!');
        } else {
            let ind = -1;

            for (let i = 0; i < bookings.length; i++) {
                if (bookings[i].id === selectedBookingIds[0]) {
                    ind = i;
                    break;
                }
            }

            if (ind > -1) {
                if (bookings[ind].vx_freight_provider && bookings[ind].vx_freight_provider.toLowerCase() === st_name) {
                    this.props.stBooking(bookings[ind].id);
                } else if (bookings[ind].vx_freight_provider && bookings[ind].vx_freight_provider.toLowerCase() === allied_name) {
                    this.props.alliedBooking(bookings[ind].id);
                }
            }
        }
    }

    onClickGetLabel() {
        const { selectedBookingIds, bookings } = this.state;
        const st_name = 'startrack';
        const allied_name = 'allied';

        if (selectedBookingIds.length == 0) {
            alert('Please check only one booking!');
        } else if (selectedBookingIds.length > 1) {
            alert('Please check only one booking!');
        } else {
            let ind = -1;

            for (let i = 0; i < bookings.length; i++) {
                if (bookings[i].id === selectedBookingIds[0]) {
                    ind = i;
                    break;
                }
            }

            if (ind > -1) {
                if (bookings[ind].vx_freight_provider.toLowerCase() === st_name) {
                    this.props.getSTLabel(bookings[ind].id);
                } else if (bookings[ind].vx_freight_provider.toLowerCase() === allied_name) {
                    this.props.getAlliedLabel(bookings[ind].id);
                }
            }
        }
    }

    onDownloadPdfs() {
        const { selectedBookingIds, bookings } = this.state;

        for (let i = 0; i < selectedBookingIds.length; i++) {
            let ind = -1;

            for (let j = 0; j < bookings.length; j++) {
                if (bookings[j].id === selectedBookingIds[i]) {
                    ind = j;
                    break;
                }
            }

            if (ind > -1) {
                const options = {
                    method: 'get',
                    url: HTTP_PROTOCOL + '://' + API_HOST + '/download-pdf?filename=' + bookings[ind].z_label_url + '&id=' + bookings[ind].id,
                    responseType: 'blob', // important
                };

                axios(options).then((response) => {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', bookings[ind].z_label_url);
                    document.body.appendChild(link);
                    link.click();
                });
            } else {
                alert('No matching booking id');
            }
        }
    }

    onClickPrinter(booking) {
        let bookings = this.state.bookings;
        booking.is_printed = !booking.is_printed;
        booking.z_downloaded_shipping_label_timestamp = new Date();
        this.props.updateBooking(booking.id, booking);

        let index = 0;
        for (let i = 0; i < bookings.length; i++) {
            if (booking.id === bookings[i].id) {
                index = i;
                break;
            }
        }

        if (booking.z_label_url && booking.z_label_url.length > 0) {
            let that=this;
            bookings.splice(index, 1);

            var win = window.open(HTTP_PROTOCOL + '://' + STATIC_HOST + '/pdfs/' + booking.z_label_url, '_blank');
            win.focus();

            setTimeout(function(){
                bookings.splice(index, 0, booking);
                that.setState({ bookings});
            }, 100);
        } else {
            alert('This booking has no label');
        }
    }

    onClickRow(e) {
        window.location.assign('/booking?bookingid=' + e);
    }

    render() {
        const { bookings, bookingsCnt, bookingLines, bookingLineDetails, mainDate, selectedWarehouseId, warehouses, filterInputs, bookingLinesQtyTotal, bookingLineDetailsQtyTotal, sortField, sortDirection } = this.state;

        const warehousesList = warehouses.map((warehouse, index) => {
            return (
                <option key={index} value={warehouse.pk_id_client_warehouses}>{warehouse.warehousename}</option>
            );
        });

        const bookingLineDetailsList = bookingLineDetails.map((bookingLineDetail, index) => {
            return (
                <tr key={index}>
                    <td>{bookingLineDetail.modelNumber}</td>
                    <td>{bookingLineDetail.itemDescription}</td>
                    <td className="qty">{bookingLineDetail.quantity}</td>
                    <td>{bookingLineDetail.itemFaultDescription}</td>
                    <td>{bookingLineDetail.insuranceValueEach}</td>
                    <td>{bookingLineDetail.gap_ra}</td>
                    <td>{bookingLineDetail.clientRefNumber}</td>
                </tr>
            );
        });

        const bookingLinesList = bookingLines.map((bookingLine, index) => {
            return (
                <tr key={index}>
                    <td>{bookingLine.pk_auto_id_lines}</td>
                    <td>{bookingLine.e_type_of_packaging}</td>
                    <td>{bookingLine.e_item}</td>
                    <td className="qty">{bookingLine.e_qty}</td>
                    <td>{bookingLine.e_weightUOM}</td>
                    <td>{bookingLine.e_weightPerEach}</td>
                    <td>{bookingLine.total_kgs}</td>
                    <td>{bookingLine.e_dimUOM}</td>
                    <td>{bookingLine.e_dimLength}</td>
                    <td>{bookingLine.e_dimWidth}</td>
                    <td>{bookingLine.e_dimHeight}</td>
                    <td>{bookingLine.cubic_meter}</td>
                </tr>
            );
        });

        const bookingsList = bookings.map((booking, index) => {
            return (
                <tr key={index}>
                    <td><input type="checkbox" onChange={(e) => this.onCheck(e, booking.id)} /></td>
                    <td id={'booking-lines-info-popup-' + booking.id} className={this.state.bookingLinesInfoOpens['booking-lines-info-popup-' + booking.id] ? 'booking-lines-info active' : 'booking-lines-info'} onClick={() => this.showBookingLinesInfo(booking.id)}>
                        <i className="icon icon-th-list"></i>
                    </td>
                    <Popover
                        isOpen={this.state.bookingLinesInfoOpens['booking-lines-info-popup-' + booking.id]}
                        target={'booking-lines-info-popup-' + booking.id}
                        placement="right"
                        hideArrow={true} >
                        <PopoverHeader>Line and Line Details <a className="close-popover" onClick={this.togglePopover}>x</a></PopoverHeader>
                        <PopoverBody>
                            <div className="pad-10p">
                                <p><strong>Booking ID: {booking.b_bookingID_Visual}</strong></p>
                                <table className="booking-lines">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Qty Total</th>
                                            <th>Count</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Lines</td>
                                            <td>{bookingLinesQtyTotal}</td>
                                            <td>{lodash.size(bookingLines)}</td>
                                        </tr>
                                        <tr>
                                            <td>Line Details</td>
                                            <td>{bookingLineDetailsQtyTotal}</td>
                                            <td>{lodash.size(bookingLineDetails)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="pad-10p">
                                <p><strong>Lines</strong></p>
                                <table className="booking-lines">
                                    <thead>
                                        <th>ID</th>
                                        <th>Packaging</th>
                                        <th>Item Description</th>
                                        <th>Qty</th>
                                        <th>Wgt UOM</th>
                                        <th>Wgt Each</th>
                                        <th>Total Kgs</th>
                                        <th>Dim UOM</th>
                                        <th>Length</th>
                                        <th>Width</th>
                                        <th>Height</th>
                                        <th>Cubic Meter</th>
                                    </thead>
                                    <tbody>
                                        { bookingLinesList }
                                    </tbody>
                                </table>
                            </div>
                            <div className="pad-10p">
                                <p><strong>Line Details</strong></p>
                                <table className="booking-lines">
                                    <thead>
                                        <th>Model</th>
                                        <th>Item Description</th>
                                        <th>Qty</th>
                                        <th>Fault Description</th>
                                        <th>Insurance Value</th>
                                        <th>Gap/ RA</th>
                                        <th>Client Reference #</th>
                                    </thead>
                                    <tbody>
                                        { bookingLineDetailsList }
                                    </tbody>
                                </table>
                            </div>
                        </PopoverBody>
                    </Popover>
                    <td id={'additional-info-popup-' + booking.id} className={this.state.additionalInfoOpens['additional-info-popup-' + booking.id] ? 'additional-info active' : 'additional-info'} onClick={() => this.showAdditionalInfo(booking.id)}>
                        <i className="icon icon-plus"></i>
                    </td>
                    <Popover
                        isOpen={this.state.additionalInfoOpens['additional-info-popup-' + booking.id]}
                        target={'additional-info-popup-' + booking.id}
                        placement="right"
                        hideArrow={true} >
                        <PopoverHeader>Additional Info <a className="close-popover" onClick={this.togglePopover}>x</a></PopoverHeader>
                        <PopoverBody>
                            <div className="location-info disp-inline-block">
                                <span>PU Info</span><br />
                                <span>Pickup Location:</span><br />
                                <span>
                                    {booking.pu_Address_street_1}<br />
                                    {booking.pu_Address_street_2}<br />
                                    {booking.pu_Address_Suburb}<br />
                                    {booking.pu_Address_City}<br />
                                    {booking.pu_Address_State} {booking.pu_Address_PostalCode}<br />
                                    {booking.pu_Address_Country}<br />
                                </span>
                            </div>
                            <div className="location-info disp-inline-block">
                                <span>Delivery Info</span><br />
                                <span>Delivery Location:</span><br />
                                <span>
                                    {booking.de_To_Address_street_1}<br />
                                    {booking.de_To_Address_street_2}<br />
                                    {booking.de_To_Address_Suburb}<br />
                                    {booking.de_To_Address_City}<br />
                                    {booking.de_To_Address_State} {booking.de_To_Address_PostalCode}<br />
                                    {booking.de_To_Address_Country}<br />
                                </span>
                            </div>
                            <div className="location-info disp-inline-block">
                                <span></span>
                                <span>
                                    <strong>Contact:</strong> {booking.booking_Created_For}<br />
                                    <strong>Actual Pickup Time:</strong> {moment(booking.s_20_Actual_Pickup_TimeStamp).format('DD MMM YYYY')}<br />
                                    <strong>Actual Deliver Time:</strong> {moment(booking.s_21_Actual_Delivery_TimeStamp).format('DD MMM YYYY')}
                                </span>
                            </div>
                        </PopoverBody>
                    </Popover>
                    <td onClick={()=>this.onClickRow(booking.id)}><span className={booking.b_error_Capture ? 'c-red' : ''}>{booking.b_bookingID_Visual}</span> </td>
                    <td >{booking.b_dateBookedDate ? moment(booking.b_dateBookedDate).format('ddd DD MMM YYYY'): ''}</td>
                    <td >{booking.puPickUpAvailFrom_Date ? moment(booking.puPickUpAvailFrom_Date, 'YYYY-MM-DD').format('ddd DD MMM YYYY') : ''}</td>
                    <td >{booking.b_clientReference_RA_Numbers}</td>
                    <td className="no-padding">
                        {
                            (booking.b_error_Capture) ?
                                <div className="booking-status">
                                    <TooltipItem booking={booking} />
                                </div>
                                :
                                <div className="booking-status">
                                    <div className="disp-inline-block">
                                        {
                                            <a href="#" className={
                                                (booking.z_downloaded_shipping_label_timestamp != null) ?
                                                    'bg-yellow'
                                                    :
                                                    (booking.z_label_url && booking.z_label_url.length > 0) ?
                                                        'bg-green'
                                                        :
                                                        'bg-gray'
                                            }
                                            onClick={() => this.onClickPrinter(booking)}>
                                                <i className="icon icon-printer"></i>
                                            </a>
                                        }
                                        &nbsp;&nbsp;{booking.b_status}&nbsp;&nbsp;
                                    </div>
                                </div>
                        }
                    </td>
                    <td >{booking.vx_freight_provider}</td>
                    <td >{booking.vx_serviceName}</td>
                    <td >{booking.s_05_LatestPickUpDateTimeFinal ? moment(booking.s_05_LatestPickUpDateTimeFinal).format('DD/MM/YYYY hh:mm:ss') : ''}</td>
                    <td >{booking.s_06_LatestDeliveryDateTimeFinal ? moment(booking.s_06_LatestDeliveryDateTimeFinal).format('DD/MM/YYYY hh:mm:ss') : ''}</td>
                    <td >{booking.v_FPBookingNumber}</td>
                    <td >{booking.puCompany}</td>
                    <td >{booking.deToCompanyName}</td>
                </tr>
            );
        });

        return (
            <div className="qbootstrap-nav" >
                <div id="headr" className="col-md-12">
                    <div className="col-md-7 col-sm-12 col-lg-8 col-xs-12 col-md-push-1">
                        <ul className="nav nav-tabs">
                            <li><a href="/booking">Header</a></li>
                            <li className="active"><a href="/allbookings">All Bookings</a></li>
                            <li><a href="/bookinglines" className="none">Booking Lines</a></li>
                            <li><a href="/bookinglinedetails" className="none">Booking Line Datas</a></li>
                        </ul>
                    </div>
                    <div id="icn" className="col-md-4 col-sm-12 col-lg-4 col-xs-12 text-right">
                        <a href=""><i className="icon-plus" aria-hidden="true"></i></a>
                        <a href=""><i className="icon-cog2" aria-hidden="true"></i></a>
                        <a href=""><i className="icon-calendar3" aria-hidden="true"></i></a>
                        <a href="">?</a>
                    </div>
                </div>
                <div className="top-menu">
                    <div className="container">
                        <div className="row1">
                            <div className="col-md-12 col-sm-12 col-lg-12 col-xs-12">
                                <div className="tab-content">
                                    <div id="all_booking" className="tab-pane fade in active">
                                        <p>Date</p>
                                        <div id="line1"></div>
                                        <label className="left-15px right-10px">Date:</label>
                                        <DatePicker
                                            selected={mainDate}
                                            onChange={(e) => this.onDateChange(e)}
                                            dateFormat="dd/MM/yyyy"
                                        />
                                        <ul className="filter-conditions">
                                            <li><a >Errors to Correct</a></li>
                                            <li><a >Missing Labels</a></li>
                                            <li><a >( 50 ) To Manifest</a></li>
                                            <li><a >To Process</a></li>
                                            <li><a >Closed</a></li>
                                        </ul>
                                        <div className="filter-conditions2">
                                            <label className="right-10px">Warehouse/Client:</label>
                                            <select id="warehouse" required onChange={(e) => this.onWarehouseSelected(e)} value={selectedWarehouseId}>
                                                <option value="all">All</option>
                                                { warehousesList }
                                            </select>
                                            <button className="btn btn-primary all-trigger" onClick={() => this.onClickAllTrigger()}>All trigger</button>
                                            <button className="btn btn-primary allied-booking" onClick={() => this.onClickBook()}>Book</button>
                                            <button className="btn btn-primary get-label" onClick={() => this.onClickGetLabel()}>Get Label</button>
                                            <button className="btn btn-primary map-bok1-to-bookings" onClick={() => this.onClickMapBok1ToBookings()}>Map Bok_1 to Bookings</button>
                                            <button className="btn btn-primary multi-download" onClick={() => this.onDownloadPdfs()}>
                                                <i className="icon icon-download"></i>
                                            </button>
                                            <label className="font-24px float-right">Count: {bookingsCnt}</label>
                                        </div>
                                        <div className="table-responsive">
                                            <table className="table table-hover table-bordered sortable">
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th className="width-30px"></th>
                                                        <th className="width-30px"></th>
                                                        <th className="width-30px"></th>
                                                        <th className="width-100px" onClick={() => this.onChangeSortField('b_bookingID_Visual')} scope="col">
                                                            DME Booking ID
                                                            {
                                                                (sortField === 'b_bookingID_Visual') ?
                                                                    (sortDirection > 0) ?
                                                                        <i className="fa fa-sort-amount-asc"></i>
                                                                        : <i className="fa fa-sort-amount-desc"></i>
                                                                    : <i className="fa fa-sort-amount-desc"></i>
                                                            }
                                                        </th>
                                                        <th className="width-150px" onClick={() => this.onChangeSortField('b_dateBookedDate')} scope="col">
                                                            Booked Date
                                                            {
                                                                (sortField === 'b_dateBookedDate') ?
                                                                    (sortDirection > 0) ?
                                                                        <i className="fa fa-sort-amount-asc"></i>
                                                                        : <i className="fa fa-sort-amount-desc"></i>
                                                                    : <i className="fa fa-sort-amount-desc"></i>
                                                            }
                                                        </th>
                                                        <th className="width-150px" onClick={() => this.onChangeSortField('b_clientReference_RA_Numbers')} scope="col">
                                                            Pickup from Manifest Date
                                                            {
                                                                (sortField === 'b_clientReference_RA_Numbers') ?
                                                                    (sortDirection > 0) ?
                                                                        <i className="fa fa-sort-amount-asc"></i>
                                                                        : <i className="fa fa-sort-amount-desc"></i>
                                                                    : <i className="fa fa-sort-amount-desc"></i>
                                                            }
                                                        </th>
                                                        <th className="width-150px" onClick={() => this.onChangeSortField('puPickUpAvailFrom_Date')} scope="col">
                                                            Ref. Number
                                                            {
                                                                (sortField === 'puPickUpAvailFrom_Date') ?
                                                                    (sortDirection > 0) ?
                                                                        <i className="fa fa-sort-amount-asc"></i>
                                                                        : <i className="fa fa-sort-amount-desc"></i>
                                                                    : <i className="fa fa-sort-amount-desc"></i>
                                                            }
                                                        </th>
                                                        <th className="width-150px" onClick={() => this.onChangeSortField('b_status')} scope="col">
                                                            Status
                                                            {
                                                                (sortField === 'b_status') ?
                                                                    (sortDirection > 0) ?
                                                                        <i className="fa fa-sort-amount-asc"></i>
                                                                        : <i className="fa fa-sort-amount-desc"></i>
                                                                    : <i className="fa fa-sort-amount-desc"></i>
                                                            }
                                                        </th>
                                                        <th className="width-100px" onClick={() => this.onChangeSortField('vx_freight_provider')} scope="col">
                                                            Freight Provider
                                                            {
                                                                (sortField === 'vx_freight_provider') ?
                                                                    (sortDirection > 0) ?
                                                                        <i className="fa fa-sort-amount-asc"></i>
                                                                        : <i className="fa fa-sort-amount-desc"></i>
                                                                    : <i className="fa fa-sort-amount-desc"></i>
                                                            }
                                                        </th>
                                                        <th className="width-100px" onClick={() => this.onChangeSortField('vx_serviceName')} scope="col">
                                                            Service
                                                            {
                                                                (sortField === 'vx_serviceName') ?
                                                                    (sortDirection > 0) ?
                                                                        <i className="fa fa-sort-amount-asc"></i>
                                                                        : <i className="fa fa-sort-amount-desc"></i>
                                                                    : <i className="fa fa-sort-amount-desc"></i>
                                                            }
                                                        </th>
                                                        <th className="width-150px" onClick={() => this.onChangeSortField('s_05_LatestPickUpDateTimeFinal')} scope="col">
                                                            Pickup By
                                                            {
                                                                (sortField === 's_05_LatestPickUpDateTimeFinal') ?
                                                                    (sortDirection > 0) ?
                                                                        <i className="fa fa-sort-amount-asc"></i>
                                                                        : <i className="fa fa-sort-amount-desc"></i>
                                                                    : <i className="fa fa-sort-amount-desc"></i>
                                                            }
                                                        </th>
                                                        <th className="width-150px" onClick={() => this.onChangeSortField('s_06_LatestDeliveryDateTimeFinal')} scope="col">
                                                            Latest Delivery
                                                            {
                                                                (sortField === 's_06_LatestDeliveryDateTimeFinal') ?
                                                                    (sortDirection > 0) ?
                                                                        <i className="fa fa-sort-amount-asc"></i>
                                                                        : <i className="fa fa-sort-amount-desc"></i>
                                                                    : <i className="fa fa-sort-amount-desc"></i>
                                                            }
                                                        </th>
                                                        <th className="width-150px" onClick={() => this.onChangeSortField('v_FPBookingNumber')} scope="col">
                                                            FP Consignment Number
                                                            {
                                                                (sortField === 'v_FPBookingNumber') ?
                                                                    (sortDirection > 0) ?
                                                                        <i className="fa fa-sort-amount-asc"></i>
                                                                        : <i className="fa fa-sort-amount-desc"></i>
                                                                    : <i className="fa fa-sort-amount-desc"></i>
                                                            }
                                                        </th>
                                                        <th className="width-150px" onClick={() => this.onChangeSortField('puCompany')} scope="col">
                                                            Pickup Entity
                                                            {
                                                                (sortField === 'puCompany') ?
                                                                    (sortDirection > 0) ?
                                                                        <i className="fa fa-sort-amount-asc"></i>
                                                                        : <i className="fa fa-sort-amount-desc"></i>
                                                                    : <i className="fa fa-sort-amount-desc"></i>
                                                            }
                                                        </th>
                                                        <th className="width-150px" onClick={() => this.onChangeSortField('deToCompanyName')} scope="col">
                                                            Delivery Entity
                                                            {
                                                                (sortField === 'deToCompanyName') ?
                                                                    (sortDirection > 0) ?
                                                                        <i className="fa fa-sort-amount-asc"></i>
                                                                        : <i className="fa fa-sort-amount-desc"></i>
                                                                    : <i className="fa fa-sort-amount-desc"></i>
                                                            }
                                                        </th>
                                                    </tr>
                                                    <tr className="filter-tr">
                                                        <th><i className="icon icon-check"></i></th>
                                                        <th><i className="icon icon-th-list"></i></th>
                                                        <th><i className="icon icon-plus"></i></th>
                                                        <th scope="col"><input type="text" name="b_bookingID_Visual" value={filterInputs['b_bookingID_Visual'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onClick={(e) => this.onClickRow(e)}/></th>
                                                        <th scope="col"><input type="text" name="b_dateBookedDate" value={filterInputs['b_dateBookedDate'] || ''} onChange={(e) => this.onChangeFilterInput(e)} /></th>
                                                        <th scope="col"><input type="text" name="b_clientReference_RA_Numbers" value={filterInputs['b_clientReference_RA_Numbers'] || ''} onChange={(e) => this.onChangeFilterInput(e)} /></th>
                                                        <th scope="col"><input type="text" name="puPickUpAvailFrom_Date" value={filterInputs['puPickUpAvailFrom_Date'] || ''} onChange={(e) => this.onChangeFilterInput(e)} /></th>
                                                        <th scope="col"><input type="text" name="b_status" value={filterInputs['b_status'] || ''} onChange={(e) => this.onChangeFilterInput(e)} /></th>
                                                        <th scope="col"><input type="text" name="vx_freight_provider" value={filterInputs['vx_freight_provider'] || ''} onChange={(e) => this.onChangeFilterInput(e)} /></th>
                                                        <th scope="col"><input type="text" name="vx_serviceName" value={filterInputs['vx_serviceName'] || ''} onChange={(e) => this.onChangeFilterInput(e)} /></th>
                                                        <th scope="col"><input type="text" name="s_05_LatestPickUpDateTimeFinal" value={filterInputs['s_05_LatestPickUpDateTimeFinal'] || ''} onChange={(e) => this.onChangeFilterInput(e)} /></th>
                                                        <th scope="col"><input type="text" name="s_06_LatestDeliveryDateTimeFinal" value={filterInputs['s_06_LatestDeliveryDateTimeFinal'] || ''} onChange={(e) => this.onChangeFilterInput(e)} /></th>
                                                        <th scope="col"><input type="text" name="v_FPBookingNumber" value={filterInputs['v_FPBookingNumber'] || ''} onChange={(e) => this.onChangeFilterInput(e)} /></th>
                                                        <th scope="col"><input type="text" name="puCompany" value={filterInputs['puCompany'] || ''} onChange={(e) => this.onChangeFilterInput(e)} /></th>
                                                        <th scope="col"><input type="text" name="deToCompanyName" value={filterInputs['deToCompanyName'] || ''} onChange={(e) => this.onChangeFilterInput(e)} /></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    { bookingsList }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div id="all_booking" className="tab-pane fade">
                                        <p>Date</p>
                                        <div id="line1"></div>
                                        <div className="row">
                                            <div id="msection" className="col-md-6">
                                                <ul id="datesection">
                                                    <li><a href="#">( 04 ) Errors to Correct</a></li>
                                                    <li><a href="#">( 00 ) Missing Labels</a></li>
                                                    <li><a href="#">( 50 ) To Manifest</a></li>
                                                    <li><a href="#">( 15 ) To Process</a></li>
                                                    <li><a href="#">( 01 ) Closed</a></li>
                                                </ul>
                                            </div>
                                            <div className="col-md-4">
                                                <a href="#" id="manifest">Manifest</a>
                                            </div>
                                            <div id="found" className="col-md-2">
                                                <p>Found: <b>32</b> of 8607</p>
                                            </div>
                                        </div>
                                        <div id="other1" className="tab-pane fade">
                                            <h3>Other 1</h3>
                                            <p>Some content in Other 1</p>
                                        </div>
                                        <div id="other2" className="tab-pane fade">
                                            <h3>Other 2</h3>
                                            <p>Some content in Other 2</p>
                                        </div>
                                        <div id="other3" className="tab-pane fade">
                                            <h3>Other 3</h3>
                                            <p>Some content in Other 3</p>
                                        </div>
                                        <div id="other4" className="tab-pane fade">
                                            <h3>Other 4</h3>
                                            <p>Some content in Other 4</p>
                                        </div>
                                        <div id="other5" className="tab-pane fade">
                                            <h3>Other 5</h3>
                                            <p>Some content in Other 5</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        bookings: state.booking.bookings,
        bookingsCnt: state.booking.bookingsCnt,
        needUpdateBookings: state.booking.needUpdateBookings,
        bookingLines: state.bookingLine.bookingLines,
        bookingLineDetails: state.bookingLineDetail.bookingLineDetails,
        warehouses: state.warehouse.warehouses,
        redirect: state.auth.redirect,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        getBookings: (date, warehouseId, itemCountPerPage, sortField, columnFilters) => dispatch(getBookings(date, warehouseId, itemCountPerPage, sortField, columnFilters)),
        updateBooking: (id, booking) => dispatch(updateBooking(id, booking)),
        getBookingLines: (bookingId) => dispatch(getBookingLines(bookingId)),
        getBookingLineDetails: (bookingId) => dispatch(getBookingLineDetails(bookingId)),
        getWarehouses: () => dispatch(getWarehouses()),
        getUserDateFilterField: () => dispatch(getUserDateFilterField()),
        allTrigger: () => dispatch(allTrigger()),
        alliedBooking: (bookingId) => dispatch(alliedBooking(bookingId)),
        stBooking: (bookingId) => dispatch(stBooking(bookingId)),
        getSTLabel: (bookingId) => dispatch(getSTLabel(bookingId)),
        getAlliedLabel: (bookingId) => dispatch(getAlliedLabel(bookingId)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AllBookingsPage);

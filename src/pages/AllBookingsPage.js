import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import lodash from 'lodash';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';
// BootstrapTable
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter, dateFilter } from 'react-bootstrap-table2-filter';

import TooltipItem from '../components/Tooltip/TooltipComponent';
import { getBookings, simpleSearch, updateBooking, allTrigger, mapBok1ToBookings } from '../state/services/bookingService';
import { getBookingLines } from '../state/services/bookingLinesService';
import { getBookingLineDetails } from '../state/services/bookingLineDetailsService';
import { getWarehouses } from '../state/services/warehouseService';

class AllBookingsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            bookings: [],
            bookingLines: [],
            bookingLineDetails: [],
            bookingLineDetailsLoaded: false,
            filtered_bookings: [],
            warehouses: [],
            selectedWarehouseId: '',
            simpleSearchKeyword: '',
            showSimpleSearchBox: false,
            hasFilter: false,
            errors2CorrectCnt: 0,
            missingLabelCnt: 0,
            toProcessCnt: 0,
            closedCnt: 0,
            startDate: '',
            endDate: '',
            orFilter: false,
            printerFlag: false,
            filterConditions: {},
            additionalInfoOpens: [],
            bookingLinesInfoOpens: [],
            bookingLinesQtyTotal: 0,
            bookingLineDetailsQtyTotal: 0,
        };

        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    static propTypes = {
        getBookings: PropTypes.func.isRequired,
        getBookingLines: PropTypes.func.isRequired,
        getBookingLineDetails: PropTypes.func.isRequired,
        simpleSearch: PropTypes.func.isRequired,
        getWarehouses: PropTypes.func.isRequired,
        updateBooking: PropTypes.func.isRequired,
        allTrigger: PropTypes.func.isRequired,
        mapBok1ToBookings: PropTypes.func.isRequired,
    };

    componentDidMount() {
        this.props.getBookings();
        this.props.getWarehouses();

        this.setState({ endDate: moment().toDate() });
    }

    componentWillMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    componentWillReceiveProps(newProps) {
        const { bookings, warehouses, booking, bookingLines, bookingLineDetails } = newProps;
        let errors2CorrectCnt = 0, missingLabelCnt = 0, toProcessCnt = 0, closedCnt = 0;

        for (let i = 0; i < bookings.length; i++) {
            if (bookings[i].error_details)
                if (bookings[i].error_details.length > 0)
                    errors2CorrectCnt++;
            if (bookings[i].consignment_label_link.length === 0)
                missingLabelCnt++;
            if (bookings[i].b_status === 'booked')
                toProcessCnt++;
            if (bookings[i].b_status === 'closed')
                closedCnt++;
        }

        if (booking && this.printerFlag === true) {
            this.props.getBookings();
            this.setState({ printerFlag: false });
        }

        if (bookingLineDetails && !this.state.bookingLineDetailsLoaded) {
            this.setState({bookingLineDetails, bookingLineDetailsLoaded: true});
        }

        if (bookingLines) {
            this.setState({bookingLines: this.calcBookingLine(bookingLines)});
        }

        this.setState({ bookings, errors2CorrectCnt, missingLabelCnt, toProcessCnt, closedCnt, warehouses });
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

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    onClickSimpleSearch() {
        this.setState({showSimpleSearchBox: true});
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target))
            this.setState({showSimpleSearchBox: false});
    }

    onInputChange(e) {
        this.setState({simpleSearchKeyword: e.target.value});
    }

    onSimpleSearch(e) {
        const { simpleSearchKeyword } = this.state;

        e.preventDefault();
        this.props.simpleSearch(simpleSearchKeyword);
    }

    onClickGetAll(e) {
        e.preventDefault();
        this.props.getBookings();
    }

    onSelectChange(e) {
        this.setState({ selectedWarehouseId: e.target.value }, () => this.applyFilter(5));
    }

    onDateChange(num, date) {
        if (num === 0)
            this.setState({ startDate: date }, () => this.applyFilter(6));
        else if (num === 1)
            this.setState({ endDate: date }, () => this.applyFilter(6));
    }

    onFilterChange(e) {
        let filterConditions = this.state.filterConditions;
        const fieldName = e.target.name;
        filterConditions[fieldName] = e.target.value;
        const bookings = this.state.bookings;
        let filtered_bookings = [];

        for (let i = 0; i < bookings.length; i++) {
            let flag = true;

            for (let fieldName in filterConditions) {
                if (bookings[i][fieldName].toString().toLowerCase().indexOf(filterConditions[fieldName].toLowerCase()) === -1)
                    flag = false;
            }

            if (flag)
                filtered_bookings.push(bookings[i]);
        }

        this.setState({hasFilter: true, filtered_bookings: filtered_bookings});
    }

    applyFilter(num) {
        const { bookings, selectedWarehouseId, startDate, endDate, orFilter } = this.state;
        let newFilteredBookings = [];

        if (num === 6)
            if (startDate.length === 0 || endDate.length === 0)
                num = -1;

        for (let i = 0; i < bookings.length; i++) {
            if (num === 0)
                if (bookings[i].error_details.length)
                    if (bookings[i].error_details.length > 0)
                        newFilteredBookings.push(bookings[i]);

            if (num === 1)
                if (bookings[i].consignment_label_link.length === 0)
                    newFilteredBookings.push(bookings[i]);

            if (num === 3)
                if (bookings[i].b_status === 'booked')
                    newFilteredBookings.push(bookings[i]);

            if (num === 4)
                if (bookings[i].b_status === 'closed')
                    newFilteredBookings.push(bookings[i]);
        }

        if (orFilter && startDate.length !== 0 && endDate.length !== 0) {
            let temp = [];

            for (let i = 0; i < bookings.length; i++) {
                if (bookings[i].b_clientPU_Warehouse === parseInt(selectedWarehouseId) || selectedWarehouseId === 'all')
                    temp.push(bookings[i]);
            }
            for (let i = 0; i < temp.length; i++) {
                if (moment(temp[i].b_dateBookedDate) < moment(endDate) &&
                    moment(temp[i].b_dateBookedDate) > moment(startDate))
                    newFilteredBookings.push(temp[i]);
            }
        } else {
            for (let i = 0; i < bookings.length; i++) {
                if (num === 5) // Warehouse filter
                    if (bookings[i].b_clientPU_Warehouse === parseInt(selectedWarehouseId) || selectedWarehouseId === 'all')
                        newFilteredBookings.push(bookings[i]);

                if (num === 6)
                    if (moment(bookings[i].b_dateBookedDate) < moment(endDate) &&
                        moment(bookings[i].b_dateBookedDate) > moment(startDate))
                        newFilteredBookings.push(bookings[i]);
            }
        }

        this.setState({filtered_bookings: newFilteredBookings, hasFilter: true});

        if (num > 4)
            this.setState({orFilter: true});
        else
            this.setState({orFilter: false});
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

    showBookingLinesInfo(bookingId) {
        this.props.getBookingLines(bookingId);
        let bookingLinesInfoOpens = this.state.bookingLinesInfoOpens;
        let flag = bookingLinesInfoOpens['booking-lines-info-popup-' + bookingId];
        bookingLinesInfoOpens = [];

        if (flag)
            bookingLinesInfoOpens['booking-lines-info-popup-' + bookingId] = false;
        else
            bookingLinesInfoOpens['booking-lines-info-popup-' + bookingId] = true;

        this.setState({ bookingLinesInfoOpens, additionalInfoOpens: [], bookingLineDetails: [] });
    }

    onClickPrinter(booking) {
        let bookings = this.state.bookings;
        booking.is_printed = !booking.is_printed;
        this.props.updateBooking(booking.id, booking);

        for (let i = 0; i < bookings.length; i++) {
            if (booking.id === bookings[i].id) {
                bookings[i]['is_printed'] = true;
            }
        }

        this.setState({ printerFlag: true, bookings });
    }

    onClickBookingLine(bookingLineId) {
        this.props.getBookingLineDetails(bookingLineId);
        this.setState({ bookingLineDetailsLoaded: false });
    }

    onClickAllTrigger() {
        this.props.allTrigger();
    }

    onClickMapBok1ToBookings() {
        this.props.mapBok1ToBookings();
    }

    render() {
        const { bookings, bookingLines, bookingLineDetails, showSimpleSearchBox, simpleSearchKeyword, errors2CorrectCnt, missingLabelCnt, toProcessCnt, closedCnt, filtered_bookings, hasFilter, warehouses, selectedWarehouseId, startDate, endDate, bookingLinesQtyTotal } = this.state;
        let list, warehouses_list;

        if (hasFilter)
            list = filtered_bookings;
        else
            list = bookings;

        warehouses_list = warehouses.map((warehouse, index) => {
            return (
                <option key={index} value={warehouse.pk_id_client_warehouses}>{warehouse.warehousename}</option>
            );
        });

        let bookingLineDetailsList = bookingLineDetails.map((bookingLineDetail, index) => {
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

        let bookingLinesList = bookingLines.map((bookingLine, index) => {
            return (
                <tr key={index} onClick={() => this.onClickBookingLine(bookingLine.pk_auto_id_lines)}>
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

        let bookingList = list.map((booking, index) => {
            return (
                <tr key={index}>
                    <td id={'booking-lines-info-popup-' + booking.id} className={this.state.bookingLinesInfoOpens['booking-lines-info-popup-' + booking.id] ? 'booking-lines-info active' : 'booking-lines-info'} onClick={() => this.showBookingLinesInfo(booking.id)}>
                        <i className="icon icon-th-list"></i>
                    </td>
                    <Popover
                        isOpen={this.state.bookingLinesInfoOpens['booking-lines-info-popup-' + booking.id]}
                        target={'booking-lines-info-popup-' + booking.id}
                        placement="right"
                        hideArrow={true} >
                        <PopoverHeader>Line and Line Details</PopoverHeader>
                        <PopoverBody>
                            <div className="pad-10p">
                                <p><strong>Booking ID: {booking.id}</strong></p>
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
                                            <td></td>
                                            <td></td>
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
                        <PopoverHeader>Additional Info</PopoverHeader>
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
                    <td><input type="checkbox" /></td>
                    <td scope="row">
                        <span className={booking.error_details ? 'c-red' : ''}>{booking.id}</span>
                    </td>
                    <td>
                        {booking.b_bookingID_Visual}
                        <a href="#">
                            <i className="icon icon-th-list"></i>
                        </a>
                    </td>
                    <td>{booking.b_dateBookedDate}</td>
                    <td>{booking.puPickUpAvailFrom_Date}</td>
                    <td>
                        {booking.b_clientReference_RA_Numbers}&nbsp;&nbsp;
                    </td>
                    <td className="no-padding">
                        {
                            (booking.error_details) ?
                                <div className="booking-status">
                                    <TooltipItem booking={booking} />
                                </div>
                                :
                                <div className="booking-status">
                                    <div className="disp-inline-block">
                                        {
                                            (booking.shipping_label_base64) &&
                                            (booking.shipping_label_base64.length > 0) ?
                                                <a href="#" className={booking.is_printed ? 'bc-red' : 'bc-green'} onClick={() => this.onClickPrinter(booking)}>
                                                    <i className="icon icon-printer"></i>
                                                </a>
                                                :
                                                <a>
                                                    <i className="icon icon-printer transparent"></i>
                                                </a>
                                        }
                                        &nbsp;&nbsp;{booking.b_status}&nbsp;&nbsp;
                                    </div>
                                </div>
                        }
                    </td>
                    <td>
                        {booking.b_status_API}&nbsp;&nbsp;
                    </td>
                    <td>
                        {booking.vx_freight_provider}&nbsp;&nbsp;
                        <a href="#">
                            <i className="icon icon-plus"></i>
                        </a>
                    </td>
                    <td>{booking.vx_serviceName}</td>
                    <td>{booking.s_05_LatestPickUpDateTimeFinal}</td>
                    <td>{booking.s_06_LatestDeliveryDateTimeFinal}</td>
                    <td>{booking.v_FPBookingNumber}</td>
                    <td>{booking.puCompany}</td>
                    <td>{booking.deToCompanyName}</td>
                </tr>
            );
        });

        bookingList = '';

        const noPlaceholderFilter = textFilter({
            placeholder: ' ', // custom the input placeholder
            className: 'no-placeholder-text-filter', // custom classname on input
            caseSensitive: true, // default is false, and true will only work when comparator is LIKE
            style: { height: '20px', marginTop: '5px', padding: '3px', fontSize: '12px', fontFamily: 'Arial' }
        });

        const customDateFilter = dateFilter({
            style: { height: '53px', marginTop: '5px', padding: '3px', fontSize: '12px', fontFamily: 'Arial' },
            comparatorStyle: { padding: '0', paddingLeft: '5px' },
            dateStyle: { height: '20px', marginTop: '5px', padding: '3px', fontSize: '12px', fontFamily: 'Arial', lineHeight: '12px' },
        });

        const hasErrorDetailFormatter = (cell, row) => {
            if (row.error_details) {
                return (
                    <span>
                        <strong style={ { color: 'red' } }>{ cell }</strong>
                    </span>
                );
            }

            return (
                <span>{ cell }</span>
            );
        };

        let statusFormatter = (cell, row) => {
            if (row.error_details) {
                return (
                    <div className="booking-status">
                        <TooltipItem booking={row} />
                    </div>
                );
            } else {
                return (
                    <div className="booking-status">
                        <div className="disp-inline-block">
                            {
                                (row.shipping_label_base64) && (row.shipping_label_base64.length > 0) ?
                                    <a href="#" className={row.is_printed ? 'bg-gray' : 'bc-green'} onClick={() => this.onClickPrinter(row)}>
                                        <i className="icon icon-printer"></i>
                                    </a>
                                    :
                                    <a>
                                        <i className="icon icon-printer"></i>
                                    </a>
                            }
                            &nbsp;&nbsp;{row.b_status}&nbsp;&nbsp;
                        </div>
                    </div>
                );
            }
        };

        const iconListAttached = (cell) => {
            return (
                <span>{ cell } <i className="icon icon-th-list float-right cursor-pointer font-size-16px bg-gray"></i></span>
            );
        };

        const iconPlusAttached = (cell) => {
            return (
                <span>{ cell } <i className="icon icon-plus float-right cursor-pointer font-size-16px bg-gray"></i></span>
            );
        };

        let columns = [
            {
                dataField: 'id',
                text: 'Booking Id',
                filter: noPlaceholderFilter,
                formatter: hasErrorDetailFormatter,
            },{
                dataField: 'b_bookingID_Visual',
                text: 'BookingID Visual',
                filter: noPlaceholderFilter,
                formatter: iconListAttached,
            },{
                dataField: 'b_dateBookedDate',
                text: 'Booked Date',
                filter: customDateFilter,
            },{
                dataField: 'puPickUpAvailFrom_Date',
                text: 'Pickup from Manifest Date',
                filter: customDateFilter,
            },{
                dataField: 'b_clientReference_RA_Numbers',
                text: 'Ref. Number',
                filter: noPlaceholderFilter,
            },{
                dataField: 'b_status',
                isDummyField: true,
                text: 'Status',
                filter: noPlaceholderFilter,
                formatter: statusFormatter,
            },{
                dataField: 'b_status_API',
                text: 'Status API',
                filter: noPlaceholderFilter,
            },{
                dataField: 'vx_freight_provider',
                text: 'Freight Provider',
                filter: noPlaceholderFilter,
                formatter: iconPlusAttached,
            },{
                dataField: 'vx_serviceName',
                text: 'Service',
                filter: noPlaceholderFilter,
            },{
                dataField: 's_05_LatestPickUpDateTimeFinal',
                text: 'Pickup By',
                filter: customDateFilter,
            },{
                dataField: 's_06_LatestDeliveryDateTimeFinal',
                text: 'Latest Delivery',
                filter: customDateFilter
            },{
                dataField: 'v_FPBookingNumber',
                text: 'FP Booking Number',
                filter: noPlaceholderFilter,
            },{
                dataField: 'puCompany',
                text: 'Company',
                filter: noPlaceholderFilter,
            },{
                dataField: 'deToCompanyName',
                text: 'CompanyName',
                filter: noPlaceholderFilter,
            }
        ];

        let products = list;

        return (
            <div className="qbootstrap-nav" >
                { bookingList }
                <div id="headr" className="col-md-12">
                    <div className="col-md-7 col-sm-12 col-lg-8 col-xs-12 col-md-push-1">
                        <ul className="nav nav-tabs">
                            <li><a href="/booking">Header</a></li>
                            <li className="active"><a href="/allbookings">All Bookings</a></li>
                            <li><a href="/bookinglines">Booking Lines</a></li>
                            <li><a href="/bookinglinedetails">Booking Line Datas</a></li>
                        </ul>
                    </div>
                    <div id="icn" className="col-md-4 col-sm-12 col-lg-4 col-xs-12 text-right">
                        <a href=""><i className="icon-plus" aria-hidden="true"></i></a>
                        <div className="popup" onClick={() => this.onClickSimpleSearch()}>
                            <i className="icon-search3" aria-hidden="true"></i>
                            {
                                showSimpleSearchBox &&
                                <div ref={this.setWrapperRef}>
                                    <form onSubmit={(e) => this.onSimpleSearch(e)}>
                                        <input className="popuptext" type="text" placeholder="Search.." name="search" value={simpleSearchKeyword} onChange={(e) => this.onInputChange(e)} />
                                    </form>
                                </div>
                            }
                        </div>
                        <div className="popup" onClick={(e) => this.onClickGetAll(e)}>
                            <i className="icon icon-th-list" aria-hidden="true"></i>
                        </div>
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
                                        <ul className="filter-conditions">
                                            <li><a onClick={() => this.applyFilter(0)}>( {errors2CorrectCnt} ) Errors to Correct</a></li>
                                            <li><a onClick={() => this.applyFilter(1)}>( {missingLabelCnt} ) Missing Labels</a></li>
                                            <li><a >( 50 ) To Manifest</a></li>
                                            <li><a onClick={() => this.applyFilter(3)}>( {toProcessCnt} ) To Process</a></li>
                                            <li><a onClick={() => this.applyFilter(4)}>( {closedCnt} ) Closed</a></li>
                                        </ul>
                                        <div className="filter-conditions2">
                                            <label className="right-10px">Warehouses:</label>
                                            <select id="warehouse" required onChange={(e) => this.onSelectChange(e)} value={selectedWarehouseId}>
                                                <option value="all">All</option>
                                                { warehouses_list }
                                            </select>
                                            <label className="left-15px right-10px">Start Date:</label>
                                            <DatePicker
                                                selected={startDate}
                                                onChange={(e) => this.onDateChange(0, e)}
                                            />
                                            <label className="left-15px right-10px">End Date:</label>
                                            <DatePicker
                                                selected={endDate}
                                                onChange={(e) => this.onDateChange(1, e)}
                                            />
                                            <button className="btn btn-primary all-trigger" onClick={() => this.onClickAllTrigger()}>All trigger</button>
                                            <button className="btn btn-primary map-bok1-to-bookings" onClick={() => this.onClickMapBok1ToBookings()}>Map Bok_1 to Bookings</button>
                                        </div>
                                        <div className="table-responsive">
                                            <BootstrapTable
                                                keyField='id'
                                                data={ products }
                                                columns={ columns }
                                                filter={ filterFactory() }
                                                pagination={ paginationFactory() }
                                                bootstrap4={ true }
                                            />
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
        booking: state.booking.booking,
        bookingLines: state.bookingLine.bookingLines,
        bookingLineDetails: state.bookingLineDetail.bookingLineDetails,
        filtered_bookings: state.booking.filtered_bookings,
        warehouses: state.warehouse.warehouses,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getBookings: () => dispatch(getBookings()),
        getBookingLines: (bookingId) => dispatch(getBookingLines(bookingId)),
        getBookingLineDetails: (bookingLineId) => dispatch(getBookingLineDetails(bookingLineId)),
        simpleSearch: (keyword) => dispatch(simpleSearch(keyword)),
        getWarehouses: () => dispatch(getWarehouses()),
        updateBooking: (id, booking) => dispatch(updateBooking(id, booking)),
        allTrigger: () => dispatch(allTrigger()),
        mapBok1ToBookings: () => dispatch(mapBok1ToBookings()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AllBookingsPage);

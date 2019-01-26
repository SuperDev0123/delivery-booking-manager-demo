import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import moment from 'moment-timezone';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { getBookings, getUserDateFilterField } from '../state/services/bookingService';
import { getWarehouses } from '../state/services/warehouseService';
import { verifyToken } from '../state/services/authService';

class AllBookingsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            bookings: [],
            warehouses: [],
            mainDate: '',
            userDateFilterField: '',
            selectedWarehouseId: 0,
            sortField: 'id',
            sortDirection: 1,
            itemCountPerPage: 10,
            filterInputs: {},
        };
    }

    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        getBookings: PropTypes.func.isRequired,
        getWarehouses: PropTypes.func.isRequired,
        getUserDateFilterField: PropTypes.func.isRequired,
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
        const { itemCountPerPage } = this.state;
        const { bookings, bookingsCnt, warehouses, userDateFilterField, redirect } = newProps;
        const currentRoute = this.props.location.pathname;

        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.history.push('/');
        }

        if (bookings) {
            const pageCnt = Math.ceil(bookingsCnt / itemCountPerPage);
            this.setState({ bookings, pageCnt, bookingsCnt });
        }

        if (warehouses) {
            this.setState({ warehouses });
        }

        if (userDateFilterField) {
            this.setState({ userDateFilterField });
        }
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
            sortDirection = 1;

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

    render() {
        const { bookings, mainDate, selectedWarehouseId, warehouses, filterInputs, bookingsCnt } = this.state;

        const warehouses_table = warehouses.map((warehouse, index) => {
            return (
                <option key={index} value={warehouse.pk_id_client_warehouses}>{warehouse.warehousename}</option>
            );
        });

        const bookings_table = bookings.map((booking, index) => {
            return (
                <tr key={index}>
                    <td><span className={booking.error_details ? 'c-red' : ''}>{booking.b_bookingID_Visual}</span> </td>
                    <td >{moment(booking.b_dateBookedDate).format('ddd DD MMM YYYY')}</td>
                    <td >{booking.puPickUpAvailFrom_Date}</td>
                    <td >{booking.b_clientReference_RA_Numbers}</td>
                    <td >{booking.b_status}</td>
                    <td >{booking.vx_freight_provider}</td>
                    <td >{booking.vx_serviceName}</td>
                    <td >{booking.s_05_LatestPickUpDateTimeFinal}</td>
                    <td >{booking.s_06_LatestDeliveryDateTimeFinal}</td>
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
                                                { warehouses_table }
                                            </select>
                                            <label className="left-50px font-20px">Count: {bookingsCnt}</label>
                                        </div>
                                        <div className="table-responsive">
                                            <table className="table table-hover table-bordered sortable">
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th onClick={() => this.onChangeSortField('b_bookingID_Visual')} scope="col">DME Booking ID</th>
                                                        <th className="width-150px" onClick={() => this.onChangeSortField('b_dateBookedDate')} scope="col">Booked Date</th>
                                                        <th className="width-100px" onClick={() => this.onChangeSortField('b_clientReference_RA_Numbers')} scope="col">Pickup from Manifest Date</th>
                                                        <th className="width-100px" onClick={() => this.onChangeSortField('puPickUpAvailFrom_Date')} scope="col">Ref. Number</th>
                                                        <th className="width-150px" onClick={() => this.onChangeSortField('b_status')} scope="col">Status</th>
                                                        <th onClick={() => this.onChangeSortField('vx_freight_provider')} scope="col">Freight Provider</th>
                                                        <th onClick={() => this.onChangeSortField('vx_serviceName')} scope="col">Service</th>
                                                        <th onClick={() => this.onChangeSortField('s_05_LatestPickUpDateTimeFinal')} scope="col">Pickup By</th>
                                                        <th onClick={() => this.onChangeSortField('s_06_LatestDeliveryDateTimeFinal')} scope="col">Latest Delivery</th>
                                                        <th onClick={() => this.onChangeSortField('v_FPBookingNumber')} scope="col">FP Consignment Number</th>
                                                        <th className="width-150px" onClick={() => this.onChangeSortField('puCompany')} scope="col">Pickup Entity</th>
                                                        <th className="width-150px" onClick={() => this.onChangeSortField('deToCompanyName')} scope="col">Delivery Entity</th>
                                                    </tr>
                                                    <tr className="filter-tr">
                                                        <th scope="col"><input type="text" name="b_bookingID_Visual" value={filterInputs['b_bookingID_Visual'] || ''} onChange={(e) => this.onChangeFilterInput(e)} /></th>
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
                                                    { bookings_table }
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
        warehouses: state.warehouse.warehouses,
        redirect: state.auth.redirect,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        getBookings: (date, warehouseId, itemCountPerPage, sortField, columnFilters) => dispatch(getBookings(date, warehouseId, itemCountPerPage, sortField, columnFilters)),
        getWarehouses: () => dispatch(getWarehouses()),
        getUserDateFilterField: () => dispatch(getUserDateFilterField()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AllBookingsPage);

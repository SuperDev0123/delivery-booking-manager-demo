import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getBookings, simpleSearch } from '../state/services/bookingService';

class AllBookingsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            bookings: [],
            filtered_bookings: [],
            simpleSearchKeyword: '',
            showSimpleSearchBox: false
        };

        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    static propTypes = {
        getBookings: PropTypes.func.isRequired,
        simpleSearch: PropTypes.func.isRequired,
    };

    componentDidMount() {
        this.props.getBookings();
    }

    componentWillMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    componentWillReceiveProps(newProps) {
        const { bookings } = newProps;
        this.setState({ bookings });
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

    render() {
        const { bookings, showSimpleSearchBox, simpleSearchKeyword } = this.state;
        let bookingList = bookings.map((booking, index) => {
            return (
                <tr key={index}>
                    <th scope="row">{booking.id}</th>
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
                        <a href="#">
                            <i className="icon icon-warning"></i>
                        </a>&nbsp;&nbsp;
                        <a href="#">
                            <i className="icon icon-printer"></i>
                        </a>
                    </td>
                    <td>{booking.b_status}</td>
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

        return (
            <div className="qbootstrap-nav" >
                <div id="headr" className="col-md-12">
                    <div className="col-md-7 col-sm-12 col-lg-8 col-xs-12 col-md-push-1">
                        <ul className="nav nav-tabs">
                            <li><a data-toggle="tab" href="#header">Header</a></li>
                            <li className="active"><a data-toggle="tab" href="#all_booking">All Bookings</a></li>
                            <li><a data-toggle="tab" href="#other1">Other 1</a></li>
                            <li><a data-toggle="tab" href="#other2">Other 2</a></li>
                            <li><a data-toggle="tab" href="#other3">Other 3</a></li>
                            <li><a data-toggle="tab" href="#other4">Other 4</a></li>
                            <li><a data-toggle="tab" href="#other5">Other 5</a></li>
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
                                    <div id="header" className="tab-pane fade in active">
                                        <table style={{width: '100%'}}>
                                            <tbody>
                                                <tr>
                                                    <td> <h3>Header</h3> </td>
                                                    <td align="right"> <h3>Count : 4</h3> </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div className="table-responsive">
                                            <table className="table table-hover table-bordered sortable">
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th scope="col">Booking Id</th>
                                                        <th scope="col">BookingID Visual</th>
                                                        <th scope="col">Booked Date</th>
                                                        <th scope="col">
                                                            Pickup from /<br/>
                                                            Manifest Date
                                                        </th>
                                                        <th scope="col">Ref. Number</th>
                                                        <th scope="col">Status</th>
                                                        <th scope="col">Freight Provider</th>
                                                        <th scope="col">Service</th>
                                                        <th scope="col">Pickup By</th>
                                                        <th scope="col">Latest Delivery</th>
                                                        <th scope="col">FP Booking Number</th>
                                                        <th scope="col">Company</th>
                                                        <th scope="col">CompanyName</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    { bookingList }
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
        filtered_bookings: state.booking.filtered_bookings,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getBookings: () => dispatch(getBookings()),
        simpleSearch: (keyword) => dispatch(simpleSearch(keyword)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AllBookingsPage);
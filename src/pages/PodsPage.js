import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';

import moment from 'moment-timezone';
import { isEmpty } from 'lodash';

import { verifyToken, cleanRedirectState, getDMEClients } from '../state/services/authService';
// Constants
import { STATIC_HOST, HTTP_PROTOCOL } from '../config';

class PodsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            bookings: [],
            dmeClients: [],
        };
    }

    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.bool.isRequired,
        location: PropTypes.object.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
        getDMEClients: PropTypes.func.isRequired,
        clientname: PropTypes.string,
    };

    componentDidMount() {
        const token = localStorage.getItem('token');

        if (token && token.length > 0) {
            this.props.verifyToken();
        } else {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.history.push('/');
        }

        this.props.getDMEClients();
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { bookings, redirect, dmeClients } = newProps;
        const currentRoute = this.props.location.pathname;

        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/');
        }

        if (bookings) {
            this.setState({bookings});
        }

        if (dmeClients) {
            this.setState({dmeClients});
        }
    }

    onClickImg(e, booking, type) {
        e.preventDefault();

        if (type === 'POD') {
            const win = window.open(HTTP_PROTOCOL + '://' + STATIC_HOST + '/imgs/' + booking.z_pod_url, '_blank');
            win.focus();
        } else if (type === 'POD_SOG') {
            const win = window.open(HTTP_PROTOCOL + '://' + STATIC_HOST + '/imgs/' + booking.z_pod_signed_url, '_blank');
            win.focus();
        }
    }

    render() {
        const { bookings } = this.state;

        let bookingsList = bookings.map((booking, index) => {
            return (
                <tr key={index}>
                    <td>{booking.b_bookingID_Visual}</td>
                    <td>{booking.b_dateBookedDate ? moment(booking.b_dateBookedDate).format('ddd DD MMM YYYY'): ''}</td>
                    <td>{booking.puPickUpAvailFrom_Date ? moment(booking.puPickUpAvailFrom_Date).format('ddd DD MMM YYYY'): ''}</td>
                    <td>{booking.pu_Address_State}</td>
                    {/* <td>{booking.business_group}</td> */}
                    <td>{booking.deToCompanyName}</td>
                    <td>{booking.de_To_Address_Suburb}</td>
                    <td>{booking.de_To_Address_State}</td>
                    <td>{booking.de_To_Address_PostalCode}</td>
                    <td>{booking.b_client_sales_inv_num}</td>
                    <td>{booking.b_client_order_num}</td>
                    <td>{booking.v_FPBookingNumber}</td>
                    <td>{booking.b_status}</td>
                    <td>{booking.s_21_Actual_Delivery_TimeStamp ? moment(booking.s_21_Actual_Delivery_TimeStamp).format('ddd DD MMM YYYY'): ''}</td>
                    <td>
                        {((booking.z_pod_url && !isEmpty(booking.z_pod_url)) ||
                        (booking.z_pod_signed_url && !isEmpty(booking.z_pod_signed_url))) ?
                            <span>Y</span> : <span>N</span>
                        }
                    </td>
                    <td>{booking.z_pod_url && 
                            <a onClick={(e) => this.onClickImg(e, booking, 'POD')} className="padding-0 cursor-pointer">
                                <img src={HTTP_PROTOCOL + '://' + STATIC_HOST + '/imgs/' + booking.z_pod_url} />
                            </a>}
                    </td>
                    <td>{booking.z_pod_signed_url && 
                            <a onClick={(e) => this.onClickImg(e, booking, 'POD_SOG')} className="padding-0 cursor-pointer">
                                <img src={HTTP_PROTOCOL + '://' + STATIC_HOST + '/imgs/' + booking.z_pod_signed_url} />
                            </a>}
                    </td>
                </tr>
            );
        });

        return (
            <div className="qbootstrap-nav pods" >
                <div id="headr" className="col-md-12">
                    <div className="col-md-7 col-sm-12 col-lg-8 col-xs-12 col-md-push-1">
                        <ul className="nav nav-tabs">
                            <li><Link to="/booking">Header</Link></li>
                            <li className=""><Link to="/allbookings">All Bookings</Link></li>
                            <li className="active"><a href="/pods">PODs</a></li>
                            {this.props.clientname === 'dme' && <li className=""><Link to="/zoho">Zoho</Link></li>}
                            <li className=""><Link to="/reports">Reports</Link></li>
                            <li className="none"><a href="/bookinglines">Booking Lines</a></li>
                            <li className="none"><a href="/bookinglinedetails">Booking Line Data</a></li>
                        </ul>
                    </div>
                    <div id="icn" className="col-md-4 col-sm-12 col-lg-4 col-xs-12 text-right">
                        <a href=""><i className="icon-plus" aria-hidden="true"></i></a>
                        <div className="popup">
                            <i className="icon-search3" aria-hidden="true"></i>
                        </div>
                        <div className="popup">
                            <i className="icon icon-th-list" aria-hidden="true"></i>
                        </div>
                        <a href=""><i className="icon-cog2" aria-hidden="true"></i></a>
                        <a href=""><i className="icon-calendar3" aria-hidden="true"></i></a>
                        <a href="">?</a>
                    </div>
                </div>
                <div className="tab-pane fade in active">
                    <div className="table-responsive">
                        <table className="table table-hover table-bordered sortable">
                            <thead>
                                <tr>
                                    <th>b_bookingID_Visual</th>
                                    <th>b_dateBookedDate</th>
                                    <th>puPickUpAvailFrom_Date</th>
                                    <th>pu_Address_State</th>
                                    {/* <th>business_group</th> */}
                                    <th>deToCompanyName</th>
                                    <th>de_To_Address_Suburb</th>
                                    <th>de_To_Address_State</th>
                                    <th>de_To_Address_PostalCode</th>
                                    <th>b_client_sales_inv_num</th>
                                    <th>b_client_order_num</th>
                                    <th>v_FPBookingNumber</th>
                                    <th>b_status</th>
                                    <th>s_21_Actual_Delivery_TimeStamp</th>
                                    <th>zc_pod_or_no_pod</th>
                                    <th>z_pod_url</th>
                                    <th>z_pod_signed_url</th>
                                </tr>
                            </thead>
                            <tbody>
                                { bookingsList }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        bookings: state.booking.bookings,
        redirect: state.auth.redirect,
        dmeClients: state.auth.dmeClients,
        clientname: state.auth.clientname,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        getDMEClients: () => dispatch(getDMEClients()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PodsPage));
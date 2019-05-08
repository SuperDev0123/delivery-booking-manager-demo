import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import moment from 'moment-timezone';
import _ from 'lodash';

import { verifyToken, cleanRedirectState, getDMEClients } from '../state/services/authService';

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
        redirect: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
        getDMEClients: PropTypes.func.isRequired,
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

    componentWillReceiveProps(newProps) {
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

    render() {
        const { bookings } = this.state;

        let bookingsList = bookings.map((booking, index) => {
            return (
                <tr key={index}>
                    <td>{booking.b_bookingID_Visual}</td>
                    <td>{booking.b_dateBookedDate ? moment(booking.b_dateBookedDate).format('ddd DD MMM YYYY'): ''}</td>
                    <td>{booking.puPickUpAvailFrom_Date ? moment(booking.puPickUpAvailFrom_Date).format('ddd DD MMM YYYY'): ''}</td>
                    <td>{booking.pu_Address_State}</td>
                    <td>{booking.business_group}</td>
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
                        { 
                            ((booking.z_pod_url && !_.isEmpty(booking.z_pod_url)) ||
                            (booking.z_pod_signed_url && !_.isEmpty(booking.z_pod_signed_url))) ?
                                <span>Y</span>
                                :
                                <span>N</span>
                        }
                    </td>
                    <td>{booking.z_pod_url}</td>
                    <td>{booking.z_pod_signed_url}</td>
                </tr>
            );
        });

        return (
            <div className="qbootstrap-nav pods" >
                <div id="headr" className="col-md-12">
                    <div className="col-md-7 col-sm-12 col-lg-8 col-xs-12 col-md-push-1">
                        <ul className="nav nav-tabs">
                            <li><a href="/booking">Header</a></li>
                            <li><a href="/allbookings">All Bookings</a></li>
                            <li className="active"><a href="/pods">PODs</a></li>
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
                                <th>b_bookingID_Visual</th>
                                <th>b_dateBookedDate</th>
                                <th>puPickUpAvailFrom_Date</th>
                                <th>pu_Address_State</th>
                                <th>business_group</th>
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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        getDMEClients: () => dispatch(getDMEClients()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PodsPage);
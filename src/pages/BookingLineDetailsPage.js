import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { verifyToken, cleanRedirectState } from '../state/services/authService';
import { getBookingLineDetails } from '../state/services/bookingLineDetailsService';

class BookingLineDetailsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            bookingLineDetails: [],
        };
    }

    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        getBookingLineDetails: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.bool.isRequired,
        location: PropTypes.object.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
    };

    componentDidMount() {
        const token = localStorage.getItem('token');

        if (token && token.length > 0) {
            this.props.verifyToken();
        } else {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.history.push('/');
        }

        this.props.getBookingLineDetails();
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { bookingLineDetails, redirect } = newProps;
        const currentRoute = this.props.location.pathname;

        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/');
        }

        if (bookingLineDetails) {
            this.setState({bookingLineDetails: bookingLineDetails});
        }
    }

    render() {
        const { bookingLineDetails } = this.state;

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

        return (
            <div className="qbootstrap-nav" >
                <div id="headr" className="col-md-12">
                    <div className="col-md-7 col-sm-12 col-lg-8 col-xs-12 col-md-push-1">
                        <ul className="nav nav-tabs">
                            <li><a href="/booking">Header</a></li>
                            <li><a href="/allbookings">All Bookings</a></li>
                            <li><a href="/bookinglines">Booking Lines</a></li>
                            <li className="active"><a href="/bookinglinedetails">Booking Line Datas</a></li>
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
                <div className="top-menu">
                    <div className="container">
                        <div className="row1">
                            <div className="col-md-12 col-sm-12 col-lg-12 col-xs-12">
                                <div className="tab-content">
                                    <div id="all_booking" className="tab-pane fade in active">
                                        <div className="table-responsive">
                                            <table className="table table-hover table-bordered sortable">
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
        bookingLineDetails: state.bookingLineDetail.bookingLineDetails,
        redirect: state.auth.redirect,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        getBookingLineDetails: () => dispatch(getBookingLineDetails()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingLineDetailsPage);

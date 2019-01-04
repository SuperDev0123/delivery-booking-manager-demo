import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getBookingLineDetails } from '../state/services/bookingLineDetailsService';

class BookingLineDetailsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            bookingLineDetails: [],
        };
    }

    static propTypes = {
        getBookingLineDetails: PropTypes.func.isRequired,
    };

    componentDidMount() {
        this.props.getBookingLineDetails();
    }

    componentWillReceiveProps(newProps) {
        const { bookingLineDetails } = newProps;

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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getBookingLineDetails: () => dispatch(getBookingLineDetails()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingLineDetailsPage);

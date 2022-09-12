import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { verifyToken, cleanRedirectState } from '../state/services/authService';
import { getBookingLines } from '../state/services/bookingLinesService';
import { numberWithCommas } from '../commons/helpers'

class BookingLinesPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            bookingLines: [],
        };
    }

    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        getBookingLines: PropTypes.func.isRequired,
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

        this.props.getBookingLines();
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { bookingLines, redirect } = newProps;
        const currentRoute = this.props.location.pathname;

        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/');
        }

        if (bookingLines) {
            this.setState({bookingLines: bookingLines});
        }
    }

    render() {
        const { bookingLines } = this.state;

        let bookingLinesList = bookingLines.map((bookingLine, index) => {
            return (
                <tr key={index}>
                    <td>{bookingLine.pk_auto_id_lines}</td>
                    <td>{bookingLine.e_type_of_packaging}</td>
                    <td>{bookingLine.e_item}</td>
                    <td className="qty">{numberWithCommas(bookingLine.e_qty)}</td>
                    <td>{bookingLine.e_weightUOM}</td>
                    <td>{numberWithCommas(bookingLine.e_weightPerEach)}</td>
                    <td>{numberWithCommas(bookingLine.total_kgs)}</td>
                    <td>{bookingLine.e_dimUOM}</td>
                    <td>{numberWithCommas(bookingLine.e_dimLength)}</td>
                    <td>{numberWithCommas(bookingLine.e_dimWidth)}</td>
                    <td>{numberWithCommas(bookingLine.e_dimHeight)}</td>
                    <td>{numberWithCommas(bookingLine.cubic_meter)}</td>
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
                            <li className="active"><a href="/bookinglines">Booking Lines</a></li>
                            <li><a href="/bookinglinedetails">Booking Line Data</a></li>
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
        bookingLines: state.bookingLine.bookingLines,
        redirect: state.auth.redirect,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        getBookingLines: () => dispatch(getBookingLines()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingLinesPage);

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
// Comonents
import ManifestReport from './_ManifestReport';
// Services
import { verifyToken, cleanRedirectState } from '../../state/services/authService';

class PreBookingErrorsPage extends React.Component {
    constructor(props) {
        super(props);

    }

    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.bool.isRequired,
        location: PropTypes.object.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
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
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { redirect, username } = newProps;
        const currentRoute = this.props.location.pathname;

        if (username) {
            if (username === 'anchor_packaging_afs' || username === 'tempo_calm') {
                this.props.history.replace('/warehouse-label');
            }
        }
        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/');
        }
    }

    render() {
        const { clientname } = this.props;

        return (
            <div className="qbootstrap-nav report" >
                <div id="headr" className="col-md-12">
                    <div className="col-md-7 col-sm-12 col-lg-8 col-xs-12 col-md-push-1">
                        <ul className="nav nav-tabs">
                            <li><Link to="/booking">Header</Link></li>
                            <li className=""><Link to="/allbookings">All Bookings</Link></li>
                            <li className=""><a href="/bookingsets">Booking Sets</a></li>
                            <li className=""><a href="/pods">PODs</a></li>
                            {clientname === 'dme' && <li className=""><Link to="/zoho">Zoho</Link></li>}
                            <li className=""><Link to="/reports">Reports</Link></li>
                            <li className="active"><Link to="/prebooking-errors">Booking Errors</Link></li>
                            <li className="none"><a href="/bookinglines">Booking Lines</a></li>
                            <li className="none"><a href="/bookinglinedetails">Booking Line Data</a></li>
                        </ul>
                    </div>
                    <div id="icn" className="col-md-4 col-sm-12 col-lg-4 col-xs-12 text-right col-lg-pull-1">
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
                    <div className="content">
                        <ManifestReport
                            history={this.props.history}
                            clientname={clientname}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        redirect: state.auth.redirect,
        clientname: state.auth.clientname,
        username: state.auth.username,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PreBookingErrorsPage));
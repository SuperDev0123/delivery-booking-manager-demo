import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Clock from 'react-live-clock';
import moment from 'moment-timezone';
import { Button } from 'reactstrap';
// import _ from 'lodash';

import { verifyToken, cleanRedirectState } from '../state/services/authService';
import { getReports } from '../state/services/reportService';

class ReportPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            reports: [],
        };
    }

    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
        getReports: PropTypes.func.isRequired,
    };

    componentDidMount() {
        const token = localStorage.getItem('token');

        if (token && token.length > 0) {
            this.props.verifyToken();
        } else {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.history.push('/');
        }

        this.props.getReports();
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { redirect, reports } = newProps;
        const currentRoute = this.props.location.pathname;

        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/');
        }

        if (reports) {

            this.setState({reports});
        }
    }

    render() {
        const { reports } = this.state;

        let reportsList = reports.map((report, index) => {
            return (
                <div className="layout-card" key={index}>
                    <div className="info">
                        <p className="">
                            {index + 1}.&nbsp;&nbsp;&nbsp;
                            <strong>{report.name}&nbsp;</strong>
                            ({report.type})&nbsp;
                            {
                                (report.z_downloadedTimeStamp) ?
                                    <span className="downloaded">Downloaded</span>
                                    :
                                    <span className="new"><i>NEW!</i></span>
                            }
                        </p>
                        <p className="">
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <span>Created At: {moment(report.z_createdTimeStamp).format('DD MMM YYYY hh:mm:ss')}</span>
                            {
                                (report.z_downloadedTimeStamp) &&
                                    <span>&nbsp;&nbsp;Downloaded At: {moment(report.z_downloadedTimeStamp).format('DD MMM YYYY hh:mm:ss')}</span>
                            }
                        </p>
                    </div>
                    <div className="action">
                        <Button color="primary">A</Button>
                        <Button color="primary">A</Button>
                        <Button color="primary">A</Button>
                    </div>
                </div>
            );
        });

        return (
            <div className="qbootstrap-nav report" >
                <div id="headr" className="col-md-12">
                    <div className="col-md-7 col-sm-12 col-lg-8 col-xs-12 col-md-push-1">
                        <ul className="nav nav-tabs">
                            <li><a href="/booking">Header</a></li>
                            <li><a href="/allbookings">All Bookings</a></li>
                            <li><a href="/pods">PODs</a></li>
                            <li><a href="/comms">Comms</a></li>
                            <li className="active"><a href="/pods">Reports</a></li>
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
                        <span className="right">Sydney AU: <Clock format={'DD MMM YYYY h:mm:ss A'} disabled={true} ticking={true} timezone={'Australia/Sydney'} /></span>
                        {reportsList}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        reports: state.report.reports,
        redirect: state.auth.redirect,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        getReports: () => dispatch(getReports()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportPage);

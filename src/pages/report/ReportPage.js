import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// Comonents
import ManifestReport from './_ManifestReport';
// Services
import { verifyToken, cleanRedirectState } from '../../state/services/authService';

class ReportPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedReportType: 'manifest',
        };
    }

    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.bool.isRequired,
        location: PropTypes.object.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
        clientname: PropTypes.string.isRequired,
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
        const { redirect } = newProps;
        const currentRoute = this.props.location.pathname;

        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/');
        }
    }

    onChangeReportType(e) {
        this.setState({selectedReportType: e.target.value});
    }

    render() {
        const { clientname } = this.props;
        const { selectedReportType } = this.state;

        return (
            <div className="qbootstrap-nav report" >
                <div id="headr" className="col-md-12">
                    <div className="col-md-7 col-sm-12 col-lg-8 col-xs-12 col-md-push-1">
                        <ul className="nav nav-tabs">
                            <li><a href="/booking">Header</a></li>
                            <li><a href="/allbookings">All Bookings</a></li>
                            <li><a href="/pods">PODs</a></li>
                            {
                                clientname === 'dme' && <li><a href="/comm">Comm</a></li>
                            }
                            <li className="active"><a href="/reports">Reports</a></li>
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
                        <label>
                            Report Type:
                            <select value={selectedReportType} onChange={(e) => this.onChangeReportType(e)}>
                                <option value="manifest">Manifest</option>
                            </select>
                        </label>
                        <hr />
                        {
                            selectedReportType === 'manifest' && <ManifestReport />
                        }
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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportPage);

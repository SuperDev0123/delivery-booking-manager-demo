import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LoadingOverlay from 'react-loading-overlay';
import { withRouter } from 'react-router-dom';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Moment from 'react-moment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { verifyToken, cleanRedirectState } from '../../../../state/services/authService';
import { getallCronOptions, updateCronOptionDetails } from '../../../../state/services/cronOptionService';

class CronOptions extends Component {
    intervalId = 0;
    constructor(props) {
        super(props);

        this.state = {
            allCronOptions: [],
            username: null,
            loading: false,
        };
        this.handleChange = this.handleChange.bind(this);
    }

    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.bool.isRequired,
        getallCronOptions: PropTypes.func.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
        updateCronOptionDetails: PropTypes.func.isRequired,
        allCronOptions: PropTypes.object.isRequired,
        urlAdminHome: PropTypes.string.isRequired,
    }

    componentDidMount() {
        this.setState({ loading: true });
        const token = localStorage.getItem('token');

        if (token && token.length > 0) {
            this.props.verifyToken();
        } else {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/admin');
        }

        this.props.getallCronOptions();
        this.setState({ loading: false });
        this.intervalId = setInterval(() => { this.props.getallCronOptions(); }, 1000 * 5 * 60);
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    notify = (text) => {
        toast(text);
    };

    handleChange({ target }) {
        this.props.updateCronOptionDetails({ id: target.name, option_value: target.value == 0 ? 1 : 0 });
        if (target.checked) {
            target.setAttribute('checked', true);
            target.parentNode.style.textDecoration = 'line-through';
            target.value = 1;

        } else {
            target.removeAttribute('checked');
            target.parentNode.style.textDecoration = '';
            target.value = 0;
        }
    }
    onInputChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { redirect, allCronOptions, needUpdateCronOptions, } = newProps;
        const currentRoute = this.props.location.pathname;
        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/admin');
        }
        if (allCronOptions && allCronOptions !== this.state.allCronOptions) {
            this.setState({ allCronOptions });

        }
        if (needUpdateCronOptions) {
            this.notify('Data updated!');
            this.props.getallCronOptions();
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.allCronOptions.length > 0 && this.props.allCronOptions !== prevProps.allCronOptions) {
            this.notify('Data updated!');
        }
    }

    render() {
        const { allCronOptions } = this.state;
        const tableData = allCronOptions.map((item, index) => {
            return (
                <tr key={index}>
                    <td>{item.option_name}</td>
                    <td><input name={item.id} onClick={this.handleChange} onChange={(e) => this.onInputChange(e)} type="checkbox" value={item.option_value} checked={(item.option_value == 1) ? true : false} /></td>
                    <td width="50">{item.option_description}</td>
                    <td>{item.option_schedule}</td>
                    <td>{item.start_time}</td>
                    <td>{item.end_time}</td>
                    <td>{item.start_count}</td>
                    <td>{item.end_count}</td>
                    <td>{item.elapsed_seconds}</td>
                    <td>
                        {item.is_running == 1 ? ( <button className="btn btn-success btn-sm">Running</button> ) : ( <button className="btn btn-warn btn-sm">Not Running</button> )}
                    </td>
                    <td>{item.z_createdByAccount}</td>
                    <td><Moment format="MM/DD/YYYY HH:mm" date={item.z_createdTimeStamp} /></td>
                    {/*<td>{item.z_downloadedByAccount}</td>
                    <td><Moment date={item.z_downloadedTimeStamp} /></td>
                    <td><a className="btn btn-info btn-sm" href={"/providers/edit/"+item.id}>Edit</a>&nbsp;&nbsp;<a onClick={(event) => this.removeFpDetail(event, item)} className="btn btn-danger btn-sm" href="javascript:void(0)">Delete</a></td>*/}
                </tr>
            );
        });

        return (
            <div>
                <ToastContainer />
                <div className="pageheader">
                    <h1>Cron Options</h1>
                    <div className="breadcrumb-wrapper hidden-xs">
                        <span className="label">You are here:</span>
                        <ol className="breadcrumb">
                            <li><a href={this.props.urlAdminHome}>Home</a>
                            </li>
                            <li className="active">Cron Options</li>
                        </ol>
                    </div>
                </div>
                <section id="main-content" className="animated fadeInUp">
                    <LoadingOverlay
                        active={this.state.loading}
                        spinner
                        text='Loading...'
                    />
                    <div className="row">
                        <div className="col-md-12">
                            <div className="panel panel-default">
                                <div className="panel-heading">
                                    <h3 className="panel-title">Cron Options</h3>
                                </div>
                                <div className="panel-body">
                                    <div className="table-responsive">
                                        <table id="example" className="table table-striped table-bordered" cellSpacing="0" width="100%">
                                            <thead>
                                                <tr>
                                                    <th>Option Name</th>
                                                    <th>Option Value</th>
                                                    <th width="50">Option Description</th>
                                                    <th>Option Schedule</th>
                                                    <th>Start Time</th>
                                                    <th>End Time</th>
                                                    <th>Start Count</th>
                                                    <th>End Count</th>
                                                    <th>Elapsed Second</th>
                                                    <th>Is Running</th>
                                                    <th>Created By</th>
                                                    <th>Created At</th>
                                                    {/*<th>Modified BY</th>
                                            <th>Modified At</th>
                                            <th>Actions</th>*/}
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {tableData}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        redirect: state.auth.redirect,
        allCronOptions: state.cronOption.allCronOptions,
        username: state.auth.username,
        needUpdateCronOptions: state.cronOption.needUpdateCronOptions,
        urlAdminHome: state.url.urlAdminHome,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        getallCronOptions: () => dispatch(getallCronOptions()),
        updateCronOptionDetails: (data) => dispatch(updateCronOptionDetails(data)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CronOptions));

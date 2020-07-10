import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import _ from 'lodash';
import DateTimePicker from 'react-datetime-picker';
import LoadingOverlay from 'react-loading-overlay';
import { withRouter } from 'react-router-dom';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';

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
            isShowDateTimePicker: false,
            tempArg2: false
        };

        moment.tz.setDefault('Australia/Sydney');
        this.tzOffset = new Date().getTimezoneOffset() === 0 ? 0 : -1 * new Date().getTimezoneOffset() / 60;
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

    UNSAFE_componentWillReceiveProps(newProps) {
        const { redirect, allCronOptions, needUpdateCronOptions } = newProps;
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
            this.props.getallCronOptions();
            this.notify('List is refreshed!');
        }
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

    onChangeDateTime(date, option, fieldName) {
        const allCronOptions = this.state.allCronOptions;
        let conveted_date = moment(date).add(this.tzOffset, 'h');   // Current -> UTC
        conveted_date = conveted_date.add(-10, 'h');                // UTC -> Sydney

        if (fieldName === 'arg2' && conveted_date) {
            allCronOptions.map(cronOption => {
                if (cronOption.id === option.id) {
                    cronOption.arg2 = moment(conveted_date).format('YYYY-MM-DD HH:mm:ssZ');
                }
            });
            this.setState({allCronOptions});
        }

        this.setState({isBookingModified: true});
    }

    onInputChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    onClickPencil(option, type) {
        if (type === 'arg2') {
            this.setState({isShowDateTimePicker: true});
        }
    }

    onClickSave(option, type) {
        if (type === 'arg2') {
            this.props.updateCronOptionDetails({ id: option.id, arg2: option.arg2 });
            this.setState({isShowDateTimePicker: false});
        }
    }

    render() {
        const { allCronOptions, isShowDateTimePicker } = this.state;
        const tableData = allCronOptions.map((option, index) => {
            return (
                <tr key={index}>
                    <td>{option.option_name}</td>
                    <td><input name={option.id} onClick={this.handleChange} onChange={(e) => this.onInputChange(e)} type="checkbox" value={option.option_value} checked={(option.option_value == 1) ? true : false} /></td>
                    <td style={{width: '40%'}}>{option.option_description}</td>
                    <td>{option.option_schedule}</td>
                    <td>{option.start_time}</td>
                    <td>{option.end_time}</td>
                    <td>{option.start_count}</td>
                    <td>{option.end_count}</td>
                    <td>{option.elapsed_seconds}</td>
                    <td>
                        {option.is_running == 1 ?
                            <button className="btn btn-success btn-sm">Y</button>
                            :
                            <button className="btn btn-warn btn-sm">N</button>
                        }
                    </td>
                    <td>{option.arg1}</td>
                    <td>
                        {!isShowDateTimePicker ?
                            option.arg2 && moment(option.arg2).format('DD/MM/YYYY HH:mm')
                            :
                            <DateTimePicker
                                onChange={(date) => this.onChangeDateTime(date, option, 'arg2')}
                                value={(!_.isNull(option) &&
                                    !_.isNull(option.arg2) &&
                                    !_.isUndefined(option.arg2)) &&
                                    new Date(moment(option.arg2).toDate().toLocaleString('en-US', {timeZone: 'Australia/Sydney'}))
                                }
                                format={'dd/MM/yyyy HH:mm'}
                            />
                        }
                        <i className="icon icon-pencil" onClick={() => this.onClickPencil(option, 'arg2')}></i>
                        <i className="fa fa-save" onClick={() => this.onClickSave(option, 'arg2')}></i>
                    </td>
                    <td>{option.z_createdByAccount}</td>
                    <td>{option.z_createdTimeStamp && moment(option.z_createdTimeStamp).format('DD/MM/YYYY HH:mm')}</td>
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
                                                    <th>Name</th>
                                                    <th>Active?</th>
                                                    <th width="50">Description</th>
                                                    <th>Schedule</th>
                                                    <th>Started At</th>
                                                    <th>Finished At</th>
                                                    <th>Start Count</th>
                                                    <th>End Count</th>
                                                    <th>Elapsed Second</th>
                                                    <th>Running?</th>
                                                    <th>Arg 1</th>
                                                    <th>Arg 2</th>
                                                    <th>Created By</th>
                                                    <th>Created At</th>
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

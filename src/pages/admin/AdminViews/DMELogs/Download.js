import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import axios from 'axios';
import moment from 'moment';
import LoadingOverlay from 'react-loading-overlay';
import DateTimePicker from 'react-datetime-picker';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { verifyToken, cleanRedirectState } from '../../../../state/services/authService';
import { API_HOST, HTTP_PROTOCOL } from '../../../../config';
import { isNull } from 'lodash';
import { timeDiff } from '../../../../commons/constants';
import { getAllFPs } from '../../../../state/services/fpService';
import Select from 'react-select';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

class DMEDownloadLogs extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            log_date: (new Date()).toLocaleString('en-US', { timeZone: 'Australia/Sydney' }),
            requestTypeList: [],
            selected_fp: -1,
            selected_status: -1,
            selected_type: '',
            allPageCount: 0,
            currentPage: 0,
            log_data: [],
        };
        moment.tz.setDefault('Australia/Sydney');
        this.tzOffset = new Date().getTimezoneOffset() === 0 ? 0 : -1 * new Date().getTimezoneOffset() / 60;
        this.statusOptions = [
            {value: 1, label: 'Success'},
            {value: 0, label: 'Error'}
        ];
    }

    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        urlAdminHome: PropTypes.string.isRequired,
        location: PropTypes.object.isRequired,
        redirect: PropTypes.bool.isRequired,
        getAllFPs: PropTypes.func.isRequired,
        allFPs: PropTypes.array.isRequired,
    };

    componentDidMount() {
        const token = localStorage.getItem('token');

        if (token && token.length > 0) {
            this.props.verifyToken();
        } else {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/admin');
        }
        this.props.getAllFPs();
        this.getRequestType();
        this.getDMELogs();
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

    getRequestType = () => {
        const token = localStorage.getItem('token');
        const options = {
            method: 'post',
            url: HTTP_PROTOCOL + '://' + API_HOST + '/get-request-type/',
            headers: { 'Authorization': 'JWT ' + token },
        };
        axios(options)
            .then((response) => {                
                this.setState({ requestTypeList: response.data.result });
            })
            .catch(() => {
            });
    }

    getDMELogs = () => {
        const {selected_fp, selected_status, selected_type, currentPage} = this.state;
        if (!this.state.log_date) {
            toast.error('Please select date you want to check.');
            return;
        }
        const log_date = moment(this.state.log_date).format('YYYY-MM-DD');
        this.setState({loading: true});
        const token = localStorage.getItem('token');
        const options = {
            method: 'post',
            url: HTTP_PROTOCOL + '://' + API_HOST + '/dme_logs/pagination/',
            headers: { 'Authorization': 'JWT ' + token },
            data: {
                downloadOption: 'dme_logs',
                log_date,
                selected_fp,
                selected_type,
                currentPage,
                selected_status
            },
        };
        axios(options)
            .then((response) => {                
                this.setState({ loading: false, log_data: response.data.result, allPageCount: response.data.allPageCount });
            })
            .catch(() => {
                this.setState({ loading: false });
            });
    }

    downloadLogs() {
        const {selected_fp, selected_status, selected_type} = this.state;
        if (!this.state.log_date) {
            toast.error('Please select date you want to check.');
            return;
        }
        const log_date = moment(this.state.log_date).format('YYYY-MM-DD');
        this.setState({ loading: true });
        const token = localStorage.getItem('token');
        const options = {
            method: 'post',
            url: HTTP_PROTOCOL + '://' + API_HOST + '/download/',
            headers: { 'Authorization': 'JWT ' + token },
            data: {
                downloadOption: 'dme_logs',
                log_date,
                selected_fp,
                selected_type,
                selected_status
            },
            responseType: 'blob', // important
        };

        axios(options)
            .then((response) => {
                this.setState({ loading: false });
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `dme_log__${log_date}.zip`);
                document.body.appendChild(link);
                link.click();
            })
            .catch((error) => {
                this.setState({ loading: false });
                toast('Download failed!');
                console.log('download error:', error);
            });
    }

    onChangeDateTime(date) {
        if (date) {
            let conveted_date = moment(date).add(this.tzOffset, 'h');   // Current -> UTC
            conveted_date = conveted_date.add(timeDiff, 'h');
            this.setState({ log_date: moment(conveted_date).format('YYYY-MM-DD HH:mmZ') }, this.getDMELogs  );
        }
    }

    onClickPaginationItem(page) {
        this.setState({currentPage: page}, this.getDMELogs);
    }

    pagination(currentPage, allPageCount) {
        let paginationItems = [];
        for(let i = 0; i < allPageCount; i++) {
            paginationItems.push(
                <PaginationItem key={i+1}>
                    <PaginationLink 
                        href='javscript: void(0)' 
                        onClick={() => this.onClickPaginationItem(i)}
                        className={i === currentPage ? 'current' : null}
                    >
                        {i + 1}
                    </PaginationLink>
                </PaginationItem>
            );
        }
        return (
            <Pagination size='md' aria-label='Page navigation example' className='d-flex justify-content-center'>
                <PaginationItem>
                    <PaginationLink 
                        href='javscript: void(0)' 
                        onClick={() => currentPage !== 0 && this.onClickPaginationItem(0)}
                        className={currentPage === 0 ? 'disabled' : null}
                    >
                        &lt;&lt;
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink
                        href='javscript: void(0)' 
                        onClick={() => currentPage !== 0 && this.onClickPaginationItem(currentPage - 1)}
                        className={currentPage === 0 ? 'disabled' : null}
                    >
                        &lt;
                    </PaginationLink>
                </PaginationItem>
                {paginationItems}
                <PaginationItem>
                    <PaginationLink
                        href='javscript: void(0)' 
                        onClick={() => currentPage !== allPageCount - 1 && this.onClickPaginationItem(currentPage + 1)}
                        className={currentPage === allPageCount - 1 ? 'disabled' : null}
                    >
                        &gt;
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink 
                        href='javscript: void(0)' 
                        onClick={() => currentPage !== allPageCount - 1 && this.onClickPaginationItem(allPageCount - 1)}
                        className={currentPage === allPageCount - 1 ? 'disabled' : null}
                    >
                        &gt;&gt;
                    </PaginationLink>
                </PaginationItem>
            </Pagination>
        );
    }

    render() {
        const { log_date, requestTypeList, loading, allPageCount, currentPage, log_data } = this.state;
        const fpOptions = this.props.allFPs
            .map(fp => ({ value: fp.id, label: fp.fp_company_name }));
        const requestTypeOptions = requestTypeList.map(type => ({value: type.request_type, label: type.request_type}));
        console.log(log_data);
        let logList = log_data ? log_data.map((logLine, index) =>
            (
                <tr key={index}>
                    <td>{logLine.id}</td>
                    <td>{logLine.fk_service_provider_id}</td>
                    <td>{logLine.fk_booking_id}</td>
                    <td>{logLine.request_status}</td>
                    <td>{logLine.request_type}</td>
                    <td>{logLine.request_payload}</td>
                    <td>{logLine.response}</td>
                    <td>{moment(logLine.request_timestamp).format('DD/MM/YYYY HH:mm')}</td>
                </tr>
            )) : [];
        console.log(logList);
        return (
            <div>
                <div className="pageheader">
                    <h1>Download Logs</h1>
                    <div className="breadcrumb-wrapper hidden-xs">
                        <span className="label">You are here:</span>
                        <ol className="breadcrumb">
                            <li><a href={this.props.urlAdminHome}>Home</a>
                            </li>
                            <li className="active">Logs</li>
                        </ol>
                    </div>
                </div>
                <LoadingOverlay
                    active={loading}
                    spinner
                    text='Loading...'
                    styles={{
                        spinner: (base) => ({
                            ...base,
                            '& svg circle': {
                                stroke: '#048abb'
                            }
                        })
                    }}
                >
                    <section id="main-content" className="animated fadeInUp">
                        <h4 className='pb-1'>From the entered creation date a csv of dme logs will be downloaded.</h4>
                        
                        <div className="col-md-12">
                            <div className="col-sm-3 form-group">
                                <div>
                                    <span>Date</span>
                                    <div>
                                        <DateTimePicker
                                            onChange={(date) => {
                                                this.onChangeDateTime(date);
                                            }}
                                            value={!isNull(log_date) && new Date(moment(log_date).toDate().toLocaleString('en-US', { timeZone: 'Australia/Sydney' }))
                                            }
                                            format={'dd/MM/yyyy'}
                                            className='log-datepicker'
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-3 form-group">
                                <div>
                                    <span>Freight Provider</span>
                                    <Select
                                        onChange={(e) => {
                                            this.setState({selected_fp: e.value}, this.getDMELogs);
                                        }}
                                        options={fpOptions}
                                        placeholder='Filter by FP'
                                    />
                                </div>
                            </div>
                            <div className="col-sm-3 form-group">
                                <div>
                                    <span>Request Status</span>
                                    <Select
                                        onChange={(e) => {
                                            this.setState({selected_status: e.value}, this.getDMELogs);
                                        }}
                                        options={this.statusOptions}
                                        placeholder='Filter by Status'
                                    />
                                </div>
                            </div>
                            <div className="col-sm-3 form-group">
                                <div>
                                    <span>Request Type</span>
                                    <Select
                                        onChange={(e) => {
                                            this.setState({selected_type: e.value}, this.getDMELogs);
                                        }}
                                        options={requestTypeOptions}
                                        placeholder='Filter by Type'
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <button className="btn btn-success mr-5 mt-3" onClick={() => this.downloadLogs()} style={{marginLeft: 'calc(100% - 30px)', transform: 'translateX(-100%)'}} >Download Log</button>
                        </div>               
                    </section>
                    <div className='m-5' style={{padding: '20px 0', overflowX: 'auto'}}>
                        <table className="booking-lines">
                            <thead>
                                <th style={{minWidth: '70px'}}>ID</th>
                                <th style={{minWidth: '100px'}}>Service Provider ID</th>
                                <th style={{minWidth: '100px'}}>Booking ID</th>
                                <th style={{minWidth: '70px'}}>Request Status</th>
                                <th style={{minWidth: '90px'}}>Request Type</th>
                                <th style={{minWidth: '400px'}}>Request Payload</th>
                                <th style={{minWidth: '400px'}}>Response</th>
                                <th style={{minWidth: '100px'}}>TimeStamp</th>
                            </thead>
                            <tbody>
                                { loading || !logList.length ? <tr><td colSpan={8} style={{height: 100}}></td></tr> : logList }
                            </tbody>
                        </table>
                    </div>
                    {allPageCount ? this.pagination(currentPage, allPageCount) : ''}
                </LoadingOverlay>
                <ToastContainer />
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        redirect: state.auth.redirect,
        allFPs: state.fp.allFPs,
        username: state.auth.username,
        files: state.files.files,
        urlAdminHome: state.url.urlAdminHome,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        getAllFPs: () => dispatch(getAllFPs()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DMEDownloadLogs));

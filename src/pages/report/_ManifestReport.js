import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Libs
import axios from 'axios';
import moment from 'moment-timezone';
import LoadingOverlay from 'react-loading-overlay';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isNull } from 'lodash';
// Services
import { getManifestReport, setAllGetBookingsFilter } from '../../state/services/bookingService';
// Constants
import { API_HOST, HTTP_PROTOCOL } from '../../config';
import { getUser } from '../../state/services/authService';

class ManifestReport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loadingDownload: false,
            loading: true,
            fpFilter: '',
            clientFilter: '',
            fpFilterOpts: [],
            clientsOpts: [],
            reportStore: [],
            reportList: [],
            fpOptions: [],
            clientOptions: [],
            page_index: 0,
        };
    }

    static propTypes = {
        history: PropTypes.object.isRequired,
        getUser: PropTypes.func.isRequired,
        getManifestReport: PropTypes.func.isRequired,
        getAllClients: PropTypes.func.isRequired,
        getAllFPs: PropTypes.func.isRequired,
        setAllGetBookingsFilter: PropTypes.func.isRequired,
        reports: PropTypes.array.isRequired,
        clientname: PropTypes.string.isRequired,
        allFPs: PropTypes.array.isRequired,
        clients: PropTypes.array.isRequired,
    };

    componentDidMount() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const token = localStorage.getItem('token');

        if (isLoggedIn && token && token.length > 0)
            this.props.getUser(token);

        this.props.getManifestReport(0);
        
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { reports, allFPs, clients } = newProps;
        const { reportStore } = this.state;
        if (reports && reports.length !== 0) {
            if (isNull(this.props.reports)) {
                const newReportStore = [...reportStore, ...reports];
                this.setState({
                    reportStore: newReportStore
                });
            } else {
                if (!this.compareArray(this.props.reports, reports)) {
                    const newReportStore = [...reportStore, ...reports];
                    this.setState({
                        reportStore: newReportStore
                    });
                }
            }
            this.setState({loading: false});
        }

        if (allFPs != this.props.allFPs) {
            const { fpOptions } = this.state;
            let newOpts = [];
            allFPs.map((fp) => {
                if (!fpOptions.includes(fp)) {
                    newOpts.push(fp);
                }
            });
            const totalFps = [...fpOptions, ...newOpts];
            const fpFilterOpts = totalFps.map((fp, index) => {
                return <option value={fp} key={index}>{fp}</option>;
            });

            this.setState({
                fpFilterOpts,
                fpOptions: totalFps,
            });
        }
        
        if (clients != this.props.clients) {
            const { clientOptions } = this.state;
            let newClientOps = [];
            clients.map((client) => {
                const isNotContain = clientOptions.every((clientOption) => {
                    return clientOption.dme_account_num != client.dme_account_num;
                });

                if (isNotContain) {
                    newClientOps.push(client);
                }
            });

            const totalClients = [...clientOptions, ...newClientOps];
            const clientsOpts = totalClients.map((client, index) => {
                return <option value={client.dme_account_num} key={index}>{client.company_name}</option>;
            });
            this.setState({
                clientsOpts,
                clientOptions: totalClients
            });
        }
    }

    notify = (text) => toast(text);

    onClickDownload(report) {
        this.setState({loading: true});
        const token = localStorage.getItem('token');

        const options = {
            method: 'post',
            url: HTTP_PROTOCOL + '://' + API_HOST + '/download/',
            headers: {'Authorization': 'JWT ' + token},
            data: {z_manifest_url: report.z_manifest_url, downloadOption: 'manifest'},
            responseType: 'blob', // important
        };

        axios(options).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'manifest__' + moment(report.manifest_date).format('YYYY_MM_DD') + '.zip');
            document.body.appendChild(link);
            link.click();
            this.setState({loading: false});
        });
    }

    onClickCopy(report) {
        navigator.clipboard.writeText(report['b_bookingID_Visuals']);
        this.notify('Booking IDs are copied on clipboard');
    }

    onClickViewOnAllBookingsTab(report) {
        // Open new tab with bookings in report
        localStorage.setItem('report:b_bookingID_Visuals', report['b_bookingID_Visuals'].join(', '));
        window.open('/allbookings', '_blank');
    }

    onChangeFilterType = (e, filterType) => {
        this.setState({[filterType]: e.target.value});
    }
    
    
    onFind = (reports) => {
        const { clientname } = this.props;
        const { fpFilter, clientFilter } = this.state;
        if (reports) {
            const filteredReports = reports.filter(report => {
                const hasFP = (fpFilter) => !fpFilter || report.freight_providers.includes(fpFilter);

                if (clientname === 'dme')
                    return hasFP(fpFilter) && report.kf_client_id.includes(clientFilter);
                else
                    return hasFP(fpFilter);
            });

            if (filteredReports) {
                const reportList = filteredReports.map((report, index) => {
                    const freight_providers = report.freight_providers
                        .map((fp, index1) => (<span key={index1}><strong>{fp}</strong> ({report.cnt_4_each_fp[fp]})<br /></span>));
                    const vehicles = report.vehicles
                        .map((vehicle, index2) => (<span key={index2}>{vehicle}<br /></span>));

                    return (
                        <tr key={`${this.state.page_index} + ${index}`}>
                            <td>{report.manifest_id}</td>
                            <td>{moment(report.manifest_date).format('DD MMM YYYY')}</td>
                            <td>{report.warehouse_name}</td>
                            <td>{freight_providers}</td>
                            <td>{vehicles}</td>
                            <td>{report.count}</td>
                            <td>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => this.onClickDownload(report)}
                                >
                                    Download
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => this.onClickViewOnAllBookingsTab(report)}
                                >
                                    View on Allbookings tab
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => this.onClickCopy(report)}
                                >
                                    Copy Booking IDs
                                </button>
                            </td>
                        </tr>
                    );
                });
                return reportList;
            }
        }

    }

    onHandleScroll = (e) => {
        const { loading } = this.state;
        const height = e.target.scrollHeight;
        const scrollTop = e.target.scrollTop;
        const offsetHeight = e.target.offsetHeight;
        const { page_index } = this.state;
        if (!loading && (scrollTop + offsetHeight > height - 100)) {
            this.setState({loading: true, page_index: page_index + 1});
            this.props.getManifestReport(page_index + 1);
        }
    }

    compareArray = (arr1, arr2) => {
        if (arr1.length != arr2.length) {
            return false;
        }

        for (let i = 0; i < arr1.length; i++) {
            if (JSON.stringify(arr1[i]) !== JSON.stringify(arr2[i])) return false;
        }
        return true;
    }
    
    render() {
        const { clientname } = this.props;
        const { loading, fpFilter, clientFilter, fpFilterOpts, clientsOpts, reportStore } = this.state;
        const reportList = reportStore? this.onFind(reportStore) : '';
        return (
            <LoadingOverlay
                active={loading}
                spinner
                text='Loading...'
            >
                <div>
                    {clientname === 'dme' &&
                        <label>Client:
                            <select value={clientFilter} onChange={(e) => this.onChangeFilterType(e, 'clientFilter')} >
                                <option value="" selected>All</option>
                                {clientsOpts}
                            </select>
                        </label>
                    }
                    <label>Freight Provider:
                        <select value={fpFilter} onChange={(e) => this.onChangeFilterType(e, 'fpFilter')} >
                            <option value="" selected>All</option>
                            {fpFilterOpts}
                        </select>
                    </label>                                  
                    <hr />
                </div>
                <div className="manifest" onScroll={(e) => this.onHandleScroll(e)}>
                    <table className='table table-hover table-bordered table-striped'>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Date</th>
                                <th>Warehouse</th>
                                <th>Freight Provider</th>
                                <th>Vehicle Info</th>
                                <th>Count</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportList}
                        </tbody>
                    </table>
                </div>

                <ToastContainer />
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        reports: state.booking.manifestReports,
        clientname: state.auth.clientname,
        clients: state.booking.report_clients,
        allFPs: state.booking.report_fps,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getUser: (token) => dispatch(getUser(token)),
        getManifestReport: (index) => dispatch(getManifestReport(index)),
        setAllGetBookingsFilter: (startDate, endDate, clientPK, warehouseId, fpId, pageItemCnt, pageInd, sortField, columnFilters, activeTabInd, simpleSearchKeyword, downloadOption, dmeStatus, multiFindField, multiFindValues, projectName) => dispatch(setAllGetBookingsFilter(startDate, endDate, clientPK, warehouseId, fpId, pageItemCnt, pageInd, sortField, columnFilters, activeTabInd, simpleSearchKeyword, downloadOption, dmeStatus, multiFindField, multiFindValues, projectName)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManifestReport);

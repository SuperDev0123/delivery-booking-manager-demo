import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Libs
import axios from 'axios';
import moment from 'moment-timezone';
import LoadingOverlay from 'react-loading-overlay';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
            reportList: [],
            fpOptions: [],
            clients: [],
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

        this.props.getManifestReport();
        
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { reports, allFPs, clients } = newProps;

        if (reports != this.props.reports) {
            this.setState({loading: false, reports});
            this.onFind(reports);
        }

        if (allFPs != this.props.allFPs) {
            const fpFilterOpts = allFPs.map((fp, index) => {
                return <option value={fp} key={index}>{fp}</option>;
            });
            this.setState({fpFilterOpts});
        }
        
        if (clients != this.props.clients) {
            const clientsOpts = clients.map((client, index) => {
                return <option value={client.dme_account_num} key={index}>{client.company_name}</option>;
            });
            this.setState({clientsOpts});
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
                const fp = report.freight_provider.toLowerCase();

                if (clientname === 'dme')
                    return fp.includes(fpFilter.toLowerCase()) && report.kf_client_id.includes(clientFilter);
                else
                    return fp.includes(fpFilter.toLowerCase());
            });
            if (filteredReports) {
                let reportList = filteredReports.map((report, index) => {
                    return (
                        <tr key={index}>
                            <td>{report.manifest_id}</td>
                            <td>{moment(report.manifest_date).format('DD MMM YYYY')}</td>
                            <td>{report.warehouse_name}</td>
                            <td>{report.freight_provider}</td>
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
    render() {
        const { clientname, reports } = this.props;
        const { loading, fpFilter, clientFilter, fpFilterOpts, clientsOpts } = this.state;
        let reportList = this.onFind(reports);
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
                <div className="manifest">
                    <table className='table table-hover table-bordered table-striped'>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Date</th>
                                <th>Warehouse</th>
                                <th>Freight Provider</th>
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
        getManifestReport: () => dispatch(getManifestReport()),
        setAllGetBookingsFilter: (startDate, endDate, clientPK, warehouseId, fpId, pageItemCnt, pageInd, sortField, columnFilters, activeTabInd, simpleSearchKeyword, downloadOption, dmeStatus, multiFindField, multiFindValues, projectName) => dispatch(setAllGetBookingsFilter(startDate, endDate, clientPK, warehouseId, fpId, pageItemCnt, pageInd, sortField, columnFilters, activeTabInd, simpleSearchKeyword, downloadOption, dmeStatus, multiFindField, multiFindValues, projectName)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManifestReport);

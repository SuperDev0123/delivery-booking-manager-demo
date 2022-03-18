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
import { getAllClients } from '../../state/services/clientService';
import { getAllFPs } from '../../state/services/extraService';
import { getUser } from '../../state/services/authService';

class ManifestReport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loadingDownload: false,
            loading: true,
            fpFilter: '',
            clientFilter: '',
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

        this.props.getAllClients();
        this.props.getAllFPs();
        this.props.getManifestReport();
        
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { reports } = newProps;

        if (reports) {
            this.setState({loading: false, reports});
            this.onFind(reports);
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
        const today = moment().format('YYYY-MM-DD');
        this.props.setAllGetBookingsFilter('*', today, 0, 0, 0, 100, 0, '-id', {}, 0, '', 'label', '', 'b_bookingID_Visual', report['b_bookingID_Visuals'].join(', '));
        this.props.history.push('/allbookings');
    }

    onChangeFilterType = (e, filterType) => {
        this.setState({[filterType]: e.target.value});
    }
    
    onFind = (reports) => {
        const { clientname } = this.props;
        const { fpFilter, clientFilter } = this.state;
        if (reports) {
            const filteredReports = reports.filter(report => 
                report.freight_provider.includes(fpFilter) &&
                clientname == 'dme' &&
                report.kf_client_id.includes(clientFilter)
            );
            if (filteredReports) {
                let reportList = filteredReports.map((report, index) => {
                    return (
                        <tr key={index}>
                            <td>{index + 1}</td>
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
                this.setState({ reportList: reportList});
            }
        }

    }

    render() {
        const { clientname, allFPs, clients } = this.props;
        const { loading, fpFilter, clientFilter } = this.state;
        let fpFilterOpts = [];
        let clientsOpts = [];
        if (allFPs) {
            fpFilterOpts = allFPs.map((fp, index) => {
                return <option value={fp.fp_company_name} key={index}>{fp.fp_company_name}</option>;
            });
        }

        if (clients) {
            clientsOpts = clients.map((client, index) => {
                return <option value={client.dme_account_num} key={index}>{client.company_name}</option>;
            });
        }

        return (
            <LoadingOverlay
                active={loading}
                spinner
                text='Loading...'
            >
                <div>
                    <label>Client:
                        <select value={fpFilter} onChange={(e) => this.onChangeFilterType(e, 'fpFilter')} >
                            <option value="" selected>All</option>
                            {fpFilterOpts}
                        </select>
                    </label>&nbsp;&nbsp;
                    {clientname == 'dme' &&
                        <label>Freight Provider:
                            <select value={clientFilter} onChange={(e) => this.onChangeFilterType(e, 'clientFilter')} >
                                <option value="" selected>All</option>
                                {clientsOpts}
                            </select>
                        </label>                                  
                    }
                    <button type="button" onClick={() => this.onFind(this.props.reports)} className="btn btn-sm btn-success pull-right">Find</button>
                    <hr />
                </div>
                <div className="manifest">
                    <table>
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
                            {this.state.reportList}
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
        clients: state.client.clients,
        allFPs: state.extra.allFPs,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getUser: (token) => dispatch(getUser(token)),
        getManifestReport: () => dispatch(getManifestReport()),
        getAllClients: () => dispatch(getAllClients()),
        getAllFPs: () => dispatch(getAllFPs()),
        setAllGetBookingsFilter: (startDate, endDate, clientPK, warehouseId, fpId, pageItemCnt, pageInd, sortField, columnFilters, activeTabInd, simpleSearchKeyword, downloadOption, dmeStatus, multiFindField, multiFindValues, projectName) => dispatch(setAllGetBookingsFilter(startDate, endDate, clientPK, warehouseId, fpId, pageItemCnt, pageInd, sortField, columnFilters, activeTabInd, simpleSearchKeyword, downloadOption, dmeStatus, multiFindField, multiFindValues, projectName)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManifestReport);

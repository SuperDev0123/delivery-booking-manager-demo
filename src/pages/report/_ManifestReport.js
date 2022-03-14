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

class ManifestReport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loadingDownload: false,
            loading: true,
        };
    }

    static propTypes = {
        history: PropTypes.object.isRequired,
        getManifestReport: PropTypes.func.isRequired,
        setAllGetBookingsFilter: PropTypes.func.isRequired,
        reports: PropTypes.array.isRequired,
    };

    componentDidMount() {
        this.props.getManifestReport();
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { reports } = newProps;
    
        if (reports) {
            this.setState({loading: false, reports});
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

    render() {
        const { reports } = this.props;
        const { loading } = this.state;
        var reportList = [];

        if (reports) {
            reportList = reports.map((report, index) => {
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
        }

        return (
            <LoadingOverlay
                active={loading}
                spinner
                text='Loading...'
            >
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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getManifestReport: () => dispatch(getManifestReport()),
        setAllGetBookingsFilter: (startDate, endDate, clientPK, warehouseId, fpId, pageItemCnt, pageInd, sortField, columnFilters, activeTabInd, simpleSearchKeyword, downloadOption, dmeStatus, multiFindField, multiFindValues, projectName) => dispatch(setAllGetBookingsFilter(startDate, endDate, clientPK, warehouseId, fpId, pageItemCnt, pageInd, sortField, columnFilters, activeTabInd, simpleSearchKeyword, downloadOption, dmeStatus, multiFindField, multiFindValues, projectName)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManifestReport);

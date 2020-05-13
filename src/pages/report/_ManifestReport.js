import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// Libs
import axios from 'axios';
import moment from 'moment-timezone';
import LoadingOverlay from 'react-loading-overlay';
// Services
import { getManifestReport } from '../../state/services/bookingService';
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
        getManifestReport: PropTypes.func.isRequired,
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

    onClickDownload(report) {
        this.setState({loading: true});
        const token = localStorage.getItem('token');

        const options = {
            method: 'post',
            url: HTTP_PROTOCOL + '://' + API_HOST + '/download/',
            headers: {'Authorization': 'JWT ' + token},
            data: {z_manifest_url: report.z_manifest_url, downloadOption: 'manifest',},
            responseType: 'blob', // important
        };

        axios(options).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'ST__manifests__' + moment(report.manifest_date).format('YYYY_MM_DD') + '.zip');
            document.body.appendChild(link);
            link.click();
            this.setState({loading: false});
        });
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
                        <td>{report.count}</td>
                        <td>
                            <button
                                className="btn btn-primary"
                                onClick={() => this.onClickDownload(report)}
                            >
                                Download
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
                                <th>Count</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportList}
                        </tbody>
                    </table>
                </div>
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManifestReport);

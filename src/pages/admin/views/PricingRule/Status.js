import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
// Libs
import axios from 'axios';
import moment from 'moment-timezone';
// Components
import ConfirmModal from '../../../../components/CommonModals/ConfirmModal';
import LoadingOverlay from 'react-loading-overlay';
import { ToastContainer, toast } from 'react-toastify';
// Services
import { verifyToken, cleanRedirectState } from '../../../../state/services/authService';
import { getFiles } from '../../../../state/services/fileService';
// Constants
import { API_HOST, HTTP_PROTOCOL } from '../../../../config';

class Status extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            files: [],
            selectedFile: null,
            selectedFileOption: null,
            isShowDeleteFileConfirmModal: false,
        };

        this.toggleDeleteFileConfirmModal = this.toggleDeleteFileConfirmModal.bind(this);
    }

    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.bool.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
        getFiles: PropTypes.func.isRequired,
    }

    componentDidMount() {
        const token = localStorage.getItem('token');

        if (token && token.length > 0) {
            this.props.verifyToken();
        } else {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/admin/');
        }

        this.onClickRefresh();
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { redirect, files } = newProps;
        const currentRoute = this.props.location.pathname;

        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/admin');
        }

        if (files) {
            this.setState({files, loading: false});
            this.notify('Refreshed!');
        }
    }

    notify = (text) => {
        toast(text);
    };

    toggleDeleteFileConfirmModal() {
        this.setState(prevState => ({isShowDeleteFileConfirmModal: !prevState.isShowDeleteFileConfirmModal}));
    }

    onClickRefresh() {
        this.setState({loading: true});
        this.props.getFiles('pricing-rule');
    }

    onClickDeleteFile(file, fileOption) {
        this.setState({selectedFile: file, selectedFileOption: fileOption});
        this.toggleDeleteFileConfirmModal();
    }

    onClickConfirmDeleteFileBtn() {
        const token = localStorage.getItem('token');
        const {selectedFile, selectedFileOption} = this.state;

        const options = {
            method: 'delete',
            url: HTTP_PROTOCOL + '://' + API_HOST + '/delete-file/',
            headers: {'Authorization': 'JWT ' + token },
            data: {deleteFileOption: selectedFileOption, fileName: selectedFile.file_name},
        };

        axios(options)
            .then((response) => {
                console.log('#301 - ', response.data);
                this.notify('Deleted successfully!');
                this.props.getFiles('pricing-rule');
                this.toggleDeleteFileConfirmModal();
            })
            .catch(error => {
                this.notify('Failed to delete a file: ' + error);
                this.toggleDeleteFileConfirmModal();
            });
    }

    onClickDownloadFile(file, downloadOption) {
        const token = localStorage.getItem('token');

        const options = {
            method: 'post',
            url: HTTP_PROTOCOL + '://' + API_HOST + '/download/',
            headers: {'Authorization': 'JWT ' + token },
            data: {downloadOption: downloadOption, fileName: file.file_name},
            responseType: 'blob', // important
        };

        axios(options)
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'pricing-rule__' + file.file_name + '.zip');
                document.body.appendChild(link);
                link.click();
            })
            .catch(error => {
                this.notify('Failed to download files: ' + error);
            });
    }

    render() {
        const { loading, files } = this.state;

        const fileList = files.map((file, index) => {
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{file.file_name}</td>
                    <td>{file.file_path}</td>
                    <td>{moment(file.z_createdTimestamp).format('DD/MM/YYYY HH:mm')}</td>
                    <td>{file.z_createdByAccount}</td>
                    <td>{file.note}</td>
                    <td>
                        <button 
                            className="btn btn-primary"
                            onClick={() => this.onClickDownloadFile(file, 'pricing-rule')}
                        >
                            Download
                        </button>
                    </td>
                    <td>
                        <button
                            className="btn btn-danger"
                            onClick={() => this.onClickDeleteFile(file, 'pricing-rule')}
                        >
                            Delete
                        </button>
                    </td>
                </tr>
            );
        });

        return (
            <div className="pricing-rule">
                <div className="pageheader">
                    <h1>List</h1>
                    <div className="breadcrumb-wrapper hidden-xs">
                        <span className="label">You are here:</span>
                        <ol className="breadcrumb">
                            <li><a href="/">Dashboard</a>
                            </li>
                            <li><a href="/pricing-rule">Pricing Rule</a></li>
                            <li className="active">List</li>
                        </ol>
                    </div>
                </div>
                <section id="main-content" className="animated fadeInUp">
                    {loading ? (
                        <LoadingOverlay
                            active={loading}
                            spinner
                            text='Loading...'
                        />
                    )
                        :
                        (
                            <div className="panel panel-default">
                                <div className="panel-heading">
                                    <h3 className="panel-title"></h3>
                                </div>
                                <div className="panel-body">
                                    <button
                                        className="btn btn-success btn-refresh"
                                        onClick={() => this.onClickRefresh()}
                                    >
                                        Refresh
                                    </button> 
                                    <table className="table table-hover table-bordered sortable fixed_headers">
                                        <thead>
                                            <th>No</th>
                                            <th>File Name</th>
                                            <th>File Path</th>
                                            <th>Created At</th>
                                            <th>Created By</th>
                                            <th>Note</th>
                                            <th>Download</th>
                                            <th>Delete</th>
                                        </thead>
                                        <tbody>
                                            {fileList}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                </section>

                <ConfirmModal
                    isOpen={this.state.isShowDeleteFileConfirmModal}
                    onOk={() => this.onClickConfirmDeleteFileBtn()}
                    onCancel={this.toggleDeleteFileConfirmModal}
                    title={'Delete File'}
                    text={'Are you sure you want to delete import file?'}
                    okBtnName={'Delete'}
                />

                <ToastContainer />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        redirect: state.auth.redirect,
        username: state.auth.username,
        files: state.files.files,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        getFiles: (fileType) => dispatch(getFiles(fileType)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Status));

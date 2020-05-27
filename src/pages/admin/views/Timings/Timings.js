import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
// Libs
import axios from 'axios';
// Components
import ConfirmModal from '../../../../components/CommonModals/ConfirmModal';
import LoadingOverlay from 'react-loading-overlay';
import { ToastContainer, toast } from 'react-toastify';
// Services
import { verifyToken, cleanRedirectState } from '../../../../state/services/authService';
import { getTimings } from '../../../../state/services/timingService';
// Constants
import { API_HOST, HTTP_PROTOCOL } from '../../../../config';

class Timings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            allTimings: [],
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
        getTimings: PropTypes.func.isRequired,
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
        const { redirect, allTimings } = newProps;
        const currentRoute = this.props.location.pathname;

        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/admin');
        }

        if (allTimings) {
            this.setState({allTimings, loading: false});
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
        this.props.getTimings();
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
                this.props.getTimings();
                this.toggleDeleteFileConfirmModal();
            })
            .catch(error => {
                this.notify('Failed to delete a file: ' + error);
                this.toggleDeleteFileConfirmModal();
            });
    }

    render() {
        const { loading, allTimings } = this.state;

        const timingList = allTimings.map((timing, index) => {
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{timing.time_UOM}</td>
                    <td>{timing.min}</td>
                    <td>{timing.max}</td>
                    <td>{timing.booking_cut_off_time}</td>
                    <td>{timing.collected_by}</td>
                    <td>{timing.delivered_by}</td>
                    <td>
                        <button
                            className="btn btn-danger"
                            onClick={() => this.onClickDeleteFile(timing, 'pricing-only')}
                        >
                            Delete
                        </button>
                    </td>
                </tr>
            );
        });

        return (
            <div className="pricing-only">
                <div className="pageheader">
                    <h1>Timings</h1>
                    <div className="breadcrumb-wrapper hidden-xs">
                        <span className="label">You are here:</span>
                        <ol className="breadcrumb">
                            <li><a href="/admin">Home</a>
                            </li>
                            <li className="active">Timings</li>
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
                                            <th>Time UOM</th>
                                            <th>Min</th>
                                            <th>Max</th>
                                            <th>Booking Cut off Time</th>
                                            <th>Collected by</th>
                                            <th>Delivered by</th>
                                            <th>Delete</th>
                                        </thead>
                                        <tbody>
                                            {timingList}
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
                    text={'Are you sure you want to delete source file and result file?'}
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
        allTimings: state.timing.allTimings
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        getTimings: () => dispatch(getTimings()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Timings));

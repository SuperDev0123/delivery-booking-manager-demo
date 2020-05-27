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
import { getAvailabilities } from '../../../../state/services/availabilityService';
// Constants
import { API_HOST, HTTP_PROTOCOL } from '../../../../config';

class Availabilities extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            files: [],
            allAvailabilities: [],
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
        getAvailabilities: PropTypes.func.isRequired,
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
        const { redirect, allAvailabilities } = newProps;
        const currentRoute = this.props.location.pathname;

        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/admin');
        }

        if (allAvailabilities) {
            this.setState({allAvailabilities, loading: false});
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
        this.props.getAvailabilities();
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
                this.props.getAvailabilities();
                this.toggleDeleteFileConfirmModal();
            })
            .catch(error => {
                this.notify('Failed to delete a file: ' + error);
                this.toggleDeleteFileConfirmModal();
            });
    }

    render() {
        const { loading, allAvailabilities } = this.state;

        const availabilityList = allAvailabilities.map((availability, index) => {
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{availability.freight_provider}</td>
                    <td>{availability.code}</td>
                    <td>{availability.mon_start}</td>
                    <td>{availability.mon_end}</td>
                    <td>{availability.tue_start}</td>
                    <td>{availability.tue_end}</td>
                    <td>{availability.wed_start}</td>
                    <td>{availability.wed_end}</td>
                    <td>{availability.thu_start}</td>
                    <td>{availability.thu_end}</td>
                    <td>{availability.fri_start}</td>
                    <td>{availability.fri_end}</td>
                    <td>{availability.sat_start}</td>
                    <td>{availability.sat_end}</td>
                    <td>{availability.sun_start}</td>
                    <td>{availability.sun_end}</td>
                    <td>
                        <button
                            className="btn btn-danger"
                            onClick={() => this.onClickDeleteFile(availability, 'pricing-only')}
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
                    <h1>Availabilities</h1>
                    <div className="breadcrumb-wrapper hidden-xs">
                        <span className="label">You are here:</span>
                        <ol className="breadcrumb">
                            <li><a href="/admin">Home</a>
                            </li>
                            <li className="active">Availabilities</li>
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
                                            <th>Freight Provider</th>
                                            <th>Code</th>
                                            <th>Monday Start</th>
                                            <th>Monday End</th>
                                            <th>Tuesday Start</th>
                                            <th>Tuesday End</th>
                                            <th>Wednesday Start</th>
                                            <th>Wednesday End</th>
                                            <th>Thursday Start</th>
                                            <th>Thursday End</th>
                                            <th>Friday Start</th>
                                            <th>Friday End</th>
                                            <th>Saturday Start</th>
                                            <th>Saturday End</th>
                                            <th>Sunday Start</th>
                                            <th>Sunday End</th>
                                            <th>Delete</th>
                                        </thead>
                                        <tbody>
                                            {availabilityList}
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
        allAvailabilities: state.availability.allAvailabilities
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        getAvailabilities: () => dispatch(getAvailabilities()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Availabilities));

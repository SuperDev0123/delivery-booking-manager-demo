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
import { getVehicles } from '../../../../state/services/vehicleService';
// Constants
import { API_HOST, HTTP_PROTOCOL } from '../../../../config';

class Vehicles extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            allVehicles: [],
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
        getVehicles: PropTypes.func.isRequired,
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
        const { redirect, allVehicles } = newProps;
        const currentRoute = this.props.location.pathname;

        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/admin');
        }

        if (allVehicles) {
            this.setState({allVehicles, loading: false});
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
        this.props.getVehicles();
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
                this.props.getVehicles();
                this.toggleDeleteFileConfirmModal();
            })
            .catch(error => {
                this.notify('Failed to delete a file: ' + error);
                this.toggleDeleteFileConfirmModal();
            });
    }

    render() {
        const { loading, allVehicles } = this.state;

        const timingList = allVehicles.map((vehicle, index) => {
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{vehicle.description}</td>
                    <td>{vehicle.dim_UOM}</td>
                    <td>{vehicle.max_length}</td>
                    <td>{vehicle.max_width}</td>
                    <td>{vehicle.max_height}</td>
                    <td>{vehicle.mass_UOM}</td>
                    <td>{vehicle.pallets}</td>
                    <td>{vehicle.pallet_UOM}</td>
                    <td>{vehicle.max_pallet_length}</td>
                    <td>{vehicle.max_pallet_height}</td>
                    <td>{vehicle.base_charge}</td>
                    <td>{vehicle.min_charge}</td>
                    <td>{vehicle.limited_state}</td>
                    <td>{vehicle.freight_provider}</td>
                    <td>{vehicle.max_mass}</td>
                    <td>
                        <button
                            className="btn btn-danger"
                            onClick={() => this.onClickDeleteFile(vehicle, 'pricing-only')}
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
                    <h1>Vehicles</h1>
                    <div className="breadcrumb-wrapper hidden-xs">
                        <span className="label">You are here:</span>
                        <ol className="breadcrumb">
                            <li><a href="/">Dashboard</a>
                            </li>
                            <li className="active">Vehicles</li>
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
                                            <th>Description</th>
                                            <th>Dim UOM</th>
                                            <th>Max Length</th>
                                            <th>Max Width</th>
                                            <th>Max Height</th>
                                            <th>Mass UOM</th>
                                            <th>Pallets</th>
                                            <th>Pallets UOM</th>
                                            <th>Max Pallet Length</th>
                                            <th>Max Pallet Height</th>
                                            <th>Base Charge</th>
                                            <th>Min Charge</th>
                                            <th>Limited State</th>
                                            <th>Frieght Provider</th>
                                            <th>Max mass</th>
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
        allVehicles: state.vehicle.allVehicles
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        getVehicles: () => dispatch(getVehicles()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Vehicles));

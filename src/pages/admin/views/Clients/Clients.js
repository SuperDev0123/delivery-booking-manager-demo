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
import { verifyToken, cleanRedirectState, getDMEClients } from '../../../../state/services/authService';
// Constants
import { API_HOST, HTTP_PROTOCOL } from '../../../../config';

class Clients extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            dmeClients: [],
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
        urlAdminHome: PropTypes.string.isRequired,
        getDMEClients: PropTypes.func.isRequired,
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
        const { redirect, dmeClients } = newProps;
        const currentRoute = this.props.location.pathname;

        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/admin');
        }

        if (dmeClients) {
            console.log('dmeClients', dmeClients);
            this.setState({ dmeClients, loading: false});
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
        this.props.getDMEClients();
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
                this.props.getDMEClients();
                this.toggleDeleteFileConfirmModal();
            })
            .catch(error => {
                this.notify('Failed to delete a file: ' + error);
                this.toggleDeleteFileConfirmModal();
            });
    }

    render() {
        const { loading, dmeClients } = this.state;

        const clientsList = dmeClients.map((client, index) => {
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{client.company_name}</td>
                    <td>{client.dme_account_num}</td>
                    <td>{client.phone}</td>
                    <td>{client.client_filter_date_field}</td>
                    <td>{client.current_freight_provider}</td>
                    <td>{client.client_mark_up_percent}</td>
                    <td>{client.client_min_markup_startingcostvalue}</td>
                    <td>{client.client_min_markup_value}</td>
                    <td>{client.augment_pu_by_time}</td>
                    <td>{client.augment_pu_available_time}</td>
                    <td><a className="btn btn-info btn-sm" href={'/admin/providers/edit/' + client.id}>Edit</a></td>
                    <td>
                        {client.num_client_products>0?<a className="btn btn-info btn-sm" href={'/admin/providers/edit/' + client.id}>View</a>:null}
                    </td>
                </tr>
            );
        });

        return (
            <div className="pricing-only">
                <div className="pageheader">
                    <h1>Clients</h1>
                    <div className="breadcrumb-wrapper hidden-xs">
                        <span className="label">You are here:</span>
                        <ol className="breadcrumb">
                            <li><a href="/admin">Home</a>
                            </li>
                            <li className="active">Clients</li>
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
                                            <th>Company Name</th>
                                            <th>DME Account Number</th>
                                            <th>Phone</th>
                                            <th>Client Filter Date Field</th>
                                            <th>Freight Provider</th>
                                            <th>Client Mark_up percent</th>
                                            <th>Client Min Markup Startingcostvalue</th>
                                            <th>Client Min Markup value</th>
                                            <th>Augment By Time</th>
                                            <th>Augment Available Time</th>
                                            <th>Actions</th>
                                            <th>Products</th>
                                        </thead>
                                        <tbody>
                                            {clientsList}
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
        urlAdminHome: state.url.urlAdminHome,
        dmeClients: state.auth.dmeClients,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        getDMEClients: () => dispatch(getDMEClients()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Clients));
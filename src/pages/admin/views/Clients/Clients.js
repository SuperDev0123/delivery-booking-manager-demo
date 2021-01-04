import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import LoadingOverlay from 'react-loading-overlay';
import { ToastContainer, toast } from 'react-toastify';
// Services
import { verifyToken, cleanRedirectState, getDMEClients } from '../../../../state/services/authService';
import { getDMEClientProducts, deleteClientProduct, createClientProduct, getEmployeesByClient } from '../../../../state/services/extraService';
import ClientProductSlider from '../../../../components/Sliders/ClientProductSlider';
import ClientEmployeeSlider from '../../../../components/Sliders/ClientEmployeeSlider';
import imgClients from  '../../../../public/images/clients.png';
import { getAllRoles } from '../../../../state/services/roleService';
import { getAllClients } from '../../../../state/services/clientService';
import { getWarehouses } from '../../../../state/services/warehouseService';
import { createClientEmployee, updateClientEmployee } from '../../../../state/services/extraService';

class Clients extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            dmeClients: [],
            allClientEmployees: [],
            isShowClientProductSlider: false,
            isShowClientEmployeeSlider: false,
            loadingClientProducts: false,
            clientProducts: [],
            dmeClient: {},
            roles: [],
            clients: [],
            warehouses: [],
            pk_id_dme_client: -1,
        };

        this.toggleClientProductSlider = this.toggleClientProductSlider.bind(this);
        this.toggleClientEmployeeSlider = this.toggleClientEmployeeSlider.bind(this);
        this.onClickDelete = this.onClickDelete.bind(this);
        this.onClickSubmit = this.onClickSubmit.bind(this);
    }

    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.bool.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
        urlAdminHome: PropTypes.string.isRequired,
        getDMEClients: PropTypes.func.isRequired,
        getEmployeesByClient: PropTypes.func.isRequired,
        getAllClients: PropTypes.func.isRequired,
        getAllRoles: PropTypes.func.isRequired,
        getWarehouses: PropTypes.func.isRequired,
        clientProducts: PropTypes.array.isRequired,
        getDMEClientProducts: PropTypes.func.isRequired,
        deleteClientProduct: PropTypes.func.isRequired,
        createClientProduct: PropTypes.func.isRequired,
        createClientEmployee: PropTypes.func.isRequired,
        updateClientEmployee: PropTypes.func.isRequired,
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
        this.props.getAllRoles();
        this.props.getWarehouses();
        this.props.getAllClients();
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { redirect, dmeClients, clientProducts,allClientEmployees, roles, clients, warehouses } = newProps;
        const currentRoute = this.props.location.pathname;

        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/admin');
        }

        if (dmeClients) {
            this.setState({ dmeClients, loading: false});
            this.notify('Refreshed!');
        }

        if (allClientEmployees) {
            this.setState({ allClientEmployees });
        }

        if (clientProducts) {
            this.setState({ clientProducts, loadingClientProducts: false});
        }

        if (roles) {
            this.setState({ roles });
            console.log('roles', roles);
        }
        if (clients) {
            this.setState({ clients });
            console.log('clients', clients);
        }
        if (warehouses) {
            this.setState({warehouses});
            console.log('warehouses', warehouses);
        }
    }

    notify = (text) => {
        toast(text);
    };

    onClickRefresh() {
        this.setState({loading: true});
        this.props.getDMEClients();
    }

    toggleClientProductSlider() {
        this.setState(prevState => ({isShowClientProductSlider: !prevState.isShowClientProductSlider}));
    }

    toggleClientEmployeeSlider() {
        this.setState(prevState => ({isShowClientEmployeeSlider: !prevState.isShowClientEmployeeSlider, pk_id_dme_client:  -1}));
    }

    onClickOpenClientEmployeeSlider(client) {
        this.props.getEmployeesByClient(client.pk_id_dme_client);
        this.toggleClientEmployeeSlider();
        this.setState({pk_id_dme_client: client.pk_id_dme_client, dmeClient:client});
    }

    onClickOpenPricingSlider(client) {
        this.setState({loadingClientProducts: true, dmeClient:client});
        this.toggleClientProductSlider();
        this.props.getDMEClientProducts(client.pk_id_dme_client);
    }

    onClickDelete(id) {
        this.props.deleteClientProduct(id);
    }

    onClickSubmit(clientProductsFormInputs) {
        this.props.createClientProduct(clientProductsFormInputs);
        this.toggleClientProductSlider();
    }

    render() {
        const { loading, dmeClients, dmeClient, loadingClientProducts, clientProducts, allClientEmployees, isShowClientProductSlider, isShowClientEmployeeSlider, roles, clients, warehouses,pk_id_dme_client} = this.state;
        const clientsList = dmeClients.map((client, index) => {
            return (
                <tr key={index} className={client.pk_id_dme_client===pk_id_dme_client?'bg-success':''}>
                    <td>{index + 1}</td>
                    <td><span className="d-flex align-items-center" onClick={() => this.onClickOpenClientEmployeeSlider(client)}><img src={imgClients} width="25px"/>{client.company_name} </span></td>
                    <td>{client.dme_account_num}</td>
                    <td>{client.phone}</td>
                    <td>{client.client_filter_date_field}</td>
                    <td>{client.current_freight_provider}</td>
                    <td>{client.client_mark_up_percent}</td>
                    <td>{client.client_min_markup_startingcostvalue}</td>
                    <td>{client.client_min_markup_value}</td>
                    <td><a className="btn btn-info btn-sm" href={'/admin/clients/edit/' + client.pk_id_dme_client}>Edit</a></td>
                    <td>
                        {client.num_client_products>0?<button className="btn btn-info btn-sm" onClick={() => this.onClickOpenPricingSlider(client)}>View</button>:null}
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
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="panel panel-default">
                                        <div className="panel-heading">
                                            <h3 className="panel-title">Clients</h3>
                                            <div className="actions pull-right">
                                                <a className="btn btn-success" href="/admin/clients/add">Add New</a>
                                            </div>
                                        </div>
                                        <div className="panel-body">
                                            <table className="table table-hover table-bordered sortable fixed_headers">
                                                <thead>
                                                    <th>No</th>
                                                    <th>Company Name</th>
                                                    <th>DME Account Number</th>
                                                    <th>Phone</th>
                                                    <th>Client Filter Date Field</th>
                                                    <th>FP</th>
                                                    <th>MU %</th>
                                                    <th>MU Starting Cost</th>
                                                    <th>MU Minimum</th>
                                                    <th>Actions</th>
                                                    <th>Products</th>
                                                </thead>
                                                <tbody>
                                                    {clientsList}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                </section>

                <ClientProductSlider
                    isOpen={isShowClientProductSlider}
                    toggleSlider={this.toggleClientProductSlider}
                    clientProducts={clientProducts}
                    isLoading={loadingClientProducts}
                    dmeClient={dmeClient}
                    onClickDelete={this.onClickDelete}
                    onClickSubmit={this.onClickSubmit}
                />

                <ClientEmployeeSlider
                    isOpen={isShowClientEmployeeSlider}
                    allClientEmployees = {allClientEmployees}
                    toggleClientEmployeeSlider={this.toggleClientEmployeeSlider}
                    roles={roles}
                    clients={clients}
                    warehouses={warehouses}
                    clientname={dmeClient.company_name}
                    createClientEmployee={this.props.createClientEmployee}
                    updateClientEmployee={this.props.updateClientEmployee}
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
        clientProducts: state.extra.clientProducts,
        allClientEmployees: state.extra.allClientEmployees,
        roles: state.role.roles,
        clients: state.client.clients,
        warehouses: state.warehouse.warehouses,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        getDMEClients: () => dispatch(getDMEClients()),
        getDMEClientProducts: (client_id) => dispatch(getDMEClientProducts(client_id)),
        getEmployeesByClient: (client_id) => dispatch(getEmployeesByClient(client_id)),
        deleteClientProduct: (id) => dispatch(deleteClientProduct(id)),
        createClientProduct: (clientProduct) => dispatch(createClientProduct(clientProduct)),
        getAllClients: () => dispatch(getAllClients()),
        getAllRoles: () => dispatch(getAllRoles()),
        getWarehouses: () => dispatch(getWarehouses()),
        updateClientEmployee: (data) => dispatch(updateClientEmployee(data)),
        createClientEmployee: (data) => dispatch(createClientEmployee(data)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Clients));

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import LoadingOverlay from 'react-loading-overlay';
import { ToastContainer, toast } from 'react-toastify';
// Services
import { verifyToken, cleanRedirectState, getDMEClients } from '../../../../state/services/authService';
import { getDMEClientProducts, deleteClientProduct, createClientProduct } from '../../../../state/services/extraService';
import ClientProductSlider from '../../../../components/Sliders/ClientProductSlider';

class Clients extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            dmeClients: [],
            isShowClientProductSlider: false,
            loadingClientProducts: false,
            clientProducts: [],
            dmeClient: {}
        };

        this.toggleClientProductSlider = this.toggleClientProductSlider.bind(this);
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
        clientProducts: PropTypes.array.isRequired,
        getDMEClientProducts: PropTypes.func.isRequired,
        deleteClientProduct: PropTypes.func.isRequired,
        createClientProduct: PropTypes.func.isRequired,
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
        const { redirect, dmeClients, clientProducts } = newProps;
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

        if (clientProducts) {
            this.setState({ clientProducts, loadingClientProducts: false});
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
        const { loading, dmeClients, dmeClient, loadingClientProducts, clientProducts, isShowClientProductSlider} = this.state;
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

                <ClientProductSlider
                    isOpen={isShowClientProductSlider}
                    toggleSlider={this.toggleClientProductSlider}
                    clientProducts={clientProducts}
                    isLoading={loadingClientProducts}
                    dmeClient={dmeClient}
                    onClickDelete={this.onClickDelete}
                    onClickSubmit={this.onClickSubmit}
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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        getDMEClients: () => dispatch(getDMEClients()),
        getDMEClientProducts: (client_id) => dispatch(getDMEClientProducts(client_id)),
        deleteClientProduct: (id) => dispatch(deleteClientProduct(id)),
        createClientProduct: (clientProduct) => dispatch(createClientProduct(clientProduct)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Clients));

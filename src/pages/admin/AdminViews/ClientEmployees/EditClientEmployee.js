import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LoadingOverlay from 'react-loading-overlay';
import { withRouter } from 'react-router-dom';

import { verifyToken, cleanRedirectState } from '../../../../state/services/authService';
import { getClientEmployee, updateClientEmployee } from '../../../../state/services/extraService';
import { getAllRoles } from '../../../../state/services/roleService';
import { getAllClients } from '../../../../state/services/clientService';
import { getWarehouses } from '../../../../state/services/warehouseService';

class EditClientEmployee extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name_first: '',
            name_last: '',
            email: '',
            phone: '',
            clien_emp_job_title: '',
            role: '',
            fk_id_dme_client: '',
            warehouse_id: '',
            loading: false,
            roles: [],
            clients: [],
            warehouses: [],
            clientEmployee: {}
        };
    }

    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.bool.isRequired,
        getClientEmployee: PropTypes.func.isRequired,
        updateClientEmployee: PropTypes.func.isRequired,
        getAllClients: PropTypes.func.isRequired,
        getAllRoles: PropTypes.func.isRequired,
        getWarehouses: PropTypes.func.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
        urlAdminHome: PropTypes.string.isRequired,
        match: PropTypes.object.isRequired,
    }

    componentDidMount() {
        const employee_id = this.props.match.params.id;

        const token = localStorage.getItem('token');

        if (token && token.length > 0) {
            this.props.verifyToken();
        } else {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/admin');
        }

        this.props.getAllRoles();
        this.props.getAllClients();
        this.props.getWarehouses();
        this.props.getClientEmployee(employee_id);
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { redirect, roles, clients, warehouses, clientEmployee } = newProps;
        const currentRoute = this.props.location.pathname;
        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/admin');
        }
        if (roles) {
            this.setState({ roles });
            if(roles.length>0) {
                this.setState({ role: roles[0].id});
            }
        }
        if (clients) {
            this.setState({ clients });
            if(clients.length>0) {
                this.setState({ fk_id_dme_client: clients[0].pk_id_dme_client});
            }
        }
        if (warehouses) {
            this.setState({warehouses});
            if(warehouses.length>0) {
                this.setState({ warehouse_id: warehouses[0].pk_id_client_warehouses});
            }
        }
        if(clientEmployee) {
            const { name_first, name_last, email, phone, clien_emp_job_title, role, fk_id_dme_client, warehouse_id } = clientEmployee;
            this.setState({clientEmployee, name_first, name_last, email, phone, role, clien_emp_job_title, fk_id_dme_client, warehouse_id});
        }
    }

    onInputChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    onSubmit(event) {
        this.setState({ loading: true });
        let {clientEmployee} = this.state;
        const { name_first, name_last, email, phone, clien_emp_job_title, role, fk_id_dme_client, warehouse_id } = this.state;        
        clientEmployee.name_first = name_first;
        clientEmployee.name_last = name_last;
        clientEmployee.email = email;
        clientEmployee.phone = phone;
        clientEmployee.clien_emp_job_title = clien_emp_job_title;
        clientEmployee.role = role;
        clientEmployee.fk_id_dme_client = fk_id_dme_client;
        clientEmployee.warehouse_id = warehouse_id;
        
        this.props.updateClientEmployee(clientEmployee);
        this.setState({ loading: false });
        this.props.history.push('/admin/clientemployees');
        event.preventDefault();
    }

    render() {
        const { roles, clients, warehouses, name_first, name_last, email, phone, clien_emp_job_title, role, fk_id_dme_client, warehouse_id } = this.state;
        return (
            <div>
                <div className="pageheader">
                    <h1>Edit Client Employee</h1>
                    <div className="breadcrumb-wrapper hidden-xs">
                        <span className="label">You are here:</span>
                        <ol className="breadcrumb">
                            <li><a href={this.props.urlAdminHome}>Home</a>
                            </li>
                            <li><a href="/admin/clientemployees">Client Employees</a></li>
                            <li className="active">Edit</li>
                        </ol>
                    </div>
                </div>
                <section id="main-content" className="animated fadeInUp">
                    <LoadingOverlay
                        active={this.state.loading}
                        spinner
                        text='Loading...'
                    />
                    <div className="row">
                        <div className="col-md-6">
                            <div className="panel panel-default">
                                <div className="panel-heading">
                                    <h3 className="panel-title">Edit</h3>
                                    <div className="actions pull-right">

                                    </div>
                                </div>
                                <div className="panel-body">
                                    <form onSubmit={(e) => this.onSubmit(e)} role="form">
                                        <div className="form-group">
                                            <label htmlFor="name_first">First Name</label>
                                            <input name="name_first" type="text" className="form-control" id="name_first" placeholder="Enter First Name" value={name_first} onChange={(e) => this.onInputChange(e)} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="name_last">Last Name</label>
                                            <input name="name_last" type="text" className="form-control" id="name_last" placeholder="Enter Last Name" value={name_last} onChange={(e) => this.onInputChange(e)} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="email">Email</label>
                                            <input name="email" type="email" className="form-control" id="name_last" placeholder="Enter Email" value={email} onChange={(e) => this.onInputChange(e)} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="phone">Phone</label>
                                            <input name="phone" type="text" className="form-control" id="name_last" placeholder="Enter Phone" value={phone} onChange={(e) => this.onInputChange(e)} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="clien_emp_job_title">Job Title</label>
                                            <input name="clien_emp_job_title" type="text" className="form-control" id="clien_emp_job_title" placeholder="Enter Job Title" value={clien_emp_job_title} onChange={(e) => this.onInputChange(e)} />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="fk_id_dme_client">Client</label>
                                            <select name="fk_id_dme_client" value={fk_id_dme_client} className="form-control" id="fk_id_dme_client" onChange={(e) => this.onInputChange(e)}>
                                                {
                                                    clients.map((client, index) => {
                                                        return (
                                                            <option key={index} value={client.pk_id_dme_client}>{client.company_name}</option>
                                                        );
                                                    })
                                                }
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="role">Role</label>
                                            <select name="role" value={role} className="form-control" id="role" onChange={(e) => this.onInputChange(e)}>
                                                {
                                                    roles.map((role, index) => {
                                                        return (
                                                            <option key={index} value={role.id}>{role.role_code}</option>
                                                        );
                                                    })
                                                }
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="warehouse_id">Warehouse</label>
                                            <select name="warehouse_id" value={warehouse_id} className="form-control" id="warehouse_id" onChange={(e) => this.onInputChange(e)}>
                                                {
                                                    warehouses.map((warehouse, index) => {
                                                        return (
                                                            <option key={index} value={warehouse.pk_id_client_warehouses}>{warehouse.name}</option>
                                                        );
                                                    })
                                                }
                                            </select>
                                        </div>

                                        <button type="submit" className="btn btn-primary mt-2">Submit</button>
                                    </form>


                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        redirect: state.auth.redirect,
        username: state.auth.username,
        urlAdminHome: state.url.urlAdminHome,
        roles: state.role.roles,
        clients: state.client.clients,
        warehouses: state.warehouse.warehouses,
        clientEmployee: state.extra.clientEmployee,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        getClientEmployee: (id) => dispatch(getClientEmployee(id)),
        updateClientEmployee: (data) => dispatch(updateClientEmployee(data)),
        getAllClients: () => dispatch(getAllClients()),
        getAllRoles: () => dispatch(getAllRoles()),
        getWarehouses: () => dispatch(getWarehouses()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditClientEmployee));

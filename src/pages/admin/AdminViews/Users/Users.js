import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import LoadingOverlay from 'react-loading-overlay';
import 'react-confirm-alert/src/react-confirm-alert.css';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
import moment from 'moment';
import { verifyToken, cleanRedirectState, getDMEClients } from '../../../../state/services/authService';
import { getAllUsers, setGetUsersFilter, updateUserDetails } from '../../../../state/services/userService';  
import { validateEmail } from '../../../../commons/validations';  

const SHOW = 0;
const EDIT = 1;

class Users extends Component {    
    constructor(props) {
        super(props);

        this.state = {
            allUsers: [],
            dmeClients: [],
            username: null,
            loading: true,
            clientPK: 0,
            status: SHOW,
            currentRow: {},
            errMsg: ''
        };
    }
    
    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
        updateUserDetails: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.bool.isRequired,
        getAllUsers: PropTypes.func.isRequired,
        getDMEClients: PropTypes.func.isRequired,
        setGetUsersFilter: PropTypes.func.isRequired,
        urlAdminHome: PropTypes.string.isRequired,
    }

    componentDidMount() {
        const token = localStorage.getItem('token');

        if (token && token.length > 0) {
            this.props.verifyToken();
        } else {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/admin');
        }

        this.props.getAllUsers();
        this.props.getDMEClients();
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { redirect, allUsers, dmeClients, clientPK, needUpdateUsers } = newProps;
        const currentRoute = this.props.location.pathname;
        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/admin');
        }

        if (this.state.loading && allUsers && allUsers.length > 0) {
            this.setState({ allUsers, loading: false });
        }

        if (dmeClients) {
            this.setState({ dmeClients });
        }

        if (needUpdateUsers) {
            if (clientPK !== 0 || _.isUndefined(clientPK)) {
                this.setState({ clientPK });
            }

            this.props.getAllUsers(clientPK);
            this.setState({ loading: true });
        }
    }

    onSelected(e, src) {
        if (src === 'client') {
            this.props.setGetUsersFilter('clientPK', e.target.value);
        }
    }

    onClickEdit(row){
        this.setState({currentRow: row, status: EDIT});
    }

    onInputChange(e, fieldName){
        if(fieldName === 'is_active') {
            this.setState({
                currentRow: {...this.state.currentRow, is_active: e.target.checked}
            });
        } else {
            this.setState({
                currentRow: {...this.state.currentRow, [fieldName]: e.target.value}
            });
        }
    }

    updateUser(e){
        e.preventDefault();
        if (validateEmail(this.state.currentRow.email)) {
            this.props.updateUserDetails(this.state.currentRow);
            this.setState({errMsg: ''});
            this.setState({status: SHOW});
        } else {
            this.setState({errMsg: 'Invalid Email'});
        }
    }

    render() {
        const { allUsers, loading, dmeClients, clientPK } = this.state;
        const { SearchBar } = Search;

        const editableStyle = () => {
            return {
                backgroundColor: 'white',
                cursor: 'default',
            };
        };

        const editButton = (cell, row) => {
            return (
                <div style={{textAlign: 'center', cursor: 'pointer'}}>
                    <i
                        onClick={() => this.onClickEdit(row)}
                        className="fa fa-edit"
                        style={{ fontSize: '24px', color: 'green' }}
                    >
                    </i>
                </div>
            );
        };

        const statusUpdate = (cell, row) => {
            return (
                <div>
                    {row.is_active ? (
                        <button onClick={(e) => this.updateUserStatus(e, row, 0)} className="btn btn-sm btn-success">Active</button>
                    ) : ( <button onClick={(e) => this.updateUserStatus(e, row, 1)} className="btn btn-sm btn-danger">Inactive</button> )}
                </div>
            );
        };
    
        const datetimeFormatter = (cell) => {
            if (cell)
                return (
                    moment(cell).format('DD MMM YYYY h:mm:ss A')
                );
        };

        const tableColumns = [
            {
                dataField: 'first_name',
                text: 'First Name',
                editable: true,
                style: editableStyle,
            }, {
                dataField: 'last_name',
                text: 'Last Name',
                editable: true,
                style: editableStyle,
            }, {
                dataField: 'username',
                text: 'Username',
                editable: true,
                style: editableStyle,
            }, {
                dataField: 'email',
                text: 'Email',
                editable: true,
                style: editableStyle
            }, {
                dataField: 'last_login',
                text: 'Last Login',
                editable: true,
                style: editableStyle,
                formatter: datetimeFormatter,
            }, {
                dataField: 'is_active',
                text: 'Status',
                editable: false,
                style: editableStyle,
                formatter: statusUpdate
            }, {
                dataField: 'edit_button',
                text: 'Edit',
                formatter: editButton
            }
        ];

        const clientOptionsList = dmeClients.map((client, index) => {
            return (<option key={index} value={client.pk_id_dme_client}>{client.company_name}</option>);
        });

        return (
            <div className="users">
                <div className="pageheader">
                    <h1>Users</h1>
                    <div className="breadcrumb-wrapper hidden-xs">
                        <span className="label">You are here:</span>
                        <ol className="breadcrumb">
                            <li><a href={this.props.urlAdminHome}>Home</a></li>
                            <li className="active">Users</li>
                        </ol>
                    </div>
                </div>
                <section id="main-content" className="container animated fadeInUp">
                    <div className="row">
                        <div className="col-md-12">
                            {this.state.status === SHOW && <div className="panel panel-default">
                                <div className="panel-heading">
                                    <h3 className="panel-title">Users List</h3>
                                </div>
                                <div className="panel-body">
                                    {loading ? (
                                        <LoadingOverlay
                                            active={loading}
                                            spinner
                                            text='Loading...'
                                        />
                                    ) : (
                                        <ToolkitProvider
                                            keyField="id"
                                            data={ allUsers }
                                            columns={ tableColumns }
                                            bootstrap4={ true }
                                            search
                                        >
                                            {props => (
                                                <div className="table-responsive">
                                                    <div className="row">
                                                        <div className="col-sm-6">
                                                            <label>
                                                                Find By Client:&nbsp; 
                                                                <select 
                                                                    id="client-select" 
                                                                    required 
                                                                    onChange={(e) => this.onSelected(e, 'client')} 
                                                                    value={clientPK}
                                                                >
                                                                    { clientOptionsList }
                                                                </select>
                                                            </label>
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <SearchBar { ...props.searchProps } />
                                                        </div>
                                                    </div>
                                                    <BootstrapTable 
                                                        { ...props.baseProps }
                                                    />
                                                </div>
                                            )}
                                        </ToolkitProvider>
                                    )}
                                </div>
                            </div>}
                            {this.state.status === EDIT && <div>
                                {this.state.errMsg && <p style={{color: 'red'}}>{this.state.errMsg}</p>}
                                <form role="form">
                                    <div className="form-group">
                                        <label htmlFor="user_first_name">First Name</label>
                                        <input name="user_first_name" type="text" className="form-control" id="user_first_name" placeholder="Enter First Name" value={this.state.currentRow.first_name} onChange={(e) => this.onInputChange(e, 'first_name')} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="user_last_name">Last Name</label>
                                        <input name="user_last_name" type="text" className="form-control" id="user_last_name" placeholder="Enter Last Name" value={this.state.currentRow.last_name} onChange={(e) => this.onInputChange(e, 'last_name')} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="user_email">Email</label>
                                        <input name="user_email" type="text" className="form-control" id="user_email" placeholder="Enter Email" value={this.state.currentRow.email} onChange={(e) => this.onInputChange(e, 'email')} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="user_username">Username</label>
                                        <input name="user_username" type="text" className="form-control" id="user_username" placeholder="Enter Username" value={this.state.currentRow.username} onChange={(e) => this.onInputChange(e, 'username')} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="user_is_active">Is Active</label><br />
                                        <input type="checkbox" name="user_is_active" className="checkbox" checked={this.state.currentRow.is_active} onChange={(e) => this.onInputChange(e, 'is_active')} />
                                    </div>
                                    <button type="submit" className="btn btn-primary mt-5 mb-5" onClick={(e) => this.updateUser(e)}>Update</button>
                                    <button type="submit" className="btn btn-danger mt-5 mb-5" onClick={() => this.setState({status: SHOW})}>Cancel</button>
                                </form>
                            </div>}
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
        allUsers: state.user.allUsers,
        username: state.auth.username,
        dmeClients: state.auth.dmeClients,
        needUpdateUserDetails: state.user.needUpdateUserDetails,
        needUpdateUsers: state.user.needUpdateUsers,
        clientPK: state.user.clientPK,
        urlAdminHome: state.url.urlAdminHome,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        getAllUsers: (clientPK) => dispatch(getAllUsers(clientPK)),
        getDMEClients: () => dispatch(getDMEClients()),
        updateUserDetails: (user, status) => dispatch(updateUserDetails(user, status)),
        setGetUsersFilter: (key, value) => dispatch(setGetUsersFilter(key, value)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Users));

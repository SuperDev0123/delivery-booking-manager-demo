import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import LoadingOverlay from 'react-loading-overlay';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
import moment from 'moment';
import { verifyToken, cleanRedirectState, getDMEClients } from '../../../../state/services/authService';
import { getAllUsers, deleteUserDetails, setGetUsersFilter, setNeedUpdateUsersState, updateUserDetails } from '../../../../state/services/userService';  

class Users extends Component {    
    constructor(props) {
        super(props);

        this.state = {
            allUsers: [],
            dmeClients: [],
            username: null,
            loading: true,
            clientPK: 0
        };
    }
    
    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
        deleteUserDetails: PropTypes.func.isRequired,
        updateUserDetails: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.bool.isRequired,
        getAllUsers: PropTypes.func.isRequired,
        getDMEClients: PropTypes.func.isRequired,
        setGetUsersFilter: PropTypes.func.isRequired,
        setNeedUpdateUsersState: PropTypes.func.isRequired,
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

    removeUserDetail(event, user){
        this.setState({ loading: true });
        confirmAlert({
            title: 'Confirm to delete User Details',
            message: 'Are you sure to do this?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => { this.props.deleteUserDetails(user); this.props.setNeedUpdateUsersState(true); }
                },
                {
                    label: 'No',
                    onClick: () => console.log('Click No')
                }
            ]
        });

        this.setState({ loading: false });
        event.preventDefault();
    }

    onSelected(e, src) {
        if (src === 'client') {
            this.props.setGetUsersFilter('clientPK', e.target.value);
        }
    }

    updateUserStatus(event, user, status){
        this.setState({ loading: true });
        confirmAlert({
            title: 'Confirmation Alert',
            message: 'Click Ok to change current User Status',
            buttons: [
                {
                    label: 'Ok',
                    onClick: () => { this.props.updateUserDetails({ id: user.id, is_active: status }); }
                },
                {
                    label: 'Cancel',
                    onClick: () => console.log('Click No')
                }
            ]
        });
        this.setState({ loading: true });
        event.preventDefault();
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

        const actionButtons = (cell, row) => {
            return (
                <div>
                    <i
                        onClick={() => this.onClickEdit(2, 1, row.id)}
                        className="fa fa-edit"
                        style={{ fontSize: '24px', color: 'green' }}
                    >
                    </i>&nbsp;&nbsp;&nbsp;
                    <i
                        onClick={() => this.onClickDelete(0, { id: row.id })}
                        className="fa fa-trash"
                        style={{ fontSize: '24px', color: 'red' }}
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
                    moment(cell).format('DD/MM/YYYY HH:mm:ss')
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
                dataField: 'status_time',
                text: 'Status Time',
                editable: true,
                style: editableStyle,
                formatter: datetimeFormatter,
            }, 
            {
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
                dataField: 'button',
                text: 'Actions',
                formatter: actionButtons
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
                            <div className="panel panel-default">
                                <div className="panel-heading">
                                    <h3 className="panel-title">Users List</h3>
                                    <div className="actions pull-right">
                                        <a className="btn btn-success" href="/admin/users/add">
                                            Add New
                                        </a>
                                    </div>
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
        deleteUserDetails: (user) => dispatch(deleteUserDetails(user)),
        setGetUsersFilter: (key, value) => dispatch(setGetUsersFilter(key, value)),
        setNeedUpdateUsersState: (boolFlag) => dispatch(setNeedUpdateUsersState(boolFlag)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Users));

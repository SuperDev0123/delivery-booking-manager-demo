import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LoadingOverlay from 'react-loading-overlay';
import { withRouter } from 'react-router-dom';
import 'react-confirm-alert/src/react-confirm-alert.css';

import { verifyToken, cleanRedirectState } from '../../../../state/services/authService';
import { getAllClientEmployees } from '../../../../state/services/extraService';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';

class ClientEmployees extends Component {
    constructor(props) {
        super(props);

        this.state = {
            allClientEmployees: [],
            username: null,
            loading: true,
        };
    }

    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.bool.isRequired,
        getAllClientEmployees: PropTypes.func.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
        deleteEmailTemplateDetails: PropTypes.func.isRequired,
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

        this.props.getAllClientEmployees();
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { redirect, needUpdateFpDetails, allClientEmployees } = newProps;
        const currentRoute = this.props.location.pathname;
        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/admin');
        }

        if (allClientEmployees) {
            this.setState({ allClientEmployees });
            this.setState({ loading: false });
        }
        if (needUpdateFpDetails) {
            this.props.getAllClientEmployees();
        }
    }

    renderClientEmployeesTable() {
        const { allClientEmployees } = this.state;
        const { SearchBar } = Search;

        const editableStyle = () => {
            return {
                backgroundColor: 'white',
                cursor: 'default',
            };
        };

        const actionButton = (cell, row) => {
            return (
                <div>
                    <a className="btn btn-info btn-sm" href={'/admin/clientemployees/edit/' + row.pk_id_client_emp}>Edit</a>
                </div>
            );
        };

        const tableColumns = [
            {
                dataField: 'pk_id_client_emp',
                text: 'ID',
                editable: false,
                style: {
                    cursor: 'not-allowed',
                },
            }, {
                dataField: 'name_first',
                text: 'First Name',
                editable: false,
                style: editableStyle,
            }, {
                dataField: 'name_last',
                text: 'Last Name',
                editable: false,
                style: editableStyle,
            }, {
                dataField: 'email',
                text: 'Email',
                editable: false,
                style: editableStyle,
            }, {
                dataField: 'phone',
                text: 'Phone',
                editable: false,
                style: editableStyle,
            }, {
                dataField: 'role_name',
                text: 'Role',
                editable: false,
                style: editableStyle,
            }, {
                dataField: 'client_name',
                text: 'Client Name',
                editable: false,
                style: editableStyle,
            },{
                dataField: 'warehouse_name',
                text: 'Warehouse Name',
                editable: false,
                style: editableStyle,
            },{
                dataField: 'clien_emp_job_title',
                text: 'Job Title',
                editable: false,
                style: editableStyle,
            },{
                dataField: 'button',
                text: 'Actions',
                formatter: actionButton
            }
        ];

        return (
            <div className="row">
                <div className="col-md-12">
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h3 className="panel-title">Client Employees</h3>
                            <div className="actions pull-right">
                                <a className="btn btn-success" href="/admin/clientemployees/add">Add New</a>
                            </div>
                        </div>
                        <div className="panel-body">
                            <ToolkitProvider
                                id="client_employees"
                                keyField="id"
                                data={allClientEmployees}
                                columns={tableColumns}
                                bootstrap4={true}
                                search
                            >
                                {
                                    props => (
                                        <div>
                                            <SearchBar {...props.searchProps} />
                                            <hr />
                                            <BootstrapTable id="client_employees"
                                                {...props.baseProps}
                                            />
                                        </div>
                                    )
                                }
                            </ToolkitProvider>

                        </div>
                    </div>
                </div>
            </div>
        );
    }

    render() {       
        const { loading } = this.state;
        
        return (
            <div>
                <div className="pageheader">
                    <h1>Client Employees</h1>
                    <div className="breadcrumb-wrapper hidden-xs">
                        <span className="label">You are here:</span>
                        <ol className="breadcrumb">
                            <li><a href={this.props.urlAdminHome}>Home</a>
                            </li>
                            <li className="active">Client Employees</li>
                        </ol>
                    </div>
                </div>
                <section id="main-content" className="container animated fadeInUp">
                    { loading ? ( <LoadingOverlay active={loading} spinner text='Loading...' />): this.renderClientEmployeesTable()}
                </section>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        redirect: state.auth.redirect,
        allClientEmployees: state.extra.allClientEmployees,
        username: state.auth.username,
        needUpdateFpDetails: state.fp.needUpdateFpDetails,
        urlAdminHome: state.url.urlAdminHome,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        getAllClientEmployees: () => dispatch(getAllClientEmployees()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ClientEmployees));

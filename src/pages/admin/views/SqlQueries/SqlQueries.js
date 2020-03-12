import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LoadingOverlay from 'react-loading-overlay';
import { withRouter } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';

import { verifyToken, cleanRedirectState } from '../../../../state/services/authService';   
import { getAllSqlQueries, deleteSqlQueryDetails } from '../../../../state/services/sqlQueryService'; 

class SqlQueries extends Component {    
    constructor(props) {
        super(props);

        this.state = {
            allSqlQueries: [],
            username: null,
            loading: true,
        };
    }
    
    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.object.isRequired,
        getAllSqlQueries: PropTypes.func.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
        deleteSqlQueryDetails: PropTypes.func.isRequired,
    }

    componentDidMount() {
        //this.setState({loading: true});
        const token = localStorage.getItem('token');

        if (token && token.length > 0) {
            this.props.verifyToken();
        } else {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/');
        }

        this.props.getAllSqlQueries();
        
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { redirect, allSqlQueries, needUpdateSqlQueries } = newProps;
        const currentRoute = this.props.location.pathname;
        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/');
        }
        if (allSqlQueries) {
            this.setState({ allSqlQueries });
            this.setState({loading: false});
        }
        if(needUpdateSqlQueries){
            this.props.getAllSqlQueries();
        }
    }

    removeSqlQueryDetails(event, fp){
        this.setState({loading: true});
        confirmAlert({
            title: 'Confirm to delete SQL Query',
            message: 'Are you sure to do this?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {this.props.deleteSqlQueryDetails(fp);this.props.getAllSqlQueries();}
                },
                {
                    label: 'No',
                    onClick: () => console.log('Click No')
                }
            ]
        });
        
        this.setState({loading: false});
        event.preventDefault();
    }

    render() {
        const { allSqlQueries, loading } = this.state;
        // const List = allSqlQueries.map((row, index) => {
        //     return (
        //         <tr key={index}>
        //             <td>{row.id}</td>
        //             <td>{row.sql_title}</td>
        //             <td>{row.sql_description}</td>
        //             <td><a className="btn btn-info btn-sm" href={'/sqlqueries/edit/'+row.id}>Edit</a></td>
        //         </tr>
        //     );
        // });

        const editableStyle = () => {
            return {
                backgroundColor: 'white',
                cursor: 'default',
            };
        };

        const actionButton = (cell, row) => {
            return (
                <div>
                    <a className="btn btn-success btn-sm" href={'/sqlqueries/edit/'+row.id}><i className="fa fa-edit"></i></a>
                &nbsp;&nbsp;&nbsp;<a className="btn btn-danger btn-sm" onClick={(e) => this.removeSqlQueryDetails(e, row)}><i className="fa fa-trash"></i></a>
                </div>
            );
        };

        const tableColumns = [
            {
                dataField: 'id',
                text: 'ID',
                editable: false,
                style: {
                    backgroundColor: 'lightgray',
                    cursor: 'not-allowed',
                },
            }, {
                dataField: 'sql_title',
                text: 'Title',
                editable: false,
                style: editableStyle,
            }, {
                dataField: 'sql_description',
                text: 'Description',
                editable: false,
                style: editableStyle,
            }, {
                dataField: 'button',
                text: 'Actions',
                formatter: actionButton
            }
        ];

        const { SearchBar } = Search;

        return (
            <div>
                <div className="pageheader">
                    <h1>SQL Queries</h1>
                    <div className="breadcrumb-wrapper hidden-xs">
                        <span className="label">You are here:</span>
                        <ol className="breadcrumb">
                            <li><a href="/">Dashboard</a>
                            </li>
                            <li className="active">SQL Queries</li>
                        </ol>
                    </div>
                </div>
                <section id="main-content" className="container animated fadeInUp">
                    {loading ?(
                        <LoadingOverlay
                            active={this.state.loading}
                            spinner
                            text='Loading...'
                        />
                    ) : (
                        <div className="row">
                            <div className="col-md-12">
                                <div className="panel panel-default">
                                    <div className="panel-heading">
                                        <h3 className="panel-title">SQL Queries</h3>
                                        <div className="actions pull-right">
                                            <a className="btn btn-success btn-sm" href="/sqlqueries/add">Add New</a>
                                        </div>
                                    </div>
                                    <div className="panel-body">
                                        {/*<table id="example" className="table table-striped table-bordered" cellSpacing="0" width="100%">
                                    <thead>
                                        <tr>
                                            <th>id</th>
                                            <th>title</th>
                                            <th>Description</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        { 
                                            allSqlQueries.map((row, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{row.id}</td>
                                                        <td>{row.sql_title}</td>
                                                        <td>{row.sql_description}</td>
                                                        <td><a className="btn btn-info btn-sm" href={'/sqlqueries/edit/'+row.id}>Edit</a></td>
                                                    </tr>
                                                );
                                            }) 
                                        }
                                    </tbody>
                                </table>*/}
                
                                        <ToolkitProvider
                                            id="sql_queries"
                                            keyField="id"
                                            data={ allSqlQueries }
                                            columns={ tableColumns }
                                            bootstrap4={ true }
                                            search
                                        >
                                            {
                                                props => (
                                                    <div>
                                                        <SearchBar { ...props.searchProps } />
                                                        <hr />
                                                        <BootstrapTable id="sql_queries"
                                                            { ...props.baseProps }
                                                        />
                                                    </div>
                                                )
                                            }
                                        </ToolkitProvider>

                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        redirect: state.auth.redirect,
        allSqlQueries: state.sqlQuery.allSqlQueries,
        username: state.auth.username,
        needUpdateSqlQueries: state.sqlQuery.needUpdateSqlQueries,
        validSqlQueryDetails: state.sqlQuery.validSqlQueryDetails,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        getAllSqlQueries: () => dispatch(getAllSqlQueries()),
        deleteSqlQueryDetails: (data) => dispatch(deleteSqlQueryDetails(data))
        
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SqlQueries));
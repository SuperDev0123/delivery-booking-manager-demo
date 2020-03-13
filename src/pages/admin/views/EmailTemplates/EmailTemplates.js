import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LoadingOverlay from 'react-loading-overlay';
import { withRouter } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import { verifyToken, cleanRedirectState } from '../../../../state/services/adminAuthService';   
import { getAllEmailTemplates, deleteEmailTemplateDetails } from '../../../../state/services/emailTemplateService';  

class EmailTemplates extends Component {    
    constructor(props) {
        super(props);

        this.state = {
            allEmailTemplates: [],
            username: null,
            loading: true,
        };
    }
    
    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.object.isRequired,
        getAllEmailTemplates: PropTypes.func.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
        deleteEmailTemplateDetails: PropTypes.func.isRequired,
    }

    componentDidMount() {
        //this.setState({loading: true});
        const token = localStorage.getItem('admin_token');

        if (token && token.length > 0) {
            this.props.verifyToken();
        } else {
            localStorage.setItem('isAdminLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/');
        }

        this.props.getAllEmailTemplates();
        
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { redirect, allEmailTemplates, needUpdateFpDetails } = newProps;
        const currentRoute = this.props.location.pathname;
        if (redirect && currentRoute != '/') {
            localStorage.setItem('isAdminLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/');
        }
        if (allEmailTemplates) {
            this.setState({ allEmailTemplates });
            this.setState({loading: false});
        }
        if(needUpdateFpDetails){
            this.props.getAllEmailTemplates();
        }
    }

    removeFpDetail(event, fp){
        this.setState({loading: true});
        confirmAlert({
            title: 'Confirm to delete Freight Provider',
            message: 'Are you sure to do this?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {this.props.deleteEmailTemplateDetails(fp);this.props.getAllEmailTemplates();}
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
        const { allEmailTemplates, loading } = this.state;
        const List = allEmailTemplates.map((fp, index) => {
            return (
                <tr key={index}>
                    <td>{fp.id}</td>
                    <td>{fp.emailName}</td>
                    <td>{fp.sectionName}</td>
                    <td><a className="btn btn-info btn-sm" href={'/emails/edit/'+fp.id}>Edit</a></td>
                </tr>
            );
        });

        return (
            <div>
                <div className="pageheader">
                    <h1>Email Templates</h1>
                    <div className="breadcrumb-wrapper hidden-xs">
                        <span className="label">You are here:</span>
                        <ol className="breadcrumb">
                            <li><a href="/">Dashboard</a>
                            </li>
                            <li className="active">Email Templates</li>
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
                                        <h3 className="panel-title">Email Templates</h3>
                                        <div className="actions pull-right">
                                            {/*<a className="btn btn-success" href="/emails/add">Add New</a>*/}
                                        </div>
                                    </div>
                                    <div className="panel-body">
                                        <table id="example" className="table table-striped table-bordered" cellSpacing="0" width="100%">
                                            <thead>
                                                <tr>
                                                    <th>id</th>
                                                    <th>Name</th>
                                                    <th>Section</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                { List }
                                            </tbody>
                                        </table>

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
        redirect: state.adminAuth.redirect,
        allEmailTemplates: state.emailTemplate.allEmailTemplates,
        username: state.adminAuth.username,
        needUpdateFpDetails: state.fp.needUpdateFpDetails,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        getAllEmailTemplates: () => dispatch(getAllEmailTemplates()),
        deleteEmailTemplateDetails: (fp) => dispatch(deleteEmailTemplateDetails(fp))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EmailTemplates));

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LoadingOverlay from 'react-loading-overlay';
import { withRouter } from 'react-router-dom';

import { verifyToken, cleanRedirectState } from '../../../../state/services/authService';
import { updateClient, getClient } from '../../../../state/services/clientService';

class EditClient extends Component {
    constructor(props) {
        super(props);

        this.state = {
            company_name: '',
            dme_account_num: '',
            phone: '',
            current_freight_provider: '',
            loading: false,
            client: {}
        };
    }

    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.bool.isRequired,
        updateClient: PropTypes.func.isRequired,
        getClient: PropTypes.func.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
        urlAdminHome: PropTypes.string.isRequired,
        match: PropTypes.object.isRequired,
    }

    componentDidMount() {
        const client_id = this.props.match.params.id;
        const token = localStorage.getItem('token');

        if (token && token.length > 0) {
            this.props.verifyToken();
        } else {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/admin');
        }
        this.props.getClient(client_id);
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { redirect, client} = newProps;
        const currentRoute = this.props.location.pathname;
        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/admin');
        }

        if(client) {
            const { company_name, dme_account_num, phone, current_freight_provider } = client;
            this.setState({ client, company_name, dme_account_num, phone, current_freight_provider});
        }
    }

    onInputChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    onSubmit(event) {
        this.setState({ loading: true });
        let { client } = this.state;
        const { company_name, dme_account_num, phone, current_freight_provider } = this.state;        

        client.company_name = company_name;
        client.dme_account_num = dme_account_num;
        client.current_freight_provider = current_freight_provider;
        client.phone = phone;

        this.props.updateClient(client);
        this.setState({ loading: false });
        // this.props.history.push('/admin/clients');
        event.preventDefault();
    }

    render() {
        return (
            <div>
                <div className="pageheader">
                    <h1>Edit Client</h1>
                    <div className="breadcrumb-wrapper hidden-xs">
                        <span className="label">You are here:</span>
                        <ol className="breadcrumb">
                            <li><a href={this.props.urlAdminHome}>Home</a>
                            </li>
                            <li><a href="/admin/clientemployees">Clients</a></li>
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
                                            <label htmlFor="company_name">Company Name</label>
                                            <input name="company_name" type="text" className="form-control" id="company_name" placeholder="Enter Company Name" value={this.state.company_name} onChange={(e) => this.onInputChange(e)} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="dme_account_num">Dme Account Num</label>
                                            <input name="dme_account_num" type="text" className="form-control" id="dme_account_num" placeholder="Enter Account Num" value={this.state.dme_account_num} onChange={(e) => this.onInputChange(e)} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="phone">Phone</label>
                                            <input name="phone" type="text" className="form-control" id="name_last" placeholder="Enter Phone" value={this.state.phone} onChange={(e) => this.onInputChange(e)} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="current_freight_provider">Freight Provider</label>
                                            <input name="current_freight_provider" type="text" className="form-control" id="job_title" placeholder="Enter Freight Provider" value={this.state.current_freight_provider} onChange={(e) => this.onInputChange(e)} />
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
        client: state.client.client,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        updateClient: (data) => dispatch(updateClient(data)),
        getClient: (id) => dispatch(getClient(id)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditClient));

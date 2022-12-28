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
            phone: '',
            client_filter_date_field: 'z_CreatedTimestamp',
            current_freight_provider: '',
            client_mark_up_percent: '',
            client_min_markup_startingcostvalue: '',
            client_min_markup_value: '',
            augment_pu_available_time: '',
            augment_pu_by_time: '',
            client_customer_mark_up: '',
            gap_percent: 0,
            logo_url: '',
            loading: false,
            status_email: '',
            status_phone: '',
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
            const { 
                company_name,
                phone,
                client_filter_date_field,
                current_freight_provider,
                client_mark_up_percent,
                client_min_markup_startingcostvalue,
                client_min_markup_value,
                augment_pu_available_time,
                augment_pu_by_time,
                client_customer_mark_up,
                gap_percent,
                logo_url,
                status_email,
                status_phone
            } = client;
            this.setState({ 
                client,
                company_name,
                phone,
                client_filter_date_field,
                current_freight_provider,
                client_mark_up_percent,
                client_min_markup_startingcostvalue,
                client_min_markup_value,
                augment_pu_available_time,
                augment_pu_by_time,
                client_customer_mark_up,
                gap_percent,
                logo_url,
                status_email,
                status_phone
            });
        }
    }

    onInputChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    onSubmit(event) {
        this.setState({ loading: true });
        let { client } = this.state;
        const { 
            company_name,
            phone,
            client_filter_date_field,
            current_freight_provider,
            client_mark_up_percent,
            client_min_markup_startingcostvalue,
            client_min_markup_value,
            augment_pu_available_time,
            augment_pu_by_time,
            client_customer_mark_up,
            gap_percent,
            logo_url,
            status_email,
            status_phone
        } = this.state;

        client.company_name = company_name;
        client.phone = parseInt(phone);
        client.client_filter_date_field = client_filter_date_field;
        client.current_freight_provider = current_freight_provider;
        client.client_mark_up_percent = parseFloat(client_mark_up_percent);
        client.client_min_markup_startingcostvalue = parseFloat(client_min_markup_startingcostvalue);
        client.client_min_markup_value = parseFloat(client_min_markup_value);
        client.augment_pu_available_time = augment_pu_available_time;
        client.augment_pu_by_time = augment_pu_by_time;
        client.client_customer_mark_up = parseFloat(client_customer_mark_up);
        client.gap_percent = parseFloat(gap_percent);
        client.logo_url = logo_url;
        client.status_email = status_email || '';
        client.status_phone = status_phone || '';

        this.props.updateClient(client);
        this.setState({ loading: false });
        this.props.history.push('/admin/clients');
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
                                            <div className="panel-default panel-heading p-1 mt-4 bg-lightgray">General Info</div>
                                            <label htmlFor="company_name">Company Name</label>
                                            <input name="company_name" type="text" className="form-control" id="company_name" placeholder="Enter Company Name" value={this.state.company_name} onChange={(e) => this.onInputChange(e)} />
                                            <label htmlFor="phone">Phone</label>
                                            <input name="phone" type="text" className="form-control" id="name_last" placeholder="Enter Phone" value={this.state.phone} onChange={(e) => this.onInputChange(e)} />
                                            <label htmlFor="current_freight_provider">Freight Provider</label>
                                            <input name="current_freight_provider" type="text" className="form-control" placeholder="Enter Freight Provider" value={this.state.current_freight_provider} onChange={(e) => this.onInputChange(e)} />
                                        </div>
                                        <div className="form-group">
                                            <div className="panel-default panel-heading p-1 mt-5 bg-lightgray">Mark Up Info</div>
                                            <label htmlFor="client_mark_up_percent">Percent MU for DME Profit</label>
                                            <input name="client_mark_up_percent" type="text" className="form-control" placeholder="Enter Percent MU for DME Profit" value={this.state.client_mark_up_percent} onChange={(e) => this.onInputChange(e)} />
                                            <label htmlFor="client_min_markup_startingcostvalue">Client Min MU Starting Cost</label>
                                            <input name="client_min_markup_startingcostvalue" type="text" className="form-control" placeholder="Enter Client Min MU Starting Cost" value={this.state.client_min_markup_startingcostvalue} onChange={(e) => this.onInputChange(e)} />
                                            <label htmlFor="client_min_markup_value">Client Min MU Value</label>
                                            <input name="client_min_markup_value" type="text" className="form-control" placeholder="Enter Client Min MU Value" value={this.state.client_min_markup_value} onChange={(e) => this.onInputChange(e)} />
                                            <label htmlFor="client_customer_mark_up">Client Customer MU</label>
                                            <input name="client_customer_mark_up" type="text" className="form-control" placeholder="Enter Client Customer MU" value={this.state.client_customer_mark_up} onChange={(e) => this.onInputChange(e)} />
                                        </div>
                                        <div className="form-group">
                                            <div className="panel-default panel-heading p-1 mt-5 bg-lightgray">Augment Info</div>
                                            <label htmlFor="augment_pu_available_time">Augment PU Available Time</label>
                                            <input name="augment_pu_available_time" type="time" className="form-control" placeholder="Enter Augment PU Available Time" value={this.state.augment_pu_available_time} onChange={(e) => this.onInputChange(e)} />
                                            <label htmlFor="augment_pu_by_time">Augment PU By Time</label>
                                            <input name="augment_pu_by_time" type="time" className="form-control" placeholder="Enter Augment PU By Time" value={this.state.augment_pu_by_time} onChange={(e) => this.onInputChange(e)} />
                                        </div>
                                        <div className="form-group">
                                            <div className="panel-default panel-heading p-1 mt-5 bg-lightgray">Other Info</div>
                                            <label htmlFor="gap_percent">Gap Percent</label>
                                            <input name="gap_percent" type="text" className="form-control" placeholder="Enter Gap Percent" value={this.state.gap_percent} onChange={(e) => this.onInputChange(e)} />
                                            <label htmlFor="logo_url">Logo URL</label>
                                            <input name="logo_url" type="text" className="form-control" placeholder="Enter Logo URL" value={this.state.logo_url} onChange={(e) => this.onInputChange(e)} />
                                            <label htmlFor="exampleFormControlSelect1">Example select</label>
                                            <label htmlFor="client_filter_date_field">Client Filter Date Field</label>
                                            <select className="rounded-0 form-control py-0" name="client_filter_date_field" value={this.state.client_filter_date_field} onChange={(e) => this.onInputChange(e)}>
                                                <option value="z_CreatedTimestamp">Created Timestamp</option>
                                                <option value="puPickUpAvailFrom_Date">PU Pickup Available From Date</option>
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

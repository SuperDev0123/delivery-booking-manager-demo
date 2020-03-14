import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LoadingOverlay from 'react-loading-overlay';
import { withRouter } from 'react-router-dom';

import { verifyToken, cleanRedirectState } from '../../../../state/services/adminAuthService';
import { createFpDetail } from '../../../../state/services/fpService';

class AddUser extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fp_company_name: '',
            fp_address_country: 'AU',
            loading: false,
        };
    }

    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.object.isRequired,
        createFpDetail: PropTypes.func.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
    }

    componentDidMount() {
        const token = localStorage.getItem('admin_token');

        if (token && token.length > 0) {
            this.props.verifyToken();
        } else {
            localStorage.setItem('isAdminLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/admin');
        }
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { redirect, fp_company_name, fp_address_country } = newProps;
        const currentRoute = this.props.location.pathname;
        if (redirect && currentRoute != '/') {
            localStorage.setItem('isAdminLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/admin');
        }
        if (fp_company_name) {
            this.setState({ fp_company_name: fp_company_name });
        }
        if (fp_address_country) {
            this.setState({ fp_address_country: fp_address_country });
        }
    }

    onInputChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    onSubmit(event) {
        this.setState({ loading: true });
        const { fp_company_name, fp_address_country } = this.state;
        this.props.createFpDetail({ fp_company_name: fp_company_name, fp_address_country: fp_address_country });
        this.setState({ loading: false });
        this.props.history.push('/admin/providers');
        event.preventDefault();
    }

    render() {
        return (
            <div>
                <div className="pageheader">
                    <h1>Add Freight Providers</h1>
                    <div className="breadcrumb-wrapper hidden-xs">
                        <span className="label">You are here:</span>
                        <ol className="breadcrumb">
                            <li><a href="/">Dashboard</a>
                            </li>
                            <li><a href="/providers">Freight Providers</a></li>
                            <li className="active">Add New</li>
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
                                    <h3 className="panel-title">Add New</h3>
                                    <div className="actions pull-right">

                                    </div>
                                </div>
                                <div className="panel-body">
                                    <form onSubmit={(e) => this.onSubmit(e)} role="form">
                                        <div className="form-group">
                                            <label htmlFor="fp_company_name">Company Name</label>
                                            <input name="fp_company_name" type="text" className="form-control" id="fp_company_name" placeholder="Enter Company Name" value={this.state.fp_company_name} onChange={(e) => this.onInputChange(e)} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="fp_address_country">Country</label>
                                            <select name="fp_address_country" className="form-control" id="fp_address_country" onChange={(e) => this.onInputChange(e)}>
                                                <option value="AUS">Australia</option>
                                            </select>
                                        </div>
                                        <button type="submit" className="btn btn-primary">Submit</button>
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
        redirect: state.adminAuth.redirect,
        fp_company_name: state.fp.fp_company_name,
        fp_address_country: state.fp.fp_address_country,
        username: state.adminAuth.username,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        createFpDetail: (fpDetail) => dispatch(createFpDetail(fpDetail))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddUser));

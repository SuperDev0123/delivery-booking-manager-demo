import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LoadingOverlay from 'react-loading-overlay';
import { withRouter } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import { verifyToken, cleanRedirectState } from '../../../../state/services/authService';
import { getAllFPs, deleteFpDetail } from '../../../../state/services/fpService';

class FreightProviders extends Component {
    constructor(props) {
        super(props);

        this.state = {
            allFPs: [],
            fpCarries: [],
            username: null,
            loading: false,
        };
    }

    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.bool.isRequired,
        getAllFPs: PropTypes.func.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
        deleteFpDetail: PropTypes.func.isRequired,
    }

    componentDidMount() {
        this.setState({ loading: true });
        const token = localStorage.getItem('token');

        if (token && token.length > 0) {
            this.props.verifyToken();
        } else {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/admin');
        }

        this.props.getAllFPs();
        this.setState({ loading: false });
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { redirect, allFPs, needUpdateFpDetails } = newProps;
        const currentRoute = this.props.location.pathname;
        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/');
        }
        if (allFPs) {
            this.setState({ allFPs });
        }
        if (needUpdateFpDetails) {
            this.props.getAllFPs();
        }
    }

    removeFpDetail(event, fp) {
        this.setState({ loading: true });
        confirmAlert({
            title: 'Confirm to delete Freight Provider',
            message: 'Are you sure to do this?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => { this.props.deleteFpDetail(fp); this.props.getAllFPs(); }
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

    render() {
        const { allFPs } = this.state;

        const fpsList = allFPs.map((fp, index) => {
            return (
                <tr key={index}>
                    <td>{fp.id}</td>
                    <td>{fp.fp_company_name}</td>
                    <td>{fp.fp_address_country}</td>
                    <td><a className="btn btn-info btn-sm" href={'/admin/providers/edit/' + fp.id}>Edit</a>&nbsp;&nbsp;<a onClick={(event) => this.removeFpDetail(event, fp)} className="btn btn-danger btn-sm" href="javascript:void(0)">Delete</a></td>
                </tr>
            );
        });

        return (
            <div>
                <div className="pageheader">
                    <h1>Freight Providers</h1>
                    <div className="breadcrumb-wrapper hidden-xs">
                        <span className="label">You are here:</span>
                        <ol className="breadcrumb">
                            <li><a href="/">Dashboard</a>
                            </li>
                            <li className="active">Freight Providers</li>
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
                        <div className="col-md-12">
                            <div className="panel panel-default">
                                <div className="panel-heading">
                                    <h3 className="panel-title">Freight Providers</h3>
                                    <div className="actions pull-right">
                                        <a className="btn btn-success" href="/providers/add">Add New</a>
                                    </div>
                                </div>
                                <div className="panel-body">
                                    <table id="example" className="table table-striped table-bordered" cellSpacing="0" width="100%">
                                        <thead>
                                            <tr>
                                                <th>id</th>
                                                <th>Name</th>
                                                <th>Country</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {fpsList}
                                        </tbody>
                                    </table>

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
        allFPs: state.fp.allFPs,
        username: state.auth.username,
        needUpdateFpDetails: state.fp.needUpdateFpDetails,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        getAllFPs: () => dispatch(getAllFPs()),
        deleteFpDetail: (fp) => dispatch(deleteFpDetail(fp))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FreightProviders));

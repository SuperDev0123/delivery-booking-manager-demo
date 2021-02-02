import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LoadingOverlay from 'react-loading-overlay';
import { withRouter } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import { verifyToken, cleanRedirectState } from '../../../../state/services/authService';
import { getAllAugmentAddress, deleteAugmentAddress } from '../../../../state/services/augmentService';

class AugmentAddresses extends Component {
    constructor(props) {
        super(props);

        this.state = {
            allAugmentAddress: [],
            username: null,
            loading: false,
        };
    }

    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.bool.isRequired,
        getAllAugmentAddress: PropTypes.func.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
        deleteAugmentAddress: PropTypes.func.isRequired,
        urlAdminHome: PropTypes.string.isRequired,
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

        this.props.getAllAugmentAddress();
        this.setState({ loading: false });
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { redirect, allAugmentAddress } = newProps;
        const currentRoute = this.props.location.pathname;
        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/');
        }
        if (allAugmentAddress) {
            this.setState({ allAugmentAddress });
        }
    }

    removeAugmentAddress(event, augmentAddress) {
        this.setState({ loading: true });
        confirmAlert({
            title: 'Confirm to delete Augment Address Rule',
            message: 'Are you sure to do this?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => { this.props.deleteAugmentAddress(augmentAddress); this.props.getAllAugmentAddress(); }
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
        const { allAugmentAddress } = this.state;

        const rulesList = allAugmentAddress.map((fp, index) => {
            return (
                <tr key={index}>
                    <td>{fp.id}</td>
                    <td>{fp.origin_word}</td>
                    <td>{fp.augmented_word}</td>
                    <td><a className="btn btn-info btn-sm" href={'/admin/augmentaddress/edit/' + fp.id}>Edit</a>&nbsp;&nbsp;<a onClick={(event) => this.removeAugmentAddress(event, fp)} className="btn btn-danger btn-sm" href="javascript:void(0)">Delete</a></td>
                </tr>
            );
        });

        return (
            <div>
                <div className="pageheader">
                    <h1>Augment Address Rules</h1>
                    <div className="breadcrumb-wrapper hidden-xs">
                        <span className="label">You are here:</span>
                        <ol className="breadcrumb">
                            <li><a href={this.props.urlAdminHome}>Home</a>
                            </li>
                            <li className="active">Augment Address Rules</li>
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
                                    <h3 className="panel-title">Augment Address Rules</h3>
                                    <div className="actions pull-right">
                                        <a className="btn btn-success" href="/admin/augmentaddress/add">Add New</a>
                                    </div>
                                </div>
                                <div className="panel-body">
                                    <table id="example" className="table table-striped table-bordered" cellSpacing="0" width="100%">
                                        <thead>
                                            <tr>
                                                <th>id</th>
                                                <th>Origin Word</th>
                                                <th>Augmented Word</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rulesList}
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
        username: state.auth.username,
        urlAdminHome: state.url.urlAdminHome,
        augmentAddress: state.augment.augmentAddress,
        allAugmentAddress: state.augment.allAugmentAddress,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        getAllAugmentAddress: () => dispatch(getAllAugmentAddress()),
        deleteAugmentAddress: (augmentAddress) => dispatch(deleteAugmentAddress(augmentAddress))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AugmentAddresses));

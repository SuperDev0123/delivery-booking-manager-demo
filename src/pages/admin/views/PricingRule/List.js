import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
// Libs
import axios from 'axios';
// Components
import ConfirmModal from '../../../../components/CommonModals/ConfirmModal';
import LoadingOverlay from 'react-loading-overlay';
import { ToastContainer, toast } from 'react-toastify';
// Services
import { verifyToken, cleanRedirectState } from '../../../../state/services/authService';
import { getPricingRules } from '../../../../state/services/pricingRuleService';
// Constants
import { API_HOST, HTTP_PROTOCOL } from '../../../../config';

class List extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            allPricingRules:[],
            selectedFile: null,
            selectedFileOption: null,
            isShowDeleteFileConfirmModal: false,
        };

        this.toggleDeleteFileConfirmModal = this.toggleDeleteFileConfirmModal.bind(this);
    }

    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.bool.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
        getPricingRules: PropTypes.func.isRequired,
    }

    componentDidMount() {
        const token = localStorage.getItem('token');

        if (token && token.length > 0) {
            this.props.verifyToken();
        } else {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/admin/');
        }

        this.onClickRefresh();
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { redirect, allPricingRules } = newProps;
        const currentRoute = this.props.location.pathname;

        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/admin');
        }

        if (allPricingRules) {
            this.setState({allPricingRules, loading: false});
            this.notify('Refreshed!');
        }
    }

    notify = (text) => {
        toast(text);
    };

    toggleDeleteFileConfirmModal() {
        this.setState(prevState => ({isShowDeleteFileConfirmModal: !prevState.isShowDeleteFileConfirmModal}));
    }

    onClickRefresh() {
        this.setState({loading: true});
        this.props.getPricingRules();
    }

    onClickDeleteFile(file, fileOption) {
        this.setState({selectedFile: file, selectedFileOption: fileOption});
        this.toggleDeleteFileConfirmModal();
    }

    onClickConfirmDeleteFileBtn() {
        const token = localStorage.getItem('token');
        const {selectedFile, selectedFileOption} = this.state;

        const options = {
            method: 'delete',
            url: HTTP_PROTOCOL + '://' + API_HOST + '/delete-file/',
            headers: {'Authorization': 'JWT ' + token },
            data: {deleteFileOption: selectedFileOption, fileName: selectedFile.file_name},
        };

        axios(options)
            .then((response) => {
                console.log('#301 - ', response.data);
                this.notify('Deleted successfully!');
                this.props.getPricingRules();
                this.toggleDeleteFileConfirmModal();
            })
            .catch(error => {
                this.notify('Failed to delete a file: ' + error);
                this.toggleDeleteFileConfirmModal();
            });
    }

    render() {
        const { loading, allPricingRules } = this.state;

        const pricingRuleList = allPricingRules.map((rule, index) => {
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{rule.freight_provider}</td>
                    <td>{rule.service_type}</td>
                    <td>{rule.service_timing_code}</td>
                    <td>{rule.calc_type}</td>
                    <td>{rule.charge_rule}</td>
                    <td>{rule.cost_id}</td>
                    <td>{rule.timing_id}</td>
                    <td>{rule.vehicle_id}</td>
                    <td>{rule.both_way}</td>
                    <td>{rule.pu_zone}</td>
                    <td>{rule.pu_state}</td>
                    <td>{rule.pu_postal_code}</td>
                    <td>{rule.pu_suburb}</td>
                    <td>{rule.de_zone}</td>
                    <td>{rule.de_state}</td>
                    <td>{rule.de_postal_code}</td>
                    <td>{rule.de_suburb}</td>
                    <td>
                        <button
                            className="btn btn-danger"
                            onClick={() => this.onClickDeleteFile(rule, 'pricing-only')}
                        >
                            Delete
                        </button>
                    </td>
                </tr>
            );
        });

        return (
            <div className="pricing-only">
                <div className="pageheader">
                    <h1>Pricing Rules</h1>
                    <div className="breadcrumb-wrapper hidden-xs">
                        <span className="label">You are here:</span>
                        <ol className="breadcrumb">
                            <li><a href="/">Dashboard</a>
                            </li>
                            <li className="active">Pricing Rules</li>
                        </ol>
                    </div>
                </div>
                <section id="main-content" className="animated fadeInUp">
                    {loading ? (
                        <LoadingOverlay
                            active={loading}
                            spinner
                            text='Loading...'
                        />
                    )
                        :
                        (
                            <div className="panel panel-default">
                                <div className="panel-heading">
                                    <h3 className="panel-title"></h3>
                                </div>
                                <div className="panel-body">
                                    <button
                                        className="btn btn-success btn-refresh"
                                        onClick={() => this.onClickRefresh()}
                                    >
                                        Refresh
                                    </button> 
                                    <table className="table table-hover table-bordered sortable fixed_headers">
                                        <thead>
                                            <th>No</th>
                                            <th>Freight Provider</th>
                                            <th>Service Type</th>
                                            <th>Service Timing Code</th>
                                            <th>Calc Type</th>
                                            <th>Charge Rule</th>
                                            <th>Cost Id</th>
                                            <th>Timing Id</th>
                                            <th>Vehicle Id</th>
                                            <th>Both Way</th>
                                            <th>Pu Zone</th>
                                            <th>Pu State</th>
                                            <th>Pu Postal Code</th>
                                            <th>Pu Suburb</th>
                                            <th>De Zone</th>
                                            <th>De State</th>
                                            <th>De Postal Code</th>
                                            <th>De Suburb</th>
                                        </thead>
                                        <tbody>
                                            {pricingRuleList}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                </section>

                <ConfirmModal
                    isOpen={this.state.isShowDeleteFileConfirmModal}
                    onOk={() => this.onClickConfirmDeleteFileBtn()}
                    onCancel={this.toggleDeleteFileConfirmModal}
                    title={'Delete File'}
                    text={'Are you sure you want to delete source file and result file?'}
                    okBtnName={'Delete'}
                />

                <ToastContainer />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        redirect: state.auth.redirect,
        username: state.auth.username,
        allPricingRules: state.pricingRule.allPricingRules,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        getPricingRules: () => dispatch(getPricingRules()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(List));

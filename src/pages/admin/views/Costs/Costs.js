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
import { getAllCosts } from '../../../../state/services/costService';
// Constants
import { API_HOST, HTTP_PROTOCOL } from '../../../../config';

class Costs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            allCosts: [],
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
        getAllCosts: PropTypes.func.isRequired,
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
        const { redirect, allCosts } = newProps;
        const currentRoute = this.props.location.pathname;

        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/admin');
        }

        if (allCosts) {
            this.setState({allCosts, loading: false});
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
        this.props.getAllCosts();
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
                this.props.getAllCosts();
                this.toggleDeleteFileConfirmModal();
            })
            .catch(error => {
                this.notify('Failed to delete a file: ' + error);
                this.toggleDeleteFileConfirmModal();
            });
    }

    render() {
        const { loading, allCosts } = this.state;

        const costList = allCosts.map((cost, index) => {
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{cost.UOM_charge}</td>
                    <td>{cost.start_qty }</td>
                    <td>{cost.end_qty }</td>
                    <td>{cost.basic_charge }</td>
                    <td>{cost.min_charge }</td>
                    <td>{cost.per_UOM_charge }</td>
                    <td>{cost.oversize_premium }</td>
                    <td>{cost.oversize_price }</td>
                    <td>{cost.m3_to_kg_factor }</td>
                    <td>{cost.dim_UOM }</td>
                    <td>{cost.price_up_to_length }</td>
                    <td>{cost.price_up_to_width }</td>
                    <td>{cost.price_up_to_height }</td>
                    <td>{cost.weight_UOM  }</td>
                    <td>{cost.price_up_to_weight  }</td>
                    <td>{cost.max_length  }</td>
                    <td>{cost.max_width  }</td>
                    <td>{cost.max_height  }</td>
                    <td>{cost.max_weight  }</td>

                    <td>
                        <button
                            className="btn btn-danger"
                            onClick={() => this.onClickDeleteFile(cost, 'pricing-only')}
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
                    <h1>Costs</h1>
                    <div className="breadcrumb-wrapper hidden-xs">
                        <span className="label">You are here:</span>
                        <ol className="breadcrumb">
                            <li><a href="/">Dashboard</a>
                            </li>
                            <li className="active">Costs</li>
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
                                            <th>UOM Charge</th>
                                            <th>Start QTY</th>
                                            <th>End QTY</th>
                                            <th>Basic Charge</th>
                                            <th>Min Charge</th>
                                            <th>Per UOM Charge</th>
                                            <th>Oversize Premium</th>
                                            <th>Oversize Price</th>
                                            <th>M3_2_Kg Factor</th>
                                            <th>DIM UOM</th>
                                            <th>Price Up Length</th>
                                            <th>Price Up Width</th>
                                            <th>Price Up Height</th>
                                            <th>Weight UOM</th>
                                            <th>Price Up Weight</th>
                                            <th>Max Length</th>
                                            <th>Max Width</th>
                                            <th>Max Height</th>
                                            <th>Max Weight</th>
                                            <th>Delete</th>
                                        </thead>
                                        <tbody>
                                            {costList}
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
        allCosts: state.cost.allCosts,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        getAllCosts: () => dispatch(getAllCosts()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Costs));

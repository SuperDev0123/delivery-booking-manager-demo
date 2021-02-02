import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
// Libs
// Components
import ConfirmModal from '../../../../components/CommonModals/ConfirmModal';
import LoadingOverlay from 'react-loading-overlay';
import { ToastContainer, toast } from 'react-toastify';
// Services
import { verifyToken, cleanRedirectState } from '../../../../state/services/authService';
import { getAllClientRas, deleteClientRas } from '../../../../state/services/clientRasService';
// Constants
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import { confirmAlert } from 'react-confirm-alert';
class ClientRas extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            clientRases: [],
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
        getAllClientRas: PropTypes.func.isRequired,
        urlAdminHome: PropTypes.string.isRequired,
        deleteClientRas: PropTypes.func.isRequired,
    }

    componentDidMount() {
        const token = localStorage.getItem('token');

        if (token && token.length > 0) {
            this.props.verifyToken();
        } else {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/customerdashboard/');
        }

        this.onClickRefresh();
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { redirect, clientRases } = newProps;
        const currentRoute = this.props.location.pathname;

        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/customerdashboard');
        }

        if (clientRases) {
            console.log(' UNSAFE_componentWillReceiveProps clientRases', clientRases);
            this.setState({clientRases, loading: false});
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
        this.props.getAllClientRas();
    }

    onClickDeleteFile(file, fileOption) {
        this.setState({selectedFile: file, selectedFileOption: fileOption});
        this.toggleDeleteFileConfirmModal();
    }

    removeClientRasDetails(event, fp){
        confirmAlert({
            title: 'Confirm to delete a Client Ras',
            message: 'Are you sure to do this?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {this.props.deleteClientRas(fp);this.props.getAllClientRas();}
                },
                {
                    label: 'No',
                    onClick: () => console.log('Click No')
                }
            ]
        });
        
        this.setState({loading: true});
        event.preventDefault();
    }
    render() {
        const { loading, clientRases } = this.state;
        const { SearchBar } = Search;

        const actionButton = (cell, row) => {
            return (
                <div>
                    <a className="btn btn-success btn-sm" href={'/customerdashboard/client-ras/edit/'+row.id +'?action=edit'}><i className="fa fa-edit"></i></a>&nbsp;&nbsp;&nbsp;
                    <a className="btn btn-success btn-sm" href={'/customerdashboard/client-ras/duplicate/'+row.id+'?action=duplicate'}><i className="fa fa-clone"></i></a>
                &nbsp;&nbsp;&nbsp;<a className="btn btn-danger btn-sm" onClick={(e) => this.removeClientRasDetails(e, row)}><i className="fa fa-trash"></i></a>
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
            }, 
            { dataField: 'ra_number', text: 'Ra Number' }, 
            { dataField: 'dme_number', text: 'DME Number'}, 
            { dataField: 'name_first', text: 'First Name'}, 
            { dataField: 'name_surname', text: 'SurName'}, 
            { dataField: 'phone_mobile', text: 'Mobile Phone'}, 
            { dataField: 'address1', text: 'Address1'}, 
            { dataField: 'address2', text: 'Address2'}, 
            { dataField: 'suburb', text: 'Suburb'}, 
            { dataField: 'postal_code', text: 'Postal Code'}, 
            { dataField: 'state', text: 'State'}, 
            { dataField: 'country', text: 'Country'}, 
            { dataField: 'item_model_num', text: 'Item Model Num'}, 
            { dataField: 'description', text: 'Description'}, 
            { dataField: 'serial_number', text: 'Serial number'}, 
            { dataField: 'product_in_box', text: 'Product In Box'}, 
            {
                dataField: 'button',
                text: 'Actions',
                formatter: actionButton
            }
        ];

        return (
            <div className="pricing-only">
                <div className="pageheader">
                    <h1>Return Authorization</h1>
                    <div className="breadcrumb-wrapper hidden-xs">
                        <span className="label">You are here:</span>
                        <ol className="breadcrumb">
                            <li><a href="/customerdashboard">Home</a>
                            </li>
                            <li className="active">Return Authorization</li>
                        </ol>
                    </div>
                </div>
                <section id="main-content" className="animated fadeInUp">
                    <LoadingOverlay
                        active={loading}
                        spinner
                        text='Loading...'
                    />
                    <div className="row">
                        <div className="col-md-12">
                            <div className="panel panel-default">
                                <div className="panel-heading">
                                    <h3 className="panel-title">Return Authorization</h3>
                                    <div className="actions pull-right">
                                        <a className="btn btn-success" href="/customerdashboard/client-ras/add?action=add">Add New</a>
                                    </div>
                                </div>
                                <div className="panel-body">
                                    <ToolkitProvider
                                        id="sql_queries"
                                        keyField="id"
                                        data={clientRases}
                                        columns={tableColumns}
                                        bootstrap4={true}
                                        search
                                    >
                                        {
                                            props => (
                                                <div>
                                                    <SearchBar {...props.searchProps} />
                                                    <hr />
                                                    <BootstrapTable id="sql_queries"
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
        clientRases: state.clientRas.clientRases,
        urlAdminHome: state.url.urlAdminHome,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        getAllClientRas: () => dispatch(getAllClientRas()),
        deleteClientRas: (data) => dispatch(deleteClientRas(data)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ClientRas));

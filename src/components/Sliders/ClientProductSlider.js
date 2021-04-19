import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import DropzoneComponent from 'react-dropzone-component';
import PropTypes from 'prop-types';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import LoadingOverlay from 'react-loading-overlay';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import BootstrapTable from 'react-bootstrap-table-next';
import CustomPagination from '../Pagination/CustomPagination';
import { Button } from 'reactstrap';
import cellEditFactory, {Type} from 'react-bootstrap-table2-editor';
import Modal from '../CommonModals/ConfirmModal';
import { verifyToken, cleanRedirectState } from '../../state/services/authService';
import { successGetDMEClientProducts } from '../../state/actions/extraActions';
import { API_HOST, HTTP_PROTOCOL } from '../../config';
import { LIST, EDIT, IMPORT } from '../../commons/constants';

class ClientProductSlider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rowIdSelectd: '',
            modalOpen: false,
            uploadResult: '',
            uploaded: false,
            pageItemCnt: 20,
            pageInd: 0,
            pageCnt: 0,
            mode: LIST,
            updatedProductIds: [],
            clientProductsFormInputs: {
                parent_model_number: '',
                child_model_number: '',
                description: '',
                e_dimUOM: 'cm',
                e_dimLength: 0,
                e_dimWidth: 0,
                e_dimHeight: 0,
                e_weightUOM: 'kg',
                e_weightPerEach: 0,
            },
        };

        this.djsConfig = {
            addRemoveLinks: true,
            autoProcessQueue: false,
            parallelUploads: 10,
            timeout: 360000,
        };

        this.componentConfig = {
            iconFiletypes: ['.xlsx'],
            showFiletypeIcon: true,
            postUrl: HTTP_PROTOCOL + '://' + API_HOST + '/upload/',
        };

        this.dropzone = null;
    }

    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.bool.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
        setClientProducts: PropTypes.func.isRequired,
        urlAdminHome: PropTypes.string.isRequired,
        isOpen: PropTypes.bool.isRequired,
        toggleSlider: PropTypes.func.isRequired,
        onClickDelete: PropTypes.func.isRequired,
        onClickSubmit: PropTypes.func.isRequired,
        onClickEdit: PropTypes.func.isRequired,
        clientProducts: PropTypes.array.isRequired,
        isLoading: PropTypes.bool.isRequired,
        dmeClient: PropTypes.object.isRequired,
    };

    componentDidMount() {
        const token = localStorage.getItem('token');

        if (token && token.length > 0) {
            this.props.verifyToken();
        } else {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/admin/');
        }
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { redirect, clientProducts } = newProps;
        const currentRoute = this.props.location.pathname;
        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/admin');
        }

        if (clientProducts) {
            console.log('clientProducts', clientProducts);
            this.setState({ clientProducts });
            if (clientProducts.length > this.props.clientProducts.length) {
                const { updatedProductIds } = this.state;
                updatedProductIds.push(clientProducts[clientProducts.length - 1].id);
                this.setState({updatedProductIds});
            }
            this.setState({ loading: false });
        }
    }

    handleUploadSuccess(file) {
        let data = JSON.parse(file.xhr.responseText);
        this.props.setClientProducts(data.created_products);
        let msg = [
            <h3 key='1' style={{color: 'red'}}>
                Errors
            </h3>
        ];
        if (data.import_status.failure_rows.empty_field_error.length) {
            msg.push(
                <div key='2'>
                    <h4 style={{ color: 'red'}}>- These fields should not be empty: parent_model_number, child_model_number, description, qty.</h4>
                    <div style={{color: 'black', marginLeft: 10, display: 'flex', marginBottom: 10}}>
                        <p style={{margin: 0}}>row numbers:&nbsp;</p>
                        <p style={{margin: 0}}>{data.import_status.failure_rows.empty_field_error.join(', ')}</p>
                    </div>
                </div>
            );
        }
        if (data.import_status.failure_rows.wrong_type_error.length) {
            msg.push(
                <div key='3'>
                    <h4 style={{color: 'red'}}>- There are some rows with wrong type fields.</h4>
                    <div style={{marginLeft: 10}}>
                        <p style={{margin: 0}}><b>Positive Integer: qty</b></p>
                        <p style={{margin: 0}}><b>Float: e_dimLength, e_dimWidth, e_dimHeight, e_weightPerEach</b></p>
                        <p style={{margin: 0}}><b>String: rest</b></p>
                        <div style={{color: 'black', display: 'flex'}}>
                            <p style={{width: 96, minWidth: 96, margin: 0}}>row numbers: </p>
                            <p style={{margin: 0}}>{data.import_status.failure_rows.wrong_type_error.join(', ')}</p>
                        </div>
                    </div>
                </div>
            );
        } 
        if (!data.import_status.failure_count) {
            msg = [<h3 key='1' style={{color: 'green'}}>Client products imported successfully!</h3>];
        }
        this.setState({
            uploadedFileName: data.file_name,
            uploaded: true,
            uploadResult: msg
        });
    }

    handlePost(e) {
        e.preventDefault();
        this.setState({uploadResult: ''});
        this.dropzone.processQueue();
    }

    handleFileSending(data, xhr, formData) {
        const { dmeClient } = this.props;
        formData.append('uploadOption', 'client-products');
        formData.append('clientId', dmeClient.pk_id_dme_client);
    }

    handleClickPagination = (e) => {
        this.setState({ isLoading: true });
        const pageInd = parseInt(e);
        this.setState({ pageInd });
    }

    onClickDelete = (id) => {
        this.setState({
            rowIdSelectd: id,
            modalOpen: true
        });
    }

    onDeleteOk = () => {
        this.props.onClickDelete(this.state.rowIdSelectd);
        this.setState({modalOpen: false});
    };

    onCancel() {
        this.setState({mode: LIST});
    }

    onClickNew() {
        this.setState({
            mode: EDIT,
            clientProductsFormInputs: {
                parent_model_number: '',
                child_model_number: '',
                description: '',
                e_dimUOM: 'cm',
                e_dimLength: 0,
                e_dimWidth: 0,
                e_dimHeight: 0,
                e_weightUOM: 'kg',
                e_weightPerEach: 0,
            },
        });
    }

    onClickImport() {
        this.setState({mode: IMPORT});
    }

    onAfterSaveCell = async (oldValue, newValue, row, column) => {
        console.log('onAfterSaveCell', oldValue, newValue, row, column);

        if (['e_dimLength', 'e_dimWidth', 'e_dimHeight', 'e_weightPerEach'].indexOf(column.dataField) > -1){
            row[column.dataField] = newValue===''?null:Number(Number(newValue).toFixed(2));
        }
        
        if (oldValue !== newValue) {
            this.setState({clientProductsFormInputs: row});
            await this.props.onClickEdit(row);
    
            const { updatedProductIds } = this.state;
            updatedProductIds.push(row.id);
            this.setState({updatedProductIds: [...new Set(updatedProductIds)]});
        }
    }

    onSubmit() {
        const { clientProductsFormInputs } = this.state;
        const { dmeClient } = this.props;
    
        clientProductsFormInputs['fk_id_dme_client'] = dmeClient.pk_id_dme_client;
        
        clientProductsFormInputs['e_dimLength'] = Number(Number(clientProductsFormInputs['e_dimLength']).toFixed(2));
        clientProductsFormInputs['e_dimWidth'] = Number(Number(clientProductsFormInputs['e_dimWidth']).toFixed(2));
        clientProductsFormInputs['e_dimHeight'] = Number(Number(clientProductsFormInputs['e_dimHeight']).toFixed(2));
        clientProductsFormInputs['e_weightPerEach'] = Number(Number(clientProductsFormInputs['e_weightPerEach']).toFixed(2));
        
        console.log('clientProductsFormInput', clientProductsFormInputs);
        this.props.onClickSubmit(clientProductsFormInputs);
        this.setState({mode: LIST});
    }

    onInputChange(event) {
        const {clientProductsFormInputs} = this.state;
        const target = event.target;
        const value = target.value;
        const name = target.name;

        clientProductsFormInputs[name] = value;
        this.setState({clientProductsFormInputs});
    }


    render() {
        const { pageItemCnt, pageInd, mode, clientProductsFormInputs, updatedProductIds } = this.state;
        const { isOpen, dmeClient, clientProducts } = this.props;
        const { SearchBar } = Search;

        const rowStyle = (row) => (updatedProductIds.includes(row.id) ? {backgroundColor: 'lightgreen'} : {});

        const pageCnt = Math.ceil(clientProducts.length / pageItemCnt);
        const items = clientProducts.slice(pageInd * pageItemCnt, (pageInd + 1) * pageItemCnt);

        const carrierActionButton = (cell, row, enumObject, rowIndex) => {
            console.log(row, rowIndex);
            return (
                <div>
                    <a onClick={() => this.onClickDelete(row.id)} className="btn btn-danger btn-sm" href="javascript:void(0)">
                        Delete
                        {/* <i onClick={() => this.onClickDelete(row.id)} className="fa fa-trash" style={{fontSize:'16px',color:'red'}}>
                        </i> */}
                    </a>
                </div>
            );
        };
        
        const zonesColumns = [
            {
                dataField: 'id',
                text: 'ID',
                style: {
                    backgroundColor: 'lightgray',
                    cursor: 'not-allowed',
                },
            }, {
                dataField: 'parent_model_number',
                text: 'Parent Model Number',
            }, {
                dataField: 'child_model_number',
                text: 'Child Model Number',
            }, {
                dataField: 'description',
                text: 'Description',
            }, {
                dataField: 'e_dimUOM',
                text: 'Dim UOM',
                editor: {
                    type: Type.SELECT,
                    options: [
                        { value: 'mm', label: 'mm' },
                        { value: 'cm', label: 'cm' },
                        { value: 'm', label: 'm' }
                    ]
                }
            }, {
                dataField: 'e_dimLength',
                text: 'L',
                headerStyle: {
                    'white-space': 'nowrap'
                },
            }, {
                dataField: 'e_dimWidth',
                text: 'W',
            }, {
                dataField: 'e_dimHeight',
                text: 'H',
            }, {
                dataField: 'e_weightUOM',
                text: 'Wgt UOM',
                editor: {
                    type: Type.SELECT,
                    options: [
                        { value: 'g', label: 'g' },
                        { value: 'kg', label: 'kg' },
                        { value: 't', label: 't' }
                    ]
                }
            }, {
                dataField: 'e_weightPerEach',
                text: 'Wgt Each',
            }, {
                dataField: 'button',
                text: 'Actions',
                editable:false,
                formatter: carrierActionButton
            }
        ];

        this.djsConfig['headers'] = {'Authorization': 'JWT ' + localStorage.getItem('token')};
        const config = this.componentConfig;
        const djsConfig = this.djsConfig;
        const eventHandlers = {
            init: dz => this.dropzone = dz,
            sending: this.handleFileSending.bind(this),
            success: this.handleUploadSuccess.bind(this),
        };

        return (
            <SlidingPane
                className='client-product-pan'
                isOpen={isOpen}
                title='Client Product Panel'
                subtitle='List View'
                onRequestClose={this.props.toggleSlider}
            >
                <div className="slider-content">
                    {(mode === LIST) ? (<div className="table-view">
                        <h5>
                            {dmeClient.company_name} Products 
                            <span className="pull-right">
                                <button onClick={() => this.onClickImport()} className="btn btn-success">Import</button>
                                <button onClick={() => this.onClickNew()} className="btn btn-success">Add New</button>
                            </span>
                        </h5>
                        <hr />
                        <LoadingOverlay
                            active={this.props.isLoading}
                            spinner
                            text='Loading...'
                        >
                            <ToolkitProvider
                                keyField="id"
                                data={items}
                                columns={zonesColumns}
                                bootstrap4={true}
                                search
                            >
                                {
                                    props => (
                                        <div>
                                            <SearchBar {...props.searchProps} />
                                            <hr />
                                            <BootstrapTable id="zones_table"
                                                {...props.baseProps}
                                                rowStyle={rowStyle}
                                                cellEdit={ cellEditFactory({ mode: 'click', blurToSave:true, afterSaveCell:this.onAfterSaveCell }) }
                                            />
                                        </div>
                                    )
                                }
                            </ToolkitProvider>
                            <div className="tbl-pagination">
                                <label>
                                    Item Count per page:&nbsp;
                                </label>
                                <select value={pageItemCnt} onChange={(e) => { this.setState({ pageItemCnt: e.target.value, pageInd: 0 }); }}>
                                    <option value="20">20</option>
                                    <option value="50">50</option>
                                    <option value="75">75</option>
                                    <option value="100">100</option>
                                </select>
                                <CustomPagination
                                    onClickPagination={(type) => this.handleClickPagination(type)}
                                    pageCnt={pageCnt}
                                    pageInd={pageInd}
                                />
                            </div>
                        </LoadingOverlay>
                    </div>) : mode === EDIT ? (<div className="line-form form-view">
                        <label>
                            <p>Parent Model Number</p>
                            <input
                                className="form-control"
                                type="text"
                                name="parent_model_number"
                                value={clientProductsFormInputs['parent_model_number']}
                                onChange={(e) => this.onInputChange(e)}
                            />
                        </label>
                        <label>
                            <p>Child Model Number</p>
                            <input
                                className="form-control"
                                type="text"
                                name="child_model_number"
                                value={clientProductsFormInputs['child_model_number']}
                                onChange={(e) => this.onInputChange(e)}
                            />
                        </label>
                        <label>
                            <p>Description</p>
                            <input
                                className="form-control"
                                type="text"
                                name="description"
                                value={clientProductsFormInputs['description']}
                                onChange={(e) => this.onInputChange(e)}
                            />
                        </label>
                        <label>
                            <p>Dim UOM</p>
                            <select name="e_dimUOM" className="form-control" id="e_dimUOM" onChange={(e) => this.onInputChange(e)}>
                                <option value='cm'>cm</option>
                            </select>
                        </label>
                        <label>
                            <p>Dim Length</p>
                            <input
                                className="form-control"
                                type="text"
                                name="e_dimLength"
                                value={clientProductsFormInputs['e_dimLength']}
                                onChange={(e) => this.onInputChange(e)}
                            />
                        </label>
                        <label>
                            <p>Dim Width</p>
                            <input
                                className="form-control"
                                type="text"
                                name="e_dimWidth"
                                value={clientProductsFormInputs['e_dimWidth']}
                                onChange={(e) => this.onInputChange(e)}
                            />
                        </label>
                        <label>
                            <p>Dim Height</p>
                            <input
                                className="form-control"
                                type="text"
                                name="e_dimHeight"
                                value={clientProductsFormInputs['e_dimHeight']}
                                onChange={(e) => this.onInputChange(e)}
                            />
                        </label>
                        <label>
                            <p>Weight UOM</p>
                            <select name="e_weightUOM" className="form-control" id="e_weightUOM" onChange={(e) => this.onInputChange(e)}>
                                <option value='kg'>kg</option>
                            </select>
                        </label>
                        <label>
                            <p>Weight Per Each</p>
                            <input
                                className="form-control"
                                type="text"
                                name="e_weightPerEach"
                                value={clientProductsFormInputs['e_weightPerEach']}
                                onChange={(e) => this.onInputChange(e)}
                            />
                        </label>
                        <label>
                            <Button color="primary" onClick={() => this.onSubmit()}>
                                Submit
                            </Button>{' '}
                            <Button color="secondary" onClick={() => this.onCancel()}>Cancel</Button>
                        </label>
                    </div>) : (<div className="client-products">
                        <div className="pageheader">
                            <h1>Upload sheet</h1>
                            <div className="breadcrumb-wrapper hidden-xs">
                                <span className="label">You are here:</span>
                                <ol className="breadcrumb">
                                    <li><a href={this.props.urlAdminHome}>Home</a></li>
                                    <li><a href="/admin/clients">Clients</a></li>
                                </ol>
                            </div>
                        </div>
                        <section id="main-content" className="animated fadeInUp">
                            <div className="panel panel-default">
                                <div className="panel-heading">
                                    <h3 className="panel-title">Import</h3>
                                    <div className="actions pull-right">
                                    </div>
                                </div>
                                <div className="panel-body">
                                    <form onSubmit={(e) => this.handlePost(e)}>
                                        <DropzoneComponent 
                                            config={config}
                                            eventHandlers={eventHandlers}
                                            djsConfig={djsConfig}
                                        />
                                        <button className="btn btn-primary" type="submit">Upload</button>
                                        <button className="btn btn-secondary" type="button" onClick={() => this.onCancel()}>Cancel</button>
                                    </form>
                                    <div>
                                        <br/>
                                        {this.state.uploadResult}
                                        <br/>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>)}
                    <Modal 
                        isOpen={this.state.modalOpen}
                        onOk={() => this.onDeleteOk()}
                        onCancel={() => this.setState({modalOpen: false})}
                        title="Delete Confirmation"
                        text="Are you sure about deleting this product?"
                        okBtnName="Ok"
                    />
                </div>
            </SlidingPane>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        redirect: state.auth.redirect,
        username: state.auth.username,
        clientname: state.auth.clientname,
        urlAdminHome: state.url.urlAdminHome,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        setClientProducts: (data) => dispatch(successGetDMEClientProducts(data))
    };
};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ClientProductSlider));

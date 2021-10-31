import React from 'react';
import PropTypes from 'prop-types';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import LoadingOverlay from 'react-loading-overlay';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import BootstrapTable from 'react-bootstrap-table-next';
import { Button } from 'reactstrap';
import cellEditFactory, {Type} from 'react-bootstrap-table2-editor';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Modal from '../../../../components/CommonModals/ConfirmModal';
import { verifyToken, cleanRedirectState } from '../../../../state/services/authService';
import { getDMEClientProducts, updateClientProduct, createClientProduct, deleteClientProduct } from '../../../../state/services/extraService';

class ClientProduct extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalOpen: false,
            rowIdSelectd: '',
            editMode: 0,
            saveMode: 0, 
            updatedProductIds: [],
            clientProductsFormInputs: {
                parent_model_number: '',
                child_model_number: '',
                qty: 0,
                description: '',
                e_dimUOM: 'CM',
                e_dimLength: 0,
                e_dimWidth: 0,
                e_dimHeight: 0,
                e_weightUOM: 'KG',
                e_weightPerEach: 0,
            },
            clientProducts: [],
            isLoading: false,
        };
    }

    static propTypes = {
        toggleSlider: PropTypes.func.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
        clientProducts: PropTypes.array.isRequired,
        urlAdminHome: PropTypes.string.isRequired,
        verifyToken: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.bool.isRequired,
        getDMEClientProducts: PropTypes.func.isRequired,
        createClientProduct: PropTypes.func.isRequired,
        updateClientProduct: PropTypes.func.isRequired,
        deleteClientProduct: PropTypes.func.isRequired,
        clientPK: PropTypes.string.isRequired
    };

    componentDidMount() {
        const token = localStorage.getItem('token');

        if (token && token.length > 0) {
            this.props.verifyToken();
        } else {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/customerdashboard');
        }

        this.props.getDMEClientProducts();
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { redirect, clientProducts } = newProps;
        const currentRoute = this.props.location.pathname;
        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/customerdashboard');
        }

        if (clientProducts) {
            console.log('clientProducts', clientProducts);
            this.setState({ clientProducts });
            if (this.props.clientProducts.length && clientProducts.length > this.props.clientProducts.length) {
                const { updatedProductIds } = this.state;
                updatedProductIds.push(clientProducts[clientProducts.length - 1].id);
                this.setState({updatedProductIds});
            }
            this.setState({ loading: false });
        }
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

    onCancel() {
        this.setState({editMode: 0, saveMode: 0});
    }

    onClickNew(editMode) {
        this.resetFormInputs();
        this.setState({editMode: editMode, saveMode: 0});
    }

    onAfterSaveCell = async (oldValue, newValue, row, column) => {
        console.log('onAfterSaveCell', oldValue, newValue,row, column);

        if (['e_dimLength', 'e_dimWidth', 'e_dimHeight', 'e_weightPerEach'].indexOf(column.dataField) > -1){
            row[column.dataField] = newValue===''?null:Number(Number(newValue).toFixed(2));
        }

        if (oldValue !== newValue) {
            this.setState({clientProductsFormInputs: row});
            await this.props.updateClientProduct(row);
    
            const { updatedProductIds } = this.state;
            updatedProductIds.push(row.id);
            this.setState({updatedProductIds: [...new Set(updatedProductIds)]});
        }
    }

    onSubmit = async () => {
        const { clientPK } = this.props;
        const { saveMode, clientProductsFormInputs } = this.state;

        clientProductsFormInputs['fk_id_dme_client'] = clientPK;
        clientProductsFormInputs['e_dimLength'] = Number(Number(clientProductsFormInputs['e_dimLength']).toFixed(2));
        clientProductsFormInputs['e_dimWidth'] = Number(Number(clientProductsFormInputs['e_dimWidth']).toFixed(2));
        clientProductsFormInputs['e_dimHeight'] = Number(Number(clientProductsFormInputs['e_dimHeight']).toFixed(2));
        clientProductsFormInputs['e_weightPerEach'] = Number(Number(clientProductsFormInputs['e_weightPerEach']).toFixed(2));
        
        if (saveMode == 0)
            this.props.createClientProduct(clientProductsFormInputs);
        else {
            await this.props.updateClientProduct(clientProductsFormInputs);

            const { updatedProductIds } = this.state;
            updatedProductIds.push(clientProductsFormInputs.id);
            this.setState({updatedProductIds: [...new Set(updatedProductIds)]});
        }

        this.setState({editMode: 0});
    }

    onInputChange(event) {
        const {clientProductsFormInputs} = this.state;
        const target = event.target;
        const value = target.value;
        const name = target.name;

        clientProductsFormInputs[name] = value;
        this.setState({clientProductsFormInputs});
    }

    resetFormInputs = () => {
        const clientProductsFormInputs = {
            parent_model_number: '',
            child_model_number: '',
            qty: 0,
            description: '',
            e_dimUOM: 'cm',
            e_dimLength: 0,
            e_dimWidth: 0,
            e_dimHeight: 0,
            e_weightUOM: 'kg',
            e_weightPerEach: 0,
        };
        this.setState({clientProductsFormInputs});
    }

    onClickEditButton(clientProductsFormInputs) {
        this.setState({clientProductsFormInputs, editMode: 1, saveMode: 1});
    }

    onDeleteOk = () => {
        this.props.deleteClientProduct(this.state.rowIdSelectd);
        this.setState({modalOpen: false});
    };

    renderClientProducts() {
        const { editMode, clientProductsFormInputs, updatedProductIds, clientProducts } = this.state;
        const { SearchBar } = Search;

        const rowStyle = (row) => (updatedProductIds.includes(row.id) ? {backgroundColor: 'lightgreen'} : {});

        const carrierActionButton = (cell, row) => {
            return (
                <div>
                    <a onClick={() => this.onClickDelete(row.id)} className="btn btn-danger btn-sm" href="javascript:void(0)">Delete</a>
                    <a className="btn btn-info btn-sm" onClick={()=>this.onClickEditButton(row)}>Edit</a>
                </div>
            );
        };

        const productsColumns = [
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
                dataField: 'qty',
                text: 'Quantity',
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
                editable: false,
                formatter: carrierActionButton
            }
        ];

        return (
            <div className="slider-content">
                {(editMode === 0) ?
                    <div className="table-view">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="panel panel-default">
                                    <div className="panel-heading">
                                        <h3 className="panel-title">Client Products</h3>
                                        <div className="actions pull-right">
                                            <button onClick={() => this.onClickNew(1)} className="btn btn-success">Add New</button>
                                        </div>
                                    </div>
                                    <div className="panel-body">
                                        <ToolkitProvider
                                            id="client_products"
                                            keyField="id"
                                            data={clientProducts}
                                            columns={productsColumns}
                                            bootstrap4={true}
                                            search
                                        >
                                            {
                                                props => (
                                                    <div>
                                                        <SearchBar {...props.searchProps} />
                                                        <hr />
                                                        <BootstrapTable id="client_employees"
                                                            {...props.baseProps}
                                                            rowStyle={rowStyle}
                                                            cellEdit={cellEditFactory({ mode: 'click', blurToSave: true, afterSaveCell: this.onAfterSaveCell })}
                                                        />
                                                    </div>
                                                )
                                            }
                                        </ToolkitProvider>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <div className="line-form form-view">
                        <label>
                            <span className="text-left">Parent Model Number</span>
                            <input
                                className="form-control"
                                type="text"
                                name="parent_model_number"
                                value={clientProductsFormInputs['parent_model_number']}
                                onChange={(e) => this.onInputChange(e)}
                            />
                        </label><br />
                        <label>
                            <span className="text-left">Child Model Number</span>
                            <input
                                className="form-control"
                                type="text"
                                name="child_model_number"
                                value={clientProductsFormInputs['child_model_number']}
                                onChange={(e) => this.onInputChange(e)}
                            />
                        </label><br />
                        <label>
                            <span className="text-left">Description</span>
                            <input
                                className="form-control"
                                type="text"
                                name="description"
                                value={clientProductsFormInputs['description']}
                                onChange={(e) => this.onInputChange(e)}
                            />
                        </label><br />
                        <label>
                            <span className="text-left">Quantity</span>
                            <input
                                className="form-control"
                                type="text"
                                name="qty"
                                value={clientProductsFormInputs['qty']}
                                onChange={(e) => this.onInputChange(e)}
                            />
                        </label><br />
                        <label>
                            <span className="text-left">Dim UOM</span>
                            <select name="e_dimUOM" className="form-control" id="e_dimUOM" value={clientProductsFormInputs['e_dimUOM']} onChange={(e) => this.onInputChange(e)}>
                                <option value="mm">MM</option>
                                <option value="cm">CM</option>
                                <option value="m">METER</option>
                            </select>
                        </label><br />
                        <label>
                            <span className="text-left">Dim Length</span>
                            <input
                                className="form-control"
                                type="text"
                                name="e_dimLength"
                                value={clientProductsFormInputs['e_dimLength']}
                                onChange={(e) => this.onInputChange(e)}
                            />
                        </label><br />
                        <label>
                            <span className="text-left">Dim Width</span>
                            <input
                                className="form-control"
                                type="text"
                                name="e_dimWidth"
                                value={clientProductsFormInputs['e_dimWidth']}
                                onChange={(e) => this.onInputChange(e)}
                            />
                        </label><br />
                        <label>
                            <span className="text-left">Dim Height</span>
                            <input
                                className="form-control"
                                type="text"
                                name="e_dimHeight"
                                value={clientProductsFormInputs['e_dimHeight']}
                                onChange={(e) => this.onInputChange(e)}
                            />
                        </label><br />
                        <label>
                            <span className="text-left">Weight UOM</span>
                            <select name="e_weightUOM" className="form-control" id="e_weightUOM" value={clientProductsFormInputs['e_weightUOM']} onChange={(e) => this.onInputChange(e)}>
                                <option value="g">Gram</option>
                                <option value="kg">Kilogram</option>
                                <option value="t">Ton</option>
                            </select>
                        </label><br />
                        <label>
                            <span className="text-left">Weight Per Each</span>
                            <input
                                className="form-control"
                                type="text"
                                name="e_weightPerEach"
                                value={clientProductsFormInputs['e_weightPerEach']}
                                onChange={(e) => this.onInputChange(e)}
                            />
                        </label><br />
                        <label>
                            <Button color="primary" onClick={() => this.onSubmit()}>Save</Button>{' '}
                            <Button color="secondary" onClick={() => this.onCancel()}>Cancel</Button>
                        </label>
                    </div>
                }
            </div>
        );
    }

    render() {       
        const { isLoading } = this.state;
        
        return (
            <div>
                <div className="pageheader">
                    <h1>Client Products</h1>
                    <div className="breadcrumb-wrapper hidden-xs">
                        <span className="label">You are here:</span>
                        <ol className="breadcrumb">
                            <li><a href={this.props.urlAdminHome}>Home</a></li>
                            <li className="active">Client Products</li>
                        </ol>
                    </div>
                </div>
                <section id="main-content" className="container animated fadeInUp">
                    {isLoading ?
                        (<LoadingOverlay active={isLoading} spinner text='Loading...' />)
                        :
                        this.renderClientProducts()
                    }
                </section>
                <Modal 
                    isOpen={this.state.modalOpen}
                    onOk={() => this.onDeleteOk()}
                    onCancel={() => this.setState({modalOpen: false})}
                    title="Delete Confirmation"
                    text="Are you sure about deleting this product?"
                    okBtnName="Ok"
                />
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        redirect: state.auth.redirect,
        username: state.auth.username,
        clientPK: state.auth.clientPK,
        needUpdateFpDetails: state.fp.needUpdateFpDetails,
        urlAdminHome: state.url.urlAdminHome,
        clientProducts: state.extra.clientProducts,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        getDMEClientProducts: () => dispatch(getDMEClientProducts()),
        deleteClientProduct: (id) => dispatch(deleteClientProduct(id)),
        createClientProduct: (clientProduct) => dispatch(createClientProduct(clientProduct)),
        updateClientProduct: (clientProduct) => dispatch(updateClientProduct(clientProduct)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ClientProduct));

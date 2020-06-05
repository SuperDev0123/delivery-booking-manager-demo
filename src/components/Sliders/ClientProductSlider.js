import React from 'react';
import PropTypes from 'prop-types';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import LoadingOverlay from 'react-loading-overlay';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import BootstrapTable from 'react-bootstrap-table-next';
import CustomPagination from '../Pagination/CustomPagination';
import { Button } from 'reactstrap';

class ClientProductSlider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pageItemCnt: 20,
            pageInd: 0,
            pageCnt: 0,
            editMode: 0,
            clientProductsFormInputs: {
                modelNumber: '',
                e_dimUOM: 'cm',
                e_dimLength: 0,
                e_dimWidth: 0,
                e_dimHeight: 0,
                e_weightUOM: 'kg',
                e_weightPerEach: 0,
            },
        };
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleSlider: PropTypes.func.isRequired,
        onClickDelete: PropTypes.func.isRequired,
        onClickSubmit: PropTypes.func.isRequired,
        clientProducts: PropTypes.array.isRequired,
        isLoading: PropTypes.bool.isRequired,
        dmeClient: PropTypes.object.isRequired,
    };

    handleClickPagination = (e) => {
        this.setState({ isLoading: true });
        const pageInd = parseInt(e);
        this.setState({ pageInd });
    }

    onClickDelete = (id) => {
        this.props.onClickDelete(id);
    }

    onCancel() {
        this.setState({editMode: 0});
    }

    onClickNew(editMode) {
        this.setState({editMode: editMode});
    }

    onSubmit() {
        const { clientProductsFormInputs } = this.state;
        const { dmeClient } = this.props;
    
        clientProductsFormInputs['fk_id_dme_client_id'] = dmeClient.pk_id_dme_client;

        this.props.onClickSubmit(clientProductsFormInputs);
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


    render() {
        const { pageItemCnt, pageInd, editMode, clientProductsFormInputs } = this.state;
        const { isOpen, dmeClient, clientProducts } = this.props;
        const { SearchBar } = Search;

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
                dataField: 'modelNumber',
                text: 'Model Number',
            }, {
                dataField: 'e_dimUOM',
                text: 'Dim UOM',
            }, {
                dataField: 'e_dimLength',
                text: 'L',
            }, {
                dataField: 'e_dimWidth',
                text: 'W',
            }, {
                dataField: 'e_dimHeight',
                text: 'H',
            }, {
                dataField: 'e_weightUOM',
                text: 'Wgt UOM',
            }, {
                dataField: 'e_weightPerEach',
                text: 'Wgt Each',
            }, {
                dataField: 'button',
                text: 'Actions',
                formatter: carrierActionButton
            }
        ];

        return (
            <SlidingPane
                className='fp-pricing-pan'
                isOpen={isOpen}
                title='Freight Provider Pricing Panel'
                subtitle='List View'
                onRequestClose={this.props.toggleSlider}
            >
                <div className="slider-content">
                    {(editMode === 0) ? (<div className="table-view">
                        <h5>{dmeClient.company_name} Products <span className="pull-right"><button onClick={() => this.onClickNew(1)} className="btn btn-success">Add New</button></span></h5>
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
                    </div>) : (<div className="line-form form-view">
                        <label>
                            <p>Model Number</p>
                            <input
                                className="form-control"
                                type="text"
                                name="modelNumber"
                                value={clientProductsFormInputs['modelNumber']}
                                onChange={(e) => this.onInputChange(e)}
                            />
                        </label>
                        <label>
                            <p>Dim UOM</p>
                            <input
                                className="form-control"
                                type="text"
                                name="e_dimUOM"
                                value={clientProductsFormInputs['e_dimUOM']}
                                onChange={(e) => this.onInputChange(e)}
                            />
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
                            <input
                                className="form-control"
                                type="text"
                                name="e_weightUOM"
                                value={clientProductsFormInputs['e_weightUOM']}
                                onChange={(e) => this.onInputChange(e)}
                            />
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
                    </div>)}
                </div>
            </SlidingPane>
        );
    }
}

export default ClientProductSlider;

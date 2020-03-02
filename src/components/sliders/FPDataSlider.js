import React from 'react';
import PropTypes from 'prop-types';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import BootstrapTable from 'react-bootstrap-table-next';
import LoadingOverlay from 'react-loading-overlay';
import cellEditFactory from 'react-bootstrap-table2-editor';
import { Button } from 'reactstrap';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
import CustomPagination from '../pagination/CustomPagination';

class FPDataSlider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editMode: 0, // 0: no create, 1: create, 2: update
            loading: false,
            selected: [],
            currentLine: null,
            pageItemCnt: 10,
            pageInd: 0,
            pageCnt: 0,
            carrierFormInputs: {
                fk_fp: 0,
                carrier: '',
                connote_start_value: '',
                connote_end_value: '',
                current_value: '',
                label_end_value: '',
                label_start_value: '',
               
            },
            zoneFormInputs:{
                fk_fp: 0,
                suburb: '',
                state: '',
                postal_code: '',
                zone: '',
                carrier: '',
                service: '',
                sender_code: ''
            }
        };
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleShowFPDataSlider: PropTypes.func.isRequired,
        setGetZonesFilter: PropTypes.func.isRequired,
        createFpCarrier: PropTypes.func.isRequired,
        updateFpCarrier: PropTypes.func.isRequired,
        createFpZone: PropTypes.func.isRequired,
        updateFpZone: PropTypes.func.isRequired,
        onClickDelete: PropTypes.func.isRequired,
        calcCollected: PropTypes.func.isRequired,
        handlePageItemCntChange: PropTypes.func.isRequired,
        handleClickPagination: PropTypes.func.isRequired,
        fpCarriers: PropTypes.object.isRequired,
        fpZones: PropTypes.object.isRequired,
        fpDetails: PropTypes.object.isRequired,
        clientname: PropTypes.object.isRequired,
        loading: PropTypes.bool.isRequired,
        pageCnt: PropTypes.number.isRequired,
        pageInd: PropTypes.number.isRequired,
        
    };

    onClickNew(editMode, typeNum) {
        this.setState({editMode: editMode, lineOrLineDetail: typeNum});
    }

    onClickEdit(editMode, typeNum, index) {
        const {fpCarriers, fpZones} = this.props;

        if (typeNum === 1) {
            this.setState({editMode: editMode, lineOrLineDetail: typeNum, carrierFormInputs: fpCarriers.filter(word => word.id == index)[0]});
        } else if (typeNum === 2) {
            this.setState({editMode: editMode, lineOrLineDetail: typeNum, zoneFormInputs: fpZones.filter(word => word.id == index)[0]});
        }
    }

    onInputChange(event) {
        const {lineOrLineDetail} = this.state;
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        if (lineOrLineDetail === 1) {
            let carrierFormInputs = this.state.carrierFormInputs;
            carrierFormInputs[name] = value;
            this.setState({carrierFormInputs});
        } else if (lineOrLineDetail === 2) {
            let zoneFormInputs = this.state.zoneFormInputs;
            zoneFormInputs[name] = value;
            this.setState({zoneFormInputs});
        }
    }

    onSubmit() {
        const {editMode, lineOrLineDetail, carrierFormInputs, zoneFormInputs } = this.state;
        const { fpDetails } = this.props;

        if (editMode === 1) {
            if (lineOrLineDetail === 1) {
                carrierFormInputs['fk_fp'] = fpDetails.id;
                this.props.createFpCarrier(carrierFormInputs);
            } else if (lineOrLineDetail === 2) {
                zoneFormInputs['fk_fp'] = fpDetails.id;
                this.props.createFpZone(zoneFormInputs);
            }
        } else if (editMode === 2) {
            if (lineOrLineDetail === 1) {
                this.props.updateFpCarrier(carrierFormInputs);
            } else if (lineOrLineDetail === 2) {
                this.props.updateFpZone(zoneFormInputs);
            }
        }

        this.setState({editMode: 0, carrierFormInputs: {}, zoneFormInputs: {}});
    }

    onCancel() {
        this.setState({editMode: 0});
    }

    onClickDelete(typeNum, data) {
        if (typeNum === 0) {
            this.setState({selectedLineIndex: -1});
        }

        this.props.onClickDelete(typeNum, data);
    }

    handleBtnClick = (type) => {
        this.props.calcCollected(this.state.selected, type);
        this.setState({selected: []});
    }

    handleOnSelect = (row, isSelect) => {
        if (isSelect) {
            this.setState(() => ({
                selected: [...this.state.selected, row.pk_lines_id]
            }));
        } else {
            this.setState(() => ({
                selected: this.state.selected.filter(x => x !== row.pk_lines_id)
            }));
        }
    }

    handleOnSelectAll = (isSelect, rows) => {
        const ids = rows.map(r => r.pk_lines_id);
        if (isSelect) {
            this.setState(() => ({
                selected: ids
            }));
        } else {
            this.setState(() => ({
                selected: []
            }));
        }
    }

    render() {
        const { isOpen, toggleShowFPDataSlider, clientname, fpDetails, fpCarriers, fpZones, loading, pageCnt, pageInd } = this.props;

        const { selected, editMode, lineOrLineDetail, carrierFormInputs, zoneFormInputs } = this.state;

        const { SearchBar } = Search;

        const selectRow = {
            mode: 'checkbox',
            clickToSelect: true,
            clickToEdit: true,
            selected: selected,
            onSelect: this.handleOnSelect,
            onSelectAll: this.handleOnSelectAll,
        };

        const editableStyle = (cell, row) => {
            //console.log('cell - ', cell, clientname);
            if (row.is_scanned && clientname !== 'dme') {
                return {
                    backgroundColor: 'lightgray',
                    cursor: 'not-allowed',
                };
            } else {
                return {
                    backgroundColor: 'white',
                    cursor: 'default',
                };
            }
        };

        // const qtyEditableStyle = (cell, row) => {
        //     if ((row.is_scanned || isBooked) && clientname !== 'dme') {
        //         return {
        //             backgroundColor: 'lightgray',
        //             cursor: 'not-allowed',
        //         };
        //     } else {
        //         return {
        //             backgroundColor: 'white',
        //             cursor: 'default',
        //         };
        //     }
        // };

        // const isEditable = (cell, row) => {
        //     if (row.is_scanned && clientname !== 'dme') {
        //         return false;
        //     } else {
        //         return true;
        //     }
        // };

        const onClickRowSelected = (cell, row, rowIndex) => {console.log(row);
            console.log('Product #', rowIndex);
        };

        const carrierActionButton = (cell, row, enumObject, rowIndex) => {console.log(row, rowIndex);
            return (
                <div>
                    <i onClick={() => this.onClickEdit(2, 1, row.id)} className="fa fa-edit" style={{fontSize:'24px',color:'green'}}></i>
                &nbsp;&nbsp;&nbsp;<i onClick={() => this.onClickDelete(0, {id: row.id})} className="fa fa-trash" style={{fontSize:'24px',color:'red'}}></i>
                </div>
            );
        };

        const zoneActionButton = (cell, row, enumObject, rowIndex) => {console.log(cell);
            return (
                <div>
                    <i onClick={() => onClickRowSelected(cell, row, rowIndex)} className="fa fa-edit" style={{fontSize:'24px',color:'green'}}></i>
                &nbsp;&nbsp;&nbsp;<i className="fa fa-trash" style={{fontSize:'24px',color:'red'}}></i>
                </div>
            );
        };

        const carriersColumns = [
            {
                dataField: 'id',
                text: 'ID',
                editable: false,
                style: {
                    backgroundColor: 'lightgray',
                    cursor: 'not-allowed',
                },
            }, {
                dataField: 'carrier',
                text: 'Carrier',
                editable: true,
                style: editableStyle,
            }, {
                dataField: 'connote_start_value',
                text: 'Cannote Start Value',
                editable: true,
                style: editableStyle,
            }, {
                dataField: 'connote_end_value',
                text: 'Cannote End Value',
                editable: true,
                style: editableStyle,
            }, {
                dataField: 'current_value',
                text: 'Current Value',
                editable: true,
                style: editableStyle
            }, {
                dataField: 'label_start_value',
                text: 'Label Start Value',
                editable: true,
                style: editableStyle
            }, {
                dataField: 'label_end_value',
                text: 'Label End Value',
                editable: true,
                style: editableStyle
            }, {
                dataField: 'button',
                text: 'Actions',
                formatter: carrierActionButton
            }
        ];

        const zonesColumns = [
            {
                dataField: 'id',
                text: 'ID',
                style: {
                    backgroundColor: 'lightgray',
                    cursor: 'not-allowed',
                },
            }, {
                dataField: 'suburb',
                text: 'Suburb',
            }, {
                dataField: 'state',
                text: 'State',
            }, {
                dataField: 'postal_code',
                text: 'Postal Code',
            }, {
                dataField: 'zone',
                text: 'Zone',
            }, {
                dataField: 'carrier',
                text: 'Carrier',
            }, {
                dataField: 'service',
                text: 'Service',
            }, {
                dataField: 'sender_code',
                text: 'Sender Code',
            }, {
                dataField: 'button',
                text: 'Actions',
                formatter: zoneActionButton
            }
        ];

        return (
            <SlidingPane
                className='lt-slider'
                overlayClassName='lt-slider-overlay'
                isOpen={isOpen}
                title={'Freight Provider '+fpDetails.fp_company_name}
                subtitle='Table view'
                onRequestClose={toggleShowFPDataSlider}>
                <div className="slider-content">
                    {(editMode === 0) ?(
                        <div className="table-view">
                            <h1>Freight Provider Carriers<span className="pull-right"><button onClick={() => this.onClickNew(1, 1)} className="btn btn-success">Add New</button></span></h1>
                            <hr />
                            <ToolkitProvider
                                id="carrier_table"
                                keyField="id"
                                data={ fpCarriers }
                                columns={ carriersColumns }
                                cellEdit={ 
                                    cellEditFactory({ 
                                        mode: 'click',
                                        blurToSave: true,
                                        afterSaveCell: (oldValue, newValue, row, column) => this.onClickEdit(oldValue, newValue, row, column)
                                    })
                                }
                    
                                bootstrap4={ true }
                                search
                            >
                                {
                                    props => (
                                        <div>
                                            <SearchBar { ...props.searchProps } />
                                            <hr />
                                            <BootstrapTable id="carriers_table" selectRow={ selectRow }
                                                { ...props.baseProps }
                                            />
                                        </div>
                                    )
                                }
                            </ToolkitProvider>
                
                            <h1>Freight Provider Zones<span className="pull-right"><button onClick={() => this.onClickNew(1, 2)} className="btn btn-success">Add New</button></span></h1>
                            <hr />
                            <LoadingOverlay
                                active={loading}
                                spinner
                                text='Loading...'
                            >
                                <ToolkitProvider
                                    keyField="id"
                                    data={ fpZones }
                                    columns={ zonesColumns }
                                    cellEdit={ 
                                        cellEditFactory({ 
                                            mode: 'click',
                                            blurToSave: true,
                                            afterSaveCell: (oldValue, newValue, row, column) => this.onClickEdit(oldValue, newValue, row, column)
                                        })
                                    }
                                    bootstrap4={ true }
                                    search
                                >
                                    {
                                        props => (
                                            <div>
                                                <SearchBar { ...props.searchProps } />
                                                <hr />
                                                <BootstrapTable id="zones_table" selectRow={ selectRow }
                                                    { ...props.baseProps }
                                                />
                                            </div>
                                        )
                                    }
                                </ToolkitProvider>
                                <div className="tbl-pagination">
                                    <label>
                            Item Count per page:&nbsp;
                                    </label>
                                    <select value={this.state.pageItemCnt} onChange={(e) => {this.props.handlePageItemCntChange(e);this.setState({ pageItemCnt: e.target.value });}}>
                                        <option value="10">10</option>
                                        <option value="20">20</option>
                                        <option value="50">50</option>
                                    </select>
                                    <CustomPagination 
                                        onClickPagination={(type) => {this.setState({loading: true});this.props.handleClickPagination(type);}}
                                        pageCnt={pageCnt}
                                        pageInd={pageInd}
                                    />
                                </div>
                            </LoadingOverlay>
                        </div>
                    ):(
                        <div className="form-view">
                            <h2>{(editMode === 1) ? 'Create' : 'Update'} a {(lineOrLineDetail === 1) ?'Carrier':'Zone'}</h2>
                            {
                                (lineOrLineDetail === 1) ? (
                                    <div className="line-form">
                                        <label>
                                            <p>Carrier</p>
                                            <input 
                                                className="form-control" 
                                                type="text" 
                                                name="carrier" 
                                                value={carrierFormInputs['carrier']} 
                                                onChange={(e) => this.onInputChange(e)}
                                            />
                                        </label>
                                        <label>
                                            <p>Cannote Start Value</p>
                                            <input 
                                                className="form-control" 
                                                type="text" 
                                                name="connote_start_value" 
                                                value={carrierFormInputs['connote_start_value']} 
                                                onChange={(e) => this.onInputChange(e)}
                                            />
                                        </label>
                                        <label>
                                            <p>Connote End Value</p>
                                            <input 
                                                className="form-control" 
                                                type="text" 
                                                name="connote_end_value" 
                                                value={carrierFormInputs['connote_end_value']} 
                                                onChange={(e) => this.onInputChange(e)}
                                            />
                                        </label>
                                        <label>
                                            <p>Current Value</p>
                                            <input 
                                                className="form-control" 
                                                type="text" 
                                                name="current_value" 
                                                value={carrierFormInputs['current_value']} 
                                                onChange={(e) => this.onInputChange(e)}
                                            />
                                        </label>
                                        <label>
                                            <p>Label Start Value</p>
                                            <input 
                                                className="form-control" 
                                                type="text"
                                                name="label_start_value" 
                                                value={carrierFormInputs['label_start_value']} 
                                                onChange={(e) => this.onInputChange(e)}
                                            />
                                        </label>
                                        <label>
                                            <p>Label End Value</p>
                                            <input 
                                                className="form-control" 
                                                type="text" 
                                                name="label_end_value" 
                                                value={carrierFormInputs['label_end_value']} 
                                                onChange={(e) => this.onInputChange(e)}
                                            />
                                        </label>
                                        <label>
                                            <Button color="primary" onClick={() => this.onSubmit()}>
                                                {
                                                    (editMode === 1) ? 'Submit' : 'Update'
                                                }
                                            </Button>{' '}
                                            <Button color="secondary" onClick={() => this.onCancel()}>Cancel</Button>
                                        </label>
                                    </div>
                                ):(
                                    <div className="line-form">
                                        <label>
                                            <p>Suburb</p>
                                            <input 
                                                className="form-control" 
                                                type="text" 
                                                name="suburb" 
                                                value={zoneFormInputs['suburb']} 
                                                onChange={(e) => this.onInputChange(e)}
                                            />
                                        </label>
                                        <label>
                                            <p>State</p>
                                            <input 
                                                className="form-control" 
                                                type="text" 
                                                name="state" 
                                                value={zoneFormInputs['state']} 
                                                onChange={(e) => this.onInputChange(e)}
                                            />
                                        </label>
                                        <label>
                                            <p>Postal Code</p>
                                            <input 
                                                className="form-control" 
                                                type="text" 
                                                name="postal_code" 
                                                value={zoneFormInputs['postal_code']} 
                                                onChange={(e) => this.onInputChange(e)}
                                            />
                                        </label>
                                        <label>
                                            <p>Zone</p>
                                            <input 
                                                className="form-control" 
                                                type="text" 
                                                name="zone" 
                                                value={zoneFormInputs['zone']} 
                                                onChange={(e) => this.onInputChange(e)}
                                            />
                                        </label>
                                        <label>
                                            <p>Carrier</p>
                                            <input 
                                                className="form-control" 
                                                type="text"
                                                name="carrier" 
                                                value={zoneFormInputs['carrier']} 
                                                onChange={(e) => this.onInputChange(e)}
                                            />
                                        </label>
                                        <label>
                                            <p>Service</p>
                                            <input 
                                                className="form-control" 
                                                type="text" 
                                                name="service" 
                                                value={zoneFormInputs['service']} 
                                                onChange={(e) => this.onInputChange(e)}
                                            />
                                        </label>
                                        <label>
                                            <p>Sender Code</p>
                                            <input 
                                                className="form-control" 
                                                type="text" 
                                                name="sender_code" 
                                                value={zoneFormInputs['sender_code']} 
                                                onChange={(e) => this.onInputChange(e)}
                                            />
                                        </label>
                                        <label>
                                            <Button color="primary" onClick={() => this.onSubmit()}>
                                                {
                                                    (editMode === 1) ? 'Submit' : 'Update'
                                                }
                                            </Button>{' '}
                                            <Button color="secondary" onClick={() => this.onCancel()}>Cancel</Button>
                                        </label>
                                    </div>
                                )}
                        </div>
                    )}
                    
                </div>
            </SlidingPane>
        );
    }
}

export default FPDataSlider;

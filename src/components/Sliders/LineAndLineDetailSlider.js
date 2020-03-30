import React from 'react';
import PropTypes from 'prop-types';

import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import { Button } from 'reactstrap';
import LoadingOverlay from 'react-loading-overlay';

class LineAndLineDetailSlider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editMode: 0, // 0: no create, 1: create, 2: update
            lineOrLineDetail: 1, // 1: line, 2: lineDetail
            selectedLineIndex: -1,
            lineFormInputs: {
                e_qty: 0,
                e_dimLength: 0,
                e_dimWidth: 0,
                e_dimHeight: 0,
                e_dimUOM: 'CM',
                e_weightUOM: 'Kilogram',
                e_weightPerEach: 0,
            },
            lineDetailFormInputs: {},
        };
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleLineSlider: PropTypes.func.isRequired,
        lines: PropTypes.array.isRequired,
        lineDetails: PropTypes.array.isRequired,
        onClickDuplicate: PropTypes.func.isRequired,
        onClickDelete: PropTypes.func.isRequired,
        loadingBookingLine: PropTypes.bool.isRequired,
        loadingBookingLineDetail: PropTypes.bool.isRequired,
        getCubicMeter: PropTypes.func.isRequired,
        getTotalWeight: PropTypes.func.isRequired,
        booking: PropTypes.object.isRequired,
        createBookingLine: PropTypes.func.isRequired,
        updateBookingLine: PropTypes.func.isRequired,
        createBookingLineDetail: PropTypes.func.isRequired,
        updateBookingLineDetail: PropTypes.func.isRequired,
        packageTypes: PropTypes.array.isRequired,
    };

    onClickShowLine(index) {
        this.setState({selectedLineIndex: index});
    }

    onClickNew(editMode, typeNum) {
        this.setState({editMode: editMode, lineOrLineDetail: typeNum});
    }

    onClickEdit(editMode, typeNum, index) {
        const {lines, lineDetails} = this.props;

        if (typeNum === 1) {
            this.setState({editMode: editMode, lineOrLineDetail: typeNum, lineFormInputs: lines[index]});
        } else if (typeNum === 2) {
            this.setState({editMode: editMode, lineOrLineDetail: typeNum, lineDetailFormInputs: lineDetails[index]});
        }
    }

    onInputChange(event) {
        const {lineOrLineDetail} = this.state;
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        if (lineOrLineDetail === 1) {
            let lineFormInputs = this.state.lineFormInputs;
            lineFormInputs[name] = value;
            lineFormInputs['e_1_Total_dimCubicMeter'] = this.props.getCubicMeter(lineFormInputs);
            lineFormInputs['e_Total_KG_weight'] = this.props.getTotalWeight(lineFormInputs);
            lineFormInputs['total_2_cubic_mass_factor_calc'] = Number.parseFloat(lineFormInputs['e_1_Total_dimCubicMeter']).toFixed(4) * 250;
            lineFormInputs['e_1_Total_dimCubicMeter'] = lineFormInputs['e_1_Total_dimCubicMeter'].toFixed(2);
            lineFormInputs['e_Total_KG_weight'] = lineFormInputs['e_Total_KG_weight'].toFixed(2);
            lineFormInputs['total_2_cubic_mass_factor_calc'] = lineFormInputs['total_2_cubic_mass_factor_calc'].toFixed(2);
            this.setState({lineFormInputs});
        } else if (lineOrLineDetail === 2) {
            let lineDetailFormInputs = this.state.lineDetailFormInputs;
            lineDetailFormInputs[name] = value;
            this.setState({lineDetailFormInputs});
        }
    }

    onSubmit() {
        const {editMode, lineOrLineDetail, lineFormInputs, lineDetailFormInputs, selectedLineIndex} = this.state;
        const {lines} = this.props;

        if (editMode === 1) {
            if (lineOrLineDetail === 1) {
                lineFormInputs['fk_booking_id'] = this.props.booking.pk_booking_id;
                this.props.createBookingLine(lineFormInputs);
            } else if (lineOrLineDetail === 2) {
                lineDetailFormInputs['fk_booking_id'] = this.props.booking.pk_booking_id;
                lineDetailFormInputs['fk_booking_lines_id'] = lines[selectedLineIndex].pk_lines_id;
                this.props.createBookingLineDetail(lineDetailFormInputs);
            }
        } else if (editMode === 2) {
            if (lineOrLineDetail === 1) {
                this.props.updateBookingLine(lineFormInputs);
            } else if (lineOrLineDetail === 2) {
                this.props.updateBookingLineDetail(lineDetailFormInputs);
            }
        }

        this.setState({editMode: 0, lineFormInputs: {}, lineDetailFormInputs: {}});
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

    render() {
        const { isOpen, lines, lineDetails, loadingBookingLine, loadingBookingLineDetail, packageTypes } = this.props;
        const { selectedLineIndex, editMode, lineOrLineDetail, lineFormInputs, lineDetailFormInputs } = this.state;

        const lineList = lines.map((line, index) => {
            line.e_Total_KG_weight = parseFloat(line.e_Total_KG_weight).toFixed(2);
            line.e_1_Total_dimCubicMeter = parseFloat(line.e_1_Total_dimCubicMeter).toFixed(2);
            line.total_2_cubic_mass_factor_calc = parseFloat(line.total_2_cubic_mass_factor_calc).toFixed(2);
            return (
                <tr key={index} className={(index === selectedLineIndex) ? 'current' : ''}>
                    <td>{line.e_type_of_packaging}</td>
                    <td>{line.e_item}</td>
                    <td>{line.e_qty}</td>
                    <td>{line.e_weightUOM}</td>
                    <td>{line.e_weightPerEach}</td>
                    <td>{line.e_Total_KG_weight}</td>
                    <td>{line.e_dimUOM}</td>
                    <td>{line.e_dimLength}</td>
                    <td>{line.e_dimWidth}</td>
                    <td>{line.e_dimHeight}</td>
                    <td>{line.e_1_Total_dimCubicMeter}</td>
                    <td>{line.total_2_cubic_mass_factor_calc}</td>
                    <td className="show" onClick={() => this.onClickShowLine(index)}><Button color="primary">LineDetail</Button></td>
                    <td className="edit"><Button color="primary" onClick={() => this.onClickEdit(2, 1, index)}>Edit</Button></td>
                    <td className="duplicate">
                        <Button color="primary" onClick={() => this.props.onClickDuplicate(0, {pk_lines_id: line.pk_lines_id})}>
                            Duplicate
                        </Button>
                    </td>
                    <td className="delete">
                        <Button color="danger" onClick={() => this.onClickDelete(0, {pk_lines_id: line.pk_lines_id})}>
                            Delete
                        </Button>
                    </td>
                </tr>
            );
        });

        const lineDetailList = lineDetails.map((lineDetail, index) => {
            if (selectedLineIndex > -1 && 
                parseInt(lines[selectedLineIndex].pk_lines_id) === parseInt(lineDetail.fk_booking_lines_id)) {
                return (
                    <tr key={index}>
                        <td>{lineDetail.modelNumber}</td>
                        <td>{lineDetail.itemDescription}</td>
                        <td>{lineDetail.quantity}</td>
                        <td>{lineDetail.clientRefNumber}</td>
                        <td>{lineDetail.gap_ra}</td>
                        <td>${lineDetail.insuranceValueEach}</td>
                        <td>{lineDetail.itemFaultDescription}</td>
                        <td className="edit"><Button color="primary" onClick={() => this.onClickEdit(2, 2, index)}>Edit</Button></td>
                        <td className="duplicate">
                            <Button color="primary" onClick={() => this.props.onClickDuplicate(1, {pk_id_lines_data: lineDetail.pk_id_lines_data})}>
                                Duplicate
                            </Button>
                        </td>
                        <td className="delete">
                            <Button color="danger" onClick={() => this.onClickDelete(1, {pk_id_lines_data: lineDetail.pk_id_lines_data})}>
                                Delete
                            </Button>
                        </td>
                    </tr>
                );
            }
        });

        const packageTypesOptions = packageTypes.map((packageType, key) => {
            return (<option key={key} value={packageType.dmePackageTypeDesc}>{packageType.dmePackageTypeDesc}</option>);
        });

        return (
            <SlidingPane
                className='lld-slider'
                overlayClassName='lld-slider-overlay'
                isOpen={isOpen}
                title='Line And Line Detail Slider'
                subtitle='Table view'
                onRequestClose={this.props.toggleLineSlider}>
                <div className="slider-content">
                    {
                        (editMode === 0) ?
                            <div className="table-view">
                                <LoadingOverlay
                                    active={loadingBookingLine}
                                    spinner
                                    text='Loading...'
                                >
                                    <div className="line-section">
                                        <Button color="primary new-btn" onClick={() => this.onClickNew(1, 1)}>
                                            +
                                        </Button>
                                        <h3>Lines</h3>
                                        <table className="table table-hover table-bordered sortable fixed_headers">
                                            <tr>
                                                <th className="" scope="col" nowrap>
                                                    <p>Packaging</p>
                                                </th>
                                                <th className="" scope="col" nowrap>
                                                    <p>Item Description</p>
                                                </th>
                                                <th className="" scope="col" nowrap>
                                                    <p>Qty</p>
                                                </th>
                                                <th className="" scope="col" nowrap>
                                                    <p>Wgt UOM</p>
                                                </th>
                                                <th className="" scope="col" nowrap>
                                                    <p>Wgt Each</p>
                                                </th>
                                                <th className="" scope="col" nowrap>
                                                    <p>Total Kgs</p>
                                                </th>
                                                <th className="" scope="col" nowrap>
                                                    <p>Dim UOM</p>
                                                </th>
                                                <th className="" scope="col" nowrap>
                                                    <p>Length</p>
                                                </th>
                                                <th className="" scope="col" nowrap>
                                                    <p>Width</p>
                                                </th>
                                                <th className="" scope="col" nowrap>
                                                    <p>Height</p>
                                                </th>
                                                <th className="" scope="col" nowrap>
                                                    <p>Cubic Meter</p>
                                                </th>
                                                <th className="" scope="col" nowrap>
                                                    <p>Cubic KG</p>
                                                </th>
                                                <th className="" scope="col" nowrap>
                                                    <p>Show</p>
                                                </th>
                                                <th className="" scope="col" nowrap>
                                                    <p>Edit</p>
                                                </th>
                                                <th className="" scope="col" nowrap>
                                                    <p>Duplicate</p>
                                                </th>
                                                <th className="" scope="col" nowrap>
                                                    <p>Delete</p>
                                                </th>
                                            </tr>
                                            { lineList }
                                        </table>
                                    </div>
                                </LoadingOverlay>
                                {
                                    (selectedLineIndex > -1) ?
                                        <LoadingOverlay
                                            active={loadingBookingLineDetail}
                                            spinner
                                            text='Loading...'
                                        >
                                            <div className="line-detail-section">
                                                <Button color="primary new-btn" onClick={() => this.onClickNew(1, 2)}>
                                                    +
                                                </Button>
                                                <h3>Line Details</h3>
                                                <table className="table table-hover table-bordered sortable fixed_headers">
                                                    <tr>
                                                        <th className="" scope="col" nowrap>
                                                            <p>Model</p>
                                                        </th>
                                                        <th className="" scope="col" nowrap>
                                                            <p>Item Description</p>
                                                        </th>
                                                        <th className="" scope="col" nowrap>
                                                            <p>Qty</p>
                                                        </th>
                                                        <th className="" scope="col" nowrap>
                                                            <p>Client Reference #</p>
                                                        </th>
                                                        <th className="" scope="col" nowrap>
                                                            <p>Insurance Value</p>
                                                        </th>
                                                        <th className="" scope="col" nowrap>
                                                            <p>Gap / RA</p>
                                                        </th>
                                                        <th className="" scope="col" nowrap>
                                                            <p>Fault Description</p>
                                                        </th>
                                                        <th className="" scope="col" nowrap>
                                                            <p>Edit</p>
                                                        </th>
                                                        <th className="" scope="col" nowrap>
                                                            <p>Duplicate</p>
                                                        </th>
                                                        <th className="" scope="col" nowrap>
                                                            <p>Delete</p>
                                                        </th>
                                                    </tr>
                                                    { lineDetailList }
                                                </table>
                                            </div>
                                        </LoadingOverlay>
                                        :
                                        null
                                }
                            </div>
                            :
                            <div className="form-view">
                                <h2>{(editMode === 1) ? 'Create' : 'Update'} a {(lineOrLineDetail === 1) ? 'Line' : 'LineDetail'}</h2>
                                {
                                    (lineOrLineDetail === 1) ?
                                        <div className="line-form">
                                            <label>
                                                <p>Packaging</p>
                                                <select
                                                    name="e_type_of_packaging" 
                                                    onChange={(e) => this.onInputChange(e)}
                                                    value = {lineFormInputs['e_type_of_packaging']}
                                                >
                                                    {packageTypesOptions}
                                                </select>
                                            </label>
                                            <label>
                                                <p>Item Description</p>
                                                <input 
                                                    className="form-control" 
                                                    type="text" 
                                                    name="e_item" 
                                                    value={lineFormInputs['e_item']} 
                                                    onChange={(e) => this.onInputChange(e)}
                                                />
                                            </label>
                                            <label>
                                                <p>Qty</p>
                                                <input 
                                                    className="form-control" 
                                                    type="text" 
                                                    name="e_qty" 
                                                    value={lineFormInputs['e_qty']} 
                                                    onChange={(e) => this.onInputChange(e)}
                                                />
                                            </label>
                                            <label>
                                                <p>Wgt UOM</p>
                                                <select
                                                    name="e_weightUOM" 
                                                    onChange={(e) => this.onInputChange(e)}
                                                    value = {lineFormInputs['e_weightUOM']} >
                                                    <option value="Gram">Gram</option>
                                                    <option value="Kilogram">Kilogram</option>
                                                    <option value="Ton">Ton</option>
                                                </select>
                                            </label>
                                            <label>
                                                <p>Wgt Each</p>
                                                <input 
                                                    className="form-control" 
                                                    type="text" 
                                                    name="e_weightPerEach" 
                                                    value={lineFormInputs['e_weightPerEach']} 
                                                    onChange={(e) => this.onInputChange(e)}
                                                />
                                            </label>
                                            <label>
                                                <p>Total Kgs</p>
                                                <input 
                                                    className="form-control" 
                                                    type="text" 
                                                    disabled="disabled"
                                                    name="e_Total_KG_weight" 
                                                    value={lineFormInputs['e_Total_KG_weight']} 
                                                />
                                            </label>
                                            <label>
                                                <p>Dim UOM</p>
                                                <select
                                                    name="e_dimUOM" 
                                                    onChange={(e) => this.onInputChange(e)}
                                                    value = {lineFormInputs['e_dimUOM']} >
                                                    <option value="MM">MM</option>
                                                    <option value="CM">CM</option>
                                                    <option value="METER">METER</option>
                                                </select>
                                            </label>
                                            <label>
                                                <p>Length</p>
                                                <input 
                                                    className="form-control" 
                                                    type="text" 
                                                    name="e_dimLength" 
                                                    value={lineFormInputs['e_dimLength']} 
                                                    onChange={(e) => this.onInputChange(e)}
                                                />
                                            </label>
                                            <label>
                                                <p>Width</p>
                                                <input 
                                                    className="form-control" 
                                                    type="text" 
                                                    name="e_dimWidth" 
                                                    value={lineFormInputs['e_dimWidth']} 
                                                    onChange={(e) => this.onInputChange(e)}
                                                />
                                            </label>
                                            <label>
                                                <p>Height</p>
                                                <input 
                                                    className="form-control" 
                                                    type="text" 
                                                    name="e_dimHeight" 
                                                    value={lineFormInputs['e_dimHeight']} 
                                                    onChange={(e) => this.onInputChange(e)}
                                                />
                                            </label>
                                            <label>
                                                <p>Cubic Meter</p>
                                                <input 
                                                    className="form-control" 
                                                    type="text" 
                                                    disabled="disabled"
                                                    name="e_1_Total_dimCubicMeter" 
                                                    value={lineFormInputs['e_1_Total_dimCubicMeter']} 
                                                />
                                            </label>
                                            <label>
                                                <p>Cubic KG</p>
                                                <input 
                                                    className="form-control" 
                                                    type="text" 
                                                    disabled="disabled"
                                                    name="total_2_cubic_mass_factor_calc" 
                                                    value={lineFormInputs['total_2_cubic_mass_factor_calc']} 
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
                                        :
                                        <div className="line-detail-form">
                                            <label>
                                                <p>Model</p>
                                                <input 
                                                    className="form-control" 
                                                    type="text" 
                                                    name="modelNumber" 
                                                    value={lineDetailFormInputs['modelNumber']} 
                                                    onChange={(e) => this.onInputChange(e)}
                                                />
                                            </label>
                                            <label>
                                                <p>Item Description</p>
                                                <input 
                                                    className="form-control" 
                                                    type="text" 
                                                    name="itemDescription" 
                                                    value={lineDetailFormInputs['itemDescription']} 
                                                    onChange={(e) => this.onInputChange(e)}
                                                />
                                            </label>
                                            <label>
                                                <p>Qty</p>
                                                <input 
                                                    className="form-control" 
                                                    type="text" 
                                                    name="quantity" 
                                                    value={lineDetailFormInputs['quantity']} 
                                                    onChange={(e) => this.onInputChange(e)}
                                                />
                                            </label>
                                            <label>
                                                <p>Client Reference #</p>
                                                <input 
                                                    className="form-control" 
                                                    type="text" 
                                                    name="clientRefNumber" 
                                                    value={lineDetailFormInputs['clientRefNumber']} 
                                                    onChange={(e) => this.onInputChange(e)}
                                                />
                                            </label>
                                            <label>
                                                <p>Insurance Value</p>
                                                <input 
                                                    className="form-control" 
                                                    type="text" 
                                                    name="insuranceValueEach" 
                                                    value={lineDetailFormInputs['insuranceValueEach']} 
                                                    onChange={(e) => this.onInputChange(e)}
                                                />
                                            </label>
                                            <label>
                                                <p>Gap / RA</p>
                                                <input 
                                                    className="form-control" 
                                                    type="text" 
                                                    name="gap_ra" 
                                                    value={lineDetailFormInputs['gap_ra']} 
                                                    onChange={(e) => this.onInputChange(e)}
                                                />
                                            </label>
                                            <label>
                                                <p>Fault Description</p>
                                                <input 
                                                    className="form-control" 
                                                    type="text" 
                                                    name="itemFaultDescription" 
                                                    value={lineDetailFormInputs['itemFaultDescription']} 
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
                                }
                            </div>
                    }
                </div>
            </SlidingPane>
        );
    }
}

export default LineAndLineDetailSlider;

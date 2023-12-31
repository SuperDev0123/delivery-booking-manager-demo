// React lib
import React from 'react';
import PropTypes from 'prop-types';
// React Components
import {uniq, intersection} from 'lodash';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import LoadingOverlay from 'react-loading-overlay';
import { Button } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Custom
import { getCubicMeter, getWeight } from '../../commons/helpers';
import { LINE_IMPORTANT_FIELDS } from '../../commons/constants';

class LineAndLineDetailSlider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editMode: 0, // 0: no create, 1: create, 2: update
            lineOrLineDetail: 1, // 1: line, 2: lineDetail
            selectedLineIndex: -1,
            lineFormInputs: {
                e_type_of_packaging: 'carton',
                e_qty: 0,
                e_dimLength: 0,
                e_dimWidth: 0,
                e_dimHeight: 0,
                e_dimUOM: 'cm',
                e_weightUOM: 'kg',
                e_weightPerEach: 0,
                sscc: null,
            },
            lineDetailFormInputs: {},
            isShowAllLineDetails: false,
            selectedLineDetails: [],
            updatedFields: [],
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
        booking: PropTypes.object.isRequired,
        createBookingLine: PropTypes.func.isRequired,
        updateBookingLine: PropTypes.func.isRequired,
        createBookingLineDetail: PropTypes.func.isRequired,
        updateBookingLineDetail: PropTypes.func.isRequired,
        toggleUpdateBookingModal: PropTypes.func.isRequired,
        packageTypes: PropTypes.array.isRequired,
        moveLineDetails: PropTypes.func.isRequired,
        currentPackedStatus: PropTypes.string,
    };

    notify = (text) => toast(text);

    /*
     *  index: selected Line index
     *  mode: 'showOnly' or 'highlight'
     */
    onClickShowLine(index, mode) {
        if (mode === 'highlight' && this.state.isShowAllLineDetails)
            this.setState({selectedLineIndex: index});
        else
            this.setState({selectedLineIndex: index, isShowAllLineDetails: false});
    }

    onClickNew(editMode, typeNum) {
        this.setState({
            editMode: editMode,
            lineOrLineDetail: typeNum,
            lineFormInputs: {
                e_type_of_packaging: 'carton',
                e_qty: 0,
                e_dimLength: 0,
                e_dimWidth: 0,
                e_dimHeight: 0,
                e_dimUOM: 'cm',
                e_weightUOM: 'kg',
                e_weightPerEach: 0,
                sscc: null,
                e_util_height: 0,
                e_util_cbm: 0,
                e_util_kg: 0,
            },
            lineDetailFormInputs: {}
        });
    }

    onClickEdit(editMode, typeNum, index) {
        const {lines, lineDetails} = this.props;

        if (typeNum === 1) {
            this.setState({editMode, lineOrLineDetail: typeNum, lineFormInputs: lines[index], selectedLineIndex: index});
        } else if (typeNum === 2) {
            this.setState({editMode, lineOrLineDetail: typeNum, lineDetailFormInputs: lineDetails[index]});
        }
    }

    onInputChange(event, data=null) {
        /*
            event: input event
            data: selected lineDetail
        */

        const {lineOrLineDetail, selectedLineDetails} = this.state;
        let updatedFields = this.state.updatedFields;
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        if (data) {
            if (value) {
                selectedLineDetails.push(data);
            } else {
                const index = selectedLineDetails.findIndex(lineDetail => lineDetail['pk_id_lines_data'] === data['pk_id_lines_data']);

                if (index > -1)
                    selectedLineDetails.splice(index, 1);
            }

            this.setState({selectedLineDetails: uniq(selectedLineDetails)});
        } else if (lineOrLineDetail === 1) {
            let lineFormInputs = this.state.lineFormInputs;
            lineFormInputs[name] = value;
            lineFormInputs['e_1_Total_dimCubicMeter'] = getCubicMeter(lineFormInputs['e_qty'], lineFormInputs['e_dimUOM'], lineFormInputs['e_dimLength'], lineFormInputs['e_dimWidth'], lineFormInputs['e_dimHeight']);
            lineFormInputs['e_Total_KG_weight'] = getWeight(lineFormInputs['e_qty'], lineFormInputs['e_weightUOM'], lineFormInputs['e_weightPerEach']);
            lineFormInputs['total_2_cubic_mass_factor_calc'] = (Number.parseFloat(lineFormInputs['e_1_Total_dimCubicMeter']).toFixed(4) * 250).toFixed(2);
            updatedFields.push(name);
            updatedFields = uniq(updatedFields);
            this.setState({lineFormInputs, updatedFields});
        } else if (lineOrLineDetail === 2) {
            let lineDetailFormInputs = this.state.lineDetailFormInputs;
            lineDetailFormInputs[name] = value;

            if (!value) {
                lineDetailFormInputs[name] = null;
            }

            this.setState({lineDetailFormInputs});
        }
    }

    validation(data) {
        const keys = [{ key: 'e_qty', name: 'Qty' }, { key: 'e_weightPerEach', name: 'Wgt Each' }, { key: 'e_dimLength', name: 'Length' }, { key: 'e_dimWidth', name: 'Width' }, { key: 'e_dimHeight', name: 'Height' },];
        for (let i = 0; i < keys.length; i++) {
            const column = keys[i];
            if (!isNaN(data[column.key]) && data[column.key] <= 0)
                return column.name;
        }
        return false;
    }

    onSubmit(e) {
        const { editMode, lineOrLineDetail, lineFormInputs, lineDetailFormInputs, selectedLineIndex, updatedFields } = this.state;
        const { lines, currentPackedStatus } = this.props;

        let invalidField;
        if (lineOrLineDetail === 1) {
            invalidField = this.validation(lineFormInputs);
        }
        else if (lineOrLineDetail === 2) {
            invalidField = this.validation(lineDetailFormInputs);
        }
        if (invalidField) {
            this.notify(invalidField + ' must be greater than 0');
            e.preventDefault();
            return;
        }

        if (editMode === 1) {
            if (lineOrLineDetail === 1) {
                lineFormInputs['fk_booking_id'] = this.props.booking.pk_booking_id;
                lineFormInputs['packed_status'] = currentPackedStatus;
                this.props.createBookingLine(lineFormInputs);
                this.props.toggleUpdateBookingModal();
            } else if (lineOrLineDetail === 2) {
                lineDetailFormInputs['fk_booking_id'] = this.props.booking.pk_booking_id;
                lineDetailFormInputs['fk_booking_lines_id'] = lines[selectedLineIndex].pk_booking_lines_id;
                this.props.createBookingLineDetail(lineDetailFormInputs);
            }
        } else if (editMode === 2) {
            if (lineOrLineDetail === 1) {
                if (intersection(updatedFields, LINE_IMPORTANT_FIELDS)) {
                    this.props.toggleUpdateBookingModal();
                }

                if (lineFormInputs['e_util_kg'] === 'N/A') {
                    lineFormInputs['e_util_height'] = 0;
                    lineFormInputs['e_util_kg'] = 0;
                    lineFormInputs['e_util_cbm'] = 0;
                }

                this.props.updateBookingLine(lineFormInputs);
            } else if (lineOrLineDetail === 2) {
                this.props.updateBookingLineDetail(lineDetailFormInputs);
            }
        }

        this.setState({
            editMode: 0,
            lineFormInputs: {
                e_type_of_packaging: 'carton',
                e_qty: 0,
                e_dimLength: 0,
                e_dimWidth: 0,
                e_dimHeight: 0,
                e_dimUOM: 'cm',
                e_weightUOM: 'kg',
                e_weightPerEach: 0,
                sscc: null,
                e_util_height: 0,
                e_util_cbm: 0,
                e_util_kg: 0,
            },
            lineDetailFormInputs: {}
        });
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

    onCloseSlider() {
        this.setState({selectedLineIndex: -1, selectedLineDetails: []});
        this.props.toggleLineSlider();
    }

    onClickShowAllLineDetails() {
        this.setState({isShowAllLineDetails: true, selectedLineIndex: -1});
    }

    onClickLineDetail(isChecked, selectedLineDetail) {
        const {selectedLineDetails} = this.state;

        if (!isChecked) {
            selectedLineDetails.push(selectedLineDetail);
        } else {
            const index = selectedLineDetails.findIndex(lineDetail => lineDetail['pk_id_lines_data'] === selectedLineDetail['pk_id_lines_data']);

            if (index > -1)
                selectedLineDetails.splice(index, 1);
        }

        this.setState({selectedLineDetails: uniq(selectedLineDetails)});
    }

    onClickMoveIn(line) {
        const {selectedLineDetails} = this.state;
        const linesDetailsToBeMoved = selectedLineDetails.filter(lineDetail => lineDetail['fk_booking_lines_id'] != line['pk_booking_lines_id']);
        let lineDetailIds = [];

        linesDetailsToBeMoved.map(lineDetail => {
            lineDetailIds.push(lineDetail['pk_id_lines_data'].toString());
        });

        if (lineDetailIds.length > 0) {
            this.props.moveLineDetails(line['pk_lines_id'], lineDetailIds);
            this.setState({selectedLineDetails: []});
        } else {
            this.notify('Selected LineDetails are in this Line already!');
        }
    }

    render() {
        const { isOpen, lines, lineDetails, loadingBookingLine, loadingBookingLineDetail, packageTypes } = this.props;
        const { selectedLineIndex, editMode, lineOrLineDetail, lineFormInputs, lineDetailFormInputs, isShowAllLineDetails, selectedLineDetails } = this.state;

        const lineList = lines.map((line, index) => {
            line.e_Total_KG_weight = parseFloat(line.e_Total_KG_weight).toFixed(2);
            line.e_1_Total_dimCubicMeter = parseFloat(line.e_1_Total_dimCubicMeter).toFixed(2);
            line.total_2_cubic_mass_factor_calc = parseFloat(line.total_2_cubic_mass_factor_calc).toFixed(2);

            return (
                <tr key={index} className={(index === selectedLineIndex) ? 'current' : ''} onClick={() => this.onClickShowLine(index, 'highlight')}>
                    <td>{index + 1}</td>
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
                    <td>{line.sscc}</td>
                    <td className="show" onClick={() => this.onClickShowLine(index, 'showOnly')}><Button color="primary">LineDetail</Button></td>
                    <td className="move-in">
                        <Button
                            color="success"
                            title="Move selected LineDetails into this Line."
                            disabled={ selectedLineDetails.length > 0 }
                            onClick={() => this.onClickMoveIn(line)}
                        >
                            Move in
                        </Button>
                    </td>
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
            const isDetailOfSelectedLine = selectedLineIndex > -1 && lines[selectedLineIndex].pk_booking_lines_id === lineDetail.fk_booking_lines_id;
            const isChecked = selectedLineDetails.findIndex(selectedlineDetail => selectedlineDetail['pk_id_lines_data'] === lineDetail['pk_id_lines_data']) > -1 ? true : false;

            if (isDetailOfSelectedLine || isShowAllLineDetails) {
                const lineNo = lines.findIndex(line => line.pk_booking_lines_id === lineDetail.fk_booking_lines_id);

                return (
                    <tr
                        key={index}
                        className={(isDetailOfSelectedLine && isShowAllLineDetails) ? 'current' : null}
                        onClick={() => this.onClickLineDetail(isChecked, lineDetail)}
                    >
                        <td>
                            <input
                                name="lineDetailCheckbox"
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => this.onInputChange(e, lineDetail)}
                            />
                        </td>
                        <td>{lineNo + 1}</td>
                        <td>{lineDetail.modelNumber}</td>
                        <td>{lineDetail.itemDescription}</td>
                        <td>{lineDetail.quantity}</td>
                        <td>{lineDetail.itemFaultDescription}</td>
                        <td>${lineDetail.insuranceValueEach}</td>
                        <td>{lineDetail.gap_ra}</td>
                        <td>{lineDetail.clientRefNumber}</td>
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
                onRequestClose={() => this.onCloseSlider()}>
                <div className="slider-content">
                    {(editMode === 0) ?
                        <div className="table-view">
                            <div>
                                <Button color="primary" onClick={() => this.onClickShowAllLineDetails()}>All LineDetails</Button>
                            </div>
                            <hr />
                            <LoadingOverlay
                                active={loadingBookingLine}
                                spinner
                                text='Loading...'
                            >
                                <div className="line-section">
                                    <h3><strong>Lines</strong></h3>
                                    <Button color="primary new-btn" onClick={() => this.onClickNew(1, 1)}>+</Button>
                                    <table className="table table-hover table-bordered table-striped sortable fixed_headers">
                                        <thead>
                                            <tr>
                                                <th className="" scope="col" nowrap="true">
                                                    <p>No.</p>
                                                </th>
                                                <th className="" scope="col" nowrap="true">
                                                    <p>Packaging</p>
                                                </th>
                                                <th className="" scope="col" nowrap="true">
                                                    <p>Item Description</p>
                                                </th>
                                                <th className="" scope="col" nowrap="true">
                                                    <p>Qty</p>
                                                </th>
                                                <th className="" scope="col" nowrap="true">
                                                    <p>Wgt UOM</p>
                                                </th>
                                                <th className="" scope="col" nowrap="true">
                                                    <p>Wgt Each</p>
                                                </th>
                                                <th className="" scope="col" nowrap="true">
                                                    <p>Total Kgs</p>
                                                </th>
                                                <th className="" scope="col" nowrap="true">
                                                    <p>Dim UOM</p>
                                                </th>
                                                <th className="" scope="col" nowrap="true">
                                                    <p>Length</p>
                                                </th>
                                                <th className="" scope="col" nowrap="true">
                                                    <p>Width</p>
                                                </th>
                                                <th className="" scope="col" nowrap="true">
                                                    <p>Height</p>
                                                </th>
                                                <th className="" scope="col" nowrap="true">
                                                    <p>Cubic Meter</p>
                                                </th>
                                                <th className="" scope="col" nowrap="true">
                                                    <p>Cubic KG</p>
                                                </th>
                                                <th className="" scope="col" nowrap="true">
                                                    <p>SSCC</p>
                                                </th>
                                                <th className="" scope="col" nowrap="true">
                                                    <p>Show Only</p>
                                                </th>
                                                <th className="" scope="col" nowrap="true">
                                                    <p>Move</p>
                                                </th>
                                                <th className="" scope="col" nowrap="true">
                                                    <p>Edit</p>
                                                </th>
                                                <th className="" scope="col" nowrap="true">
                                                    <p>Duplicate</p>
                                                </th>
                                                <th className="" scope="col" nowrap="true">
                                                    <p>Delete</p>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            { lineList }
                                        </tbody>
                                    </table>
                                </div>
                            </LoadingOverlay>
                            {(selectedLineIndex > -1 || isShowAllLineDetails) &&
                                <LoadingOverlay
                                    active={loadingBookingLineDetail}
                                    spinner
                                    text='Loading...'
                                >
                                    <hr />
                                    <div className="line-detail-section">
                                        <h3><strong>Line Details</strong></h3>
                                        {!isShowAllLineDetails && <Button color="primary new-btn" onClick={() => this.onClickNew(1, 2)}>+</Button>}
                                        <table className="table table-hover table-bordered sortable fixed_headers">
                                            <thead>
                                                <tr>
                                                    <th className="" scope="col" nowrap="true"></th>
                                                    <th className="" scope="col" nowrap="true">
                                                        <p>Line No.</p>
                                                    </th>
                                                    <th className="" scope="col" nowrap="true">
                                                        <p>Model</p>
                                                    </th>
                                                    <th className="" scope="col" nowrap="true">
                                                        <p>Item Description</p>
                                                    </th>
                                                    <th className="" scope="col" nowrap="true">
                                                        <p>Qty</p>
                                                    </th>
                                                    <th className="" scope="col" nowrap="true">
                                                        <p>Fault Description</p>
                                                    </th>
                                                    <th className="" scope="col" nowrap="true">
                                                        <p>Insurance Value</p>
                                                    </th>
                                                    <th className="" scope="col" nowrap="true">
                                                        <p>Gap / RA</p>
                                                    </th>
                                                    <th className="" scope="col" nowrap="true">
                                                        <p>Client Reference #</p>
                                                    </th>
                                                    <th className="" scope="col" nowrap="true">
                                                        <p>Edit</p>
                                                    </th>
                                                    <th className="" scope="col" nowrap="true">
                                                        <p>Duplicate</p>
                                                    </th>
                                                    <th className="" scope="col" nowrap="true">
                                                        <p>Delete</p>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                { lineDetailList }
                                            </tbody>
                                        </table>
                                    </div>
                                </LoadingOverlay>
                            }
                        </div>
                        :
                        <div className="form-view">
                            <h2>{(editMode === 1) ? 'Create' : 'Update'} a {(lineOrLineDetail === 1) ? 'Line' : 'LineDetail'}</h2>
                            {
                                (lineOrLineDetail === 1) ?
                                    <div className="line-form">
                                        <form onSubmit={(e) => this.onSubmit(e)} role="form">
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
                                                    value={lineFormInputs['e_item'] ? lineFormInputs['e_item'] : ''}
                                                    onChange={(e) => this.onInputChange(e)}
                                                />
                                            </label>
                                            <label>
                                                <p>Qty</p>
                                                <input
                                                    className="form-control"
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    name="e_qty"
                                                    value={!isNaN(lineFormInputs['e_qty']) ? lineFormInputs['e_qty'] : 0}
                                                    onChange={(e) => this.onInputChange(e)}
                                                    required
                                                />
                                            </label>
                                            <label>
                                                <p>Wgt UOM</p>
                                                <select
                                                    name="e_weightUOM"
                                                    onChange={(e) => this.onInputChange(e)}
                                                    value = {lineFormInputs['e_weightUOM']} >
                                                    <option value="kg">Kilogram</option>
                                                    <option value="g">Gram</option>
                                                    <option value="t">Ton</option>
                                                </select>
                                            </label>
                                            <label>
                                                <p>Wgt Each</p>
                                                <input
                                                    className="form-control"
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    name="e_weightPerEach"
                                                    value={!isNaN(lineFormInputs['e_weightPerEach']) ? lineFormInputs['e_weightPerEach'] : 0}
                                                    onChange={(e) => this.onInputChange(e)}
                                                    required
                                                />
                                            </label>
                                            <label>
                                                <p>Total Kgs</p>
                                                <input
                                                    className="form-control"
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    disabled="disabled"
                                                    name="e_Total_KG_weight"
                                                    value={!isNaN(lineFormInputs['e_Total_KG_weight']) ? lineFormInputs['e_Total_KG_weight'] : 0}
                                                    required
                                                />
                                            </label>
                                            <label>
                                                <p>Dim UOM</p>
                                                <select
                                                    name="e_dimUOM"
                                                    onChange={(e) => this.onInputChange(e)}
                                                    value = {lineFormInputs['e_dimUOM']} >
                                                    <option value="m">METER</option>
                                                    <option value="cm">CM</option>
                                                    <option value="mm">MM</option>
                                                </select>
                                            </label>
                                            <label>
                                                <p>Length</p>
                                                <input
                                                    className="form-control"
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    name="e_dimLength"
                                                    value={!isNaN(lineFormInputs['e_dimLength']) ? lineFormInputs['e_dimLength'] : 0}
                                                    onChange={(e) => this.onInputChange(e)}
                                                    required
                                                />
                                            </label>
                                            <label>
                                                <p>Width</p>
                                                <input
                                                    className="form-control"
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    name="e_dimWidth"
                                                    value={!isNaN(lineFormInputs['e_dimWidth']) ? lineFormInputs['e_dimWidth'] : 0}
                                                    onChange={(e) => this.onInputChange(e)}
                                                    required
                                                />
                                            </label>
                                            <label>
                                                <p>Height</p>
                                                <input
                                                    className="form-control"
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    name="e_dimHeight"
                                                    value={!isNaN(lineFormInputs['e_dimHeight']) ? lineFormInputs['e_dimHeight'] : 0}
                                                    onChange={(e) => this.onInputChange(e)}
                                                    required
                                                />
                                            </label>
                                            <label>
                                                <p>Cubic Meter</p>
                                                <input
                                                    className="form-control"
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    disabled="disabled"
                                                    name="e_1_Total_dimCubicMeter"
                                                    value={!isNaN(lineFormInputs['e_1_Total_dimCubicMeter']) ? lineFormInputs['e_1_Total_dimCubicMeter'] : 0}
                                                    required
                                                />
                                            </label>
                                            <label>
                                                <p>Cubic KG</p>
                                                <input
                                                    className="form-control"
                                                    type="number"
                                                    disabled="disabled"
                                                    name="total_2_cubic_mass_factor_calc"
                                                    value={lineFormInputs['total_2_cubic_mass_factor_calc'] ? lineFormInputs['total_2_cubic_mass_factor_calc'] : ''}
                                                />
                                            </label>
                                            <label>
                                                <p>SSCC</p>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    name="sscc"
                                                    value={lineFormInputs['sscc'] ? lineFormInputs['sscc'] : ''}
                                                    onChange={(e) => this.onInputChange(e)}
                                                />
                                            </label>
                                            <label>
                                                <Button type="submit" color="primary">{(editMode === 1) ? 'Submit' : 'Update'}</Button>{' '}
                                                <Button color="secondary" onClick={() => this.onCancel()}>Cancel</Button>
                                            </label>
                                        </form>
                                    </div>
                                    :
                                    <div className="line-detail-form">
                                        <form onSubmit={(e) => this.onSubmit(e)} role="form">
                                            <label>
                                                <p>Model</p>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    name="modelNumber"
                                                    value={lineDetailFormInputs['modelNumber'] ? lineDetailFormInputs['modelNumber'] : ''}
                                                    onChange={(e) => this.onInputChange(e)}
                                                />
                                            </label>
                                            <label>
                                                <p>Item Description</p>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    name="itemDescription"
                                                    value={lineDetailFormInputs['itemDescription'] ? lineDetailFormInputs['itemDescription'] : ''}
                                                    onChange={(e) => this.onInputChange(e)}
                                                />
                                            </label>
                                            <label>
                                                <p>Qty</p>
                                                <input
                                                    className="form-control"
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    name="quantity"
                                                    value={!isNaN(lineDetailFormInputs['quantity']) ? lineDetailFormInputs['quantity'] : 0}
                                                    onChange={(e) => this.onInputChange(e)}
                                                    required
                                                />
                                            </label>
                                            <label>
                                                <p>Fault Description</p>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    name="itemFaultDescription"
                                                    value={lineDetailFormInputs['itemFaultDescription'] ? lineDetailFormInputs['itemFaultDescription'] : ''}
                                                    onChange={(e) => this.onInputChange(e)}
                                                />
                                            </label>
                                            <label>
                                                <p>Insurance Value</p>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    name="insuranceValueEach"
                                                    value={lineDetailFormInputs['insuranceValueEach'] ? lineDetailFormInputs['insuranceValueEach'] : ''}
                                                    onChange={(e) => this.onInputChange(e)}
                                                />
                                            </label>
                                            <label>
                                                <p>Gap / RA</p>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    name="gap_ra"
                                                    value={lineDetailFormInputs['gap_ra'] ? lineDetailFormInputs['gap_ra'] : ''}
                                                    onChange={(e) => this.onInputChange(e)}
                                                />
                                            </label>
                                            <label>
                                                <p>Client Reference #</p>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    name="clientRefNumber"
                                                    value={lineDetailFormInputs['clientRefNumber'] ? lineDetailFormInputs['clientRefNumber'] : ''}
                                                    onChange={(e) => this.onInputChange(e)}
                                                />
                                            </label>
                                            <label>
                                                <Button color="primary" type="submit">{(editMode === 1) ? 'Submit' : 'Update'}</Button>{' '}
                                                <Button color="secondary" onClick={() => this.onCancel()}>Cancel</Button>
                                            </label>
                                        </form>
                                    </div>
                            }
                        </div>
                    }
                </div>

                <ToastContainer />
            </SlidingPane>
        );
    }
}

export default LineAndLineDetailSlider;

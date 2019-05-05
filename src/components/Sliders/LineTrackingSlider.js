import React from 'react';
import PropTypes from 'prop-types';

import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import { Button } from 'reactstrap';

class LineTrackingSlider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editMode: false,
            lineFormInputs: {}
        };
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleShowLineTrackingSlider: PropTypes.func.isRequired,
        lines: PropTypes.array.isRequired,
        updateBookingLine: PropTypes.func.isRequired,
    };

    onClickEdit(index) {
        const {lines} = this.props;

        this.setState({editMode: true, lineFormInputs: lines[index]});
    }

    onCancel() {
        this.setState({editMode: false});
    }

    onInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        const lineFormInputs = this.state.lineFormInputs;

        lineFormInputs[name] = value;
        lineFormInputs['e_qty_adjusted_delivered'] = lineFormInputs['e_qty_delivered'] - lineFormInputs['e_qty_damaged'] - lineFormInputs['e_qty_returned'] - lineFormInputs['e_qty_shortages'];
        this.setState({lineFormInputs});
    }

    onSubmit() {
        const lineFormInputs = this.state.lineFormInputs;
        this.props.updateBookingLine(lineFormInputs);
        this.setState({editMode: false});
    }

    render() {
        const { isOpen, lines, toggleShowLineTrackingSlider } = this.props;
        const { editMode, lineFormInputs } = this.state;

        const lineList = lines.map((line, index) => {
            return (
                <tr key={index}>
                    <td>{line.e_item}</td>
                    <td>{line.e_qty}</td>
                    <td>{line.e_qty_awaiting_inventory}</td>
                    <td>{line.e_qty_collected}</td>
                    <td>{line.e_qty_scanned_depot}</td>
                    <td>{line.e_qty_delivered}</td>
                    <td>{line.e_qty_adjusted_delivered}</td>
                    <td>{line.e_qty_damaged}</td>
                    <td>{line.e_qty_returned}</td>
                    <td>{line.e_qty_shortages}</td>
                    <td className="edit">
                        <Button color="primary" onClick={() => this.onClickEdit(index)}>Edit</Button>
                    </td>
                </tr>
            );
        });

        return (
            <SlidingPane
                className='lt-slider'
                overlayClassName='lt-slider-overlay'
                isOpen={isOpen}
                title='Line Tracking Slider'
                subtitle='Table view'
                onRequestClose={toggleShowLineTrackingSlider}>
                <div className="slider-content">
                    {
                        editMode ?
                            <div className="form-view">
                                <label>
                                    <p>Item Description</p>
                                    <input 
                                        className="form-control" 
                                        type="text" 
                                        name="e_item" 
                                        value={lineFormInputs['e_item']} 
                                        onChange={(e) => this.onInputChange(e)}
                                        disabled={true}
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
                                    <p>Qty Awaiting Inventory</p>
                                    <input 
                                        className="form-control" 
                                        type="text" 
                                        name="e_qty_awaiting_inventory" 
                                        value={lineFormInputs['e_qty_awaiting_inventory']} 
                                        onChange={(e) => this.onInputChange(e)}
                                    />
                                </label>
                                <label>
                                    <p>Qty Collected</p>
                                    <input 
                                        className="form-control" 
                                        type="text" 
                                        name="e_qty_collected" 
                                        value={lineFormInputs['e_qty_collected']} 
                                        onChange={(e) => this.onInputChange(e)}
                                    />
                                </label>
                                <label>
                                    <p>Qty Scanned depot</p>
                                    <input 
                                        className="form-control" 
                                        type="text" 
                                        name="e_qty_scanned_depot" 
                                        value={lineFormInputs['e_qty_scanned_depot']} 
                                        onChange={(e) => this.onInputChange(e)}
                                    />
                                </label>
                                <label>
                                    <p>Qty Delivered</p>
                                    <input 
                                        className="form-control" 
                                        type="text" 
                                        name="e_qty_delivered" 
                                        value={lineFormInputs['e_qty_delivered']} 
                                        onChange={(e) => this.onInputChange(e)}
                                        disabled={true}
                                    />
                                </label>
                                <label>
                                    <p>Qty Adjusted Delivered</p>
                                    <input 
                                        className="form-control" 
                                        type="text" 
                                        name="e_qty_adjusted_delivered" 
                                        value={lineFormInputs['e_qty_adjusted_delivered']} 
                                        onChange={(e) => this.onInputChange(e)}
                                    />
                                </label>
                                <label>
                                    <p>Qty Damaged</p>
                                    <input 
                                        className="form-control" 
                                        type="text" 
                                        name="e_qty_damaged" 
                                        value={lineFormInputs['e_qty_damaged']} 
                                        onChange={(e) => this.onInputChange(e)}
                                    />
                                </label>
                                <label>
                                    <p>Qty Returned</p>
                                    <input 
                                        className="form-control" 
                                        type="text" 
                                        name="e_qty_returned" 
                                        value={lineFormInputs['e_qty_returned']} 
                                        onChange={(e) => this.onInputChange(e)}
                                    />
                                </label>
                                <label>
                                    <p>Qty Shortages</p>
                                    <input 
                                        className="form-control" 
                                        type="text" 
                                        name="e_qty_shortages" 
                                        value={lineFormInputs['e_qty_shortages']} 
                                        onChange={(e) => this.onInputChange(e)}
                                    />
                                </label>
                                <Button color="primary" onClick={() => this.onSubmit()}>Submit</Button>{' '}
                                <Button color="secondary" onClick={() => this.onCancel()}>Cancel</Button>
                            </div>
                            :
                            <div className="table-view">
                                <table className="table table-hover table-bordered sortable fixed_headers">
                                    <tr>
                                        <th className="" scope="col" nowrap>
                                            <p>Description</p>
                                        </th>
                                        <th className="" scope="col" nowrap>
                                            <p>Qty</p>
                                        </th>
                                        <th className="" scope="col" nowrap>
                                            <p>Qty Awaiting Inventory</p>
                                        </th>
                                        <th className="" scope="col" nowrap>
                                            <p>Qty Collected</p>
                                        </th>
                                        <th className="" scope="col" nowrap>
                                            <p>Qty Scanned depot</p>
                                        </th>
                                        <th className="" scope="col" nowrap>
                                            <p>Qty Delivered</p>
                                        </th>
                                        <th className="" scope="col" nowrap>
                                            <p>Qty Adjusted Delivered</p>
                                        </th>
                                        <th className="" scope="col" nowrap>
                                            <p>Qty Damaged</p>
                                        </th>
                                        <th className="" scope="col" nowrap>
                                            <p>Qty Returned</p>
                                        </th>
                                        <th className="" scope="col" nowrap>
                                            <p>Qty Shortages</p>
                                        </th>
                                    </tr>
                                    { lineList }
                                </table>
                            </div>                            
                    }
                </div>
            </SlidingPane>
        );
    }
}

export default LineTrackingSlider;

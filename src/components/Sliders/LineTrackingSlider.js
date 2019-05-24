import React from 'react';
import PropTypes from 'prop-types';

import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import { Button } from 'reactstrap';

class LineTrackingSlider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: [],
        };
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleShowLineTrackingSlider: PropTypes.func.isRequired,
        lines: PropTypes.array.isRequired,
        booking: PropTypes.object.isRequired,
        updateBookingLine: PropTypes.func.isRequired,
        isBooked: PropTypes.bool.isRequired,
        clientname: PropTypes.string.isRequired,
        calcCollected: PropTypes.func.isRequired,
    };

    onClickEdit(oldValue, newValue, row, column) {
        console.log('Old val: ', oldValue);

        let line = row;
        line[column.dataField] = parseInt(line[column.dataField]);
        line['e_qty_adjusted_delivered'] = line['e_qty_delivered'] - line['e_qty_damaged'] - line['e_qty_returned'] - line['e_qty_shortages'];

        if (line['e_1_Total_dimCubicMeter'] == 'NaN') {
            line['e_1_Total_dimCubicMeter'] = 0;
        }

        this.props.updateBookingLine(line);
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
        const { isOpen, lines, toggleShowLineTrackingSlider, booking, isBooked, clientname } = this.props;

        const selectRow = {
            mode: 'checkbox',
            clickToSelect: false,
            clickToEdit: true,
            selected: this.state.selected,
            onSelect: this.handleOnSelect,
            onSelectAll: this.handleOnSelectAll,
        };

        const editableStyle = (cell, row) => {
            console.log('cell - ', cell, clientname);
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

        const qtyEditableStyle = (cell, row) => {
            console.log('cell - ', cell);
            if ((row.is_scanned || isBooked) && clientname !== 'dme') {
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

        const isEditable = (cell, row) => {
            console.log('cell - ', cell);
            if (row.is_scanned && clientname !== 'dme') {
                return false;
            } else {
                return true;
            }
        };

        const bookingLineColumns = [
            {
                dataField: 'e_item',
                text: 'Item Description',
                editable: false,
                style: {
                    backgroundColor: 'lightgray',
                    cursor: 'not-allowed',
                },
            }, {
                dataField: 'e_qty',
                text: 'Qty',
                editable: !isBooked,
                style: qtyEditableStyle,
            }, {
                dataField: 'e_qty_awaiting_inventory',
                text: 'Qty Awaiting Inventory',
                editable: isEditable,
                style: editableStyle,
            }, {
                dataField: 'e_qty_collected',
                text: 'Qty Collected',
                editable: false,
                style: {
                    backgroundColor: 'lightgray',
                    cursor: 'not-allowed',
                },
            }, {
                dataField: 'e_qty_scanned_depot',
                text: 'Qty Scanned Depot',
                editable: isEditable,
                style: editableStyle,
            }, {
                dataField: 'e_qty_delivered',
                text: 'Qty Delivered',
                editable: false,
                style: {
                    backgroundColor: 'lightgray',
                    cursor: 'not-allowed',
                },
            }, {
                dataField: 'e_qty_adjusted_delivered',
                text: 'Qty Adjusted Delivered',
                editable: false,
                style: {
                    backgroundColor: 'lightgray',
                    cursor: 'not-allowed',
                },
            }, {
                dataField: 'e_qty_damaged',
                text: 'Qty Damaged',
                editable: isEditable,
                style: editableStyle,
            }, {
                dataField: 'e_qty_returned',
                text: 'Qty Returned',
                editable: isEditable,
                style: editableStyle,
            }, {
                dataField: 'e_qty_shortages',
                text: 'Qty Shortages',
                editable: isEditable,
                style: editableStyle,
            }, {
                dataField: 'e_qty_scanned_fp',
                text: 'Scanned',
                editable: false,
                style: {
                    backgroundColor: 'lightgray',
                    cursor: 'not-allowed',
                },
            }
        ];

        return (
            <SlidingPane
                className='lt-slider'
                overlayClassName='lt-slider-overlay'
                isOpen={isOpen}
                title='Line Tracking Slider'
                subtitle='Table view'
                onRequestClose={toggleShowLineTrackingSlider}>
                <div className="slider-content">
                    <h1>Booking ID: {booking.b_bookingID_Visual}</h1>
                    <BootstrapTable
                        keyField='pk_lines_id'
                        data={ lines }
                        columns={ bookingLineColumns }
                        cellEdit={ 
                            cellEditFactory({ 
                                mode: 'click',
                                blurToSave: true,
                                afterSaveCell: (oldValue, newValue, row, column) => this.onClickEdit(oldValue, newValue, row, column)
                            })
                        }
                        selectRow={ selectRow }
                        bootstrap4={ true }
                    />
                    <label>
                        **Select lines and click button below to perform action
                    </label>
                    <br />
                    {
                        (lines.length > 0) ?
                            <label>
                                <Button 
                                    onClick={() => this.handleBtnClick('Calc')} 
                                    disabled={(this.state.selected.length === 0) ? 'disabled' : ''}
                                >
                                    Set Collected Qty
                                </Button>
                                <Button 
                                    onClick={() => this.handleBtnClick('Clear')}
                                    disabled={(this.state.selected.length === 0) ? 'disabled' : ''}
                                >
                                    Set Collected 0
                                </Button>
                            </label>
                            :
                            null
                    }
                </div>
            </SlidingPane>
        );
    }
}

export default LineTrackingSlider;

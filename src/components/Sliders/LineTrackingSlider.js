import React from 'react';
import PropTypes from 'prop-types';

import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';

class LineTrackingSlider extends React.Component {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleShowLineTrackingSlider: PropTypes.func.isRequired,
        lines: PropTypes.array.isRequired,
        booking: PropTypes.object.isRequired,
        updateBookingLine: PropTypes.func.isRequired,
        isBooked: PropTypes.bool.isRequired,
    };

    onClickEdit(oldValue, newValue, row, column) {
        console.log('Old val: ', oldValue);

        let line = row;
        line[column.dataField] = parseInt(line[column.dataField]);
        line['e_qty_adjusted_delivered'] = line['e_qty_delivered'] - line['e_qty_damaged'] - line['e_qty_returned'] - line['e_qty_shortages'];
        line['e_qty_collected'] = line['e_qty'] - line['e_qty_awaiting_inventory'];

        if (line['e_1_Total_dimCubicMeter'] == 'NaN') {
            line['e_1_Total_dimCubicMeter'] = 0;
        }
        console.log('@ - ', line['e_1_Total_dimCubicMeter']);

        this.props.updateBookingLine(line);
    }

    render() {
        const { isOpen, lines, toggleShowLineTrackingSlider, booking, isBooked } = this.props;

        const qtyDeliveryCell = (cell, row) => {
            return (
                <div>
                    {
                        (booking.b_status === 'Delivered') ?
                            row.e_qty
                            :
                            cell
                    }
                </div>
            );
        };

        const qtyStyle = {
            'backgroundColor': isBooked ? 'gray' : 'white',
            'cursor': isBooked ? 'not-allowed' : 'default',
        };

        const bookingLineColumns = [
            {
                dataField: 'e_item',
                text: 'Item Description',
                editable: false,
                style: {
                    backgroundColor: 'gray',
                    cursor: 'not-allowed',
                },
            }, {
                dataField: 'e_qty',
                text: 'Qty',
                editable: !isBooked,
                style: qtyStyle,
            }, {
                dataField: 'e_qty_awaiting_inventory',
                text: 'Qty Awaiting Inventory',
            }, {
                dataField: 'e_qty_collected',
                text: 'Qty Collected',
                editable: false,
                style: {
                    backgroundColor: 'gray',
                    cursor: 'not-allowed',
                },
            }, {
                dataField: 'e_qty_scanned_depot',
                text: 'Qty Scanned Depot',
            }, {
                dataField: 'e_qty_delivered',
                text: 'Qty Delivered',
                formatter: qtyDeliveryCell,
                editable: false,
                style: {
                    backgroundColor: 'gray',
                    cursor: 'not-allowed',
                },
            }, {
                dataField: 'e_qty_adjusted_delivered',
                text: 'Qty Adjusted Delivered',
                editable: false,
                style: {
                    backgroundColor: 'gray',
                    cursor: 'not-allowed',
                },
            }, {
                dataField: 'e_qty_damaged',
                text: 'Qty Damaged',
            }, {
                dataField: 'e_qty_returned',
                text: 'Qty Returned',
            }, {
                dataField: 'e_qty_shortages',
                text: 'Qty Shortages',
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
                        bootstrap4={ true }
                    />
                    <label>
                        **Note any change to a fields value will be saved automatically upon exiting the field
                    </label>
                </div>
            </SlidingPane>
        );
    }
}

export default LineTrackingSlider;

import React from 'react';
import PropTypes from 'prop-types';

import { indexOf } from 'lodash';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import { Button } from 'reactstrap';
import ConfirmModal from '../CommonModals/ConfirmModal';

class LineTrackingSlider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: [],
            isOpenUpdateDeliveredConfirmModal: false,
            currentLine: null,
            old_e_qty_awaiting_inventory: 0,
        };

        this.toggleUpdateDeliveredConfirmModal = this.toggleUpdateDeliveredConfirmModal.bind(this);
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleLineTrackingSlider: PropTypes.func.isRequired,
        lines: PropTypes.array.isRequired,
        booking: PropTypes.object.isRequired,
        updateBookingLine: PropTypes.func.isRequired,
        updateBooking: PropTypes.func.isRequired,
        isBooked: PropTypes.bool.isRequired,
        clientname: PropTypes.string.isRequired,
        calcCollected: PropTypes.func.isRequired,
        apiBCLs: PropTypes.array.isRequired,
    };

    onClickEdit(oldValue, newValue, row, column) {
        console.log('Old val: ', oldValue);

        let line = row;
        line[column.dataField] = parseInt(line[column.dataField]);
        line['e_qty_adjusted_delivered'] = line['e_qty_delivered'] - line['e_qty_damaged'] - line['e_qty_returned'] - line['e_qty_shortages'];

        if (line['e_1_Total_dimCubicMeter'] == 'NaN') {
            line['e_1_Total_dimCubicMeter'] = 0;
        }

        if (column.dataField === 'e_qty_awaiting_inventory' && this.props.booking.tally_delivered > 0) {
            this.setState({currentLine: line, old_e_qty_awaiting_inventory: oldValue});
            this.toggleUpdateDeliveredConfirmModal();
        } else {
            this.props.updateBookingLine(line);
        }
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

    toggleUpdateDeliveredConfirmModal() {
        this.setState(prevState => ({isOpenUpdateDeliveredConfirmModal: !prevState.isOpenUpdateDeliveredConfirmModal}));
    }

    onConfirmUpdateDelivered = () => {
        let line = this.state.currentLine;
        line['e_qty_delivered'] = line['e_qty'] - line['e_qty_awaiting_inventory'];
        this.props.updateBookingLine(line);
        let booking = this.props.booking;
        booking['tally_delivered'] += 1;
        this.props.updateBooking(booking.id, booking);
        this.toggleUpdateDeliveredConfirmModal();
    }

    onCancelUpdateDelivered = () => {
        let line = this.state.currentLine;
        line['e_qty_awaiting_inventory'] = this.state.old_e_qty_awaiting_inventory;
        this.props.updateBookingLine(line);
        this.toggleUpdateDeliveredConfirmModal();
    }

    render() {
        const { isOpen, lines, toggleLineTrackingSlider, booking, isBooked, clientname, apiBCLs } = this.props;
        const { selected } = this.state;

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
                dataField: 'e_qty_scanned_fp',
                text: 'Qty Scanned Depot',
                editable: isEditable,
                style: {
                    backgroundColor: 'lightgray',
                    cursor: 'not-allowed',
                },
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
                text: 'Qty Shortages / Lost',
                editable: isEditable,
                style: editableStyle,
            }
        ];

        const rowClasses = (row) => {
            let classes = '';

            if (indexOf(selected, parseInt(row.fk_booking_line_id)) !== -1) {
                classes = 'selected';
            }

            return classes;
        };

        const apiBCLColumns = [
            {
                dataField: 'fk_booking_id',
                text: 'Booking ID',
            }, {
                dataField: 'label_code',
                text: 'Label Code',
            }, {
                dataField: 'client_item_reference',
                text: 'Client Item Ref',
            }, {
                dataField: 'fp_event_date',
                text: 'Event Date',
            }, {
                dataField: 'fp_event_time',
                text: 'Event Time',
            }
        ];

        return (
            <SlidingPane
                className='lt-slider'
                overlayClassName='lt-slider-overlay'
                isOpen={isOpen}
                title='Line Tracking Slider'
                subtitle='Table view'
                onRequestClose={toggleLineTrackingSlider}>
                <div className="slider-content">
                    <h1>Booking ID: {booking.b_bookingID_Visual}{booking.tally_delivered > 0 ? ' - Delivered' : ''}</h1>
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
                        (lines.length > 0 && clientname === 'dme') ?
                            <label>
                                <Button 
                                    onClick={() => this.handleBtnClick('Calc')} 
                                    disabled={this.state.selected.length === 0}
                                >
                                    Set Collected Qty
                                </Button>
                                <Button 
                                    onClick={() => this.handleBtnClick('Clear')}
                                    disabled={this.state.selected.length === 0}
                                >
                                    Set Collected 0
                                </Button>
                            </label>
                            :
                            null
                    }
                </div>

                <ConfirmModal
                    isOpen={this.state.isOpenUpdateDeliveredConfirmModal}
                    onOk={() => this.onConfirmUpdateDelivered()}
                    onCancel={() => this.onCancelUpdateDelivered()}
                    title={'Delivered Booking!'}
                    text={'There is a delivered status in history / do you want to clear it so that delivered count is not calculated ?'}
                    okBtnName={'Confirm'}
                />

                <div className='api-bcl-table'>
                    <BootstrapTable
                        keyField='id'
                        data={ apiBCLs }
                        columns={ apiBCLColumns }
                        bootstrap4={ true }
                        rowClasses={ rowClasses }
                    />
                </div>
            </SlidingPane>
        );
    }
}

export default LineTrackingSlider;

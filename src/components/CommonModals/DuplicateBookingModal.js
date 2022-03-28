import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {isEmpty, isNull, isUndefined} from 'lodash';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Modal as ReactstrapModal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

// import { isInt } from '../../commons/helpers';
import Children from '../Modules/Children';

class DuplicateBookingModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            switchInfo: false,
            dupLineAndLineDetail: false,
            is4Child: false,
            selectedLineIndex: -1,
            isShowAllLineDetails: false,
            qtys4Children: {},
        };
    }

    static propTypes = {
        isOpen: PropTypes.bool.required,
        toggleModal: PropTypes.func.required,
        onClickDuplicate: PropTypes.func.required,
        booking: PropTypes.object,
        lines: PropTypes.array.isRequired,
        lineDetails: PropTypes.array.isRequired,
        childBookings: PropTypes.array.isRequired,
    };

    static defaultProps = {
        isOpen: false,
    };

    // componentDidMount() {
    // }

    notify = (text) => toast(text);

    onOk() {
        const {toggleModal, onClickDuplicate, booking} = this.props;
        const {switchInfo, dupLineAndLineDetail, is4Child, qtys4Children} = this.state;

        // Is Booked Booking?
        if (!isNull(booking.b_dateBookedDate) &&
            !isUndefined(booking.b_dateBookedDate) &&
            !isEmpty(booking.b_dateBookedDate) &&
            is4Child
        ) {
            this.notify('This booking is BOOKED booking, you can NOT create child from this.');
            return;
        }

        if (is4Child && Object.keys(qtys4Children).length) {
            const qtys_in_stock = booking.qtys_in_stock;
            let wrong_qtys = [];

            qtys_in_stock.map(_iter => {
                if (qtys4Children[_iter['pk_lines_id']] && qtys4Children[_iter['pk_lines_id']] > _iter.qty_in_stock) {
                    wrong_qtys.push(_iter.e_item);
                }
            });

            if (wrong_qtys.length > 0) {
                this.notify(`Following items qty is exceeded over the qty in stock: ${wrong_qtys.join(', ')}`);
                return;
            }

            for (const key in qtys4Children)
                if (!qtys4Children[key]) delete qtys4Children.key;
        }

        onClickDuplicate({switchInfo, dupLineAndLineDetail, is4Child, qtys4Children});
        this.setState({switchInfo: false, dupLineAndLineDetail: false, qtys4Children: [], is4Child: false});
        toggleModal();
    }

    handleInputChange(event, lineIndex=0) {
        const {booking, lines} = this.props;
        let qtys4Children = this.state.qtys4Children;
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        if (name === 'is4Child') {
            if (booking.x_booking_Created_With.indexOf('Child of #') !== -1) {
                this.notify('You can NOT create a child booking from a child booking');
                return;
            }
        }

        if (name === 'qty') {
            if (Object.keys(qtys4Children).length === 0 && qtys4Children.constructor === Object) {
                lines.map(line => {
                    qtys4Children[line.pk_lines_id] = null;
                });
            }

            if (!value) {
                qtys4Children[lines[lineIndex].pk_lines_id] = null;
                this.setState({qtys4Children});
                this.notify('Please input integer value');
            } else {
                qtys4Children[lines[lineIndex].pk_lines_id] = parseInt(value);
                this.setState({qtys4Children});
            }
        } else {
            this.setState({[name]: value});
        }

        if (name === 'is4Child') {
            this.switch4Child();
        }
    }

    switch4Child() {
        this.setState({switchInfo: false, dupLineAndLineDetail: false});
    }

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

    render() {
        const {isOpen, toggleModal, lines, lineDetails, booking, childBookings} = this.props;
        const {is4Child, selectedLineIndex, isShowAllLineDetails, qtys4Children} = this.state;

        const lineList = lines.map((line, index) => {
            // Calc totals
            line.e_Total_KG_weight = parseFloat(line.e_Total_KG_weight).toFixed(2);
            line.e_1_Total_dimCubicMeter = parseFloat(line.e_1_Total_dimCubicMeter).toFixed(2);
            line.total_2_cubic_mass_factor_calc = parseFloat(line.total_2_cubic_mass_factor_calc).toFixed(2);

            const qtys_in_stock = booking.qtys_in_stock;
            let qty_in_stock = 0;

            if (qtys_in_stock)
                qty_in_stock = qtys_in_stock.find(qty_in_stock => qty_in_stock.pk_lines_id === line.pk_lines_id);

            return (
                <tr key={index} className={(index === selectedLineIndex) ? 'current' : ''} onClick={() => this.onClickShowLine(index, 'showOnly')}>
                    <td>{index + 1}</td>
                    <td>{line.e_type_of_packaging}</td>
                    <td>{line.e_item}</td>
                    <td>{line.e_qty}</td>
                    <td>{qty_in_stock ? qty_in_stock['qty_in_stock'] : null}</td>
                    <td>{qty_in_stock ? qty_in_stock['qty_out_stock'] : null}</td>
                    <td>
                        <input
                            name='qty'
                            type="number"
                            step="1"
                            min="0"
                            max={line.e_qty}
                            value={qtys4Children.hasOwnProperty(line.pk_lines_id) ? qtys4Children[line.pk_lines_id] : 0}
                            onChange={(e) => this.handleInputChange(e, index)}
                            disabled={!line.e_qty ? 'disabled' : null}
                        />
                    </td>
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
                </tr>
            );
        });

        const lineDetailList = lineDetails.map((lineDetail, index) => {
            const isDetailOfSelectedLine = selectedLineIndex > -1 && lines[selectedLineIndex].pk_booking_lines_id === lineDetail.fk_booking_lines_id;

            if (isDetailOfSelectedLine || isShowAllLineDetails) {
                const lineNo = lines.findIndex(line => line.pk_booking_lines_id === lineDetail.fk_booking_lines_id);

                return (
                    <tr
                        key={index}
                        className={(isDetailOfSelectedLine && isShowAllLineDetails) ? 'current' : null}
                    >
                        <td>{lineNo + 1}</td>
                        <td>{lineDetail.modelNumber}</td>
                        <td>{lineDetail.itemDescription}</td>
                        <td>{lineDetail.quantity}</td>
                        <td>{lineDetail.itemFaultDescription}</td>
                        <td>${lineDetail.insuranceValueEach}</td>
                        <td>{lineDetail.gap_ra}</td>
                        <td>{lineDetail.clientRefNumber}</td>
                    </tr>
                );
            }
        });

        return (
            <ReactstrapModal isOpen={isOpen} toggle={toggleModal} className={is4Child ? 'duplicate-option-modal build-child-mode' : 'duplicate-option-modal'}>
                <ModalHeader toggle={toggleModal}>Duplicate Booking Options</ModalHeader>
                <ModalBody>
                    <div className="options-section">
                        <label>
                            <input
                                name='switchInfo'
                                type='checkbox'
                                checked={this.state.switchInfo}
                                onChange={(e) => this.handleInputChange(e)}
                                disabled={is4Child ? 'disabled' : null}
                            />
                            Switch Addresses & Contacts
                        </label>
                        <br />
                        <label>
                            <input
                                name='dupLineAndLineDetail'
                                type='checkbox'
                                checked={this.state.dupLineAndLineDetail}
                                onChange={(e) => this.handleInputChange(e)}
                                disabled={is4Child ? 'disabled' : null}
                            />
                            Duplicate related Lines and LineDetails
                        </label>
                        <br />
                        <label>
                            <input
                                name='is4Child'
                                type='checkbox'
                                checked={this.state.is4Child}
                                onChange={(e) => this.handleInputChange(e)}
                            />
                            Build a child Booking
                        </label>
                    </div>
                    {is4Child && 
                        <div>
                            <hr />
                            <div className="line-section">
                                <h3><strong>Lines</strong></h3>
                                <table className="table table-hover table-bordered sortable fixed_headers">
                                    <tr>
                                        <th className="" scope="col" nowrap>
                                            <p>No.</p>
                                        </th>
                                        <th className="" scope="col" nowrap>
                                            <p>Packaging</p>
                                        </th>
                                        <th className="" scope="col" nowrap>
                                            <p>Item Description</p>
                                        </th>
                                        <th className="" scope="col" nowrap>
                                            <p>Qty Ordered</p>
                                        </th>
                                        <th className="" scope="col" nowrap>
                                            <p>QTY Sent To Children</p>
                                        </th>
                                        <th className="" scope="col" nowrap>
                                            <p>QTY Sent To Children</p>
                                        </th>
                                        <th className="" scope="col" nowrap>
                                            <p>Qty Remaining</p>
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
                                            <p>SSCC</p>
                                        </th>
                                        <th className="" scope="col" nowrap>
                                            <p>Show Only</p>
                                        </th>
                                    </tr>
                                    { lineList }
                                </table>
                            </div>
                            {selectedLineIndex > -1 &&
                                <div className="line-detail-section">
                                    <h3><strong>Line Details</strong></h3>
                                    <table className="table table-hover table-bordered sortable fixed_headers">
                                        <tr>
                                            <th className="" scope="col" nowrap>
                                                <p>Line No.</p>
                                            </th>
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
                                                <p>Fault Description</p>
                                            </th>
                                            <th className="" scope="col" nowrap>
                                                <p>Insurance Value</p>
                                            </th>
                                            <th className="" scope="col" nowrap>
                                                <p>Gap / RA</p>
                                            </th>
                                            <th className="" scope="col" nowrap>
                                                <p>Client Reference #</p>
                                            </th>
                                        </tr>
                                        { lineDetailList }
                                    </table>
                                </div>
                            }
                        </div>
                    }
                    {(childBookings && childBookings.length > 0 && is4Child) &&
                        <div>
                            <hr />
                            <h4>Children Bookings:</h4>
                            <Children childBookings={childBookings} />
                        </div>
                    }
                </ModalBody>
                <ModalFooter>
                    <Button color='primary' onClick={() => this.onOk()}>Duplicate</Button>{' '}
                    <Button color='secondary' onClick={toggleModal}>Cancel</Button>
                </ModalFooter>

                <ToastContainer />
            </ReactstrapModal>
        );
    }
}

export default DuplicateBookingModal;

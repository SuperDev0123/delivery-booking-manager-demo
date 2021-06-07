import React, {Component} from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';

import { Button, Modal as ReactstrapModal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class OrderModal extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggle: PropTypes.func.isRequired,
        onCreateOrder: PropTypes.func.isRequired,
        selectedBookingIds: PropTypes.array.isRequired,
        selectedBookingLinesCnt: PropTypes.number.isRequired,
        bookings: PropTypes.array.isRequired,
        clientname: PropTypes.string,
        toggleOrderModal: PropTypes.func.isRequired,
    };

    static defaultProps = {
        isOpen: false,
    };

    onClickCreate(selectedBookings, selectedBookingIds) {
        this.props.toggleOrderModal();
        this.props.onCreateOrder(selectedBookingIds, selectedBookings[0].vx_freight_provider);
    }

    render() {
        const {isOpen, selectedBookingIds, selectedBookingLinesCnt, clientname} = this.props;
        const selectedBookings = this.props.bookings.filter(booking => selectedBookingIds.includes(booking.id));
        const puAvailFromDateCnt = _.uniqBy(selectedBookings, 'puPickUpAvailFrom_Date').length;
        let bookedCnt = selectedBookings.filter(booking => booking.b_status==='Booked').length;
        let notBookedCnt = selectedBookingIds.length - bookedCnt;
        const fpCnt = _.uniqBy(selectedBookings, 'vx_freight_provider').length;

        if (clientname === 'Jason L') {
            notBookedCnt = 0;
            bookedCnt = selectedBookings.length;
        }

        return (
            <ReactstrapModal isOpen={isOpen} className="find-modal">
                <ModalHeader toggle={this.props.toggle}>FP Order(Manifest) Modal</ModalHeader>
                <ModalBody>
                    <h4>Please review info before creating the order.</h4>
                    <label>
                        <span>
                            # There are {selectedBookingIds.length} Bookings with {selectedBookingLinesCnt} number of packages added together for the selected Bookings.
                        </span><br />
                        <span className={fpCnt > 1 ? 'red' : ''}>
                            # {fpCnt} `Freight Provider(s)`;
                        </span><br />
                        <span className={puAvailFromDateCnt > 1 ? 'red' : ''}>
                            # There are {puAvailFromDateCnt} `Pick Up Available From Date`;
                        </span><br />
                        {clientname !== 'Jason L' &&
                            <span className={notBookedCnt > 0 ? 'red' : ''}>
                                # Not booked Count: {notBookedCnt}
                            </span>
                        }
                    </label>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="primary"
                        onClick={() => this.onClickCreate(selectedBookings, selectedBookingIds)}
                        disabled={puAvailFromDateCnt > 1 || (selectedBookingIds.length - bookedCnt > 0) || fpCnt > 1 ? 'disabled' : ''}
                    >
                        Create
                    </Button>
                    <Button color="secondary" onClick={() => this.props.toggle()}>Cancel</Button>
                </ModalFooter>
            </ReactstrapModal>
        );
    }
}

export default OrderModal;

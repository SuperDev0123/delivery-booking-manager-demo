import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { Button, Modal as ReactstrapModal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import _ from 'lodash';

class OrderModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggle: PropTypes.func.isRequired,
        onCreateOrder: PropTypes.func.isRequired,
        selectedBookingIds: PropTypes.array.isRequired,
        selectedBookingLinesCnt: PropTypes.number.isRequired,
        bookings: PropTypes.array.isRequired,
    };

    static defaultProps = {
        isOpen: false,
    };

    render() {
        const {isOpen, selectedBookingIds, selectedBookingLinesCnt} = this.props;
        const selectedBookings = this.props.bookings.filter(booking => selectedBookingIds.includes(booking.id));
        const puAvailFromDateCnt = _.uniqBy(selectedBookings, 'puPickUpAvailFrom_Date').length;
        const bookedCnt = selectedBookings.filter(booking => booking.b_status==='Booked').length;
        const notBookedCnt = selectedBookingIds.length - bookedCnt;
        const fpCnt = _.uniqBy(selectedBookings, 'vx_freight_provider').length;

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
                        <span className={notBookedCnt > 0 ? 'red' : ''}>
                            # Not booked Count: {notBookedCnt}
                        </span>
                    </label>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="primary"
                        onClick={() => this.props.onCreateOrder(selectedBookingIds, selectedBookings[0].vx_freight_provider)}
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

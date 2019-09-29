import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { Button, Modal as ReactstrapModal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import _ from 'lodash';

class STOrderModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleShow: PropTypes.func.isRequired,
        onCreateOrder: PropTypes.func.isRequired,
        selectedBookingIds: PropTypes.array.isRequired,
        selectedBookingLinesCnt: PropTypes.number.isRequired,
        bookings: PropTypes.array.isRequired,
    };

    static defaultProps = {
        isOpen: false,
    };

    render() {
        const {isOpen} = this.props;
        const selectedBookings = this.props.bookings.filter(booking => this.props.selectedBookingIds.includes(booking.id));
        const puPickUpAvailFromDateCnt = _.uniqBy(selectedBookings, 'puPickUpAvailFrom_Date').length;
        const bookedCnt = this.props.bookings.filter(booking => booking.b_status==='Booked').length;

        return (
            <ReactstrapModal isOpen={isOpen} className="find-modal">
                <ModalHeader toggle={this.props.toggleShow}>StarTrack Order Modal</ModalHeader>
                <ModalBody>
                    <h4>
                        Please review info before creating the order.
                    </h4>
                    <label>
                        <span>
                            # There are {this.props.selectedBookingIds.length} Bookings with {this.props.selectedBookingLinesCnt} number of packages added together for the selected Bookings.
                        </span><br />
                        <span className={puPickUpAvailFromDateCnt > 1 ? 'red' : ''}>
                            # There are {puPickUpAvailFromDateCnt} `Pick Up Available From Date`;
                        </span><br />
                        <span className={this.props.selectedBookingIds.length - bookedCnt > 0 ? 'red' : ''}>
                            # Not booked Count: {this.props.selectedBookingIds.length - bookedCnt}
                        </span>
                    </label>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="primary"
                        onClick={() => this.props.onCreateOrder(this.props.selectedBookingIds)}
                        disabled={puPickUpAvailFromDateCnt > 1 || (this.props.selectedBookingIds.length - bookedCnt > 0) 
                            ? 'disabled' : ''}
                    >
                        Create
                    </Button>
                    <Button color="secondary" onClick={() => this.props.toggleShow()}>Cancel</Button>
                </ModalFooter>
            </ReactstrapModal>
        );
    }
}

export default STOrderModal;

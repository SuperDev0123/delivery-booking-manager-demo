import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { Button, Modal as ReactstrapModal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class StatusLockModal extends Component {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleShowStatusLockModal: PropTypes.func.isRequired,
        onClickUpdate: PropTypes.func.isRequired,
        booking: PropTypes.object.isRequired,
    };

    render() {
        const {isOpen, booking} = this.props;

        return (
            <ReactstrapModal isOpen={isOpen} toggle={() => this.props.toggleShowStatusLockModal()} className="status-lock-modal">
                <ModalHeader toggle={() => this.props.toggleShowStatusLockModal()}>Booking Lock Status Change</ModalHeader>
                <ModalBody>
                    <label>
                        {
                            booking ? <p>Booking ID: {booking.b_bookingID_Visual}</p> : null
                        }
                        <p>There is a POD softlock on this record that has set status to Delivered. Do you want this soft lock to be taken off?</p>
                    </label>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => this.props.onClickUpdate(booking)}>Force Update</Button>
                    <Button color="secondary" onClick={() => this.props.toggleShowStatusLockModal()}>Cancel</Button>
                </ModalFooter>
            </ReactstrapModal>
        );
    }
}

export default StatusLockModal;

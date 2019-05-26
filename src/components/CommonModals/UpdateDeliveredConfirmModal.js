import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { Button, Modal as ReactstrapModal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class UpdateDeliveredConfirmModal extends Component {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleUpdateDeliveredConfirmModal: PropTypes.func.isRequired,
        onConfirm: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
    };

    render() {
        const {isOpen} = this.props;

        return (
            <ReactstrapModal isOpen={isOpen} className="delivered-confirm-modal">
                <ModalHeader toggle={this.props.onCancel}>Delivered Booking!</ModalHeader>
                <ModalBody>
                    There is a delivered status in history / do you want to clear it so that delivered count is not calculated ?
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.props.onConfirm}>Confirm</Button>
                    <Button color="secondary" onClick={this.props.onCancel}>Cancel</Button>
                </ModalFooter>
            </ReactstrapModal>
        );
    }
}

export default UpdateDeliveredConfirmModal;

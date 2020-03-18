import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { Button, Modal as ReactstrapModal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class CheckPodModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isPODChecked: null,
        };
    }

    static propTypes = {
        isOpen: PropTypes.bool,
        toggleCheckPodModal: PropTypes.func,
        onClickSave: PropTypes.func.isRequired,
        booking: PropTypes.object.isRequired,
    };

    static defaultProps = {
        isOpen: false,
    };

    onInputChange(e) {
        this.setState({isPODChecked: e.target.checked});
    }

    onClickSave() {
        const {isPODChecked} = this.state;
        const {booking} = this.props;

        let newBooking = booking;
        newBooking.check_pod = isPODChecked;

        this.props.onClickSave(newBooking.id, newBooking);
        this.props.toggleCheckPodModal();
        this.setState({isPODChecked: null});
    }

    render() {
        const {isOpen, booking} = this.props;
        const {isPODChecked} = this.state;
        let isPODCheckedVar = isPODChecked;

        if (isPODCheckedVar === null && booking) {
            isPODCheckedVar = booking.check_pod;
        }

        return (
            <ReactstrapModal isOpen={isOpen} toggle={() => this.props.toggleCheckPodModal()} className="check-pod-modal">
                <ModalHeader toggle={() => this.props.toggleCheckPodModal()}>Check POD status Modal</ModalHeader>
                <ModalBody>
                    <label>
                        <p>Checked POD? </p>
                        <input type="checkbox" name="isPODChecked" className="checkbox" checked={isPODCheckedVar} onChange={(e) => this.onInputChange(e)} />
                    </label>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => this.onClickSave()}>Save</Button>
                    <Button color="secondary" onClick={() => this.props.toggleCheckPodModal()}>Cancel</Button>
                </ModalFooter>
            </ReactstrapModal>
        );
    }
}

export default CheckPodModal;

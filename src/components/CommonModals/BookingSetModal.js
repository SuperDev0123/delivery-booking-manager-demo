import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { Button, Modal as ReactstrapModal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class BookingSetModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggle: PropTypes.func.isRequired,
    };

    static defaultProps = {
        isOpen: false,
    };

    render() {
        const {isOpen} = this.props;

        return (
            <ReactstrapModal isOpen={isOpen} className="find-modal">
                <ModalHeader toggle={this.props.toggle}>BookingSet Modal</ModalHeader>
                <ModalBody>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="primary"
                    >
                        Create
                    </Button>
                    <Button color="secondary" onClick={() => this.props.toggle()}>Cancel</Button>
                </ModalFooter>
            </ReactstrapModal>
        );
    }
}

export default BookingSetModal;
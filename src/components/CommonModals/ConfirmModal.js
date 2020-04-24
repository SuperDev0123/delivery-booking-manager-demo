import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { Button, Modal as ReactstrapModal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class ConfirmModal extends Component {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        onOk: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
        title: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        okBtnName: PropTypes.string.isRequired,
        onOk2: PropTypes.func,
        ok2BtnName: PropTypes.string,
    };

    render() {
        const {isOpen, text, title, okBtnName, ok2BtnName} = this.props;

        return (
            <ReactstrapModal isOpen={isOpen} className="confirm-modal">
                <ModalHeader toggle={this.props.onCancel}>{title}</ModalHeader>
                <ModalBody>
                    {text}
                </ModalBody>
                <ModalFooter>
                    <Button color={okBtnName === 'Delete' ? 'danger' : 'primary'} onClick={this.props.onOk}>{okBtnName}</Button>
                    {ok2BtnName &&
                        <Button color={okBtnName === 'Delete' ? 'danger' : 'primary'} onClick={this.props.onOk2}>{ok2BtnName}</Button>
                    }
                    <Button color="secondary" onClick={this.props.onCancel}>Cancel</Button>
                </ModalFooter>
            </ReactstrapModal>
        );
    }
}

export default ConfirmModal;

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Button, Modal as ReactstrapModal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class StatusNoteModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            note: '',
        };
    }

    static propTypes = {
        isShowStatusNoteModal: PropTypes.bool,
        toggleStatusNoteModal: PropTypes.func,
        onUpdate: PropTypes.func.isRequired,
        onClear: PropTypes.func.isRequired,
        note: PropTypes.string,
        isEditable: PropTypes.bool,
        fieldName: PropTypes.string,
    };

    static defaultProps = {
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({note: nextProps.note});
    }

    handleInputChange(e) {
        this.setState({note: e.target.value});
    }
    
    render() {
        const {note} = this.state;
        const {isShowStatusNoteModal, isEditable, fieldName} = this.props;
        let title = '';

        if (fieldName === 'dme_status_history_notes') {
            title = 'DME Status History Note';
        } else if (fieldName === 'inv_billing_status_note') {
            title = 'Invoice Billing Status Note';
        } else if (fieldName === 'dme_client_notes') {
            title = 'DME Client Notes';
        }

        title = isEditable ? title : title + ' (View Only)';

        return (
            <ReactstrapModal isOpen={isShowStatusNoteModal} toggle={() => this.props.toggleStatusNoteModal()} className="status-note-modal">
                <ModalHeader toggle={() => this.props.toggleStatusNoteModal()}>{title}</ModalHeader>
                <ModalBody>
                    <label>
                        <p>Status Note: </p>
                        <textarea
                            className="form-control"
                            value={note}
                            onChange={(e) => this.handleInputChange(e)}
                            disabled={isEditable ? '' : 'disabled'}
                        />
                    </label>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" disabled={isEditable ? false : true} onClick={() => this.props.onClear()}>Clear</Button>
                    <Button color="primary" disabled={isEditable ? false : true} onClick={() => this.props.onUpdate(note)}>Save</Button>
                    <Button color="secondary" onClick={() => this.props.toggleStatusNoteModal()}>Cancel</Button>
                </ModalFooter>
            </ReactstrapModal>
        );
    }
}

export default StatusNoteModal;

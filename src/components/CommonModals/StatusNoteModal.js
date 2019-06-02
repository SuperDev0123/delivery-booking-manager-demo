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
        toggleShowStatusNoteModal: PropTypes.func,
        onUpdateStatusNote: PropTypes.func.required,
        note: PropTypes.string.required,
        isEditable: PropTypes.bool,
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
        const {isShowStatusNoteModal, isEditable} = this.props;

        return (
            <ReactstrapModal isOpen={isShowStatusNoteModal} toggle={() => this.props.toggleShowStatusNoteModal()} className="status-note-modal">
                <ModalHeader toggle={() => this.props.toggleShowStatusNoteModal()}>{isEditable ? 'Status Note' : 'Status Note (Only View)'}</ModalHeader>
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
                    <Button color="primary" onClick={() => this.props.onUpdateStatusNote(note)}>Save</Button>
                    <Button color="secondary" onClick={() => this.props.toggleShowStatusNoteModal()}>Cancel</Button>
                </ModalFooter>
            </ReactstrapModal>
        );
    }
}

export default StatusNoteModal;

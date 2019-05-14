import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { Button, Modal as ReactstrapModal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import EditorPreview from '../EditorPreview/EditorPreview';

class NoteDetailModal extends Component {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleNoteDetailModal: PropTypes.func.isRequired,
        selectedNoteDetail: PropTypes.string.isRequired,
    };

    render() {
        const {isOpen, selectedNoteDetail} = this.props;

        return (
            <ReactstrapModal isOpen={isOpen} toggle={this.props.toggleNoteDetailModal} className="note-detail-modal">
                <ModalHeader toggle={this.props.toggleNoteDetailModal}>Note Detail</ModalHeader>
                <ModalBody>
                    <EditorPreview data={selectedNoteDetail} />
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.props.toggleNoteDetailModal}>Cancel</Button>
                </ModalFooter>
            </ReactstrapModal>
        );
    }
}

export default NoteDetailModal;

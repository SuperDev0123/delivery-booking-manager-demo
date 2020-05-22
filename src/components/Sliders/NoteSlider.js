import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment-timezone';
import { Button } from 'reactstrap';
import _ from 'lodash';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import CKEditor from 'ckeditor4-react';
import DateTimePicker from 'react-datetime-picker';

import EditorPreview from '../EditorPreview/EditorPreview';
import NoteDetailModal from '../CommonModals/NoteDetailModal';
import ConfirmModal from '../CommonModals/ConfirmModal';

class NoteSlider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isShowNoteForm: false,
            noteFormMode: 'create',
            noteFormInputs: {},
            selectedNoteNo: 0,
            selectedNoteDetail: null,
            isShowNoteDetailModal: false,
            isShowDeleteNoteConfirmModal: false,
            formInputs: {
                status_last: 'Entered',
            },
        };

        moment.tz.setDefault('Australia/Sydney');
        this.tzOffset = new Date().getTimezoneOffset() === 0 ? 0 : -1 * new Date().getTimezoneOffset() / 60;
        this.toggleNoteDetailModal = this.toggleNoteDetailModal.bind(this);
        this.toggleDeleteNoteConfirmModal = this.toggleDeleteNoteConfirmModal.bind(this);
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleNoteSlider: PropTypes.func.isRequired,
        createNote: PropTypes.func.isRequired,
        updateNote: PropTypes.func.isRequired,
        deleteNote: PropTypes.func.isRequired,
        notes: PropTypes.array.isRequired,
        username: PropTypes.string.isRequired,
        selectedCommId: PropTypes.number.isRequired,
    };

    onSubmitNote() {
        const {noteFormInputs, selectedNoteId, noteFormMode} = this.state;
        const {selectedCommId, notes} = this.props;

        if (noteFormMode === 'create') {
            let newNote = _.clone(noteFormInputs);
            newNote['comm'] = selectedCommId;
            newNote['username'] = 'Stephen';
            newNote['dme_notes_no'] = (notes.length > 0) ? parseInt(notes[notes.length - 1]['dme_notes_no']) + 1 : 1;
            newNote['note_date_updated'] = moment(newNote['note_date_updated']).format('YYYY-MM-DD');
            newNote['note_date_created'] = newNote['note_date_updated'];
            newNote['note_time_created'] = newNote['note_time_updated'];
            this.props.createNote(newNote);
        } else if (noteFormMode === 'update') {
            let newNote = _.clone(noteFormInputs);
            newNote['comm'] = selectedCommId;
            newNote['note_date_updated'] = moment(newNote['note_date_updated']).format('YYYY-MM-DD');
            delete newNote.z_modifiedTimeStamp;
            this.props.updateNote(selectedNoteId, newNote);
        }

        this.setState({isShowNoteForm: false, noteFormInputs: {}});
    }

    onCreateNoteButton() {
        this.setState({isShowNoteForm: true, noteFormMode: 'create', noteFormInputs: {}});
    }

    onCancelNoteForm() {
        this.setState({isShowNoteForm: false});
    }

    onUpdateBtnClick(type, data, index=0) {
        console.log('Update type: ', type);

        let note = {};
        const {notes} = this.props;

        for (let i = 0; i < notes.length; i++) {
            if (notes[i].id === data.id) {
                note = notes[i];
            }
        }

        const noteFormInputs = note;
        noteFormInputs['updated_timestamp'] = note.note_date_updated ? moment(note.note_date_updated + ' ' + note.note_time_updated, 'YYYY-MM-DD HH:mm:ss').toDate() : null;
        this.setState({selectedNoteNo: index, selectedNoteId: note.id, noteFormInputs});
        this.setState({isShowNoteForm: true, noteFormMode: 'update'});
    }

    onDeleteBtnClick(type, data) {
        console.log('Update type: ', type);
        this.setState({selectedNoteId: data.id});
        this.toggleDeleteNoteConfirmModal();
    }

    onConfirmDeleteNote() {
        this.props.deleteNote(this.state.selectedNoteId);
        this.toggleDeleteNoteConfirmModal();
    }

    onChangeDateTime(date) {
        const noteFormInputs = this.state.noteFormInputs;
        let conveted_date = moment(date).tz('Etc/UTC');
        conveted_date = conveted_date.add(this.tzOffset, 'h');
        conveted_date = moment(conveted_date).tz('Australia/Sydney');

        noteFormInputs['updated_timestamp'] = date;
        noteFormInputs['note_date_updated'] = moment(conveted_date).format('YYYY-MM-DD');
        noteFormInputs['note_time_updated'] = moment(conveted_date).format('HH:mm:ssZ');
        this.setState({noteFormInputs});
    }

    onEditorChange(type, from, event) {
        if (type === 'note' && from === 'comm') {
            let commFormInputs = this.state.commFormInputs;
            commFormInputs['dme_notes'] = event.editor.getData();
            this.setState({commFormInputs});
        } else if (type === 'note' && from === 'note') {
            let noteFormInputs = this.state.noteFormInputs;
            noteFormInputs['dme_notes'] = event.editor.getData();
            this.setState({noteFormInputs});
        }
    }

    handleModalInputChange(type, event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        if (type === 'comm') {
            let commFormInputs = this.state.commFormInputs;
            commFormInputs[name] = value;
            this.setState({commFormInputs});
        } else if (type === 'note') {
            let noteFormInputs = this.state.noteFormInputs;
            noteFormInputs[name] = value;
            this.setState({noteFormInputs});
        }
    }

    toggleNoteDetailModal() {
        this.setState(prevState => ({isShowNoteDetailModal: !prevState.isShowNoteDetailModal}));
    }

    toggleDeleteNoteConfirmModal() {
        this.setState(prevState => ({isShowDeleteNoteConfirmModal: !prevState.isShowDeleteNoteConfirmModal}));
    }

    onClickNoteDetailCell(note) {
        this.setState({selectedNoteDetail: note.dme_notes});
        this.toggleNoteDetailModal();
    }

    render() {
        const {selectedNoteNo, isShowNoteForm, noteFormInputs, noteFormMode, isShowNoteDetailModal, selectedNoteDetail} = this.state;
        const {isOpen, notes, username} = this.props;

        const notesList = notes.map((note, index) => {
            return (
                <tr key={index}>
                    <td>{notes.length - index}</td>
                    <td>{(note.note_date_updated && !_.isEmpty(note.note_date_updated)) ? moment(note.note_date_updated).format('DD MMM YYYY') : null}</td>
                    <td>{(note.note_time_updated && !_.isEmpty(note.note_time_updated)) ? note.note_time_updated : null}</td>
                    <td>{note.username}</td>
                    <td>{note.dme_notes_type}</td>
                    <td className='overflow-hidden' id={'note-detail-tooltip-' + note.id} onClick={() => this.onClickNoteDetailCell(note)}>
                        <EditorPreview data={note.dme_notes} />
                    </td>
                    <td className="update">
                        <Button color="primary" onClick={() => this.onUpdateBtnClick('note', note, index)}>
                            <i className="icon icon-edit"></i>
                        </Button>
                    </td>
                    <td className="update">
                        <Button color="danger" onClick={() => this.onDeleteBtnClick('note', note)}>
                            <i className="icon icon-trash"></i>
                        </Button>
                    </td>
                </tr>
            );
        });

        return(
            <SlidingPane
                className='note-pan'
                overlayClassName='note-pan-overlay'
                isOpen={isOpen}
                title='Note Panel'
                subtitle={!isShowNoteForm ? 'List view' : 'Form view'}
                onRequestClose={this.props.toggleNoteSlider}
            >
                <div className="slider-content">
                    {
                        !isShowNoteForm ?
                            <div className="table-view">
                                <div className="button-group">
                                    <Button color="primary" onClick={() => this.onCreateNoteButton()}>
                                        +
                                    </Button>
                                </div>
                                <div className="table-responsive">
                                    <table className="table table-hover table-bordered sortable fixed_headers">
                                        <tr>
                                            <th className="" scope="col" nowrap>
                                                <p>Note No</p>
                                            </th>
                                            <th className="" scope="col" nowrap>
                                                <p>Date Entered</p>
                                            </th>
                                            <th className="" scope="col" nowrap>
                                                <p>Time Entered</p>
                                            </th>
                                            <th className="" scope="col" nowrap>
                                                <p>User</p>
                                            </th>
                                            <th className="" scope="col" nowrap>
                                                <p>Note Type</p>
                                            </th>
                                            <th className="" scope="col" nowrap>
                                                <p>Note</p>
                                            </th>
                                            <th className="" scope="col" nowrap>
                                                <p>Update</p>
                                            </th>
                                            <th className="" scope="col" nowrap>
                                                <p>Delete</p>
                                            </th>
                                        </tr>
                                        { notesList }
                                    </table>
                                </div>
                            </div>
                            :
                            <div className="form-view">
                                <h2>{(noteFormMode === 'create') ? 'Create' : 'Update'} a note</h2>
                                <label>
                                    <p>Note No</p>
                                    <input 
                                        className="form-control" 
                                        type="text" 
                                        disabled="disabled"
                                        name="dme_no" 
                                        value={(noteFormMode === 'create') ? notes.length + 1 : selectedNoteNo + 1} />
                                </label>
                                <br />
                                <label>
                                    <p>Updated Timestamp</p>
                                    <DateTimePicker
                                        onChange={(date) => this.onChangeDateTime(date)}
                                        value={noteFormInputs['updated_timestamp'] ? new Date(moment(noteFormInputs['updated_timestamp']).toDate().toLocaleString('en-US', {timeZone: 'UTC'})) : null}
                                        format={'dd/MM/yyyy HH:mm'}
                                    />
                                </label>
                                <label>
                                    <p>User</p>
                                    <input 
                                        className={(noteFormMode === 'update' && username !== noteFormInputs['username']) ? 'form-control orange-color' : 'form-control'}
                                        type="text" 
                                        placeholder="" 
                                        name="username" 
                                        value = {noteFormInputs['username']}
                                        onChange={(e) => this.handleModalInputChange('note', e)} />
                                </label>
                                <br />
                                <label>
                                    <p>Note Type</p>
                                    <select
                                        required 
                                        name="dme_notes_type" 
                                        onChange={(e) => this.handleModalInputChange('note', e)}
                                        value = {noteFormInputs['dme_notes_type']}
                                    >
                                        <option value="" selected disabled hidden>Select a note type</option>
                                        <option value="Call">Call</option>
                                        <option value="Email">Email</option>
                                        <option value="SMS">SMS</option>
                                        <option value="Letter">Letter</option>
                                        <option value="Note">Note</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </label>
                                <br />
                                <label className="editor">
                                    <p>Note</p>
                                    <CKEditor
                                        data={noteFormInputs['dme_notes']}
                                        onChange={(e) => this.onEditorChange('note', 'note', e)} />
                                </label>
                                <br />
                                <div className="button-group">
                                    <Button color="primary" onClick={() => this.onSubmitNote()}>
                                        {
                                            (noteFormMode === 'create') ? 'Create' : 'Update'
                                        }
                                    </Button>{' '}
                                    <Button color="secondary" onClick={() => this.onCancelNoteForm()}>Cancel</Button>
                                </div>
                            </div>
                    }

                    <NoteDetailModal
                        isOpen={isShowNoteDetailModal}
                        toggleNoteDetailModal={this.toggleNoteDetailModal}
                        selectedNoteDetail={selectedNoteDetail}
                    />

                    <ConfirmModal
                        isOpen={this.state.isShowDeleteNoteConfirmModal}
                        onOk={() => this.onConfirmDeleteNote()}
                        onCancel={this.toggleDeleteNoteConfirmModal}
                        title={'Delete Note'}
                        text={'Are you sure that you are going to delete this Note?'}
                        okBtnName={'Delete'}
                    />
                </div>
            </SlidingPane>
        );
    }
}

export default NoteSlider;

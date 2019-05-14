import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment-timezone';
import { Button } from 'reactstrap';
import _ from 'lodash';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import CKEditor from 'ckeditor4-react';

import {timeSelectOptions} from '../../commons/constants';
import EditorPreview from '../EditorPreview/EditorPreview';
import NoteDetailModal from '../CommonModals/NoteDetailModal';

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
            formInputs: {
                status_last: 'Entered',
            },
        };

        this.toggleNoteDetailModal = this.toggleNoteDetailModal.bind(this);
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleShowNoteSlider: PropTypes.func.isRequired,
        createNote: PropTypes.func.isRequired,
        updateNote: PropTypes.func.isRequired,
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
        this.setState({selectedNoteNo: index, selectedNoteId: note.id, noteFormInputs});
        this.setState({isShowNoteForm: true, noteFormMode: 'update'});
    }

    onDatePlusOrMinus(type='comm', number) {
        console.log('Type - ', type);

        let noteFormInputs = this.state.noteFormInputs;
        noteFormInputs['note_date_updated'] = moment(noteFormInputs['note_date_updated']).add(number, 'd').toDate();
        this.setState({noteFormInputs});
    }

    clearDateOrTime(type, dateOrTime) {
        let noteFormInputs = this.state.noteFormInputs;

        if (type === 'note') {
            if (dateOrTime === 'date') {
                noteFormInputs['note_date_updated'] = null;
            } else if (dateOrTime === 'time') {
                noteFormInputs['note_time_updated'] = null;
            }

            this.setState({noteFormInputs});
        }
    }

    onDateChange(type='comm', date) {
        if (type === 'note') {
            let noteFormInputs = this.state.noteFormInputs;
            noteFormInputs['note_date_updated'] = moment(date).toDate();
            this.setState({noteFormInputs});
        }
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

    onClickNoteDetailCell(note) {
        this.setState({selectedNoteDetail: note.dme_notes});
        this.toggleNoteDetailModal();
    }

    render() {
        const {selectedNoteNo, isShowNoteForm, noteFormInputs, noteFormMode, isShowNoteDetailModal, selectedNoteDetail} = this.state;
        const {isOpen, notes, username} = this.props;

        const note_time_updated = {value: noteFormInputs['note_time_updated'], label: noteFormInputs['note_time_updated']};

        const notesList = notes.map((note, index) => {
            return (
                <tr key={index}>
                    <td>{note.dme_notes_no}</td>
                    <td>{(note.note_date_updated && !_.isEmpty(note.note_date_updated)) ? moment(note.note_date_updated).format('DD MMM YYYY') : ''}</td>
                    <td>{(note.note_time_updated && !_.isEmpty(note.note_time_updated)) ? note.note_time_updated : ''}</td>
                    <td>{note.username}</td>
                    <td>{note.dme_notes_type}</td>
                    <td className='overflow-hidden' id={'note-detail-tooltip-' + note.id} onClick={() => this.onClickNoteDetailCell(note)}>
                        <EditorPreview data={note.dme_notes} />
                    </td>
                    <td className="update"><Button color="primary" onClick={() => this.onUpdateBtnClick('note', note, index)}>Update</Button></td>
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
                onRequestClose={this.props.toggleShowNoteSlider}
            >
                <div className="slider-content">
                    {
                        !isShowNoteForm ?
                            <div className="table-view">
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
                                        </tr>
                                        { notesList }
                                    </table>
                                </div>
                                <div className="button-group">
                                    <Button color="primary" onClick={() => this.onCreateNoteButton()}>Create</Button>
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
                                <div className={(noteFormMode === 'update' && noteFormInputs['note_date_created'] !== noteFormInputs['note_date_updated']) ? 'datetime date orange-color' : 'datetime date' } >
                                    <p>Date</p>
                                    <div >
                                        <div className="date-adjust" onClick={() => this.onDatePlusOrMinus('note', -1)}><i className="fa fa-minus"></i></div>
                                        <DatePicker
                                            selected={moment(noteFormInputs['note_date_updated']).toDate()}
                                            onChange={(e) => this.onDateChange('note', e)}
                                            dateFormat="dd MMM yyyy"
                                        />
                                        <div className="date-adjust" onClick={() => this.onDatePlusOrMinus('note', 1)}><i className="fa fa-plus"></i></div>
                                        <button className="button-clear" onClick={() => this.clearDateOrTime('note', 'date')}><i className="fa fa-times-circle"></i></button>
                                    </div>
                                </div>
                                <div className={(noteFormMode === 'update' && noteFormInputs['note_time_created'] !== noteFormInputs['note_time_updated']) ? 'datetime time orange-color' : 'datetime time' }>
                                    <p>Time</p>
                                    <Select
                                        value={note_time_updated}
                                        onChange={(e) => this.handleModalInputChange('note', {target: {name: 'note_time_updated', value: e.value, type: 'input'}})}
                                        options={timeSelectOptions}
                                        placeholder='Select time'
                                    />
                                    <button className="button-clear" onClick={() => this.clearDateOrTime('note', 'time')}><i className="fa fa-times-circle"></i></button>
                                </div>
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
                                        value = {noteFormInputs['dme_notes_type']} >
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
                </div>
            </SlidingPane>
        );
    }
}

export default NoteSlider;

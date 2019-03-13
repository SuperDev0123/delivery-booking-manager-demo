import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import moment from 'moment-timezone';
import Modal from 'react-modal';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import { Button, Modal as ReactstrapModal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';

import { verifyToken, cleanRedirectState } from '../state/services/authService';
import { getBookingWithFilter } from '../state/services/bookingService';
import { getCommsWithBookingId, updateComm, setGetCommsFilter, getNotes, createNote, updateNote } from '../state/services/commService';

class CommPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            booking: {},
            comms: [],
            notes: [],
            simpleSearchKeyword: '',
            showSimpleSearchBox: false,
            sortDirection: -1,
            sortField: 'id',
            filterInputs: {},
            isNotePaneOpen: false,
            selectedCommId: null,
            selectedNoteId: null,
            isShowNoteForm: false,
            isShowUpdateCommModal: false,
            noteFormMode: 'create',
            noteFormInputs: {},
            commFormInputs: {},
        };

        this.toggleUpdateCommModal = this.toggleUpdateCommModal.bind(this);
    }

    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
        getBookingWithFilter: PropTypes.func.isRequired,
        getCommsWithBookingId: PropTypes.func.isRequired,
        updateComm: PropTypes.func.isRequired,
        setGetCommsFilter: PropTypes.func.isRequired,
        getNotes: PropTypes.func.isRequired,
        createNote: PropTypes.func.isRequired,
        updateNote: PropTypes.func.isRequired,
    };

    componentDidMount() {
        const token = localStorage.getItem('token');

        if (token && token.length > 0) {
            this.props.verifyToken();
        } else {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/');
        }

        var urlParams = new URLSearchParams(window.location.search);
        var bookingId = urlParams.get('bookingid');

        if (bookingId != null) {
            this.props.getBookingWithFilter(bookingId, 'id');
            this.props.getCommsWithBookingId(bookingId);
        } else {
            console.log('Booking ID is null');
        }

        Modal.setAppElement(this.el);
    }

    componentWillReceiveProps(newProps) {
        const { redirect, booking, comms, needUpdateComms, sortField, columnFilters, notes, needUpdateNotes } = newProps;
        const { selectedCommId } = this.state;
        const currentRoute = this.props.location.pathname;

        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/');
        }

        if (booking) {
            this.setState({booking});
        }

        if (comms) {
            this.setState({comms});
        }

        if (notes) {
            this.setState({notes});
        }

        if (needUpdateComms) {
            this.props.getCommsWithBookingId(booking.id, sortField, columnFilters);
        }

        if (needUpdateNotes) {
            this.props.getNotes(selectedCommId);
        }
    }

    onClickSimpleSearch() {

    }

    onSimpleSarchInputChange(e) {
        this.setState({simpleSearchKeyword: e.target.value});
    }

    onSimpleSearch(e) {
        e.preventDefault();
    }

    onChangeSortField(fieldName) {
        let sortField = this.state.sortField;
        let sortDirection = this.state.sortDirection;

        if (fieldName === sortField)
            sortDirection = -1 * sortDirection;
        else
            sortDirection = -1;

        this.setState({sortField: fieldName, sortDirection});

        if (sortDirection < 0)
            this.props.setGetCommsFilter('sortField', '-' + fieldName);
        else
            this.props.setGetCommsFilter('sortField', fieldName);
    }

    onCheck(e, id, index) {
        if (e.target.name === 'closed') {
            let updatedComm = {};

            if (e.target.checked)
                updatedComm = {
                    closed: e.target.checked,
                    status_log_closed_time: moment(),
                };
            else
                updatedComm = {
                    closed: e.target.checked,
                    status_log_closed_time: null,
                };

            let updatedComms = this.state.comms;
            updatedComms[index].closed = e.target.checked;
            this.props.updateComm(id, updatedComm);
            this.setState({comms: updatedComms});
        }
    }

    onChangeFilterInput(e) {
        let filterInputs = this.state.filterInputs;
        filterInputs[e.target.name] = e.target.value;
        this.setState({filterInputs});
    }

    onKeyPress(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            let filterInputs = this.state.filterInputs;
            filterInputs[e.target.name] = e.target.value;
            this.setState({filterInputs});
            this.props.setGetCommsFilter('columnFilters', filterInputs);
        }
    }

    onClickCommIdCell(comm) {
        console.log('Comm ID: ', comm.id);

        this.setState({ isNotePaneOpen: true, selectedCommId: comm.id });
        this.props.getNotes(comm.id);
    }

    onCreateNoteButton() {
        this.setState({isShowNoteForm: true, noteFormMode: 'create'});
    }

    onCancel() {
        this.setState({isShowNoteForm: false});
    }

    onSubmitNote() {
        const {noteFormInputs, selectedNoteId, selectedCommId, notes, noteFormMode} = this.state;
        
        if (noteFormMode === 'create') {
            noteFormInputs['comm'] = selectedCommId;
            noteFormInputs['username'] = 'Stephen';
            noteFormInputs['dme_notes_no'] = (notes.length > 0) ? parseInt(notes[notes.length - 1]['dme_notes_no']) + 1 : 1;
            this.props.createNote(noteFormInputs);
        } else if (noteFormMode === 'update') {
            noteFormInputs['comm'] = selectedCommId;
            delete noteFormInputs.z_modifiedTimeStamp;
            this.props.updateNote(selectedNoteId, noteFormInputs);
        }

        this.setState({isShowNoteForm: false, noteFormInputs: {}});
    }

    onClickHeader(e) {
        e.preventDefault();
        window.location.assign('/booking?bookingid=' + this.state.booking.id);
    }

    onUpdateBtnClick(type, data) {
        console.log('Click update comm button');
        
        if (type === 'comm') {
            const comm = data;
            const commFormInputs = comm;
            commFormInputs['due_by_time'] = comm.due_by_time.substring(0, 5);
            this.setState({selectedCommId: comm.id, commFormInputs});
            this.toggleUpdateCommModal();
        } else if (type === 'note') {
            const note = data;
            const noteFormInputs = note;
            this.setState({selectedNoteId: note.id, noteFormInputs});
            this.setState({isShowNoteForm: true, noteFormMode: 'update'});
        }
    }

    toggleUpdateCommModal() {
        this.setState(prevState => ({isShowUpdateCommModal: !prevState.isShowUpdateCommModal}));
    }

    onUpdate(type) {
        console.log('Update comm');

        if (type === 'comm') {
            const {selectedCommId, commFormInputs} = this.state;

            this.props.updateComm(selectedCommId, commFormInputs);
            this.toggleUpdateCommModal();
        } else if (type === 'note') {
            const {selectedNoteId, noteFormInputs} = this.state;

            this.props.updateComm(selectedNoteId, noteFormInputs);
            this.setState({isShowNoteForm: false});
        }
    }

    onDatePlusOrMinus(number) {
        console.log('number - ', number);

        let commFormInputs = this.state.commFormInputs;
        const date = moment(commFormInputs['due_by_date']).add(number, 'd').format('YYYY-MM-DD');
        commFormInputs['due_by_date'] = date;
        this.setState({commFormInputs});
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

    onDateChange(date) {
        let commFormInputs = this.state.commFormInputs;
        commFormInputs['due_by_date'] = moment(date).format('YYYY-MM-DD');
        this.setState({commFormInputs});
    }

    render() {
        const { showSimpleSearchBox, simpleSearchKeyword, comms, booking, sortField, sortDirection, filterInputs, isNotePaneOpen, notes, isShowNoteForm, noteFormInputs, commFormInputs, isShowUpdateCommModal, noteFormMode } = this.state;

        const commsList = comms.map((comm, index) => {
            return (
                <tr key={index}>
                    <td onClick={() => this.onClickCommIdCell(comm)}>{comm.id}</td>
                    <td>{booking.b_bookingID_Visual}</td>
                    <td>{booking.b_status}</td>
                    <td>{booking.vx_freight_Provider}</td>
                    <td>{booking.puCompany}</td>
                    <td>{booking.deToCompanyName}</td>
                    <td>{booking.v_FPBookingNumber}</td>
                    <td>{comm.priority_of_log}</td>
                    <td>{comm.assigned_to}</td>
                    <td>{comm.dme_notes_type}</td>
                    <td>{comm.query}</td>
                    <td>{comm.dme_action}</td>
                    <td><input type="checkbox" checked={comm.closed} name="closed" onChange={(e) => this.onCheck(e, comm.id, index)} /></td>
                    <td>{comm.status_log_closed_time ? moment(comm.status_log_closed_time).format('DD/MM/YYYY hh:mm:ss') : ''}</td>
                    <td>{comm.dme_detail}</td>
                    <td>{comm.dme_notes_external}</td>
                    <td>{comm.due_by_date}</td>
                    <td>{comm.due_by_time}</td>
                    <td className="update"><Button color="primary" onClick={() => this.onUpdateBtnClick('comm', comm)}>Update</Button></td>
                </tr>
            );
        });

        const timeSelectOptions = [
            {value: '06:00', label: '06:00'},
            {value: '06:30', label: '06:30'},
            {value: '07:00', label: '07:00'},
            {value: '07:30', label: '07:30'},
            {value: '08:00', label: '08:00'},
            {value: '08:30', label: '08:30'},
            {value: '09:00', label: '09:00'},
            {value: '09:30', label: '09:30'},
            {value: '10:00', label: '10:00'},
            {value: '10:30', label: '10:30'},
            {value: '11:00', label: '11:00'},
            {value: '11:30', label: '11:30'},
            {value: '12:00', label: '12:00'},
            {value: '12:30', label: '12:30'},
            {value: '13:00', label: '13:00'},
            {value: '13:30', label: '13:30'},
            {value: '14:00', label: '14:00'},
            {value: '14:30', label: '14:30'},
            {value: '15:00', label: '15:00'},
            {value: '15:30', label: '15:30'},
            {value: '16:00', label: '16:00'},
            {value: '16:30', label: '16:30'},
            {value: '17:00', label: '17:00'},
            {value: '17:30', label: '17:30'},
            {value: '18:00', label: '18:00'},
            {value: '18:30', label: '18:30'},
            {value: '19:00', label: '19:00'},
            {value: '19:30', label: '19:30'},
            {value: '20:00', label: '20:00'},
            {value: '20:30', label: '20:30'},
            {value: '21:00', label: '21:00'},
            {value: '21:30', label: '21:30'},
            {value: '22:00', label: '22:00'},
            {value: '22:30', label: '22:30'},
            {value: '23:00', label: '23:00'},
            {value: '23:30', label: '23:30'},
            {value: '00:00', label: '00:00'},
            {value: '00:30', label: '00:30'},
            {value: '01:00', label: '01:00'},
            {value: '01:30', label: '01:30'},
            {value: '02:00', label: '02:00'},
            {value: '02:30', label: '02:30'},
            {value: '03:00', label: '03:00'},
            {value: '03:30', label: '03:30'},
            {value: '04:00', label: '04:00'},
            {value: '04:30', label: '04:30'},
            {value: '05:00', label: '05:00'},
            {value: '05:30', label: '05:30'},
        ];

        const due_by_time = {value: commFormInputs['due_by_time'], label: commFormInputs['due_by_time']};

        const notesList = notes.map((note, index) => {
            return (
                <tr key={index}>
                    <td>{note.dme_notes_no}</td>
                    <td>{note.username}</td>
                    <td>{note.dme_notes_type}</td>
                    <td>{note.dme_notes}</td>
                    <td>{moment(note.z_modifiedTimeStamp).format('MM/DD/YYYY')}</td>
                    <td>{moment(note.z_modifiedTimeStamp).format('hh:mm:ss')}</td>
                    <td className="update"><Button color="primary" onClick={() => this.onUpdateBtnClick('note', note)}>Update</Button></td>
                </tr>
            );
        });

        return (
            <div className="qbootstrap-nav comm" ref={ref => this.el = ref}>
                <div id="headr" className="col-md-12">
                    <div className="col-md-7 col-sm-12 col-lg-8 col-xs-12 col-md-push-1">
                        <ul className="nav nav-tabs">
                            <li><a onClick={(e) => this.onClickHeader(e)}>Header</a></li>
                            <li><a href="/allbookings">All Bookings</a></li>
                            <li><a href="/bookinglines" className="none">Booking Lines</a></li>
                            <li><a href="/bookinglinedetails" className="none">Booking Line Datas</a></li>
                        </ul>
                    </div>
                    <div id="icn" className="col-md-4 col-sm-12 col-lg-4 col-xs-12 text-right">
                        <a href=""><i className="icon-plus" aria-hidden="true"></i></a>
                        <div className="popup" onClick={() => this.onClickSimpleSearch(0)}>
                            <i className="icon-search3" aria-hidden="true"></i>
                            {
                                showSimpleSearchBox &&
                                <div ref={this.setWrapperRef}>
                                    <form onSubmit={(e) => this.onSimpleSearch(e)}>
                                        <input className="popuptext" type="text" placeholder="Search.." name="search" value={simpleSearchKeyword} onChange={(e) => this.onSimpleSarchInputChange(e)} />
                                    </form>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className='content'>
                    <div className="table-responsive">
                        <table className="table table-hover table-bordered sortable fixed_headers">
                            <tr>
                                <th className="" onClick={() => this.onChangeSortField('id')} scope="col" nowrap>
                                    <p>ID</p>
                                    {
                                        (sortField === 'id') ?
                                            (sortDirection > 0) ?
                                                <i className="fa fa-sort-up"></i>
                                                : <i className="fa fa-sort-down"></i>
                                            : <i className="fa fa-sort"></i>
                                    }
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>Booking ID</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>Status</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>Freight Provider</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>From</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>To</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>FP Booking No</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>Priority</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>Assiged To</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>Notes Type</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>Query</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>Action</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>Closed</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>Closed Time</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>Detail</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>Notes External</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>Date</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>Time</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>Update</p>
                                </th>
                            </tr>
                            <tr>
                                <th scope="col"><input type="text" name="id" value={filterInputs['id'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                            </tr>
                            { commsList }
                        </table>
                    </div>
                </div>
                <SlidingPane
                    className='note-pan'
                    overlayClassName='note-pan-overlay'
                    isOpen={isNotePaneOpen}
                    title='Note Panel'
                    subtitle={!isShowNoteForm ? 'List view' : 'Form view'}
                    onRequestClose={() => {this.setState({ isNotePaneOpen: false });}}>
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
                                                    <p>User</p>
                                                </th>
                                                <th className="" scope="col" nowrap>
                                                    <p>Note Type</p>
                                                </th>
                                                <th className="" scope="col" nowrap>
                                                    <p>Note</p>
                                                </th>
                                                <th className="" scope="col" nowrap>
                                                    <p>Date</p>
                                                </th>
                                                <th className="" scope="col" nowrap>
                                                    <p>Time</p>
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
                                    <h2>Create a note</h2>
                                    <label>
                                        <p>Note Type</p>
                                        <input 
                                            className="form-control" 
                                            type="text" 
                                            placeholder="" 
                                            name="dme_notes_type" 
                                            value = {noteFormInputs['dme_notes_type']}
                                            onChange={(e) => this.handleModalInputChange('note', e)} />
                                    </label>
                                    <br />
                                    <label>
                                        <p>Note</p>
                                        <input 
                                            className="form-control" 
                                            type="text" 
                                            placeholder="" 
                                            name="dme_notes" 
                                            value = {noteFormInputs['dme_notes']}
                                            onChange={(e) => this.handleModalInputChange('note', e)} />
                                    </label>
                                    <br />
                                    <div className="button-group">
                                        <Button color="primary" onClick={() => this.onSubmitNote()}>
                                            {
                                                (noteFormMode === 'create') ? 'Create' : 'Update'
                                            }
                                        </Button>{' '}
                                        <Button color="secondary" onClick={() => this.onCancel()}>Cancel</Button>
                                    </div>
                                </div>
                        }
                    </div>
                </SlidingPane>
                <ReactstrapModal isOpen={isShowUpdateCommModal} toggle={this.toggleUpdateCommModal} className="create-comm-modal">
                    <ModalHeader toggle={this.toggleUpdateCommModal}>Update Communication Log: {booking.b_bookingID_Visual}</ModalHeader>
                    <ModalBody>
                        <label>
                            <p>Assigned To</p>
                            <select
                                required 
                                name="assigned_to" 
                                onChange={(e) => this.handleModalInputChange('comm', e)}
                                value = {commFormInputs['assigned_to']} >
                                <option value="emadeisky">emadeisky</option>
                                <option value="nlimbauan">nlimbauan</option>
                                <option value="status query">status query</option>
                                <option value="edit…">edit…</option>
                            </select>
                        </label>
                        <br />
                        <label>
                            <p>Priority</p>
                            <select
                                required 
                                name="priority_of_log" 
                                onChange={(e) => this.handleModalInputChange('comm', e)}
                                value = {commFormInputs['priority_of_log']} >
                                <option value="Standard">Standard</option>
                                <option value="Low">Low</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </label>
                        <br />
                        <label>
                            <p>DME Comm Title</p>
                            <input 
                                className="form-control" 
                                type="text" 
                                placeholder="" 
                                name="dme_com_title" 
                                value = {commFormInputs['dme_com_title']}
                                onChange={(e) => this.handleModalInputChange('comm', e)} />
                        </label>
                        <br />
                        <label>
                            <p>Type</p>
                            <select
                                required 
                                name="dme_notes_type" 
                                onChange={(e) => this.handleModalInputChange('comm', e)}
                                value = {commFormInputs['dme_notes_type']} >
                                <option value="Delivery">Delivery</option>
                                <option value="Financial">Financial</option>
                                <option value="FP Query">FP Query</option>
                                <option value="Other">Other</option>
                            </select>
                        </label>
                        <br />
                        <label>
                            <p>DME Detail</p>
                            <input 
                                className="form-control" 
                                type="text" 
                                placeholder="" 
                                name="dme_detail" 
                                value = {commFormInputs['dme_detail']}
                                onChange={(e) => this.handleModalInputChange('comm', e)} />
                        </label>
                        <br />
                        <div className="datetime">
                            <p>Due By Date</p>
                            <div className="date-adjust" onClick={() => this.onDatePlusOrMinus(-1)}><i className="fa fa-minus"></i></div>
                            <DatePicker
                                selected={commFormInputs['due_by_date']}
                                onChange={(e) => this.onDateChange(e)}
                                dateFormat="dd MMM yyyy"
                            />
                            <div className="date-adjust" onClick={() => this.onDatePlusOrMinus(1)}><i className="fa fa-plus"></i></div>
                        </div>
                        <div className="datetime">
                            <p>Due By Time</p>
                            <Select
                                value={due_by_time}
                                onChange={(e) => this.handleModalInputChange('comm', {target: {name: 'due_by_time', value: e.value, type: 'input'}})}
                                options={timeSelectOptions}
                                placeholder='Select time'
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => this.onUpdate('comm')}>Update</Button>{' '}
                        <Button color="secondary" onClick={this.toggleUpdateCommModal}>Cancel</Button>
                    </ModalFooter>
                </ReactstrapModal>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        booking: state.booking.booking,
        redirect: state.auth.redirect,
        comms: state.comm.comms,
        sortField: state.comm.sortField,
        columnFilters: state.comm.columnFilters,
        needUpdateComms: state.comm.needUpdateComms,
        notes: state.comm.notes,
        needUpdateNotes: state.comm.needUpdateNotes,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        getBookingWithFilter: (id, filter) => dispatch(getBookingWithFilter(id, filter)),
        getCommsWithBookingId: (id, sortField, columnFilters) => dispatch(getCommsWithBookingId(id, sortField, columnFilters)),
        updateComm: (id, updatedComm) => dispatch(updateComm(id, updatedComm)),
        setGetCommsFilter: (key, value) => dispatch(setGetCommsFilter(key, value)),
        getNotes: (commId) => dispatch(getNotes(commId)),
        createNote: (note) => dispatch(createNote(note)),
        updateNote: (id, updatedNote) => dispatch(updateNote(id, updatedNote)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CommPage);

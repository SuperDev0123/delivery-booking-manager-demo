import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import moment from 'moment-timezone';
import Modal from 'react-modal';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import { Button } from 'reactstrap';

import { verifyToken, cleanRedirectState } from '../state/services/authService';
import { getBookingWithFilter } from '../state/services/bookingService';
import { getCommsWithBookingId, updateComm, setGetCommsFilter, getNotes, createNote } from '../state/services/commService';

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
            isShowNoteForm: false,
            noteFormInputs: {},
        };
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
        this.setState({isShowNoteForm: true});
    }

    handleNoteModalInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        let noteFormInputs = this.state.noteFormInputs;
        noteFormInputs[name] = value;
        this.setState({noteFormInputs});
    }

    onCancel() {
        this.setState({isShowNoteForm: false});
    }

    onCreateNote() {
        const {noteFormInputs, selectedCommId, notes} = this.state;
        noteFormInputs['comm'] = selectedCommId;
        noteFormInputs['username'] = 'Stephen';
        noteFormInputs['dme_notes_no'] = (notes.length > 0) ? parseInt(notes[notes.length - 1]['dme_notes_no']) + 1 : 1;
        this.props.createNote(noteFormInputs);
        this.setState({isShowNoteForm: false, noteFormInputs: {}});
    }

    onClickHeader(e) {
        e.preventDefault();
        window.location.assign('/booking?bookingid=' + this.state.booking.id);
    }

    render() {
        const { showSimpleSearchBox, simpleSearchKeyword, comms, booking, sortField, sortDirection, filterInputs, isNotePaneOpen, notes, isShowNoteForm, noteFormInputs } = this.state;

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
                </tr>
            );
        });

        const notesList = notes.map((note, index) => {
            return (
                <tr key={index}>
                    <td>{note.dme_notes_no}</td>
                    <td>{note.username}</td>
                    <td>{note.dme_notes_type}</td>
                    <td>{note.dme_notes}</td>
                    <td>{moment(note.z_modifiedTimeStamp).format('MM/DD/YYYY')}</td>
                    <td>{moment(note.z_modifiedTimeStamp).format('hh:mm:ss')}</td>
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
                                            onChange={(e) => this.handleNoteModalInputChange(e)} />
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
                                            onChange={(e) => this.handleNoteModalInputChange(e)} />
                                    </label>
                                    <br />
                                    <div className="button-group">
                                        <Button color="primary" onClick={() => this.onCreateNote()}>Create</Button>{' '}
                                        <Button color="secondary" onClick={() => this.onCancel()}>Cancel</Button>
                                    </div>
                                </div>
                        }
                    </div>
                </SlidingPane>
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CommPage);

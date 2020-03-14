import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import _ from 'lodash';
import moment from 'moment-timezone';
import Modal from 'react-modal';
import { Button, Modal as ReactstrapModal, ModalHeader, ModalBody, ModalFooter, Nav, NavItem, NavLink } from 'reactstrap';
import LoadingOverlay from 'react-loading-overlay';
import DateTimePicker from 'react-datetime-picker';

import NoteSlider from '../components/Sliders/NoteSlider';

import { verifyToken, cleanRedirectState } from '../state/services/authService';
import { getBooking } from '../state/services/bookingService';
import { getComms, updateComm, setGetCommsFilter, setAllGetCommsFilter, getNotes, createNote, updateNote, setNeedUpdateComms, getAvailableCreators } from '../state/services/commService';

class CommPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            clientname: '',
            selectedBookingId: null,
            booking: {},
            comms: [],
            notes: [],
            simpleSearchKeyword: '',
            showSimpleSearchBox: false,
            sortDirection: -1,
            sortField: 'id',
            sortType: 'comms',
            filterInputs: {},
            isNotePaneOpen: false,
            selectedCommId: null,
            selectedNoteId: null,
            isShowNoteForm: false,
            isShowUpdateCommModal: false,
            noteFormMode: 'create',
            noteFormInputs: {},
            commFormInputs: {},
            loading: false,
            availableCreators: [],
            sortByDate: false,
            activeTabInd: 0,
            commCnts: null,
            activeCommId: null,
            isUpdatingComm: false,
        };

        this.toggleUpdateCommModal = this.toggleUpdateCommModal.bind(this);
        this.toggleShowNoteSlider = this.toggleShowNoteSlider.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.myRef = React.createRef();
    }

    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.bool.isRequired,
        location: PropTypes.object.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
        getBooking: PropTypes.func.isRequired,
        getComms: PropTypes.func.isRequired,
        updateComm: PropTypes.func.isRequired,
        setGetCommsFilter: PropTypes.func.isRequired,
        setAllGetCommsFilter: PropTypes.func.isRequired,
        getNotes: PropTypes.func.isRequired,
        createNote: PropTypes.func.isRequired,
        updateNote: PropTypes.func.isRequired,
        setNeedUpdateComms: PropTypes.func.isRequired,
        getAvailableCreators: PropTypes.func.isRequired,
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

        this.props.getAvailableCreators();

        var urlParams = new URLSearchParams(window.location.search);
        var bookingId = urlParams.get('bookingid');

        if (bookingId != null) {
            this.props.setAllGetCommsFilter(bookingId);
            this.props.setGetCommsFilter('activeTabInd', 7);
            this.props.getBooking(bookingId, 'id');
        } else {
            this.props.setNeedUpdateComms(true);
        }

        Modal.setAppElement(this.el);
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { redirect, booking, comm, comms, commCnts, needUpdateComms, sortField, sortType, columnFilters, notes, needUpdateNotes, simpleSearchKeyword, clientname, availableCreators, username, sortByDate, activeTabInd, selectedBookingId } = newProps;
        const { selectedCommId } = this.state;
        const currentRoute = this.props.location.pathname;

        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/');
        }

        if (clientname) {
            this.setState({clientname});
        }

        if (username) {
            this.setState({username});
        }

        if (booking) {
            this.setState({booking});
        }

        if (comms) {
            this.setState({comms, commCnts, loading: false});
        }

        if (notes) {
            this.setState({notes});
        }

        if (comm && this.state.isUpdatingComm) {
            let currentComms = this.state.comms;

            for (let i = 0; i < currentComms.length; i++) {
                if (currentComms[i].id === comm.id) {
                    currentComms[i] = comm;
                }
            }

            this.setState({comms: currentComms});
        }

        if (needUpdateComms) {
            this.props.setNeedUpdateComms(false);
            this.props.getComms(selectedBookingId, sortField, sortType, columnFilters, simpleSearchKeyword, sortByDate, activeTabInd);
            this.setState({
                loading: true, 
                selectedBookingId,
                sortField,
                sortType,
                columnFilters,
                simpleSearchKeyword,
                sortByDate,
                activeTabInd
            });
        }

        if (needUpdateNotes) {
            this.props.getNotes(selectedCommId);
        }

        if (availableCreators) {
            this.setState({availableCreators});
        }
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    handleScroll(event) {
        let scrollLeft = event.target.scrollLeft;
        const tblContent = this.myRef.current;

        if (scrollLeft !== this.state.scrollLeft) {
            this.setState({scrollLeft: tblContent.scrollLeft});
        }
    }

    onClickSimpleSearch() {
        this.setState({showSimpleSearchBox: true});
    }

    onSimpleSarchInputChange(e) {
        this.setState({simpleSearchKeyword: e.target.value});
    }

    onSimpleSearch(e) {
        e.preventDefault();
        const {simpleSearchKeyword, selectedBookingId} = this.state;

        if (simpleSearchKeyword.length === 0) {
            this.props.setAllGetCommsFilter(selectedBookingId, 'id', 'comms', {}, '', false, 0);
        } else {
            this.props.setAllGetCommsFilter(selectedBookingId, 'id', 'comms', {}, simpleSearchKeyword, false, 0);
        }

        this.setState({columnFilters: {}, sortType: 'comms', sortField: 'id'});
    }

    onChangeSortField(fieldName, sortType) {
        let sortField = this.state.sortField;
        let sortDirection = this.state.sortDirection;
        const {selectedBookingId, columnFilters, activeTabInd} = this.state;

        if (sortField && sortField.indexOf('-') > -1)
            sortDirection = -1 * sortDirection;
        else
            sortDirection = -1;

        this.setState({sortField: fieldName, sortDirection, sortType, sortByDate: false});

        if (sortType === 'comms') {
            if (sortDirection < 0)
                this.props.setAllGetCommsFilter(selectedBookingId, '-' + fieldName, sortType, columnFilters, '', false, activeTabInd);
            else
                this.props.setAllGetCommsFilter(selectedBookingId, fieldName, sortType, columnFilters, '', false, activeTabInd);
        } else if (sortType === 'bookings') {
            if (sortDirection < 0)
                this.props.setAllGetCommsFilter(selectedBookingId, '-' + fieldName, sortType, columnFilters, '', false, activeTabInd);
            else
                this.props.setAllGetCommsFilter(selectedBookingId, fieldName, sortType, columnFilters, '', false, activeTabInd);
        }
    }

    onCheckClosed(e, id, index) {
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
            this.setState({comms: updatedComms, isUpdatingComm: true});
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
            noteFormInputs['clientname'] = 'Stephen';
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

        if (this.state.booking.hasOwnProperty('id')) {
            this.props.history.push('/booking?bookingid=' + this.state.booking.id);
        } else {
            this.props.history.push('/booking');
        }
    }

    onUpdateBtnClick(type, data) {
        console.log('Click update comm button');
        
        if (type === 'comm') {
            const comm = data;
            const commFormInputs = comm;
            commFormInputs['due_date_time'] = comm.due_by_date ? moment(comm.due_by_date + ' ' + comm.due_by_time, 'YYYY-MM-DD HH:mm:ss').toDate() : null;
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

    toggleShowNoteSlider() {
        this.setState(prevState => ({isNotePaneOpen: !prevState.isNotePaneOpen}));
    }

    onUpdate(type) {
        console.log('Update comm');

        if (type === 'comm') {
            const {selectedCommId, commFormInputs} = this.state;
            let newComm = _.clone(commFormInputs);
            newComm['due_by_date'] = moment(commFormInputs['due_by_date']).format('YYYY-MM-DD');
            this.props.updateComm(selectedCommId, newComm);
            this.setState({isUpdatingComm: true});
            this.toggleUpdateCommModal();
        }
    }

    onDatePlusOrMinus(number) {
        console.log('number - ', number);

        let commFormInputs = this.state.commFormInputs;
        commFormInputs['due_by_date'] = moment(commFormInputs['due_by_date']).add(number, 'd').toDate();
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

    onChangeDateTime(date) {
        const commFormInputs = this.state.commFormInputs;

        commFormInputs['due_date_time'] = date;
        commFormInputs['due_by_date'] = moment(date).format('YYYY-MM-DD');
        commFormInputs['due_by_time'] = moment(date).format('HH:mm:ss');
        this.setState({commFormInputs});
    }

    onDropdownFilterChange(event) {
        this.setState({dropdownFilter: event.target.value});
        this.props.setGetCommsFilter('dropdownFilter', event.target.value);
    }

    onClickByDate() {
        this.setState({sortByDate: true});
        this.props.setGetCommsFilter('sortByDate', true);
    }

    onClickTab(activeTabInd) {
        const {selectedBookingId, sortField, sortType, columnFilters, sortByDate} = this.state;
        var urlParams = new URLSearchParams(window.location.search);
        var bookingId = urlParams.get('bookingid');

        if (activeTabInd == 0) { // All
            this.props.setAllGetCommsFilter(null, sortField, sortType, columnFilters, '', sortByDate, activeTabInd);
        } else if (activeTabInd == 7) { // Selected
            if (_.isNull(bookingId)) {
                alert('There is no selected booking ID');
                this.props.setAllGetCommsFilter(null, sortField, sortType, columnFilters, '', sortByDate, 0);
            } else {
                this.props.setAllGetCommsFilter(bookingId, sortField, sortType, columnFilters, '', sortByDate, activeTabInd);
            }
        } else if (activeTabInd == 1) { // Opened
            this.props.setAllGetCommsFilter(selectedBookingId, sortField, sortType, columnFilters, '', sortByDate, activeTabInd);
        } else if (activeTabInd == 2) { // Closed
            this.props.setAllGetCommsFilter(selectedBookingId, sortField, sortType, columnFilters, '', sortByDate, activeTabInd);
        }

        this.setState({activeTabInd});
    }

    onClickComm(comm) {
        this.setState({activeCommId: comm.id});
    }

    render() {
        const { clientname, showSimpleSearchBox, simpleSearchKeyword, comms, commCnts, sortField, sortDirection, filterInputs, isNotePaneOpen, notes, commFormInputs, isShowUpdateCommModal, scrollLeft, loading, selectedCommId, availableCreators, username, sortByDate, activeTabInd, activeCommId } = this.state;

        const tblContentWidthVal = 'calc(100% + ' + scrollLeft + 'px)';
        const tblContentWidth = {width: tblContentWidthVal};

        const commsList = comms.map((comm, index) => {
            return (
                <tr 
                    key={index}
                    className={(activeCommId === comm.id) ? 'active' : 'inactive'}
                    onClick={() => this.onClickComm(comm)}
                >
                    <td onClick={() => this.onClickCommIdCell(comm)}>{comm.id}</td>
                    <td>{comm.b_bookingID_Visual}</td>
                    <td>{comm.b_status}</td>
                    <td>{comm.vx_freight_provider}</td>
                    <td>{comm.puCompany}</td>
                    <td>{comm.deToCompanyName}</td>
                    <td>{comm.v_FPBookingNumber}</td>
                    <td>{comm.priority_of_log}</td>
                    <td>{comm.assigned_to}</td>
                    <td>{comm.dme_notes_type}</td>
                    <td>{comm.query}</td>
                    <td><div>{comm.dme_action}</div></td>
                    <td><input type="checkbox" checked={comm.closed} name="closed" onChange={(e) => this.onCheckClosed(e, comm.id, index)} /></td>
                    <td>{comm.status_log_closed_time ? moment(comm.status_log_closed_time).format('DD/MM/YYYY HH:mm:ss') : ''}</td>
                    <td>{comm.dme_detail}</td>
                    <td>{comm.dme_notes_external}</td>
                    <td>{comm.due_by_date ? moment(comm.due_by_date).format('DD/MM/YYYY') : ''}</td>
                    <td>{comm.due_by_time}</td>
                    <td className="update"><Button color="primary" onClick={() => this.onUpdateBtnClick('comm', comm)}>Update</Button></td>
                </tr>
            );
        });

        const availableCreatorsList = availableCreators.map((availableCreator, index) => {
            return (
                <option key={index} value={availableCreator.username} selected={availableCreator.username===username ? 'selected' : ''}>{availableCreator.first_name} {availableCreator.last_name}</option>
            );
        });

        return (
            <div className="qbootstrap-nav comm" ref={ref => this.el = ref}>
                <div id="headr" className="col-md-12">
                    <div className="col-md-7 col-sm-12 col-lg-8 col-xs-12 col-md-push-1">
                        <ul className="nav nav-tabs">
                            <li><a onClick={(e) => this.onClickHeader(e)}>Header</a></li>
                            <li><a href="/allbookings">All Bookings</a></li>
                            <li className={clientname === 'dme' ? 'active ' : 'none'}><a>Comms</a></li>
                            <li><a href="/bookinglines" className="none">Booking Lines</a></li>
                            <li><a href="/bookinglinedetails" className="none">Booking Line Datas</a></li>
                        </ul>
                    </div>
                    <div id="icn" className="col-md-4 col-sm-12 col-lg-4 col-xs-12 text-right">
                        <a className="none" href=""><i className="icon-plus" aria-hidden="true"></i></a>
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
                <div id="tab-section" className="col-md-12">
                    <Nav tabs>
                        <NavItem>
                            <NavLink
                                className={parseInt(activeTabInd) === 0 ? 'active' : ''}
                                onClick={() => this.onClickTab(0)}
                            >
                                All {!_.isNull(commCnts) && !_.isUndefined(commCnts['all_cnt']) && commCnts['all_cnt'] !== -1 ? ' (' + commCnts['all_cnt'] + ')' : ''}
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={parseInt(activeTabInd) === 7 ? 'active' : ''}
                                onClick={() => this.onClickTab(7)}
                            >
                                Selected {!_.isNull(commCnts) && !_.isUndefined(commCnts['selected_cnt']) && commCnts['selected_cnt'] !== -1 ? ' (' + commCnts['selected_cnt'] + ')' : ''}
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={parseInt(activeTabInd) === 1 ? 'active' : ''}
                                onClick={() => this.onClickTab(1)}
                            >
                                Opened {!_.isNull(commCnts) && !_.isUndefined(commCnts['opened_cnt']) && commCnts['opened_cnt'] !== -1 ? ' (' + commCnts['opened_cnt'] + ')' : ''}
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={parseInt(activeTabInd) === 2 ? 'active' : ''}
                                onClick={() => this.onClickTab(2)}
                            >
                                Closed
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <Button
                        className="none"
                        color="primary" 
                        onClick={() => this.onClickByDate()}
                        disabled={(sortByDate) ? 'disabled' : ''}
                    >
                        By Date
                    </Button>
                    <br />
                    <hr />
                </div>
                <LoadingOverlay
                    active={loading}
                    spinner
                    text='Loading...'
                >
                    <div className='content col-md-12'>
                        <div className="table-responsive" onScroll={this.handleScroll} ref={this.myRef}>
                            <div className="tbl-header">
                                <table className="table table-hover table-bordered sortable fixed_headers">
                                    <tr>
                                        <th className="" onClick={() => this.onChangeSortField('id', 'comms')} scope="col" nowrap>
                                            <p>Comm ID</p>
                                            {
                                                (sortField === 'id') ?
                                                    (sortDirection > 0) ?
                                                        <i className="fa fa-sort-up"></i>
                                                        : <i className="fa fa-sort-down"></i>
                                                    : <i className="fa fa-sort"></i>
                                            }
                                        </th>
                                        <th className="" onClick={() => this.onChangeSortField('b_bookingID_Visual', 'bookings')} scope="col" nowrap>
                                            <p>Booking ID</p>
                                            {
                                                (sortField === 'b_bookingID_Visual') ?
                                                    (sortDirection > 0) ?
                                                        <i className="fa fa-sort-up"></i>
                                                        : <i className="fa fa-sort-down"></i>
                                                    : <i className="fa fa-sort"></i>
                                            }
                                        </th>
                                        <th className="" onClick={() => this.onChangeSortField('b_status', 'bookings')} scope="col" nowrap>
                                            <p>Status</p>
                                            {
                                                (sortField === 'b_status') ?
                                                    (sortDirection > 0) ?
                                                        <i className="fa fa-sort-up"></i>
                                                        : <i className="fa fa-sort-down"></i>
                                                    : <i className="fa fa-sort"></i>
                                            }
                                        </th>
                                        <th className="" onClick={() => this.onChangeSortField('vx_freight_provider', 'bookings')} scope="col" nowrap>
                                            <p>Freight Provider</p>
                                            {
                                                (sortField === 'vx_freight_provider') ?
                                                    (sortDirection > 0) ?
                                                        <i className="fa fa-sort-up"></i>
                                                        : <i className="fa fa-sort-down"></i>
                                                    : <i className="fa fa-sort"></i>
                                            }
                                        </th>
                                        <th className="" onClick={() => this.onChangeSortField('puCompany', 'bookings')} scope="col" nowrap>
                                            <p>From</p>
                                            {
                                                (sortField === 'puCompany') ?
                                                    (sortDirection > 0) ?
                                                        <i className="fa fa-sort-up"></i>
                                                        : <i className="fa fa-sort-down"></i>
                                                    : <i className="fa fa-sort"></i>
                                            }
                                        </th>
                                        <th className="" onClick={() => this.onChangeSortField('deToCompanyName', 'bookings')} scope="col" nowrap>
                                            <p>To</p>
                                            {
                                                (sortField === 'deToCompanyName') ?
                                                    (sortDirection > 0) ?
                                                        <i className="fa fa-sort-up"></i>
                                                        : <i className="fa fa-sort-down"></i>
                                                    : <i className="fa fa-sort"></i>
                                            }
                                        </th>
                                        <th className="" onClick={() => this.onChangeSortField('v_FPBookingNumber', 'bookings')} scope="col" nowrap>
                                            <p>FP Booking No</p>
                                            {
                                                (sortField === 'v_FPBookingNumber') ?
                                                    (sortDirection > 0) ?
                                                        <i className="fa fa-sort-up"></i>
                                                        : <i className="fa fa-sort-down"></i>
                                                    : <i className="fa fa-sort"></i>
                                            }
                                        </th>
                                        <th className="" onClick={() => this.onChangeSortField('priority_of_log', 'comms')} scope="col" nowrap>
                                            <p>Priority</p>
                                            {
                                                (sortField === 'priority_of_log') ?
                                                    (sortDirection > 0) ?
                                                        <i className="fa fa-sort-up"></i>
                                                        : <i className="fa fa-sort-down"></i>
                                                    : <i className="fa fa-sort"></i>
                                            }
                                        </th>
                                        <th className="" onClick={() => this.onChangeSortField('assigned_to', 'comms')} scope="col" nowrap>
                                            <p>Assiged To</p>
                                            {
                                                (sortField === 'assigned_to') ?
                                                    (sortDirection > 0) ?
                                                        <i className="fa fa-sort-up"></i>
                                                        : <i className="fa fa-sort-down"></i>
                                                    : <i className="fa fa-sort"></i>
                                            }
                                        </th>
                                        <th className="" onClick={() => this.onChangeSortField('dme_notes_type', 'comms')} scope="col" nowrap>
                                            <p>Notes Type</p>
                                            {
                                                (sortField === 'dme_notes_type') ?
                                                    (sortDirection > 0) ?
                                                        <i className="fa fa-sort-up"></i>
                                                        : <i className="fa fa-sort-down"></i>
                                                    : <i className="fa fa-sort"></i>
                                            }
                                        </th>
                                        <th className="" onClick={() => this.onChangeSortField('query', 'comms')} scope="col" nowrap>
                                            <p>Query</p>
                                            {
                                                (sortField === 'query') ?
                                                    (sortDirection > 0) ?
                                                        <i className="fa fa-sort-up"></i>
                                                        : <i className="fa fa-sort-down"></i>
                                                    : <i className="fa fa-sort"></i>
                                            }
                                        </th>
                                        <th className="" onClick={() => this.onChangeSortField('dme_action', 'comms')} scope="col" nowrap>
                                            <p>Action</p>
                                            {
                                                (sortField === 'dme_action') ?
                                                    (sortDirection > 0) ?
                                                        <i className="fa fa-sort-up"></i>
                                                        : <i className="fa fa-sort-down"></i>
                                                    : <i className="fa fa-sort"></i>
                                            }
                                        </th>
                                        <th className="" scope="col" nowrap>
                                            <p>Closed</p>
                                        </th>
                                        <th className="" onClick={() => this.onChangeSortField('status_log_closed_time', 'comms')} scope="col" nowrap>
                                            <p>Closed Time</p>
                                            {
                                                (sortField === 'status_log_closed_time') ?
                                                    (sortDirection > 0) ?
                                                        <i className="fa fa-sort-up"></i>
                                                        : <i className="fa fa-sort-down"></i>
                                                    : <i className="fa fa-sort"></i>
                                            }
                                        </th>
                                        <th className="" onClick={() => this.onChangeSortField('dme_detail', 'comms')} scope="col" nowrap>
                                            <p>Detail</p>
                                            {
                                                (sortField === 'dme_detail') ?
                                                    (sortDirection > 0) ?
                                                        <i className="fa fa-sort-up"></i>
                                                        : <i className="fa fa-sort-down"></i>
                                                    : <i className="fa fa-sort"></i>
                                            }
                                        </th>
                                        <th className="" onClick={() => this.onChangeSortField('dme_notes_external', 'comms')} scope="col" nowrap>
                                            <p>Notes External</p>
                                            {
                                                (sortField === 'dme_notes_external') ?
                                                    (sortDirection > 0) ?
                                                        <i className="fa fa-sort-up"></i>
                                                        : <i className="fa fa-sort-down"></i>
                                                    : <i className="fa fa-sort"></i>
                                            }
                                        </th>
                                        <th className="" onClick={() => this.onChangeSortField('due_by_date', 'comms')} scope="col" nowrap>
                                            <p>Date</p>
                                            {
                                                (sortField === 'due_by_date') ?
                                                    (sortDirection > 0) ?
                                                        <i className="fa fa-sort-up"></i>
                                                        : <i className="fa fa-sort-down"></i>
                                                    : <i className="fa fa-sort"></i>
                                            }
                                        </th>
                                        <th className="" onClick={() => this.onChangeSortField('due_by_time', 'comms')} scope="col" nowrap>
                                            <p>Time</p>
                                            {
                                                (sortField === 'due_by_time') ?
                                                    (sortDirection > 0) ?
                                                        <i className="fa fa-sort-up"></i>
                                                        : <i className="fa fa-sort-down"></i>
                                                    : <i className="fa fa-sort"></i>
                                            }
                                        </th>
                                        <th className="" scope="col" nowrap>
                                            <p>Update</p>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th scope="col">
                                            <input 
                                                type="text" 
                                                name="id" 
                                                value={filterInputs['id'] || ''} 
                                                onChange={(e) => this.onChangeFilterInput(e)} 
                                                onKeyPress={(e) => this.onKeyPress(e)}
                                            />
                                        </th>
                                        <th scope="col">
                                            <input 
                                                type="text" 
                                                name="b_bookingID_Visual" 
                                                value={filterInputs['b_bookingID_Visual'] || ''} 
                                                onChange={(e) => this.onChangeFilterInput(e)} 
                                                onKeyPress={(e) => this.onKeyPress(e)}
                                            />
                                        </th>
                                        <th scope="col">
                                            <input 
                                                type="text" 
                                                name="b_status" 
                                                value={filterInputs['b_status'] || ''} 
                                                onChange={(e) => this.onChangeFilterInput(e)} 
                                                onKeyPress={(e) => this.onKeyPress(e)}
                                            />
                                        </th>
                                        <th scope="col">
                                            <input 
                                                type="text" 
                                                name="vx_freight_provider" 
                                                value={filterInputs['vx_freight_provider'] || ''} 
                                                onChange={(e) => this.onChangeFilterInput(e)} 
                                                onKeyPress={(e) => this.onKeyPress(e)}
                                            />
                                        </th>
                                        <th scope="col">
                                            <input 
                                                type="text" 
                                                name="puCompany" 
                                                value={filterInputs['puCompany'] || ''} 
                                                onChange={(e) => this.onChangeFilterInput(e)} 
                                                onKeyPress={(e) => this.onKeyPress(e)}
                                            />
                                        </th>
                                        <th scope="col">
                                            <input 
                                                type="text" 
                                                name="deToCompanyName" 
                                                value={filterInputs['deToCompanyName'] || ''} 
                                                onChange={(e) => this.onChangeFilterInput(e)} 
                                                onKeyPress={(e) => this.onKeyPress(e)}
                                            />
                                        </th>
                                        <th scope="col">
                                            <input 
                                                type="text" 
                                                name="v_FPBookingNumber" 
                                                value={filterInputs['v_FPBookingNumber'] || ''} 
                                                onChange={(e) => this.onChangeFilterInput(e)} 
                                                onKeyPress={(e) => this.onKeyPress(e)}
                                            />
                                        </th>
                                        <th scope="col">
                                            <input 
                                                type="text" 
                                                name="priority_of_log" 
                                                value={filterInputs['priority_of_log'] || ''} 
                                                onChange={(e) => this.onChangeFilterInput(e)} 
                                                onKeyPress={(e) => this.onKeyPress(e)}
                                            />
                                        </th>
                                        <th scope="col">
                                            <input 
                                                type="text" 
                                                name="assigned_to" 
                                                value={filterInputs['assigned_to'] || ''} 
                                                onChange={(e) => this.onChangeFilterInput(e)} 
                                                onKeyPress={(e) => this.onKeyPress(e)}
                                            />
                                        </th>
                                        <th scope="col">
                                            <input 
                                                type="text" 
                                                name="dme_notes_type" 
                                                value={filterInputs['dme_notes_type'] || ''} 
                                                onChange={(e) => this.onChangeFilterInput(e)} 
                                                onKeyPress={(e) => this.onKeyPress(e)}
                                            />
                                        </th>
                                        <th scope="col">
                                            <input 
                                                type="text" 
                                                name="query" 
                                                value={filterInputs['query'] || ''} 
                                                onChange={(e) => this.onChangeFilterInput(e)} 
                                                onKeyPress={(e) => this.onKeyPress(e)}
                                            />
                                        </th>
                                        <th scope="col">
                                            <input 
                                                type="text" 
                                                name="dme_action" 
                                                value={filterInputs['dme_action'] || ''} 
                                                onChange={(e) => this.onChangeFilterInput(e)} 
                                                onKeyPress={(e) => this.onKeyPress(e)}
                                            />
                                        </th>
                                        <th scope="col"></th>
                                        <th scope="col">
                                            <input 
                                                type="text" 
                                                name="status_log_closed_time" 
                                                value={filterInputs['status_log_closed_time'] || ''} 
                                                onChange={(e) => this.onChangeFilterInput(e)} 
                                                onKeyPress={(e) => this.onKeyPress(e)}
                                            />
                                        </th>
                                        <th scope="col">
                                            <input 
                                                type="text" 
                                                name="dme_detail" 
                                                value={filterInputs['dme_detail'] || ''} 
                                                onChange={(e) => this.onChangeFilterInput(e)} 
                                                onKeyPress={(e) => this.onKeyPress(e)}
                                            />
                                        </th>
                                        <th scope="col">
                                            <input 
                                                type="text" 
                                                name="dme_notes_external" 
                                                value={filterInputs['dme_notes_external'] || ''} 
                                                onChange={(e) => this.onChangeFilterInput(e)} 
                                                onKeyPress={(e) => this.onKeyPress(e)}
                                            />
                                        </th>
                                        <th scope="col">
                                            <input 
                                                type="text" 
                                                name="due_by_date" 
                                                value={filterInputs['due_by_date'] || ''} 
                                                onChange={(e) => this.onChangeFilterInput(e)} 
                                                onKeyPress={(e) => this.onKeyPress(e)}
                                            />
                                        </th>
                                        <th scope="col">
                                            <input 
                                                type="text" 
                                                name="due_by_time" 
                                                value={filterInputs['due_by_time'] || ''} 
                                                onChange={(e) => this.onChangeFilterInput(e)} 
                                                onKeyPress={(e) => this.onKeyPress(e)}
                                            />
                                        </th>
                                    </tr>
                                </table>
                            </div>
                            <div className="tbl-content" style={tblContentWidth} onScroll={this.handleScroll}>
                                <table className="table table-hover table-bordered sortable fixed_headers">
                                    { commsList }
                                </table>
                            </div>
                        </div>
                    </div>
                </LoadingOverlay>

                <NoteSlider
                    isOpen={isNotePaneOpen}
                    toggleShowNoteSlider={this.toggleShowNoteSlider}
                    notes={notes}
                    createNote={(newNote) => this.props.createNote(newNote)} 
                    updateNote={(noteId, newNote) => this.props.updateNote(noteId, newNote)} 
                    clientname={clientname}
                    selectedCommId={selectedCommId}
                />

                <ReactstrapModal isOpen={isShowUpdateCommModal} toggle={this.toggleUpdateCommModal} className="create-comm-modal">
                    <ModalHeader toggle={this.toggleUpdateCommModal}>Update Communication Log: *SHOW VISUAL ID*</ModalHeader>
                    <ModalBody>
                        <label>
                            <p>Assigned To</p>
                            <select
                                required 
                                name="assigned_to" 
                                onChange={(e) => this.handleModalInputChange('comm', e)}
                                value = {commFormInputs['assigned_to']} >
                                {availableCreatorsList}
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
                        <label>
                            <p>Due Date Time</p>
                            <DateTimePicker
                                onChange={(date) => this.onChangeDateTime(date)}
                                value={commFormInputs['due_date_time']}
                            />
                        </label>
                        <label>
                            <p>Closed?</p>
                            <input
                                className="form-control"
                                type="checkbox"
                                name="closed"
                                checked = {commFormInputs['closed']}
                                onChange={(e) => this.handleCommModalInputChange(e)} />
                        </label>
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
        clientname: state.auth.clientname,
        booking: state.booking.booking,
        redirect: state.auth.redirect,
        comms: state.comm.comms,
        comm: state.comm.comm,
        sortField: state.comm.sortField,
        sortType: state.comm.sortType,
        simpleSearchKeyword: state.comm.simpleSearchKeyword,
        columnFilters: state.comm.columnFilters,
        sortByDate: state.comm.sortByDate,
        activeTabInd: state.comm.activeTabInd,
        needUpdateComms: state.comm.needUpdateComms,
        notes: state.comm.notes,
        needUpdateNotes: state.comm.needUpdateNotes,
        availableCreators: state.comm.availableCreators,
        selectedBookingId: state.comm.selectedBookingId,
        username: state.auth.username,
        commCnts: state.comm.commCnts,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        getBooking: (id, filter) => dispatch(getBooking(id, filter)),
        updateComm: (id, updatedComm) => dispatch(updateComm(id, updatedComm)),
        setGetCommsFilter: (key, value) => dispatch(setGetCommsFilter(key, value)),
        setAllGetCommsFilter: (selectedBookingId, sortField, sortType, columnFilters, simpleSearchKeyword, sortByDate, activeTabInd) => dispatch(setAllGetCommsFilter(selectedBookingId, sortField, sortType, columnFilters, simpleSearchKeyword, sortByDate, activeTabInd)),
        getNotes: (commId) => dispatch(getNotes(commId)),
        createNote: (note) => dispatch(createNote(note)),
        updateNote: (id, updatedNote) => dispatch(updateNote(id, updatedNote)),
        getComms: (selectedBookingId, sortField, sortType, columnFilters, simpleSearchKeyword, sortByDate, activeTabInd) => dispatch(getComms(selectedBookingId, sortField, sortType, columnFilters, simpleSearchKeyword, sortByDate, activeTabInd)),
        setNeedUpdateComms: (boolFlag) => dispatch(setNeedUpdateComms(boolFlag)),
        getAvailableCreators: () => dispatch(getAvailableCreators()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CommPage);

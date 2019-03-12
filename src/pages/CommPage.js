import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import moment from 'moment-timezone';

import { verifyToken, cleanRedirectState } from '../state/services/authService';
import { getBookingWithFilter } from '../state/services/bookingService';
import { getCommsWithBookingId, updateComm, setGetCommsFilter } from '../state/services/commService';

class CommPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            booking: {},
            comms: [],
            simpleSearchKeyword: '',
            showSimpleSearchBox: false,
            sortDirection: -1,
            sortField: 'id',
            filterInputs: {},
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
    }

    componentWillReceiveProps(newProps) {
        const { redirect, booking, comms, needUpdateComms, sortField, columnFilters } = newProps;
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

        if (needUpdateComms) {
            this.props.getCommsWithBookingId(booking.id, sortField, columnFilters);
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

    render() {
        const { showSimpleSearchBox, simpleSearchKeyword, comms, booking, sortField, sortDirection, filterInputs } = this.state;

        const commsList = comms.map((comm, index) => {
            return (
                <tr key={index}>
                    <td>{comm.id}</td>
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

        return (
            <div className="qbootstrap-nav comm" >
                <div id="headr" className="col-md-12">
                    <div className="col-md-7 col-sm-12 col-lg-8 col-xs-12 col-md-push-1">
                        <ul className="nav nav-tabs">
                            <li><a href="/booking">Header</a></li>
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CommPage);

// React libs
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
// Libs
import moment from 'moment';
import _ from 'lodash';
// Components
import { Button } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingOverlay from 'react-loading-overlay';
// Custom Components
import TooltipItem from '../../components/Tooltip/TooltipComponent';
import SimpleTooltipComponent from '../../components/Tooltip/SimpleTooltipComponent';
import ConfirmModal from '../../components/CommonModals/ConfirmModal';
// Services
import { verifyToken, cleanRedirectState } from '../../state/services/authService';
import { getBookingSets, deleteBookingSet, resetBookingSetFlags } from '../../state/services/extraService';
import { getBookings, setGetBookingsFilter, setAllGetBookingsFilter } from '../../state/services/bookingService';

class BookingSetList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            viewMode: 0, // 0: BookingSet List, 1: booings view
            bookingSets: [],
            clientname: null,
            isShowDeleteConfirmModal: false,
            selectedBookingSet: null,
            bookings: [],
            bookingIds: [],
            filterInputs: [],
            pageItemCnt: 100,
            pageInd: 0,
            pageCnt: 0,
            activeTabInd: 7,
            downloadOption: 'label',
            dmeClients: [],
            clientPK: 'dme',
            scrollLeft: 0,
            loading: false,
            sortDirection: 1,
        };

        this.myRef = React.createRef();
        this.handleScroll = this.handleScroll.bind(this);
        this.toggleDeleteConfirmModal = this.toggleDeleteConfirmModal.bind(this);
    }

    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.bool.isRequired,
        location: PropTypes.object.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
        getBookingSets: PropTypes.func.isRequired,
        deleteBookingSet: PropTypes.func.isRequired,
        resetBookingSetFlags: PropTypes.func.isRequired,
        getBookings: PropTypes.func.isRequired,
        setAllGetBookingsFilter: PropTypes.func.isRequired,
        setGetBookingsFilter: PropTypes.func.isRequired,
    };

    componentDidMount() {
        const token = localStorage.getItem('token');

        if (token && token.length > 0) {
            this.props.verifyToken();
        } else {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.history.push('/');
        }

        this.props.getBookingSets();
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { redirect, bookingSets, clientname, isBookingSetDeleted, needUpdateBookingSets, startDate, endDate, warehouseId, pageItemCnt, pageInd, sortField, columnFilters, activeTabInd, simpleSearchKeyword, downloadOption, clientPK, bookingIds, needUpdateBookings, bookings, bookingsCnt, filteredBookingIds, dmeStatus, projectName, multiFindField, multiFindValues, pageCnt } = newProps;
        const currentRoute = this.props.location.pathname;

        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/');
        }

        if (bookingSets) {
            this.setState({bookingSets});
        }

        if (clientname) {
            this.setState({clientname});
        }

        if (isBookingSetDeleted && needUpdateBookingSets) {
            this.notify('BookingSet has been deleted');
            this.props.getBookingSets();
            this.props.resetBookingSetFlags();
        }

        if (!_.isNull(bookingsCnt) && bookings) {
            this.setState({ bookings, filteredBookingIds, bookingsCnt, loading: false });
        }

        if (pageCnt) {
            this.setState({ pageCnt: parseInt(pageCnt), pageInd: parseInt(pageInd) });
        }

        if (needUpdateBookings) {
            this.setState({loading: true});

            // sortField
            if (!_.isEmpty(sortField)) {
                if (sortField[0] === '-') {
                    this.setState({sortDirection: -1, sortField: sortField.substring(1)});
                } else {
                    this.setState({sortDirection: 1, sortField});
                }
            }

            this.setState({
                filterInputs: columnFilters,
                pageItemCnt: pageItemCnt,
                pageInd: pageInd,
                bookingIds: bookingIds,
            });
            this.props.getBookings('*', '2099-01-01', clientPK, warehouseId, pageItemCnt, pageInd, sortField, columnFilters, activeTabInd, simpleSearchKeyword, downloadOption, dmeStatus, multiFindField, multiFindValues, projectName, bookingIds);
        }
    }

    handleScroll(event) {
        const scrollLeft = event.target.scrollLeft;
        const tblContent = this.myRef.current;

        if (scrollLeft !== this.state.scrollLeft) {
            this.setState({scrollLeft: tblContent.scrollLeft});
        }
    }

    notify = (text) => {
        toast(text);
    };

    toggleDeleteConfirmModal() {
        this.setState(prevState => ({isShowDeleteConfirmModal: !prevState.isShowDeleteConfirmModal}));
    }

    onClickDeleteBtn(selectedBookingSet) {
        this.setState({selectedBookingSet});
        this.toggleDeleteConfirmModal();
    }

    onClickShowBookingsBtn(selectedBookingSet) {
        this.setState({selectedBookingSet, viewMode: 1});
        this.props.setAllGetBookingsFilter('*', '2099-01-01', 0, 0, this.state.pageItemCnt, 0, '-id', {}, 0, '', 'label', '', null, null, null, selectedBookingSet.booking_ids);
    }

    onConfirmDelete() {
        this.props.deleteBookingSet(this.state.selectedBookingSet.id);
        this.toggleDeleteConfirmModal();
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
            fieldName = '-' + fieldName;

        this.props.setGetBookingsFilter('sortField', fieldName);
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
            this.props.setGetBookingsFilter('columnFilters', filterInputs);
            this.setState({selectedBookingIds: [], allCheckStatus: 'None'});
        }
    }

    onClickRow(booking) {
        this.setState({activeBookingId: booking.id});
    }

    render() {
        const { bookingSets, clientname, selectedBookingSet, bookings, scrollLeft, filterInputs, sortDirection, sortField, loading, activeBookingId } = this.state;
        const tblContentWidthVal = 'calc(100% + ' + scrollLeft + 'px)';
        const tblContentWidth = {width: tblContentWidthVal};

        const bookingSetsList = bookingSets.map((bookingSet, index) => {
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{bookingSet.name}</td>
                    <td id={'booking-set-' + 'note' + '-tooltip-' + bookingSet.id}>
                        {bookingSet.note}
                        {!_.isEmpty(bookingSet.note) && <TooltipItem object={bookingSet} placement={'top'}  name={'booking-set'} fields={['note']} />}
                    </td>
                    <td>{bookingSet.status}</td>
                    <td>{bookingSet.z_createdByAccount}</td>
                    <td>{bookingSet.z_createdTimestamp && moment(bookingSet.z_createdTimestamp).format('ddd DD MMM YYYY hh:mm a')}</td>
                    <td><Button color="primary" onClick={() => this.onClickShowBookingsBtn(bookingSet)}>Show Bookings</Button></td>
                    <td><Button color="danger" onClick={() => this.onClickDeleteBtn(bookingSet)}>Delete</Button></td>
                </tr>
            );
        });

        const bookingsList = bookings.map((booking, index) => {
            return (
                <tr 
                    key={index} 
                    className={(activeBookingId === booking.id) ? 'active' : 'inactive'}
                    onClick={() => this.onClickRow(booking)}
                >
                    <td>$</td>
                    <td 
                        id={'link-popover-' + booking.id} 
                        onClick={() => this.onClickLink(0, booking.id)}
                        className={(sortField === 'b_bookingID_Visual') ? 'visualID-box current' : 'visualID-box'}
                    >
                        <span className={booking.b_error_Capture ? 
                            'c-red bold' : booking.b_status === 'Closed' ? 'c-black bold' : 'c-dme bold'}
                        >
                            {booking.b_bookingID_Visual}
                        </span>
                    </td>
                    <td className={(sortField === 'b_client_name') ? 'current nowrap' : ' nowrap'}>{booking.b_client_name}</td>
                    <td className={(sortField === 'b_client_name_sub') ? 'current nowrap' : ' nowrap'}>{booking.b_client_name_sub}</td>
                    <td className={(sortField === 'puCompany') ? 'current nowrap' : ' nowrap'}>{booking.puCompany}</td>
                    <td className={(sortField === 'pu_Address_Suburb') ? 'current' : ''}>{booking.pu_Address_Suburb}</td>
                    <td className={(sortField === 'pu_Address_State') ? 'current' : ''}>{booking.pu_Address_State}</td>
                    <td className={(sortField === 'pu_Address_PostalCode') ? 'current' : ''}>{booking.pu_Address_PostalCode}</td>
                    <td className={(sortField === 'deToCompanyName') ? 'current nowrap' : ' nowrap'}>{booking.deToCompanyName}</td>
                    <td className={(sortField === 'de_To_Address_Suburb') ? 'current' : ''}>{booking.de_To_Address_Suburb}</td>
                    <td className={(sortField === 'de_To_Address_State') ? 'current' : ''}>{booking.de_To_Address_State}</td>
                    <td className={(sortField === 'de_To_Address_PostalCode') ? 'current' : ''}>{booking.de_To_Address_PostalCode}</td>
                    <td>$ - price</td>
                    <td>$ - ETA DE</td>
                    <td className={(sortField === 'vx_freight_provider') ? 'current' : ''}>{booking.vx_freight_provider}</td>
                    <td>$ - service_name</td>
                    <td>$ - account_code</td>
                    <td
                        className={'text-center'}
                        id={'booking-b_error_Capture-tooltip-' + booking.id}
                    >
                        {booking.b_error_Capture &&
                            <React.Fragment>
                                <i className="fa fa-exclamation-triangle c-red" aria-hidden="true"></i>
                                <TooltipItem object={booking} fields={['b_error_Capture']} />
                            </React.Fragment>
                        }
                    </td>
                    <td className={(sortField === 'b_clientReference_RA_Numbers') ? 'current' : ''}>{booking.b_clientReference_RA_Numbers}</td>
                    <td className={(sortField === 'vx_serviceName') ? 'current' : ''}>{booking.vx_serviceName}</td>
                    <td className={(sortField === 'b_status') ? 'current' : ''} id={'booking-' + 'b_status' + '-tooltip-' + booking.id}>
                        <p className="status">{booking.b_status}</p>
                        {!_.isEmpty(booking.b_status) &&
                            <TooltipItem object={booking} fields={['b_status']} />
                        }
                    </td>
                    <td className={(sortField === 'pu_PickUp_By_Date') ? 'current' : ''}>
                        {booking.pu_PickUp_By_Date ? moment(booking.pu_PickUp_By_Date).format('DD/MM/YYYY') : ''}
                    </td>
                    <td 
                        id={'booking-' + 'de_to_PickUp_Instructions_Address' + '-tooltip-' + booking.id}
                        className={(sortField === 'de_to_PickUp_Instructions_Address') ? 'current nowrap' : 'nowrap'}
                    >
                        {booking.de_to_PickUp_Instructions_Address}
                        {!_.isEmpty(booking.de_to_PickUp_Instructions_Address) &&
                            <TooltipItem object={booking} fields={['de_to_PickUp_Instructions_Address']} />
                        }
                    </td>
                    <td 
                        id={'booking-' + 'b_booking_project' + '-tooltip-' + booking.id}
                        className={(sortField === 'b_booking_project') ? 'current nowrap' : 'nowrap'}
                    >
                        {booking.b_booking_project}
                        {!_.isEmpty(booking.b_booking_project) &&
                            <TooltipItem object={booking} fields={['b_booking_project']} />
                        }
                    </td>
                    <td 
                        className={(sortField === 'b_project_due_date') ? 'current nowrap' : 'nowrap'}
                    >
                        {booking.b_project_due_date && moment(booking.b_project_due_date).format('DD/MM/YYYY')}
                    </td>
                </tr>
            );
        });

        return (
            <div className="qbootstrap-nav bookingsets" >
                <div id="headr" className="col-md-12">
                    <div className="col-md-7 col-sm-12 col-lg-8 col-xs-12 col-md-push-1">
                        <ul className="nav nav-tabs">
                            <li><Link to="/booking">Header</Link></li>
                            <li className=""><Link to="/allbookings">All Bookings</Link></li>
                            <li className="active"><a href="/bookingsets">BookingSets</a></li>
                            <li className=""><a href="/pods">PODs</a></li>
                            {clientname === 'dme' && <li className=""><Link to="/comm">Comm</Link></li>}
                            {clientname === 'dme' && <li className=""><Link to="/zoho">Zoho</Link></li>}
                            <li className=""><Link to="/reports">Reports</Link></li>
                            <li className="none"><a href="/bookinglines">Booking Lines</a></li>
                            <li className="none"><a href="/bookinglinedetails">Booking Line Datas</a></li>
                        </ul>
                    </div>
                    <div id="icn" className="col-md-4 col-sm-12 col-lg-4 col-xs-12 text-right none">
                        <a href=""><i className="icon-plus" aria-hidden="true"></i></a>
                        <div className="popup">
                            <i className="icon-search3" aria-hidden="true"></i>
                        </div>
                        <div className="popup">
                            <i className="icon icon-th-list" aria-hidden="true"></i>
                        </div>
                        <a href=""><i className="icon-cog2" aria-hidden="true"></i></a>
                        <a href=""><i className="icon-calendar3" aria-hidden="true"></i></a>
                        <a href="">?</a>
                    </div>
                </div>
                <div className="content">
                    {this.state.viewMode === 0 ?
                        <React.Fragment>
                            <table className="table table-hover table-bordered sortable">
                                <thead>
                                    <th>No</th>
                                    <th>Name</th>
                                    <th>Note</th>
                                    <th>Status</th>
                                    <th>Created By</th>
                                    <th>Created At</th>
                                    <th>Show Bookings</th>
                                    <th>Delete</th>
                                </thead>
                                <tbody>
                                    { bookingSetsList }
                                </tbody>
                            </table>
                        </React.Fragment>
                        :
                        <React.Fragment>
                            <div className='buttons'>
                                <Button className="primary">AAA</Button>
                            </div>
                            <LoadingOverlay spinner active={loading} text='Loading...'>
                                <div className="table-responsive" onScroll={this.handleScroll} ref={this.myRef}>
                                    <div className="tbl-header">
                                        <table className="table table-hover table-bordered sortable fixed_headers">
                                            <tr>
                                                <th scope="col" nowrap>$</th>
                                                <th 
                                                    className={(sortField === 'b_bookingID_Visual') ? 'current' : ''} 
                                                    onClick={() => this.onChangeSortField('b_bookingID_Visual')} 
                                                    scope="col" 
                                                    nowrap
                                                >
                                                    <p>Booking ID</p>
                                                    {
                                                        (sortField === 'b_bookingID_Visual') ?
                                                            (sortDirection > 0) ?
                                                                <i className="fa fa-sort-up"></i>
                                                                : <i className="fa fa-sort-down"></i>
                                                            : <i className="fa fa-sort"></i>
                                                    }
                                                </th>
                                                <th 
                                                    className={(sortField === 'b_client_name') ? 'current' : ''}
                                                    onClick={() => this.onChangeSortField('b_client_name')} 
                                                    scope="col" 
                                                    nowrap
                                                >
                                                    <p>Client</p>
                                                    {
                                                        (sortField === 'b_client_name') ?
                                                            (sortDirection > 0) ?
                                                                <i className="fa fa-sort-up"></i>
                                                                : <i className="fa fa-sort-down"></i>
                                                            : <i className="fa fa-sort"></i>
                                                    }
                                                </th>
                                                <th 
                                                    className={(sortField === 'b_client_name_sub') ? 'current' : ''}
                                                    onClick={() => this.onChangeSortField('b_client_name_sub')} 
                                                    scope="col" 
                                                    nowrap
                                                >
                                                    <p>Sub Client</p>
                                                    {
                                                        (sortField === 'b_client_name_sub') ?
                                                            (sortDirection > 0) ?
                                                                <i className="fa fa-sort-up"></i>
                                                                : <i className="fa fa-sort-down"></i>
                                                            : <i className="fa fa-sort"></i>
                                                    }
                                                </th>
                                                <th 
                                                    className={(sortField === 'puCompany') ? 'current' : ''}
                                                    onClick={() => this.onChangeSortField('puCompany')} 
                                                    scope="col" 
                                                    nowrap
                                                >
                                                    <p>From</p>
                                                    {
                                                        (sortField === 'puCompany') ?
                                                            (sortDirection > 0) ?
                                                                <i className="fa fa-sort-up"></i>
                                                                : <i className="fa fa-sort-down"></i>
                                                            : <i className="fa fa-sort"></i>
                                                    }
                                                </th>
                                                <th 
                                                    className={(sortField === 'pu_Address_Suburb') ? 'current' : ''}
                                                    onClick={() => this.onChangeSortField('pu_Address_Suburb')} 
                                                    scope="col" 
                                                    nowrap
                                                >
                                                    <p>From Suburb</p>
                                                    {
                                                        (sortField === 'pu_Address_Suburb') ?
                                                            (sortDirection > 0) ?
                                                                <i className="fa fa-sort-up"></i>
                                                                : <i className="fa fa-sort-down"></i>
                                                            : <i className="fa fa-sort"></i>
                                                    }
                                                </th>
                                                <th 
                                                    className={(sortField === 'pu_Address_State') ? 'current' : ''}
                                                    onClick={() => this.onChangeSortField('pu_Address_State')} 
                                                    scope="col" 
                                                    nowrap
                                                >
                                                    <p>From State</p>
                                                    {
                                                        (sortField === 'pu_Address_State') ?
                                                            (sortDirection > 0) ?
                                                                <i className="fa fa-sort-up"></i>
                                                                : <i className="fa fa-sort-down"></i>
                                                            : <i className="fa fa-sort"></i>
                                                    }
                                                </th>
                                                <th 
                                                    className={(sortField === 'pu_Address_PostalCode') ? 'current' : ''}
                                                    onClick={() => this.onChangeSortField('pu_Address_PostalCode')} 
                                                    scope="col" 
                                                    nowrap
                                                >
                                                    <p>From Postal Code</p>
                                                    {
                                                        (sortField === 'pu_Address_PostalCode') ?
                                                            (sortDirection > 0) ?
                                                                <i className="fa fa-sort-up"></i>
                                                                : <i className="fa fa-sort-down"></i>
                                                            : <i className="fa fa-sort"></i>
                                                    }
                                                </th>
                                                <th 
                                                    className={(sortField === 'deToCompanyName') ? 'current' : ''}
                                                    onClick={() => this.onChangeSortField('deToCompanyName')} 
                                                    scope="col" 
                                                    nowrap
                                                >
                                                    <p>To</p>
                                                    {
                                                        (sortField === 'deToCompanyName') ?
                                                            (sortDirection > 0) ?
                                                                <i className="fa fa-sort-up"></i>
                                                                : <i className="fa fa-sort-down"></i>
                                                            : <i className="fa fa-sort"></i>
                                                    }
                                                </th>
                                                <th 
                                                    className={(sortField === 'de_To_Address_Suburb') ? 'current' : ''}
                                                    onClick={() => this.onChangeSortField('de_To_Address_Suburb')} 
                                                    scope="col" 
                                                    nowrap
                                                >
                                                    <p>To Suburb</p>
                                                    {
                                                        (sortField === 'de_To_Address_Suburb') ?
                                                            (sortDirection > 0) ?
                                                                <i className="fa fa-sort-up"></i>
                                                                : <i className="fa fa-sort-down"></i>
                                                            : <i className="fa fa-sort"></i>
                                                    }
                                                </th>
                                                <th 
                                                    className={(sortField === 'de_To_Address_State') ? 'current' : ''}
                                                    onClick={() => this.onChangeSortField('de_To_Address_State')} 
                                                    scope="col" 
                                                    nowrap
                                                >
                                                    <p>To State</p>
                                                    {
                                                        (sortField === 'de_To_Address_State') ?
                                                            (sortDirection > 0) ?
                                                                <i className="fa fa-sort-up"></i>
                                                                : <i className="fa fa-sort-down"></i>
                                                            : <i className="fa fa-sort"></i>
                                                    }
                                                </th>
                                                <th 
                                                    className={(sortField === 'de_To_Address_PostalCode') ? 'current' : ''}
                                                    onClick={() => this.onChangeSortField('de_To_Address_PostalCode')} 
                                                    scope="col" 
                                                    nowrap
                                                >
                                                    <p>To Postal Code</p>
                                                    {
                                                        (sortField === 'de_To_Address_PostalCode') ?
                                                            (sortDirection > 0) ?
                                                                <i className="fa fa-sort-up"></i>
                                                                : <i className="fa fa-sort-down"></i>
                                                            : <i className="fa fa-sort"></i>
                                                    }
                                                </th>
                                                <th scope="col" nowrap><p>$ - Cost</p></th>
                                                <th scope="col" nowrap><p>$ - ETA DE</p></th>
                                                <th 
                                                    className={(sortField === 'vx_freight_provider') ? 'current' : ''}
                                                    onClick={() => this.onChangeSortField('vx_freight_provider')} 
                                                    scope="col" 
                                                    nowrap
                                                >
                                                    <p>Freight Provider</p>
                                                    {
                                                        (sortField === 'vx_freight_provider') ?
                                                            (sortDirection > 0) ?
                                                                <i className="fa fa-sort-up"></i>
                                                                : <i className="fa fa-sort-amount-desc"></i>
                                                            : <i className="fa fa-sort"></i>
                                                    }
                                                </th>
                                                <th scope="col" nowrap><p>$ - Service Name</p></th>
                                                <th scope="col" nowrap><p>$ - Account Code</p></th>
                                                <th
                                                    id={'booking-column-header-tooltip-Error'}
                                                    className={(sortField === 'b_error_Capture') ? 'narrow-column current' : 'narrow-column'}
                                                    onClick={() => this.onChangeSortField('b_error_Capture')} 
                                                >
                                                    <i className="fa fa-exclamation-triangle"></i>
                                                    <SimpleTooltipComponent text={'Error'} />
                                                </th>
                                                <th 
                                                    className={(sortField === 'b_clientReference_RA_Numbers') ? 'current' : ''}
                                                    onClick={() => this.onChangeSortField('b_clientReference_RA_Numbers')} 
                                                    scope="col" 
                                                    nowrap
                                                >
                                                    <p>Reference</p>
                                                    {
                                                        (sortField === 'b_clientReference_RA_Numbers') ?
                                                            (sortDirection > 0) ?
                                                                <i className="fa fa-sort-up"></i>
                                                                : <i className="fa fa-sort-down"></i>
                                                            : <i className="fa fa-sort"></i>
                                                    }
                                                </th>
                                                <th 
                                                    className={(sortField === 'vx_serviceName') ? 'current' : ''}
                                                    onClick={() => this.onChangeSortField('vx_serviceName')} 
                                                    scope="col" 
                                                    nowrap
                                                >
                                                    <p>Service</p>
                                                    {
                                                        (sortField === 'vx_serviceName') ?
                                                            (sortDirection > 0) ?
                                                                <i className="fa fa-sort-up"></i>
                                                                : <i className="fa fa-sort-down"></i>
                                                            : <i className="fa fa-sort"></i>
                                                    }
                                                </th>
                                                <th 
                                                    className={(sortField === 'b_status') ? 'current' : ''}
                                                    onClick={() => this.onChangeSortField('b_status')}
                                                    scope="col" 
                                                    nowrap
                                                >
                                                    <p>Status</p>
                                                    {
                                                        (sortField === 'b_status') ?
                                                            (sortDirection > 0) ?
                                                                <i className="fa fa-sort-up"></i>
                                                                : <i className="fa fa-sort-down"></i>
                                                            : <i className="fa fa-sort"></i>
                                                    }
                                                </th>
                                                <th 
                                                    className={(sortField === 'pu_PickUp_By_Date') ? 'current' : ''}
                                                    onClick={() => this.onChangeSortField('pu_PickUp_By_Date')}
                                                    scope="col" 
                                                    nowrap
                                                >
                                                    <p>Pickup Due</p>
                                                    {
                                                        (sortField === 'pu_PickUp_By_Date') ?
                                                            (sortDirection > 0) ?
                                                                <i className="fa fa-sort-up"></i>
                                                                : <i className="fa fa-sort-down"></i>
                                                            : <i className="fa fa-sort"></i>
                                                    }
                                                </th>
                                                <th 
                                                    className={(sortField === 'de_to_PickUp_Instructions_Address') ? 'current' : ''}
                                                    onClick={() => this.onChangeSortField('de_to_PickUp_Instructions_Address')}
                                                    scope="col" 
                                                    nowrap
                                                >
                                                    <p>DE Instruction</p>
                                                    {
                                                        (sortField === 'de_to_PickUp_Instructions_Address') ?
                                                            (sortDirection > 0) ?
                                                                <i className="fa fa-sort-up"></i>
                                                                : <i className="fa fa-sort-down"></i>
                                                            : <i className="fa fa-sort"></i>
                                                    }
                                                </th>
                                                <th 
                                                    className={(sortField === 'b_booking_project') ? 'current' : ''}
                                                    onClick={() => this.onChangeSortField('b_booking_project')}
                                                    scope="col" 
                                                    nowrap
                                                >
                                                    <p>Project Name</p>
                                                    {
                                                        (sortField === 'b_booking_project') ?
                                                            (sortDirection > 0) ?
                                                                <i className="fa fa-sort-up"></i>
                                                                : <i className="fa fa-sort-down"></i>
                                                            : <i className="fa fa-sort"></i>
                                                    }
                                                </th>
                                                <th 
                                                    className={(sortField === 'b_project_due_date') ? 'current' : ''}
                                                    onClick={() => this.onChangeSortField('b_project_due_date')}
                                                    scope="col" 
                                                    nowrap
                                                >
                                                    <p>Project Due Date</p>
                                                    {
                                                        (sortField === 'b_project_due_date') ?
                                                            (sortDirection > 0) ?
                                                                <i className="fa fa-sort-up"></i>
                                                                : <i className="fa fa-sort-down"></i>
                                                            : <i className="fa fa-sort"></i>
                                                    }
                                                </th>
                                            </tr>
                                            <tr className="filter-tr">
                                                <th scope="col"></th>
                                                <th scope="col"><input type="text" name="b_bookingID_Visual" value={filterInputs['b_bookingID_Visual'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                <th scope="col"><input type="text" name="b_client_name" value={filterInputs['b_client_name'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                <th scope="col"><input type="text" name="b_client_name_sub" value={filterInputs['b_client_name_sub'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                <th scope="col"><input type="text" name="puCompany" value={filterInputs['puCompany'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                <th scope="col"><input type="text" name="pu_Address_Suburb" value={filterInputs['pu_Address_Suburb'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                <th scope="col"><input type="text" name="pu_Address_State" value={filterInputs['pu_Address_State'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                <th scope="col"><input type="text" name="pu_Address_PostalCode" value={filterInputs['pu_Address_PostalCode'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                <th scope="col"><input type="text" name="deToCompanyName" value={filterInputs['deToCompanyName'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                <th scope="col"><input type="text" name="de_To_Address_Suburb" value={filterInputs['de_To_Address_Suburb'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                <th scope="col"><input type="text" name="de_To_Address_State" value={filterInputs['de_To_Address_State'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                <th scope="col"><input type="text" name="de_To_Address_PostalCode" value={filterInputs['de_To_Address_PostalCode'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                <th scope="col"></th>
                                                <th scope="col"></th>
                                                <th scope="col"><input type="text" name="vx_freight_provider" value={filterInputs['vx_freight_provider'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                <th scope="col"></th>
                                                <th scope="col"></th>
                                                <th className=""></th>
                                                <th scope="col"><input type="text" name="b_clientReference_RA_Numbers" value={filterInputs['b_clientReference_RA_Numbers'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                <th scope="col"><input type="text" name="vx_serviceName" value={filterInputs['vx_serviceName'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                <th scope="col"><input type="text" name="b_status" value={filterInputs['b_status'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                <th scope="col"><input type="text" name="pu_PickUp_By_Date" value={filterInputs['pu_PickUp_By_Date'] || ''} placeholder="20xx-xx-xx" onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                <th scope="col"><input type="text" name="de_to_PickUp_Instructions_Address" value={filterInputs['de_to_PickUp_Instructions_Address'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                <th scope="col"><input type="text" name="b_booking_project" value={filterInputs['b_booking_project'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                <th scope="col"><input type="text" name="b_project_due_date" value={filterInputs['b_project_due_date'] || ''} placeholder="20xx-xx-xx" onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                            </tr>
                                        </table>
                                    </div>
                                    <div className="tbl-content" style={tblContentWidth} onScroll={this.handleScroll}>
                                        <table className="table table-hover table-bordered sortable fixed_headers">
                                            { bookingsList }
                                        </table>
                                    </div>
                                </div>
                            </LoadingOverlay>
                        </React.Fragment>
                    }
                </div>

                <ConfirmModal
                    isOpen={this.state.isShowDeleteConfirmModal}
                    onOk={() => this.onConfirmDelete()}
                    onCancel={this.toggleDeleteConfirmModal}
                    title={`Delete BookingSet (${selectedBookingSet && selectedBookingSet.name})`}
                    text={'Are you sure you want to delete this BookingSet?'}
                    okBtnName={'Delete'}
                />

                <ToastContainer />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        redirect: state.auth.redirect,
        bookingSets: state.extra.bookingsets,
        isBookingSetDeleted: state.extra.isBookingSetDeleted,
        needUpdateBookingSets: state.extra.needUpdateBookingSets,
        clientname: state.auth.clientname,
        bookings: state.booking.bookings,
        bookingsCnt: state.booking.bookingsCnt,
        needUpdateBookings: state.booking.needUpdateBookings,
        pageItemCnt: state.booking.pageItemCnt,
        pageInd: state.booking.pageInd,
        pageCnt: state.booking.pageCnt,
        sortField: state.booking.sortField,
        columnFilters: state.booking.columnFilters,
        bookingIds: state.booking.bookingIds,
        activeTabInd: state.booking.activeTabInd,
        simpleSearchKeyword: state.booking.simpleSearchKeyword,
        downloadOption: state.booking.downloadOption,
        dmeStatus: state.booking.dmeStatus,
        bookingErrorMessage: state.booking.errorMessage,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        getBookings: (startDate, endDate, clientPK, warehouseId, pageItemCnt, pageInd, sortField, columnFilters, activeTabInd, simpleSearchKeyword, downloadOption, dmeStatus, multiFindField, multiFindValues, projectName, bookingIds) => dispatch(getBookings(startDate, endDate, clientPK, warehouseId, pageItemCnt, pageInd, sortField, columnFilters, activeTabInd, simpleSearchKeyword, downloadOption, dmeStatus, multiFindField, multiFindValues, projectName, bookingIds)),
        setGetBookingsFilter: (key, value) => dispatch(setGetBookingsFilter(key, value)),
        setAllGetBookingsFilter: (startDate, endDate, clientPK, warehouseId, pageItemCnt, pageInd, sortField, columnFilters, activeTabInd, simpleSearchKeyword, downloadOption, dmeStatus, multiFindField, multiFindValues, projectName, bookingIds) => dispatch(setAllGetBookingsFilter(startDate, endDate, clientPK, warehouseId, pageItemCnt, pageInd, sortField, columnFilters, activeTabInd, simpleSearchKeyword, downloadOption, dmeStatus, multiFindField, multiFindValues, projectName, bookingIds)),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        getBookingSets: () => dispatch(getBookingSets()),
        deleteBookingSet: (id) => dispatch(deleteBookingSet(id)),
        resetBookingSetFlags: () => dispatch(resetBookingSetFlags()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BookingSetList));

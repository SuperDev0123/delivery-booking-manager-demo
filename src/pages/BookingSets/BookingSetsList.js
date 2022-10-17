// React libs
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
// Libs
import moment from 'moment';
import { isEmpty, difference, union, isNull, map, join, indexOf } from 'lodash';
// Components
import { Button } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingOverlay from 'react-loading-overlay';
// Custom Components
import TooltipItem from '../../components/Tooltip/TooltipComponent';
import SimpleTooltipComponent from '../../components/Tooltip/SimpleTooltipComponent';
import ConfirmModal from '../../components/CommonModals/ConfirmModal';
import FPPricingSlider from '../../components/Sliders/FPPricingSlider';
import VehicleSlider from '../../components/Sliders/VehicleSlider';
// Services
import { verifyToken, cleanRedirectState } from '../../state/services/authService';
import { getBookingSets, deleteBookingSet, updateBookingSet, resetBookingSetFlags, getAllFPs } from '../../state/services/extraService';
import { getBookings, setGetBookingsFilter, setAllGetBookingsFilter, getPricingInfos, updateBooking } from '../../state/services/bookingService';

class BookingSetList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            viewMode: 0, // 0: BookingSet List, 1: booings view
            bookingSets: [],
            clientname: null,
            isShowDeleteConfirmModal: false,
            isShowPricingConfirmModal: false,
            isShowDropConfirmModal: false,
            isShowBookConfirmModal: false,
            isShowLabelConfirmModal: false,
            isShowFPPricingSlider: false,
            selectedBookingSet: null,
            bookings: [],
            bookingIds: [],
            filterInputs: [],
            selectedBookingIds: [],
            allCheckStatus: 'None',
            pageItemCnt: 100,
            pageInd: 0,
            pageCnt: 0,
            activeTabInd: 7,
            downloadOption: 'label',
            dmeClients: [],
            clientPK: 'dme',
            scrollLeft: 0,
            loadingBookings: false,
            loadingBookingSets: false,
            loadingPricingInfos: false,
            sortDirection: 1,
            pricingInfos: [],
            selectedBooking: null,
            allFPs: [],
            isShowVehicleSlider: false,
        };

        this.myRef = React.createRef();
        this.handleScroll = this.handleScroll.bind(this);
        this.toggleDeleteConfirmModal = this.toggleDeleteConfirmModal.bind(this);
        this.togglePricingConfirmModal = this.togglePricingConfirmModal.bind(this);
        this.toggleBookConfirmModal = this.toggleBookConfirmModal.bind(this);
        this.toggleLabelConfirmModal = this.toggleLabelConfirmModal.bind(this);
        this.toggleFPPricingSlider = this.toggleFPPricingSlider.bind(this);
        this.toggleDropConfirmModal = this.toggleDropConfirmModal.bind(this);
        this.toggleVehicleSlider = this.toggleVehicleSlider.bind(this);
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
        getPricingInfos: PropTypes.func.isRequired,
        updateBooking: PropTypes.func.isRequired,
        updateBookingSet: PropTypes.func.isRequired,
        getAllFPs: PropTypes.func.isRequired,
    };

    componentDidMount() {
        const token = localStorage.getItem('token');

        if (token && token.length > 0) {
            this.props.verifyToken();
        } else {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.history.push('/');
        }

        this.setState({loadingBookingSets: true});
        this.props.getBookingSets();
        this.props.getAllFPs();
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { redirect, bookingSets, clientname, isBookingSetDeleted, needUpdateBookingSets, startDate, endDate, warehouseId, fpId, pageItemCnt, pageInd, sortField, columnFilters, activeTabInd, simpleSearchKeyword, downloadOption, clientPK, bookingIds, needUpdateBookings, bookings, bookingsCnt, filteredBookingIds, dmeStatus, projectName, multiFindField, multiFindValues, pageCnt, pricingInfos, allFPs } = newProps;
        const currentRoute = this.props.location.pathname;

        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/');
        }

        if (clientname) {
            this.setState({clientname});
        }

        if (pricingInfos) {
            this.setState({pricingInfos, loadingPricingInfos: false});
        }

        if (allFPs) {
            this.setState({ allFPs });
        }

        if (isBookingSetDeleted) {
            this.notify('BookingSet has been deleted');
            this.setState({loadingBookingSets: true});
            this.props.getBookingSets();
            this.props.resetBookingSetFlags();
        } else if (this.state.loadingBookingSets && bookingSets) {
            this.setState({bookingSets});
            this.setState({loadingBookingSets: false});
            this.notify('BookingSets are refreshed');
        }

        if (needUpdateBookingSets) {
            this.setState({loadingBookingSets: true});
            this.props.getBookingSets();
            this.props.resetBookingSetFlags();

            if (this.state.viewMode === 1) {
                this.props.setGetBookingsFilter('bookingIds', this.state.selectedBookingSet.booking_ids);
            }
        }

        if (this.state.loadingBookings && !isNull(bookingsCnt) && !isEmpty(bookings)) {
            this.setState({ bookings, filteredBookingIds, bookingsCnt, loadingBookings: false });
        }

        if (pageCnt) {
            this.setState({ pageCnt: parseInt(pageCnt), pageInd: parseInt(pageInd) });
        }

        if (needUpdateBookings) {
            this.setState({loadingBookings: true});

            // sortField
            if (!isEmpty(sortField)) {
                if (sortField[0] === '-') {
                    this.setState({sortDirection: -1, sortField: sortField.substring(1)});
                } else {
                    this.setState({sortDirection: 1, sortField});
                }
            }

            this.setState({
                selectedFPId: fpId,
                filterInputs: columnFilters,
                pageItemCnt: pageItemCnt,
                pageInd: pageInd,
                bookingIds: bookingIds,
            });
            this.props.getBookings(startDate, endDate, clientPK, warehouseId, fpId, pageItemCnt, pageInd, sortField, columnFilters, activeTabInd, simpleSearchKeyword, downloadOption, dmeStatus, multiFindField, multiFindValues, projectName, bookingIds);
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

    togglePricingConfirmModal() {
        this.setState(prevState => ({isShowPricingConfirmModal: !prevState.isShowPricingConfirmModal}));
    }

    toggleDropConfirmModal() {
        this.setState(prevState => ({isShowDropConfirmModal: !prevState.isShowDropConfirmModal}));
    }

    toggleBookConfirmModal() {
        this.setState(prevState => ({isShowBookConfirmModal: !prevState.isShowBookConfirmModal}));
    }

    toggleLabelConfirmModal() {
        this.setState(prevState => ({isShowLabelConfirmModal: !prevState.isShowLabelConfirmModal}));
    }

    toggleFPPricingSlider() {
        this.setState(prevState => ({isShowFPPricingSlider: !prevState.isShowFPPricingSlider}));
    }

    toggleVehicleSlider() {
        this.setState(prevState => ({isShowVehicleSlider: !prevState.isShowVehicleSlider}));
    }

    onClickDeleteBtn(selectedBookingSet) {
        this.setState({selectedBookingSet});
        this.toggleDeleteConfirmModal();
    }

    onConfirmDelete() {
        this.props.deleteBookingSet(this.state.selectedBookingSet.id);
        this.setState({loadingBookingSets: true});
        this.toggleDeleteConfirmModal();
    }

    onClickPricingBtn(selectedBookingSet) {
        this.setState({selectedBookingSet});
        this.togglePricingConfirmModal();
    }

    onConfirmPricing(type) {
        const {selectedBookingSet} = this.state;
        selectedBookingSet.status = 'Pricing again';
        selectedBookingSet.auto_select_type = type === 'lowest';
        this.props.updateBookingSet(selectedBookingSet.id, selectedBookingSet);
        this.setState({loadingBookingSets: true});
        this.togglePricingConfirmModal();
    }

    onClickBookBtn(selectedBookingSet) {
        this.setState({selectedBookingSet});
        this.toggleBookConfirmModal();
    }

    onConfirmBook() {
        const {selectedBookingSet} = this.state;
        selectedBookingSet.status = 'Starting BOOK';
        this.props.updateBookingSet(selectedBookingSet.id, selectedBookingSet);
        this.setState({loadingBookingSets: true});
        this.toggleBookConfirmModal();
    }

    onClickGetLabel(selectedBookingSet) {
        this.setState({selectedBookingSet});
        this.toggleLabelConfirmModal();        
    }

    onConfirmBuildLabel() {
        const {selectedBookingSet} = this.state;
        selectedBookingSet.status = 'Build Label again';
        this.props.updateBookingSet(selectedBookingSet.id, selectedBookingSet);
        this.setState({loadingBookingSets: true});
        this.toggleLabelConfirmModal();
    }

    onClickRefreshBookingSets() {
        this.props.getBookingSets();
        this.setState({loadingBookingSets: true});
    }

    onClickShowBtn(selectedBookingSet) {
        this.setState({selectedBookingSet, viewMode: 1, selectedBookingIds: []});
        this.props.setAllGetBookingsFilter('*', '2099-01-01', 0, 0, 0, this.state.pageItemCnt, 0, '-id', {}, 0, '', 'label', '', null, null, null, selectedBookingSet.booking_ids);
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

    onCheck(e, id) {
        const { bookings } = this.state;
        let selectedBookingIds = this.state.selectedBookingIds;
        let allCheckStatus = '';

        if (!e.target.checked) {
            selectedBookingIds = difference(this.state.selectedBookingIds, [id]);
        } else {
            selectedBookingIds = union(this.state.selectedBookingIds, [id]);
        }

        if (selectedBookingIds.length === bookings.length) {
            allCheckStatus = 'All';
        } else if (selectedBookingIds.length === 0) {
            allCheckStatus = 'None';
        } else {
            allCheckStatus = 'Some';
        }

        this.setState({selectedBookingIds, allCheckStatus});
    }

    onCheckAll() {
        const { bookings } = this.state;
        let selectedBookingIds = this.state.selectedBookingIds;
        let allCheckStatus = this.state.allCheckStatus;

        if ((selectedBookingIds.length > 0 && selectedBookingIds.length < bookings.length)
            || selectedBookingIds.length === bookings.length) { // If selected `All` or `Some`
            selectedBookingIds = [];
            allCheckStatus = 'None';
        } else if (selectedBookingIds.length === 0) { // If selected `None`
            selectedBookingIds = map(bookings, 'id');
            allCheckStatus = 'All';
        }

        this.setState({allCheckStatus, selectedBookingIds});
    }

    onClickRow(booking) {
        this.setState({activeBookingId: booking.id});
    }

    onClickOpenPricingSlider(booking) {
        this.setState({selectedBooking: booking, loadingPricingInfos: true});
        this.toggleFPPricingSlider();
        this.props.getPricingInfos(booking.pk_booking_id);
    }

    onClickLink(num, bookingId) {
        if (num === 0)
            this.props.history.push('/booking?bookingid=' + bookingId);
        else if (num === 1)
            this.props.history.push('/booking?bookingid=' + bookingId);
    }

    onSelectPricing(pricingInfo, isLocking) {
        const booking = this.state.selectedBooking;
        booking['vx_freight_provider'] = pricingInfo['freight_provider'];
        booking['vx_account_code'] = pricingInfo['account_code'];
        booking['vx_serviceName'] = pricingInfo['service_name'];
        booking['v_service_Type'] = pricingInfo['service_code'];
        booking['inv_cost_actual'] = pricingInfo['fee'];
        booking['inv_cost_quoted'] = pricingInfo['client_mu_1_minimum_values'];
        booking['api_booking_quote'] = pricingInfo['id'];
        booking['is_quote_locked'] = isLocking;

        const selectedFP = this.state.allFPs.find(fp => fp.fp_company_name === pricingInfo['freight_provider']);
        booking['s_02_Booking_Cutoff_Time'] = selectedFP['service_cutoff_time'];

        this.setState({selectedBooking: booking, isBookingModified: true, loadingBookings: true, curViewMode: 0});
        this.props.updateBooking(booking.id, booking);
        this.toggleFPPricingSlider();
    }

    onConfirmDrop() {
        const {selectedBookingSet, selectedBookingIds, bookings} = this.state;
        const bookingIds = map(bookings, 'id');
        const remainingBookingIds = difference(bookingIds, selectedBookingIds);
        const joinStr = join(remainingBookingIds, ', ');

        selectedBookingSet['booking_ids'] = joinStr;
        this.props.updateBookingSet(selectedBookingSet.id, selectedBookingSet);
        this.setState({selectedBooking: [], allCheckStatus: 'None'});
        this.toggleDropConfirmModal();
    }

    onClickLineHaul(bookingSet) {
        this.setState({selectedBookingSet: bookingSet});
        this.toggleVehicleSlider();
    }

    render() {
        const { bookingSets, clientname, selectedBookingSet, bookings, scrollLeft, filterInputs, sortDirection, sortField, loadingBookings, loadingBookingSets, activeBookingId, allCheckStatus, selectedBookingIds } = this.state;
        const tblContentWidthVal = 'calc(100% + ' + scrollLeft + 'px)';
        const tblContentWidth = {width: tblContentWidthVal};

        const bookingSetsList = bookingSets.map((bookingSet, index) => {
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{bookingSet.name}</td>
                    <td id={'booking-set-' + 'note' + '-tooltip-' + bookingSet.id}>
                        {bookingSet.note}
                        {!isEmpty(bookingSet.note) && <TooltipItem object={bookingSet} placement={'top'} hideArrow={true}  name={'booking-set'} fields={['note']} />}
                    </td>
                    <td id={'booking-set-' + 'status' + '-tooltip-' + bookingSet.id}>
                        {bookingSet.status}
                        {!isEmpty(bookingSet.status) && <TooltipItem object={bookingSet} placement={'top'} hideArrow={true} name={'booking-set'} fields={['status']} />}
                    </td>
                    <td>{bookingSet.z_createdByAccount}</td>
                    <td>{moment(bookingSet.z_createdTimestamp).format('ddd DD MMM YYYY hh:mm a')}</td>
                    <td>
                        <Button
                            color="primary"
                            onClick={() => this.onClickLineHaul(bookingSet)}
                            disabled={bookingSet.line_haul_date ? true : false}
                        >
                            Set LineHaul
                        </Button>
                    </td>
                    <td>
                        <Button
                            color="primary"
                            onClick={() => this.onClickShowBtn(bookingSet)}
                        >
                            Show ({bookingSet.bookings_cnt})
                        </Button>
                    </td>
                    <td>
                        <Button
                            color="primary"
                            onClick={() => this.onClickPricingBtn(bookingSet)}
                            disabled={bookingSet.status.indexOf('In Progress') > -1}
                        >
                            Pricing ({bookingSet.auto_select_type ? 'Lowest' : 'Fastest'})
                        </Button>
                    </td>
                    <td>
                        <Button
                            color="primary"
                            onClick={() => this.onClickBookBtn(bookingSet)}
                            disabled={bookingSet.status.indexOf('Completed') === -1}
                        >
                            BOOK
                        </Button>
                    </td>
                    <td>
                        <Button
                            color="primary"
                            onClick={() => this.onClickGetLabel(bookingSet)}
                            disabled={bookingSet.status.indexOf('Completed') === -1}
                        >
                            Get Label
                        </Button>
                    </td>
                    <td>
                        <Button
                            color="danger"
                            onClick={() => this.onClickDeleteBtn(bookingSet)}
                            disabled={bookingSet.status.indexOf('In Progress') > -1}
                        >
                            Delete
                        </Button>
                    </td>
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
                    <td><input type="checkbox" checked={indexOf(selectedBookingIds, booking.id) > -1 ? 'checked' : ''} onChange={(e) => this.onCheck(e, booking.id)} /></td>
                    <td onClick={() => this.onClickOpenPricingSlider(booking)} className="bg-gray cur-pointer"><strong>$</strong></td>
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
                    <td className={(sortField === 'b_client_name') ? 'current nowrap="true"' : ' nowrap="true"'}>{booking.b_client_name}</td>
                    <td className={(sortField === 'b_client_name_sub') ? 'current nowrap="true"' : ' nowrap="true"'}>{booking.b_client_name_sub}</td>
                    <td className={(sortField === 'b_booking_Category') ? 'current' : ''}>{booking.b_booking_Category}</td>
                    <td className={(sortField === 'puCompany') ? 'current nowrap="true"' : ' nowrap="true"'}>{booking.puCompany}</td>
                    <td className={(sortField === 'pu_Address_Suburb') ? 'current' : ''}>{booking.pu_Address_Suburb}</td>
                    <td className={(sortField === 'pu_Address_State') ? 'current' : ''}>{booking.pu_Address_State}</td>
                    <td className={(sortField === 'pu_Address_PostalCode') ? 'current' : ''}>{booking.pu_Address_PostalCode}</td>
                    <td className={(sortField === 'deToCompanyName') ? 'current nowrap="true"' : ' nowrap="true"'}>{booking.deToCompanyName}</td>
                    <td className={(sortField === 'de_To_Address_Suburb') ? 'current' : ''}>{booking.de_To_Address_Suburb}</td>
                    <td className={(sortField === 'de_To_Address_State') ? 'current' : ''}>{booking.de_To_Address_State}</td>
                    <td className={(sortField === 'de_To_Address_PostalCode') ? 'current' : ''}>{booking.de_To_Address_PostalCode}</td>
                    <td>{booking.pricing_cost && `$${booking.pricing_cost.toFixed(2)}`}</td>
                    <td>{booking.eta_de_by && moment(booking.eta_de_by).utc().format('DD/MM/YYYY')}</td>
                    <td className={(sortField === 'vx_freight_provider') ? 'current' : ''}>{booking.vx_freight_provider}</td>
                    <td>{booking.pricing_service_name}</td>
                    <td>{booking.pricing_account_code}</td>
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
                        {!isEmpty(booking.b_status) &&
                            <TooltipItem object={booking} fields={['b_status']} />
                        }
                    </td>
                    <td className={(sortField === 'pu_PickUp_By_Date') ? 'current' : ''}>
                        {booking.pu_PickUp_By_Date ? moment(booking.pu_PickUp_By_Date).format('DD/MM/YYYY') : ''}
                    </td>
                    <td 
                        id={'booking-' + 'de_to_PickUp_Instructions_Address' + '-tooltip-' + booking.id}
                        className={(sortField === 'de_to_PickUp_Instructions_Address') ? 'current nowrap="true"' : 'nowrap="true"'}
                    >
                        {booking.de_to_PickUp_Instructions_Address}
                        {!isEmpty(booking.de_to_PickUp_Instructions_Address) &&
                            <TooltipItem object={booking} fields={['de_to_PickUp_Instructions_Address']} />
                        }
                    </td>
                    <td 
                        id={'booking-' + 'b_booking_project' + '-tooltip-' + booking.id}
                        className={(sortField === 'b_booking_project') ? 'current nowrap="true"' : 'nowrap="true"'}
                    >
                        {booking.b_booking_project}
                        {!isEmpty(booking.b_booking_project) &&
                            <TooltipItem object={booking} fields={['b_booking_project']} />
                        }
                    </td>
                    <td 
                        className={(sortField === 'b_project_due_date') ? 'current nowrap="true"' : 'nowrap="true"'}
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
                            <li className="active"><a href="/bookingsets">Booking Sets</a></li>
                            <li className=""><a href="/pods">PODs</a></li>
                            {clientname === 'dme' && <li className=""><Link to="/zoho">Zoho</Link></li>}
                            <li className=""><Link to="/reports">Reports</Link></li>
                            <li className="none"><a href="/bookinglines">Booking Lines</a></li>
                            <li className="none"><a href="/bookinglinedetails">Booking Line Data</a></li>
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
                    <LoadingOverlay spinner active={loadingBookings || loadingBookingSets} text='Loading...'>
                        {this.state.viewMode === 0 ?
                            <React.Fragment>
                                <div>
                                    <Button color="success" onClick={() => this.onClickRefreshBookingSets()}>Refresh</Button>
                                </div>
                                <div className="bookingsets-table">
                                    <table className="table table-hover table-bordered sortable">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Name</th>
                                                <th>Note</th>
                                                <th>Status</th>
                                                <th>Created By</th>
                                                <th>Created At</th>
                                                <th>LineHaul</th>
                                                <th>Show Bookings</th>
                                                <th>Pricing</th>
                                                <th>BOOK</th>
                                                <th>Delete</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            { bookingSetsList }
                                        </tbody>
                                    </table>
                                </div>
                            </React.Fragment>
                            :
                            <React.Fragment>
                                <div className='buttons'>
                                    <Button className="btn btn-primary" onClick={() => this.setState({viewMode: 0})}>Back to List</Button>
                                    <Button
                                        className="btn btn-danger float-right" onClick={() => this.toggleDropConfirmModal()}
                                        disabled={selectedBookingIds.length === 0}
                                    >
                                        Drop from SET
                                    </Button>
                                </div>
                                <div className="table-responsive" onScroll={this.handleScroll} ref={this.myRef}>
                                    <div className="tbl-header">
                                        <table className="table table-hover table-bordered sortable fixed_headers">
                                            <tr>
                                                <th className=""></th>
                                                <th scope="col" nowrap="true">$</th>
                                                <th 
                                                    className={(sortField === 'b_bookingID_Visual') ? 'current' : ''} 
                                                    onClick={() => this.onChangeSortField('b_bookingID_Visual')} 
                                                    scope="col" 
                                                    nowrap="true"
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
                                                    nowrap="true"
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
                                                    nowrap="true"
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
                                                    className={(sortField === 'b_booking_Category') ? 'current' : ''}
                                                    onClick={() => this.onChangeSortField('b_booking_Category')} 
                                                    scope="col" 
                                                    nowrap="true"
                                                >
                                                    <p>Category</p>
                                                    {
                                                        (sortField === 'b_booking_Category') ?
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
                                                    nowrap="true"
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
                                                    nowrap="true"
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
                                                    nowrap="true"
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
                                                    nowrap="true"
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
                                                    nowrap="true"
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
                                                    nowrap="true"
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
                                                    nowrap="true"
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
                                                    nowrap="true"
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
                                                <th scope="col" nowrap="true"><p>$ - Cost</p></th>
                                                <th scope="col" nowrap="true"><p>$ - ETA DE</p></th>
                                                <th 
                                                    className={(sortField === 'vx_freight_provider') ? 'current' : ''}
                                                    onClick={() => this.onChangeSortField('vx_freight_provider')} 
                                                    scope="col" 
                                                    nowrap="true"
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
                                                <th scope="col" nowrap="true"><p>$ - Service Name</p></th>
                                                <th scope="col" nowrap="true"><p>$ - Account Code</p></th>
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
                                                    nowrap="true"
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
                                                    nowrap="true"
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
                                                    nowrap="true"
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
                                                    nowrap="true"
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
                                                    nowrap="true"
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
                                                    nowrap="true"
                                                >
                                                    <p>Vehicle Loaded</p>
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
                                                    nowrap="true"
                                                >
                                                    <p>Vehicle Departure Date</p>
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
                                                <th>
                                                    <input
                                                        type="checkbox"
                                                        className={(allCheckStatus === 'All' || allCheckStatus === 'None') ? 'checkall' : 'checkall some'}
                                                        checked={allCheckStatus !== 'None' ? 'checked' : ''}
                                                        onChange={() => this.onCheckAll()}
                                                    />
                                                </th>
                                                <th scope="col" nowrap="true"></th>
                                                <th scope="col" nowrap="true"><input type="text" name="b_bookingID_Visual" value={filterInputs['b_bookingID_Visual'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                <th scope="col" nowrap="true"><input type="text" name="b_client_name" value={filterInputs['b_client_name'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                <th scope="col" nowrap="true"><input type="text" name="b_client_name_sub" value={filterInputs['b_client_name_sub'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                <th scope="col" nowrap="true"><input type="text" name="b_booking_Category" value={filterInputs['b_booking_Category'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                <th scope="col" nowrap="true"><input type="text" name="puCompany" value={filterInputs['puCompany'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                <th scope="col" nowrap="true"><input type="text" name="pu_Address_Suburb" value={filterInputs['pu_Address_Suburb'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                <th scope="col" nowrap="true"><input type="text" name="pu_Address_State" value={filterInputs['pu_Address_State'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                <th scope="col" nowrap="true"><input type="text" name="pu_Address_PostalCode" value={filterInputs['pu_Address_PostalCode'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                <th scope="col" nowrap="true"><input type="text" name="deToCompanyName" value={filterInputs['deToCompanyName'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                <th scope="col" nowrap="true"><input type="text" name="de_To_Address_Suburb" value={filterInputs['de_To_Address_Suburb'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                <th scope="col" nowrap="true"><input type="text" name="de_To_Address_State" value={filterInputs['de_To_Address_State'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                <th scope="col" nowrap="true"><input type="text" name="de_To_Address_PostalCode" value={filterInputs['de_To_Address_PostalCode'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                <th scope="col" nowrap="true"></th>
                                                <th scope="col" nowrap="true"></th>
                                                <th scope="col" nowrap="true"><input type="text" name="vx_freight_provider" value={filterInputs['vx_freight_provider'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                <th scope="col" nowrap="true"></th>
                                                <th scope="col" nowrap="true"></th>
                                                <th className="" nowrap="true"></th>
                                                <th scope="col" nowrap="true"><input type="text" name="b_clientReference_RA_Numbers" value={filterInputs['b_clientReference_RA_Numbers'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                <th scope="col" nowrap="true"><input type="text" name="vx_serviceName" value={filterInputs['vx_serviceName'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                <th scope="col" nowrap="true"><input type="text" name="b_status" value={filterInputs['b_status'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                <th scope="col" nowrap="true"><input type="text" name="pu_PickUp_By_Date" value={filterInputs['pu_PickUp_By_Date'] || ''} placeholder="20xx-xx-xx" onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                <th scope="col" nowrap="true"><input type="text" name="de_to_PickUp_Instructions_Address" value={filterInputs['de_to_PickUp_Instructions_Address'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                <th scope="col" nowrap="true"><input type="text" name="b_booking_project" value={filterInputs['b_booking_project'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                <th scope="col" nowrap="true"><input type="text" name="b_project_due_date" value={filterInputs['b_project_due_date'] || ''} placeholder="20xx-xx-xx" onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                            </tr>
                                        </table>
                                    </div>
                                    <div className="tbl-content" style={tblContentWidth} onScroll={this.handleScroll}>
                                        <table className="table table-hover table-bordered sortable fixed_headers">
                                            { bookingsList }
                                        </table>
                                    </div>
                                </div>
                            </React.Fragment>
                        }
                    </LoadingOverlay>
                </div>

                <ConfirmModal
                    isOpen={this.state.isShowDeleteConfirmModal}
                    onOk={() => this.onConfirmDelete()}
                    onCancel={this.toggleDeleteConfirmModal}
                    title={`Delete BookingSet (${selectedBookingSet && selectedBookingSet.name})`}
                    text={'Are you sure you want to delete this BookingSet?'}
                    okBtnName={'Delete'}
                />

                <ConfirmModal
                    isOpen={this.state.isShowPricingConfirmModal}
                    onOk={() => this.onConfirmPricing('lowest')}
                    onOk2={() => this.onConfirmPricing('fastest')}
                    onCancel={this.togglePricingConfirmModal}
                    title={`Start get pricing for BookingSet (${selectedBookingSet && selectedBookingSet.name})`}
                    text={'Are you sure you want to restart pricing for this BookingSet?'}
                    okBtnName={'Lowest Pricing'}
                    ok2BtnName={'Fastest Pricing'}
                />

                <ConfirmModal
                    isOpen={this.state.isShowBookConfirmModal}
                    onOk={() => this.onConfirmBook()}
                    onCancel={this.toggleBookConfirmModal}
                    title={`BOOK all bookings of BookingSet (${selectedBookingSet && selectedBookingSet.name})`}
                    text={'Are you sure you want to BOOK all bookings?'}
                    okBtnName={'BOOK'}
                />

                <ConfirmModal
                    isOpen={this.state.isShowLabelConfirmModal}
                    onOk={() => this.onConfirmBuildLabel()}
                    onCancel={this.toggleLabelConfirmModal}
                    title={`Build label of all bookings of BookingSet (${selectedBookingSet && selectedBookingSet.name})`}
                    text={'Are you sure you want to BUILD LABEL of all bookings?'}
                    okBtnName={'Get Label'}
                />

                <ConfirmModal
                    isOpen={this.state.isShowDropConfirmModal}
                    onOk={() => this.onConfirmDrop()}
                    onCancel={this.toggleDropConfirmModal}
                    title={'Drop bookings from this set'}
                    text={`${selectedBookingIds.length} booking(s) are selected, will you continue to drop?`}
                    okBtnName={'Continue'}
                />

                {this.state.selectedBooking &&
                    <FPPricingSlider
                        isOpen={this.state.isShowFPPricingSlider}
                        toggleSlider={this.toggleFPPricingSlider}
                        pricings={this.state.pricingInfos}
                        onSelectPricing={(pricingInfo, isLocking) => this.onSelectPricing(pricingInfo, isLocking)}
                        isLoading={this.state.loadingPricingInfos}
                        clientname={clientname}
                        x_manual_booked_flag={this.state.selectedBooking.x_manual_booked_flag}
                        api_booking_quote_id={this.state.selectedBooking.api_booking_quote}
                        is_quote_locked={this.state.selectedBooking.is_quote_locked}
                        isBooked={this.state.selectedBooking.b_dateBookedDate ? true : false}
                        clientSalesTotal={this.state.selectedBooking.client_sales_total}
                    />
                }

                <VehicleSlider
                    isOpen={this.state.isShowVehicleSlider}
                    toggleSlider={this.toggleVehicleSlider}
                    selectedBookingSet={selectedBookingSet}
                    updateBookingSet={this.props.updateBookingSet}
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
        needUpdateBooking: state.booking.needUpdateBooking,
        needUpdateBookingSets: state.extra.needUpdateBookingSets,
        clientname: state.auth.clientname,
        bookings: state.booking.bookings,
        bookingsCnt: state.booking.bookingsCnt,
        needUpdateBookings: state.booking.needUpdateBookings,
        startDate: state.booking.startDate,
        endDate: state.booking.endDate,
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
        pricingInfos: state.booking.pricingInfos,
        allFPs: state.extra.allFPs,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        getBookings: (startDate, endDate, clientPK, warehouseId, fpId, pageItemCnt, pageInd, sortField, columnFilters, activeTabInd, simpleSearchKeyword, downloadOption, dmeStatus, multiFindField, multiFindValues, projectName, bookingIds) => dispatch(getBookings(startDate, endDate, clientPK, warehouseId, fpId, pageItemCnt, pageInd, sortField, columnFilters, activeTabInd, simpleSearchKeyword, downloadOption, dmeStatus, multiFindField, multiFindValues, projectName, bookingIds)),
        setGetBookingsFilter: (key, value) => dispatch(setGetBookingsFilter(key, value)),
        setAllGetBookingsFilter: (startDate, endDate, clientPK, warehouseId, fpId, pageItemCnt, pageInd, sortField, columnFilters, activeTabInd, simpleSearchKeyword, downloadOption, dmeStatus, multiFindField, multiFindValues, projectName, bookingIds) => dispatch(setAllGetBookingsFilter(startDate, endDate, clientPK, warehouseId, fpId, pageItemCnt, pageInd, sortField, columnFilters, activeTabInd, simpleSearchKeyword, downloadOption, dmeStatus, multiFindField, multiFindValues, projectName, bookingIds)),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        getBookingSets: () => dispatch(getBookingSets()),
        deleteBookingSet: (id) => dispatch(deleteBookingSet(id)),
        resetBookingSetFlags: () => dispatch(resetBookingSetFlags()),
        getPricingInfos: (pk_booking_id) => dispatch(getPricingInfos(pk_booking_id)),
        updateBooking: (id, booking) => dispatch(updateBooking(id, booking)),
        updateBookingSet: (id, bookingSet) => dispatch(updateBookingSet(id, bookingSet)),
        getAllFPs: () => dispatch(getAllFPs()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BookingSetList));

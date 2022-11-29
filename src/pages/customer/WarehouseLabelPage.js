// React Libs
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
// Libs
import moment from 'moment-timezone';
import {isEmpty, isUndefined, join, union,  difference, isNull, clone, indexOf, size} from 'lodash';
import axios from 'axios';
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Clock from 'react-live-clock';
import LoadingOverlay from 'react-loading-overlay';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DateRangePicker from 'react-daterange-picker';
import 'react-daterange-picker/dist/css/react-calendar.css'; // For some basic styling. (OPTIONAL)
// Constants
import { API_HOST, STATIC_HOST, HTTP_PROTOCOL } from '../../config';
// Actions
import { verifyToken, cleanRedirectState } from '../../state/services/authService';
import { getWarehouses } from '../../state/services/warehouseService';
import {
    getWareHouseLabelBookings, getUserDateFilterField, alliedBooking, fpLabel, getAlliedLabel,
    setGetBookingsFilter, setAllGetBookingsFilter, setNeedUpdateBookingsState,
    fpOrder, changeBookingsStatus, changeBookingsFlagStatus,
    clearErrorMessage, fpOrderSummary, getSummaryOfBookings
} from '../../state/services/bookingService';
import {
    getBookingLines, getBookingLinesCnt, createBookingLine, updateBookingLine, deleteBookingLine, duplicateBookingLine
} from '../../state/services/bookingLinesService';
import {
    getBookingLineDetails, createBookingLineDetail, updateBookingLineDetail, deleteBookingLineDetail, duplicateBookingLineDetail, moveLineDetails
} from '../../state/services/bookingLineDetailsService';
import { getAllFPs, getPackageTypes } from '../../state/services/extraService';
// Components
import TooltipItem from '../../components/Tooltip/TooltipComponent';
import SimpleTooltipComponent from '../../components/Tooltip/SimpleTooltipComponent';
import CustomPagination from '../../components/Pagination/Pagination';
import FindModal from '../../components/CommonModals/FindModal';
import ManifestSlider from '../../components/Sliders/ManifestSlider';
import BulkUpdateSlider from '../../components/Sliders/BulkUpdateSlider';
import LineAndLineDetailSlider from '../../components/Sliders/LineAndLineDetailSlider';

class WarehouseLabelPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            bookingLines: [],
            bookingLineDetails: [],
            warehouses: [],
            bookingsCnt: 0,
            startDate: '',
            endDate: '',
            userDateFilterField: '',
            filterInputs: {},
            selectedBookingIds: [],
            selectedBookingId: '',
            selectedBooking: {},
            additionalInfoOpens: [],
            bookingLinesInfoOpens: [],
            linkPopoverOpens: [],
            editCellPopoverOpens: [],
            bookingLinesQtyTotal: 0,
            bookingLineDetailsQtyTotal: 0,
            simpleSearchKeyword: '',
            showSimpleSearchBox: false,
            loading: false,
            loadingBooking: false,
            loadingDownload: false,
            loadingLines: false,
            activeTabInd: 7,
            allCheckStatus: 'None',
            showGearMenu: false,
            showCopyMenu: false,
            currentBookInd: 0,
            downloadOption: 'label',
            total_qty: 0,
            total_kgs: 0,
            total_cubic_meter: 0,
            dmeClients: [],
            clientname: null,
            username: null,
            clientPK: 0,
            hasSuccessSearchAndFilterOptions: false,
            successSearchFilterOptions: {},
            scrollLeft: 0,
            selectedStatusValue: null,
            selectedname: 'All',
            pageItemCnt: 100,
            pageInd: 0,
            pageCnt: 0,
            activeBookingId: null,
            dmeStatus: null,
            selectedWarehouseId: 0,
            selectedFPId: 0,
            isShowFindModal: false,
            selectedBookingLinesCnt: 0,
            isShowManifestSlider: false,
            isShowBulkUpdateSlider: false,
            isShowLineSlider: false,
            currentPackedStatus: 'original',
        };

        moment.tz.setDefault('Australia/Sydney');
        this.myRef = React.createRef();
        this.togglePopover = this.togglePopover.bind(this);
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.toggleFindModal = this.toggleFindModal.bind(this);
        this.toggleManifestSlider = this.toggleManifestSlider.bind(this);
        this.toggleBulkUpdateSlider = this.toggleBulkUpdateSlider.bind(this);
        this.toggleLineSlider = this.toggleLineSlider.bind(this);
    }

    static propTypes = {
        // Prop funcs
        verifyToken: PropTypes.func.isRequired,
        getWareHouseLabelBookings: PropTypes.func.isRequired,
        getBookingLines: PropTypes.func.isRequired,
        getBookingLineDetails: PropTypes.func.isRequired,
        createBookingLine: PropTypes.func.isRequired,
        duplicateBookingLine: PropTypes.func.isRequired,
        deleteBookingLine: PropTypes.func.isRequired,
        updateBookingLine: PropTypes.func.isRequired,
        createBookingLineDetail: PropTypes.func.isRequired,
        duplicateBookingLineDetail: PropTypes.func.isRequired,
        deleteBookingLineDetail: PropTypes.func.isRequired,
        updateBookingLineDetail: PropTypes.func.isRequired,
        moveLineDetails: PropTypes.func.isRequired,
        getWarehouses: PropTypes.func.isRequired,
        getUserDateFilterField: PropTypes.func.isRequired,
        alliedBooking: PropTypes.func.isRequired,
        fpLabel: PropTypes.func.isRequired,
        fpOrder: PropTypes.func.isRequired,
        fpOrderSummary: PropTypes.func.isRequired,
        getAlliedLabel: PropTypes.func.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
        setGetBookingsFilter: PropTypes.func.isRequired,
        setAllGetBookingsFilter: PropTypes.func.isRequired,
        setNeedUpdateBookingsState: PropTypes.func.isRequired,
        changeBookingsStatus: PropTypes.func.isRequired,
        changeBookingsFlagStatus: PropTypes.func.isRequired,
        getAllFPs: PropTypes.func.isRequired,
        getBookingLinesCnt: PropTypes.func.isRequired,
        getSummaryOfBookings: PropTypes.func.isRequired,
        getPackageTypes: PropTypes.func.isRequired,

        // Prop vars
        history: PropTypes.object.isRequired,
        redirect: PropTypes.bool.isRequired,
        location: PropTypes.object.isRequired,
        bookings: PropTypes.array,
        clientname: PropTypes.string,
        startDate: PropTypes.any,
        filteredBookingIds: PropTypes.array,
        filteredBookingVisualIds: PropTypes.array,
        filteredConsignments: PropTypes.array,
        clearErrorMessage: PropTypes.func.isRequired,
        bookingsSummary: PropTypes.object,
        allFPs: PropTypes.array,
        bookingLines: PropTypes.array,
        bookingLineDetails: PropTypes.array,
        packageTypes: PropTypes.array,
    };

    componentDidMount() {
        const { startDate, bookings } = this.props;
        const token = localStorage.getItem('token');

        if (token && token.length > 0) {
            this.props.verifyToken();
        } else {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/');
        }

        const delayedFuncs = () => {
            const that = this;
            setTimeout(() => {
                that.props.getWarehouses();
                that.props.getUserDateFilterField();
                that.props.getAllFPs();
                that.props.getPackageTypes();
            }, 2000);
        };

        if (!bookings || (bookings && (isEmpty(bookings) || isUndefined(bookings)))) {
            // Set initial date range filter values
            let newStartDate = moment().format('YYYY-MM-DD');

            if (startDate === '*') {
                newStartDate = null;
                this.props.setGetBookingsFilter('date', {startDate: '*', endDate: newStartDate});
            } else {
                this.props.setGetBookingsFilter('date', {startDate: newStartDate, endDate: newStartDate});
            }

            this.setState({startDate: newStartDate, endDate: newStartDate});
            delayedFuncs();
        }
    }

    UNSAFE_componentWillMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
        // document.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
        // document.removeEventListener('scroll', this.handleScroll);
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { bookings, bookingsCnt, bookingLines, bookingLineDetails, warehouses, userDateFilterField,
            redirect, username, needUpdateBookings, startDate, endDate, warehouseId, fpId, pageItemCnt, pageInd, sortField,
            columnFilters, activeTabInd, simpleSearchKeyword, downloadOption, dmeClients, clientname, clientPK,
            pageCnt, dmeStatus, multiFindField, multiFindValues, bookingErrorMessage, selectedBookingLinesCnt
        } = newProps;
        let {successSearchFilterOptions, hasSuccessSearchAndFilterOptions} = this.state;
        const currentRoute = this.props.location.pathname;

        if (bookings && bookings !== this.props.bookings) {
            const bookingIds = bookings.map(booking => booking.id);
            this.props.getSummaryOfBookings(bookingIds, 'allbookings');
        }

        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/');
        }

        if (!isEmpty(bookingErrorMessage)) {
            this.notify(bookingErrorMessage);
            this.props.clearErrorMessage();
        }

        if (!isNull(bookingsCnt)) {
            this.setState({ bookingsCnt, activeTabInd, loading: false });

            if (bookings.length > 0 && !needUpdateBookings) {
                this.setState({
                    successSearchFilterOptions: {
                        startDate,
                        endDate,
                        warehouseId,
                        fpId,
                        sortField,
                        pageItemCnt,
                        pageInd,
                        columnFilters: {...columnFilters},
                        activeTabInd,
                        simpleSearchKeyword,
                        downloadOption,
                        clientPK,
                        dmeStatus,
                        multiFindField,
                        multiFindValues,
                    },
                    hasSuccessSearchAndFilterOptions: true,
                });
            } else if (bookings.length === 0 && !needUpdateBookings && hasSuccessSearchAndFilterOptions) {
                this.notify('Your search/filter has returned 0 records - Returning to your last found set.');

                this.props.setAllGetBookingsFilter(
                    successSearchFilterOptions.startDate,
                    successSearchFilterOptions.endDate,
                    successSearchFilterOptions.clientPK,
                    successSearchFilterOptions.warehouseId,
                    successSearchFilterOptions.fpId,
                    successSearchFilterOptions.pageItemCnt,
                    successSearchFilterOptions.pageInd,
                    successSearchFilterOptions.sortField,
                    successSearchFilterOptions.columnFilters,
                    successSearchFilterOptions.activeTabInd,
                    successSearchFilterOptions.simpleSearchKeyword,
                    successSearchFilterOptions.downloadOption,
                    successSearchFilterOptions.dmeStatus,
                    successSearchFilterOptions.multiFindField,
                    successSearchFilterOptions.multiFindValues,
                );
                this.setState({successSearchFilterOptions: {}, hasSuccessSearchAndFilterOptions: false});
            }
        }

        if (bookingLineDetails) {
            this.setState({bookingLineDetails: this.calcBookingLineDetail(bookingLineDetails)});
        }

        if (bookingLines) {
            this.setState({bookingLines: this.calcBookingLine(bookingLines)});
            this.setState({loadingLines: false});
        }

        if (warehouses) {
            warehouses.sort(function(a, b) {
                var nameA = a.name.toUpperCase();
                var nameB = b.name.toUpperCase();
                return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
            });
            this.setState({ warehouses });
        }

        if (userDateFilterField) {
            this.setState({ userDateFilterField });
        }

        if (pageCnt) {
            this.setState({ pageCnt: parseInt(pageCnt), pageInd: parseInt(pageInd) });
        }

        if (dmeClients) {
            dmeClients.sort(function(a, b) {
                var companyA = a.company_name.toUpperCase();
                var companyB = b.company_name.toUpperCase();
                return (companyA < companyB) ? -1 : (companyA > companyB) ? 1 : 0;
            });

            this.setState({dmeClients});
        }

        if (clientname) {
            this.setState({clientname});
        }

        if (username) {
            this.setState({username});
        }

        if (selectedBookingLinesCnt) {
            this.setState({selectedBookingLinesCnt});
        }

        if (needUpdateBookings) {
            this.setState({loading: true});

            // startDate
            if (isEmpty(startDate)) {
                const startDate = moment().toDate();
                const dateParam = moment().format('YYYY-MM-DD');
                this.props.setGetBookingsFilter('date', {startDate: dateParam});
                this.setState({startDate});
                return;
            } else if (startDate === '*') {
                this.setState({startDate: null});
            } else {
                this.setState({startDate});
            }

            // endDate
            if (startDate !== '*' && isEmpty(endDate)) {
                const endDate = startDate;
                const dateParam = moment(startDate).format('YYYY-MM-DD');
                this.props.setGetBookingsFilter('date', {startDate: startDate, endDate: dateParam});
                this.setState({endDate: endDate});
                return;
            } else if (endDate === '*') {
                this.setState({endDate: null});
            } else {
                this.setState({endDate});
            }

            // sortField
            if (!isEmpty(sortField)) {
                if (sortField[0] === '-') {
                    this.setState({sortDirection: -1, sortField: sortField.substring(1)});
                } else {
                    this.setState({sortDirection: 1, sortField});
                }
            }

            // activeTabInd
            if (startDate === '*') {
                this.setState({activeTabInd: 0});
            } else if (startDate !== '*' && activeTabInd === 0) {
                this.setState({activeTabInd: 7});
            } else {
                this.setState({activeTabInd: activeTabInd});
            }

            // downloadOption
            if (downloadOption) {
                this.setState({downloadOption});
            }

            this.setState({
                selectedWarehouseId: warehouseId,
                selectedFPId: fpId,
                filterInputs: columnFilters,
                columnFilters: columnFilters,
                simpleSearchKeyword,
                dmeStatus,
                projectName: null,
                pageItemCnt,
                pageInd,
                clientPK,
            });

            this.props.getWareHouseLabelBookings(startDate, endDate, clientPK, warehouseId, fpId, pageItemCnt, pageInd, sortField, columnFilters, activeTabInd, simpleSearchKeyword, downloadOption, dmeStatus, multiFindField, multiFindValues);
        }
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    notify = (text) => {
        toast(text);
    };

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target))
            this.setState({showSimpleSearchBox: false, showGearMenu: false, showCopyMenu: false});
    }

    handleScroll(event) {
        let scrollLeft = event.target.scrollLeft;
        const tblContent = this.myRef.current;
        if (scrollLeft !== this.state.scrollLeft) {
            this.setState({scrollLeft: tblContent.scrollLeft});
        }
    }

    onSelectDateRange (dateRange, field) {
        let filterInputs = this.state.filterInputs;
        filterInputs[field] = `${dateRange.start.format('DD/MM/YY')}-${dateRange.end.format('DD/MM/YY')}`;

        if (field === 'puPickUpAvailFrom_Date')
            this.setState({puPickUpAvailFrom_DateRange: dateRange, isShowpuPickUpAvailFrom_DateRange: !this.state.isShowpuPickUpAvailFrom_DateRange});
        else if (field === 'b_dateBookedDate')
            this.setState({b_dateBookedDateRange: dateRange, isShowb_dateBookedDateRange: !this.state.isShowb_dateBookedDateRange});
        else if (field === 'manifest_timestamp')
            this.setState({manifest_timestampDateRange: dateRange, isShowmanifest_timestampDateRange: !this.state.isShowmanifest_timestampDateRange});

        this.props.setGetBookingsFilter('columnFilters', filterInputs);
        this.setState({filterInputs, selectedBookingIds: [], allCheckStatus: 'None'});
    }

    calcBookingLine(bookingLines) {
        let total_qty = 0;
        let total_kgs = 0;
        let total_cubic_meter = 0;

        let newBookingLines = bookingLines.map((bookingLine) => {
            if (bookingLine.e_weightUOM) {
                if (bookingLine.e_weightUOM.toUpperCase() === 'GRAM' ||
                    bookingLine.e_weightUOM.toUpperCase() === 'GRAMS')
                    bookingLine['total_kgs'] = bookingLine.e_qty * bookingLine.e_weightPerEach / 1000;
                else if (bookingLine.e_weightUOM.toUpperCase() === 'KILOGRAM' ||
                    bookingLine.e_weightUOM.toUpperCase() === 'KG' ||
                    bookingLine.e_weightUOM.toUpperCase() === 'KGS' ||
                    bookingLine.e_weightUOM.toUpperCase() === 'KILOGRAMS')
                    bookingLine['total_kgs'] = bookingLine.e_qty * bookingLine.e_weightPerEach;
                else if (bookingLine.e_weightUOM.toUpperCase() === 'TON' ||
                    bookingLine.e_weightUOM.toUpperCase() === 'TONS')
                    bookingLine['total_kgs'] = bookingLine.e_qty * bookingLine.e_weightPerEach;
                else
                    bookingLine['total_kgs'] = bookingLine.e_qty * bookingLine.e_weightPerEach;
            } else {
                bookingLine['total_kgs'] = 0;
            }

            if (bookingLine.e_dimUOM) {
                if (bookingLine.e_dimUOM.toUpperCase() === 'CM')
                    bookingLine['cubic_meter'] = bookingLine.e_qty * bookingLine.e_dimLength * bookingLine.e_dimWidth * bookingLine.e_dimHeight / 1000000;
                else if (bookingLine.e_dimUOM.toUpperCase() === 'METER')
                    bookingLine['cubic_meter'] = bookingLine.e_qty * bookingLine.e_dimLength * bookingLine.e_dimWidth * bookingLine.e_dimHeight;
                else
                    bookingLine['cubic_meter'] = bookingLine.e_qty * bookingLine.e_dimLength * bookingLine.e_dimWidth * bookingLine.e_dimHeight / 1000000000;
            } else {
                bookingLine['cubic_meter'] = 0;
            }

            total_qty += bookingLine.e_qty;
            total_kgs += bookingLine['total_kgs'];
            total_cubic_meter += bookingLine['cubic_meter'];
            return bookingLine;
        });

        this.setState({total_qty, total_kgs: total_kgs.toFixed(2), total_cubic_meter: total_cubic_meter.toFixed(2)});
        return newBookingLines;
    }

    calcBookingLineDetail(bookingLineDetails) {
        let bookingLineDetailsQtyTotal = 0;

        let newBookingLineDetails = bookingLineDetails.map((bookingLineDetail) => {
            if (bookingLineDetail)
                bookingLineDetailsQtyTotal += bookingLineDetail.quantity;

            return bookingLineDetail;
        });

        this.setState({ bookingLineDetailsQtyTotal });
        return newBookingLineDetails;
    }

    onDateChange(date, dateType) {
        let startDate = '';
        let endDate = '';

        if (dateType === 'startDate') {
            if (isNull(date)) {
                // startDate = moment().toDate();
                this.setState({startDate: null});
                return;
            } else {
                startDate = date;
            }

            if (moment(startDate) > moment(this.state.endDate)) {
                this.setState({
                    startDate: moment(startDate).format('YYYY-MM-DD'),
                    endDate: moment(startDate).format('YYYY-MM-DD')
                });    
            } else {
                this.setState({startDate: moment(startDate).format('YYYY-MM-DD')});
            }
        } else if (dateType === 'endDate') {
            if (isNull(date)) {
                endDate = moment().toDate();
            } else {
                endDate = date;
            }

            if (moment(endDate) < moment(this.state.startDate)) {
                this.setState({
                    startDate: moment(endDate).format('YYYY-MM-DD'),
                    endDate: moment(endDate).format('YYYY-MM-DD')
                });
            } else {
                this.setState({endDate: moment(endDate).format('YYYY-MM-DD')});
            }
        }
    }

    onClickFind() {
        const { startDate, endDate, clientPK, selectedWarehouseId, selectedFPId, pageItemCnt, pageInd, sortField, sortDirection, activeTabInd, dmeStatus, columnFilters } = this.state;
        let _startDate = startDate;
        let _sortField = sortField;

        if (isNull(startDate))
            _startDate = '*';

        if (sortDirection === -1)
            _sortField = '-' + _sortField;

        this.props.setAllGetBookingsFilter(_startDate, endDate, clientPK, selectedWarehouseId, selectedFPId, pageItemCnt, pageInd, _sortField, columnFilters, activeTabInd, '', 'label', dmeStatus, null, null);
        this.setState({selectedBookingIds: [], allCheckStatus: 'None'});
    }

    onClickSync(bookingIds) {
        this.onMultiFind('currentTab', 'id', join(bookingIds, ', '));
    }

    onSelected(e, src) {
        if (src === 'fp') {
            const selectedFPId = e.target.value;
            let fpId = 0;

            if (selectedFPId !== 'all')
                fpId = selectedFPId;

            this.setState({selectedBookingIds: [], allCheckStatus: 'None', selectedname: e.target.name, selectedFPId: fpId});
        } else if (src === 'client') {
            this.setState({selectedBookingIds: [], allCheckStatus: 'None', clientPK: e.target.value});
        } else if (src === 'status') {
            this.setState({selectedBookingIds: [], allCheckStatus: 'None', dmeStatus: e.target.value});
        }
    }

    onPageItemCntChange(e) {
        const pageItemCnt = parseInt(e.target.value);

        this.props.setGetBookingsFilter('pageInd', 0);
        this.props.setGetBookingsFilter('pageItemCnt', pageItemCnt);
        this.setState({ pageItemCnt });
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
            this.setState({selectedBookingIds: [], allCheckStatus: 'None', isShowb_dateBookedDateRange: false, isShowpuPickUpAvailFrom_DateRange: false, isShowmanifest_timestampDateRange: false});
        }
    }

    showAdditionalInfo(bookingId) {
        let additionalInfoOpens = this.state.additionalInfoOpens;
        let flag = additionalInfoOpens['additional-info-popup-' + bookingId];
        additionalInfoOpens = [];

        if (flag)
            additionalInfoOpens['additional-info-popup-' + bookingId] = false;
        else
            additionalInfoOpens['additional-info-popup-' + bookingId] = true;

        this.setState({ additionalInfoOpens, bookingLinesInfoOpens: [], bookingLineDetails: [], linkPopoverOpens: [], editCellPopoverOpens: [] });
    }

    showLinkPopover(bookingId) {
        let linkPopoverOpens = this.state.linkPopoverOpens;
        let flag = linkPopoverOpens['link-popover-' + bookingId];
        linkPopoverOpens = [];

        if (flag)
            linkPopoverOpens['link-popover-' + bookingId] = false;
        else
            linkPopoverOpens['link-popover-' + bookingId] = true;

        this.setState({ additionalInfoOpens: [], bookingLinesInfoOpens: [], bookingLineDetails: [], linkPopoverOpens, editCellPopoverOpens: [] });
    }

    getPKBookingIdFromId(id) {
        const {bookings} = this.props;
        let pkBookingId = 0;

        for (let i = 0; i < bookings.length; i++) {
            if (bookings[i].id === id) {
                pkBookingId = bookings[i].pk_booking_id;
                break;
            }
        }

        return pkBookingId;
    }

    showBookingLinesInfo(bookingId) {
        const pkBookingId = this.getPKBookingIdFromId(bookingId);

        this.props.getBookingLines(pkBookingId);
        this.props.getBookingLineDetails(pkBookingId);

        this.setState({loadingLines: true});

        let bookingLinesInfoOpens = this.state.bookingLinesInfoOpens;
        let flag = bookingLinesInfoOpens['booking-lines-info-popup-' + bookingId];
        bookingLinesInfoOpens = [];

        if (flag)
            bookingLinesInfoOpens['booking-lines-info-popup-' + bookingId] = false;
        else
            bookingLinesInfoOpens['booking-lines-info-popup-' + bookingId] = true;

        this.setState({ bookingLinesInfoOpens, additionalInfoOpens: [], bookingLineDetails: [], linkPopoverOpens: [], editCellPopoverOpens: [], bookingLines: [] });
    }

    clearActivePopoverVar() {
        this.setState({ additionalInfoOpens: [], bookingLinesInfoOpens: [], bookingLineDetails: [], linkPopoverOpens: [], editCellPopoverOpens: [], bookingLines: [] });
    }

    togglePopover() {
        this.clearActivePopoverVar();
    }

    toggleFindModal() {
        this.setState(prevState => ({isShowFindModal: !prevState.isShowFindModal})); 
    }

    toggleManifestSlider() {
        this.setState(prevState => ({isShowManifestSlider: !prevState.isShowManifestSlider}));
    }

    toggleBulkUpdateSlider() {
        this.setState(prevState => ({isShowBulkUpdateSlider: !prevState.isShowBulkUpdateSlider}));
    }

    toggleLineSlider() {
        this.setState(prevState => ({isShowLineSlider: !prevState.isShowLineSlider}));
    }

    onDownload() {
        const token = localStorage.getItem('token');
        const { selectedBookingIds, downloadOption, selectedname } = this.state;

        if (selectedBookingIds.length > 0 && selectedBookingIds.length < 501) {
            this.setState({loadingDownload: true});

            if (downloadOption === 'label' || downloadOption === 'new_label') {
                const options = {
                    method: 'post',
                    url: HTTP_PROTOCOL + '://' + API_HOST + '/download/',
                    headers: {'Authorization': 'JWT ' + token},
                    data: {ids: selectedBookingIds, downloadOption: downloadOption},
                    responseType: 'blob', // important
                };

                axios(options).then((response) => {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'labels_' + selectedname + '_' + selectedBookingIds.length + '_' + moment().utc().format('YYYY-MM-DD HH:mm') + '.zip');
                    document.body.appendChild(link);
                    link.click();
                    this.props.setNeedUpdateBookingsState(true);
                    this.setState({selectedBookingIds: [], allCheckStatus: 'None', loadingDownload: false, loading: true});
                });
            }
        } else if (selectedBookingIds.length > 100) {
            this.notify('Please selected less than 500 bookings to download.');
        } else {
            this.notify('No matching booking id');
        }
    }

    onClickLabelOrPOD(booking, type) {
        if (type === 'label') {
            if (booking.z_label_url && booking.z_label_url.length > 0) {
                this.bulkBookingUpdate([booking.id], 'z_downloaded_shipping_label_timestamp', new Date())
                    .then(() => {
                        this.onClickFind();
                    })
                    .catch((err) => {
                        this.notify(err.response.data.message);
                        this.setState({loading: false});
                    });

                if (booking.z_label_url.indexOf('http') !== -1) {
                    const win = window.open(booking.z_label_url, '_blank');
                    win.focus();
                } else {
                    const win = window.open(HTTP_PROTOCOL + '://' + STATIC_HOST + '/pdfs/' + booking.z_label_url, '_blank');
                    win.focus();
                }
            } else {
                this.notify('This booking has no label');
            }
        } else if (type === 'pod') {
            if (booking.z_pod_url && booking.z_pod_url.length > 0) {
                this.bulkBookingUpdate([booking.id], 'z_downloaded_pod_timestamp', new Date())
                    .then(() => {
                        this.onClickFind();
                    })
                    .catch((err) => {
                        this.notify(err.response.data.message);
                        this.setState({loading: false});
                    });
                const win = window.open(HTTP_PROTOCOL + '://' + STATIC_HOST + '/imgs/' + booking.z_pod_url, '_blank');
                win.focus();
            } else if (booking.z_pod_signed_url && booking.z_pod_signed_url.length > 0) {
                this.bulkBookingUpdate([booking.id], 'z_downloaded_pod_sog_timestamp', new Date())
                    .then(() => {
                        this.onClickFind();
                    })
                    .catch((err) => {
                        this.notify(err.response.data.message);
                        this.setState({loading: false});
                    });
                const win = window.open(HTTP_PROTOCOL + '://' + STATIC_HOST + '/imgs/' + booking.z_pod_signed_url, '_blank');
                win.focus();
            } else {
                this.notify('This booking has no POD or POD_SOG');
            }
        } else if (type === 'manifest') {
            if (booking.z_manifest_url && booking.z_manifest_url.length > 0) {
                this.bulkBookingUpdate([booking.id], 'manifest_timestamp', new Date())
                    .then(() => {
                        this.onClickFind();
                    })
                    .catch((err) => {
                        this.notify(err.response.data.message);
                        this.setState({loading: false});
                    });
                const win = window.open(HTTP_PROTOCOL + '://' + STATIC_HOST + '/pdfs/' + booking.z_manifest_url, '_blank');
                win.focus();
            } else {
                this.notify('This booking has no manifest');
            }
        }
    }

    onClickGetAll(e) {
        e.preventDefault();
        const {startDate, endDate} = this.state;
        this.props.setAllGetBookingsFilter(startDate, endDate);
        this.setState({selectedBookingIds: [], allCheckStatus: 'None'});
    }

    onClickSimpleSearch(num) {
        if (num === 0) {
            this.setState({showSimpleSearchBox: true});
        } else if (num === 1) {
            this.setState({showGearMenu: true});
        } else if (num === 2) {
            this.setState({showCopyMenu: true});
        }
    }

    onInputChange(e) {
        this.setState({simpleSearchKeyword: e.target.value});
    }

    onSimpleSearch(e) {
        e.preventDefault();
        const {simpleSearchKeyword, downloadOption, pageItemCnt} = this.state;

        if (simpleSearchKeyword.length === 0) {
            this.notify('Please input search keyword!');
        } else {
            const today = moment().format('YYYY-MM-DD');
            this.props.setAllGetBookingsFilter('*', today, 0, 0, 0, pageItemCnt, 0, '-id', {}, 0, simpleSearchKeyword, downloadOption);
            this.setState({selectedBookingIds: [], allCheckStatus: 'None', activeTabInd: 0});
        }
    }

    onMultiFind(findMode, fieldNameToFind, valueSet) {
        const { clientPK, warehouseId, fpId, pageItemCnt, filterInputs, activeTabInd } = this.state;
        const today = moment().format('YYYY-MM-DD');

        if (findMode === 'entire') {
            this.props.setAllGetBookingsFilter('*', today, clientPK, warehouseId, fpId, pageItemCnt, 0, '-id', filterInputs, 7, '', 'label', '', fieldNameToFind, valueSet);
        } else if (findMode === 'currentTab') {
            this.props.setAllGetBookingsFilter('*', today, clientPK, warehouseId, fpId, pageItemCnt, 0, '-id', filterInputs, activeTabInd, '', 'label', '', fieldNameToFind, valueSet);
        }

        this.setState({selectedBookingIds: [], allCheckStatus: 'None'});
    }

    onClickTab(activeTabInd) {
        const {pageItemCnt, startDate, endDate} = this.state;
        const today = moment().format('YYYY-MM-DD');

        if (
            activeTabInd === 3 ||   // Manifest
            activeTabInd === 41  // Cancel Requested
        ) {
            this.props.setAllGetBookingsFilter('*', today, 0, 0, 0, pageItemCnt, 0, '-id', {}, activeTabInd);
        } else if (activeTabInd === 7) { // Today
            this.props.setAllGetBookingsFilter(startDate, endDate, 0, 0, 0, pageItemCnt, 0, '-id', {}, activeTabInd);
        }

        this.setState({activeTabInd, selectedBookingIds: [], allCheckStatus: 'None', filterInputs: {}});
    }

    onCheck(e, booking) {
        const { filteredBookingIds } = this.props;
        let selectedBookingIds = this.state.selectedBookingIds;
        let allCheckStatus = '';

        if (!e.target.checked) {
            selectedBookingIds = difference(this.state.selectedBookingIds, [booking.id]);
        } else {
            selectedBookingIds = union(this.state.selectedBookingIds, [booking.id]);
        }

        if (selectedBookingIds.length === filteredBookingIds.length) {
            allCheckStatus = 'All';
        } else if (selectedBookingIds.length === 0) {
            allCheckStatus = 'None';
        } else {
            allCheckStatus = 'Some';
        }

        this.setState({selectedBookingIds, allCheckStatus});
    }

    onCheckAll() {
        const { filteredBookingIds } = this.props;
        let selectedBookingIds = this.state.selectedBookingIds;
        let allCheckStatus = this.state.allCheckStatus;

        if (
            (selectedBookingIds.length > 0 && selectedBookingIds.length < filteredBookingIds.length) ||
            selectedBookingIds.length === filteredBookingIds.length
        ) { // If selected `All` or `Some`
            selectedBookingIds = [];
            allCheckStatus = 'None';
        } else if (selectedBookingIds.length === 0) { // If selected `None`
            selectedBookingIds = clone(filteredBookingIds);
            allCheckStatus = 'All';
        }

        this.setState({allCheckStatus, selectedBookingIds});
    }

    onCreateOrder(selectedBookingIds, vx_freight_provider='', needTruck=false, timestamp=null) {
        const { username } = this.state;
        const { bookings } = this.props;
        const _vx_freight_provider = vx_freight_provider.toLowerCase();

        if (_vx_freight_provider === 'startrack' || _vx_freight_provider === 'auspost') {
            this.props.fpOrder(selectedBookingIds, _vx_freight_provider);
        } else {
            if (selectedBookingIds.length > 500) {
                this.notify('You can generate Manifest with 500 bookings at most.');
            } else {
                const bookingIds = [];
                let manifestedBookingVisualIds = null;

                for (let i = 0; i < bookings.length; i++) {
                    for (let j = 0; j < selectedBookingIds.length; j++) {
                        if (bookings[i].id === selectedBookingIds[j]) {
                            if (bookings[i].z_manifest_url) {
                                manifestedBookingVisualIds += isNull(manifestedBookingVisualIds) ? bookings[i].b_bookingID_Visual : ', ' + bookings[i].b_bookingID_Visual;
                            } else {
                                bookingIds.push(bookings[i].id);
                            }
                        }
                    }
                }

                if (!isNull(manifestedBookingVisualIds)) {
                    this.notify('There are bookings which have already `Manifest`:' + manifestedBookingVisualIds);
                } else {
                    this.setState({loadingDownload: true});
                    
                    this.buildMANIFEST(bookingIds, _vx_freight_provider, username, needTruck, timestamp)
                        .then(() => {
                            this.setState({loading: true, loadingDownload: false});
                            this.props.setNeedUpdateBookingsState(true);
                        })
                        .catch((err) => {
                            this.notify('Error: ' + err);
                            this.setState({loadingDownload: false});
                        });
                }
            }
        }

        this.setState({
            allCheckStatus: 'None',
            selectedBookingIds: [],
        });
    }

    bulkBookingUpdate(bookingIds, fieldName, fieldContent) {
        const token = localStorage.getItem('token');
        const options = {
            method: 'post',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
            url: HTTP_PROTOCOL + '://' + API_HOST + '/bookings/bulk_booking_update/',
            data: {bookingIds, fieldName, fieldContent},
        };

        return axios(options);
    }

    onBulkUpdate(field, value, bookingIds, optionalValue=null) {
        if (field === 'flag') {
            this.props.changeBookingsFlagStatus(value, bookingIds);
        } else if (field === 'status') {
            let lockedBookingsCnt = 0;
            this.props.bookings.map(booking => {
                if (booking['z_lock_status'])
                    lockedBookingsCnt++;
            });

            if (lockedBookingsCnt)
                this.notify(`${lockedBookingsCnt} LOCKED bookings won't be updated. Please unlock it for chainging status.`);

            this.props.changeBookingsStatus(value, bookingIds, optionalValue);
        } else {
            this.bulkBookingUpdate(bookingIds, field, value)
                .then(() => {
                    this.onMultiFind('currentTab', 'id', join(this.props.filteredBookingIds, ', '));  // Sync bookings
                })
                .catch((err) => {
                    this.notify(err.response.data.message);
                    this.setState({loading: false});
                });
        }

        this.setState({loading: true, selectedBookingIds: [], allCheckStatus: 'None', isShowBulkUpdateSlider: false});
    }

    buildMANIFEST(bookingIds, vx_freight_provider, username, needTruck, timestamp) {
        return new Promise((resolve, reject) => {
            const token = localStorage.getItem('token');
            const options = {
                method: 'post',
                url: HTTP_PROTOCOL + '://' + API_HOST + '/get-manifest/',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
                data: {bookingIds, vx_freight_provider, username, needTruck: needTruck ? 1 : 0, timestamp},
                responseType: 'blob', // important
            };

            axios(options)
                .then((response) => {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'Manifests.zip');
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    buildLabel(bookingId) {
        const token = localStorage.getItem('token');
        const options = {
            method: 'post',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
            data: {'booking_id': bookingId},
            url: `${HTTP_PROTOCOL}://${API_HOST}/build-label/`
        };
        return axios(options);
    }

    onClickMANI() {
        const {selectedBookingIds} = this.state;

        if (selectedBookingIds.length === 0) {
            this.notify('Please select bookings to create Order!');
        } else {
            this.props.getBookingLinesCnt(selectedBookingIds);
            this.toggleManifestSlider();
        }
    }

    onClickGear() {
        this.setState({showGearMenu: true});
    }

    onDownloadOptionChange(e) {
        this.props.setGetBookingsFilter('downloadOption', e.target.value);
        this.setState({downloadOption: e.target.value});
    }

    onClickBookingVisualId(booking) {
        this.setState({selectedBooking: booking});
        this.props.getBookingLines(booking.pk_booking_id);
        this.props.getBookingLineDetails(booking.pk_booking_id);
        this.toggleLineSlider();
    }

    onClickShowBulkUpdateButton() {
        const { selectedBookingIds } = this.state;

        if (selectedBookingIds.length === 0) {
            this.notify('Please select at least one booking');
            return;
        } else if (selectedBookingIds.length > 1000) {
            this.notify('Bulk operation can process 1000 bookings at once');
            return;
        }

        const bookings = this.getBookingsFromIds(selectedBookingIds);
        const bookedBookings = bookings.filter(booking => !isNull(booking.b_dateBookedDate));
        const deliveredBookings = bookings.filter(booking => booking.b_status === 'Delivered');

        if (bookedBookings.length > 0) {
            this.notify('Booked bookings are selected!');
            return;
        }
        
        if (deliveredBookings.length > 0) {
            this.notify('Delivered bookings are selected! (If you want to change Delivered bookings, please contact support center.)');
            return;
        }

        this.toggleBulkUpdateSlider();
    }

    onClickBulkLabeleButton() {
        const { selectedBookingIds } = this.state;

        if (selectedBookingIds.length === 0) {
            this.notify('Please select at least one booking');
            return;
        } else if (selectedBookingIds.length > 1000) {
            this.notify('Bulk operation can process 1000 bookings at once');
            return;
        }

        const buildLabelPromises = [];
        for (let i = 0; i < selectedBookingIds.length; i++)
            buildLabelPromises.push(this.buildLabel(selectedBookingIds[i]));

        Promise.all(buildLabelPromises)
            .then(() => {
                this.notify('Labels are successfuly built');
                this.props.setNeedUpdateBookingsState(true);
            })
            .catch(error => {
                alert(error);
            });
    }

    onClickRow(booking) {
        this.setState({activeBookingId: booking.id});
    }

    onClickPagination(pageInd) {
        this.props.setGetBookingsFilter('pageInd', pageInd);
    }

    getBookingsFromIds(bookingIds) {
        const { bookings } = this.props;
        const _bookings = [];

        for (let i = 0; i < bookings.length; i++) {
            for (let j = 0; j < bookingIds.length; j++) {
                if (bookings[i].id === bookingIds[j])
                    _bookings.push(bookings[i]);
            }
        }

        return _bookings;
    }

    onClickShowManifestSliderButton() {
        const {selectedBookingIds} = this.state;
        const bookings = this.getBookingsFromIds(selectedBookingIds);
        let bookedBookingsCnt = 0;

        for (let i = 0; i < bookings.length; i++)
            if (!isNull(bookings[i].b_dateBookedDate))
                bookedBookingsCnt += 1;

        if (selectedBookingIds.length === 0) {
            this.notify('Please select bookings to MANIFEST!');
        } else {
            if (bookedBookingsCnt > 0)
                this.notify('You selected some BOOKED bookings! Those will be just manifested. (no status change)');

            this.toggleManifestSlider();
        }
    }

    /**
     * typeNum:
     *      0 -  duplicate a Line
     *      1 -  duplicate a Line Detail
     * 
     * data:
     *      info object
     */
    onClickDuplicate(typeNum, data={}) {
        if (typeNum === 0) { // Duplicate line
            let duplicatedBookingLine = { pk_lines_id: data.pk_lines_id };
            this.props.duplicateBookingLine(duplicatedBookingLine);
        } else if (typeNum === 1) { // Duplicate line detail
            let duplicatedBookingLineDetail = { pk_id_lines_data: data.pk_id_lines_data };
            this.props.duplicateBookingLineDetail(duplicatedBookingLineDetail);
        }
    }

    onClickDeleteLineOrLineData(typeNum, row) {
        console.log('#204 onDelete: ', typeNum, row);

        if (typeNum === 0) { // line
            let deletedBookingLine = { pk_lines_id: row.pk_lines_id };
            this.props.deleteBookingLine(deletedBookingLine);
        } else if (typeNum === 1) { // line detail
            let deletedBookingLineDetail = { pk_id_lines_data: row.pk_id_lines_data };
            this.props.deleteBookingLineDetail(deletedBookingLineDetail);
        }
    }

    // status: `original`, `scanned`
    onChangePackedStatus(status) {
        const {bookingLines} = this.state;

        if (bookingLines.length === 0) {
            this.notify('There are no lines. Please add lines first.');
        }

        const currentPackedStatus = status;
        const filteredProducts = bookingLines.filter(line => {
            if (currentPackedStatus !== 'original')
                return line['packed_status'] === currentPackedStatus;
            else
                return isNull(line['packed_status']) || line['packed_status'] === currentPackedStatus;
        });

        if (filteredProducts.length === 0) {
            if (status === 'scanned' || status === 'original') {
                this.setState({currentPackedStatus});
            }
        } else {
            this.setState({currentPackedStatus});
        }
    }

    onCopyToClipboard(e, data, type) {
        e.preventDefault();
        if (data) {
            let finalData = '';

            if (type === 'text') {
                finalData = data;
            } else if (type === 'bookingIds') {
                // Data is selected bookingIDs
                const {filteredBookingIds, filteredBookingVisualIds} = this.props;
                data.forEach((item) => finalData += filteredBookingVisualIds[filteredBookingIds.findIndex(bookingId => bookingId == item)] + '\n');
            } else if (type === 'consignments') {
                const {filteredBookingIds, filteredConsignments} = this.props;
                // Data is selected bookingIDs
                data.forEach((item) => {
                    const consignment = filteredConsignments[filteredBookingIds.findIndex(bookingId => bookingId == item)];
                    finalData += consignment + '\n';
                });
            }

            navigator.clipboard.writeText(finalData);
            this.notify('Copied on clipboard!');
        }
    }

    render() {
        const { bookingsCnt, bookingLines, bookingLineDetails, startDate, endDate, selectedWarehouseId, selectedFPId, warehouses,
            filterInputs, total_qty, total_kgs, total_cubic_meter, bookingLineDetailsQtyTotal, sortField, sortDirection, simpleSearchKeyword,
            showSimpleSearchBox, selectedBookingIds, loading, activeTabInd, loadingDownload, downloadOption, dmeClients, clientPK, scrollLeft,
            activeBookingId, allCheckStatus, loadingLines, isShowLineSlider, currentPackedStatus } = this.state;
        const { bookings, filteredBookingIds, bookingsSummary, allFPs, clientname } = this.props;

        // Table width
        const tblContentWidthVal = 'calc(100% + ' + scrollLeft + 'px)';
        const tblContentWidth = {width: tblContentWidthVal};

        const selectedBookings = this.getBookingsFromIds(selectedBookingIds);

        let _currentPackedStatus = currentPackedStatus;
        let filteredProducts = [];
        let filterBookingLineDetailsProduct = [];

        if (bookingLines && bookingLineDetails) {
            filteredProducts = bookingLines
                .filter(product => {
                    if (_currentPackedStatus !== 'original')
                        return product['packed_status'] === _currentPackedStatus;
                    else
                        return isNull(product['packed_status']) || product['packed_status'] === _currentPackedStatus;
                })
                .map((line, index) => {
                    line['index'] = index + 1;
                    return line;
                });
            filterBookingLineDetailsProduct = bookingLineDetails
                .filter((lineDetail) => {
                    const index = filteredProducts.findIndex(product => product['pk_booking_lines_id'] === lineDetail['fk_booking_lines_id']);
                    return index > -1 ? true : false;
                })
                .map(lineDetail => {
                    const product = filteredProducts.find(product => product['pk_booking_lines_id'] === lineDetail['fk_booking_lines_id']);
                    lineDetail['line_index'] = product['index'];
                    return lineDetail;
                });
        }

        const selectedClient = dmeClients.find(client => client.pk_id_dme_client === parseInt(clientPK));
        const warehousesList = warehouses
            .filter(warehouse =>
                !selectedClient
                || selectedClient.company_name === 'dme'
                || (selectedClient && warehouse.client_company_name === selectedClient.company_name)
            )
            .map((warehouse, index) =>
                (<option key={index} value={warehouse.pk_id_client_warehouses}>{warehouse.name}</option>)
            );

        const fpsList = allFPs.map((fp, index) => (<option key={index} value={fp.id}>{fp.fp_company_name}</option>));

        const clientOptionsList = dmeClients
            .map((client, index) => (<option key={index} value={client.pk_id_dme_client}>{client.company_name}</option>));

        const bookingLineDetailsList = bookingLineDetails.map((bookingLineDetail, index) =>
            (
                <tr key={index}>
                    <td>{bookingLineDetail.modelNumber}</td>
                    <td>{bookingLineDetail.itemDescription}</td>
                    <td className="qty">{bookingLineDetail.quantity}</td>
                    <td>{bookingLineDetail.itemFaultDescription}</td>
                    <td>{bookingLineDetail.insuranceValueEach}</td>
                    <td>{bookingLineDetail.gap_ra}</td>
                    <td>{bookingLineDetail.clientRefNumber}</td>
                </tr>
            ));

        const bookingLinesList = bookingLines ? bookingLines.map((bookingLine, index) =>
            (
                <tr key={index}>
                    <td>{bookingLine.pk_auto_id_lines}</td>
                    <td>{bookingLine.e_type_of_packaging}</td>
                    <td>{bookingLine.e_item}</td>
                    <td className="qty">{bookingLine.e_qty}</td>
                    <td>{bookingLine.e_weightUOM}</td>
                    <td>{bookingLine.e_weightPerEach}</td>
                    <td>{bookingLine.total_kgs.toFixed(2)}</td>
                    <td>{bookingLine.e_dimUOM}</td>
                    <td>{bookingLine.e_dimLength}</td>
                    <td>{bookingLine.e_dimWidth}</td>
                    <td>{bookingLine.e_dimHeight}</td>
                    <td>{bookingLine.cubic_meter.toFixed(2)}</td>
                </tr>
            )) : [];

        const bookingsList = bookings.map((booking, index) => {
            let priorityBgColor = '';

            if (booking.b_booking_Priority) {
                if (booking.b_booking_Priority.toLowerCase() === 'critical')
                    priorityBgColor = 'bg-lightred';
                else if (booking.b_booking_Priority.toLowerCase() === 'high')
                    priorityBgColor = 'bg-lightpink';
                else if (booking.b_booking_Priority.toLowerCase() === 'standard')
                    priorityBgColor = 'bg-lightblue';
                else if (booking.b_booking_Priority.toLowerCase() === 'low')
                    priorityBgColor = 'bg-lightgray';
            }

            return (
                <tr 
                    key={index} 
                    className={(activeBookingId === booking.id || indexOf(selectedBookingIds, booking.id) !== -1) ? 'active' : 'inactive'}
                    onClick={() => this.onClickRow(booking)}
                >
                    <td name='checkbox'><input type="checkbox" checked={indexOf(selectedBookingIds, booking.id) > -1 ? 'checked' : ''} onChange={(e) => this.onCheck(e, booking)} /></td>
                    <td name='lines_info' id={'booking-lines-info-popup-' + booking.id} className={this.state.bookingLinesInfoOpens['booking-lines-info-popup-' + booking.id] ? 'booking-lines-info active' : 'booking-lines-info'} onClick={() => this.showBookingLinesInfo(booking.id)}>
                        <i className="icon icon-th-list"></i>
                    </td>
                    <Popover
                        isOpen={this.state.bookingLinesInfoOpens['booking-lines-info-popup-' + booking.id]}
                        target={'booking-lines-info-popup-' + booking.id}
                        placement="right"
                        hideArrow={true}
                    >
                        <PopoverHeader>Line and Line Details<a className="close-popover" onClick={this.togglePopover}>x</a></PopoverHeader>
                        <PopoverBody>
                            <div className="pad-10p">
                                <p><strong>Booking ID: {booking.b_bookingID_Visual}</strong></p>
                                <table className="booking-lines">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Count</th>
                                            <th>Total Qty</th>
                                            <th>Total Kgs</th>
                                            <th>Total Cubic Meter</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Lines</td>
                                            <td>{size(bookingLines)}</td>
                                            <td>{size(bookingLines)===0?'X':total_qty}</td>
                                            <td>{size(bookingLines)===0?'X':total_kgs}</td>
                                            <td>{size(bookingLines)===0?'X':total_cubic_meter}</td>
                                        </tr>
                                        <tr>
                                            <td>Line Details</td>
                                            <td>{size(bookingLineDetails)}</td>
                                            <td>{size(bookingLineDetails)===0?'X':bookingLineDetailsQtyTotal}</td>
                                            <td>X</td>
                                            <td>X</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="pad-10p">
                                <p><strong>Lines</strong></p>
                                <LoadingOverlay
                                    active={loadingLines}
                                    spinner
                                    text='Loading...'
                                    className='booking-lines-container'
                                >
                                    <table className="booking-lines">
                                        <thead>
                                            <th>ID</th>
                                            <th>Packaging</th>
                                            <th>Item Description</th>
                                            <th>Qty</th>
                                            <th>Wgt UOM</th>
                                            <th>Wgt Each</th>
                                            <th>Total Kgs</th>
                                            <th>Dim UOM</th>
                                            <th>Length</th>
                                            <th>Width</th>
                                            <th>Height</th>
                                            <th>Cubic Meter</th>
                                        </thead>
                                        <tbody>
                                            { loadingLines ? <tr><td colSpan={12} style={{height: 100}}></td></tr> : bookingLinesList }
                                        </tbody>
                                    </table>
                                </LoadingOverlay>
                            </div>
                            <div className="pad-10p">
                                <p><strong>Line Details</strong></p>
                                <table className="booking-lines">
                                    <thead>
                                        <th>Model</th>
                                        <th>Item Description</th>
                                        <th>Qty</th>
                                        <th>Fault Description</th>
                                        <th>Insurance Value</th>
                                        <th>Gap/ RA</th>
                                        <th>Client Reference #</th>
                                    </thead>
                                    <tbody>
                                        { bookingLineDetailsList }
                                    </tbody>
                                </table>
                            </div>
                        </PopoverBody>
                    </Popover>
                    <td name='additional_info' id={'additional-info-popup-' + booking.id} className={this.state.additionalInfoOpens['additional-info-popup-' + booking.id] ? 'additional-info active' : 'additional-info'} onClick={() => this.showAdditionalInfo(booking.id)}>
                        <i className="icon icon-plus"></i>
                    </td>
                    <Popover
                        isOpen={this.state.additionalInfoOpens['additional-info-popup-' + booking.id]}
                        target={'additional-info-popup-' + booking.id}
                        placement="right"
                        hideArrow={true}
                    >
                        <PopoverHeader>Additional Info <a className="close-popover" onClick={this.togglePopover}>x</a></PopoverHeader>
                        <PopoverBody>
                            <div className="location-info disp-inline-block">
                                <span>PU Info</span><br />
                                <span>Pickup Location:</span><br />
                                <span className={(isEmpty(booking.pu_Address_street_1)) ? ' none' :  ''}>
                                    {booking.pu_Address_street_1}<br />
                                </span>
                                <span className={(isEmpty(booking.pu_Address_street_2)) ? ' none' :  ''}>
                                    {booking.pu_Address_street_2}<br />
                                </span>
                                <span className={(isEmpty(booking.pu_Address_Suburb)) ? ' none' :  ''}>
                                    {booking.pu_Address_Suburb}<br />
                                </span>
                                <span className={(isEmpty(booking.pu_Address_City)) ? ' none' :  ''}>
                                    {booking.pu_Address_City}<br />
                                </span>
                                <span className={((isEmpty(booking.pu_Address_State)) && (isEmpty(booking.pu_Address_PostalCode))) ? ' none' :  ''}>
                                    {booking.pu_Address_State} {booking.pu_Address_PostalCode}<br />
                                </span>
                                <span className={(isEmpty(booking.pu_Address_Country)) ? ' none' :  ''}>
                                    {booking.pu_Address_Country}<br />
                                </span>
                                <span className={(isEmpty(booking.pu_Address_Type)) ? ' none' :  ''}>
                                    {booking.pu_Address_Type}<br />
                                </span>
                            </div>
                            <div className="location-info disp-inline-block">
                                <span>Delivery Info</span><br />
                                <span>Delivery Location:</span><br />
                                <span className={(isEmpty(booking.de_To_Address_street_1)) ? ' none' :  ''}>
                                    {booking.de_To_Address_street_1}<br />
                                </span>
                                <span className={(isEmpty(booking.de_To_Address_street_2)) ? ' none' :  ''}>
                                    {booking.de_To_Address_street_2}<br />
                                </span>
                                <span className={(isEmpty(booking.de_To_Address_Suburb)) ? ' none' :  ''}>
                                    {booking.de_To_Address_Suburb}<br />
                                </span>
                                <span className={(isEmpty(booking.de_To_Address_City)) ? ' none' :  ''}>
                                    {booking.de_To_Address_City}<br />
                                </span>
                                <span className={((isEmpty(booking.de_To_Address_State)) && (isEmpty(booking.de_To_Address_PostalCode))) ? ' none' :  ''}>
                                    {booking.de_To_Address_State} {booking.de_To_Address_PostalCode}<br />
                                </span>
                                <span className={(isEmpty(booking.de_To_Address_Country)) ? ' none' :  ''}>
                                    {booking.de_To_Address_Country}<br />
                                </span>
                                <span className={(isEmpty(booking.de_To_AddressType)) ? ' none' :  ''}>
                                    {booking.de_To_AddressType}<br />
                                </span>
                            </div>
                            <div className="location-info disp-inline-block">
                                <span></span>
                                <span>
                                    <strong>Contact:</strong> {booking.booking_Created_For}<br />
                                    <strong>Actual Pickup Time:</strong> {moment(booking.s_20_Actual_Pickup_TimeStamp).format('DD MMM YYYY')}<br />
                                    <strong>Actual Deliver Time:</strong> {moment(booking.s_21_Actual_Delivery_TimeStamp).format('DD MMM YYYY')}
                                </span>
                            </div>
                        </PopoverBody>
                    </Popover>
                    <td
                        name='b_error_Capture' 
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
                    <td name='lines_count' className={'text-center'} title='Lines count'>{booking.lines_count}</td>
                    <td name='total_kgs' className={'text-center'} title='Total KGs'>{booking.total_kgs}</td>
                    <td name='total_cbm' className={'text-center'} title='Total Cubic'>{booking.total_cbm}</td>
                    <td name='b_bookingID_Visual' 
                        id={'link-popover-' + booking.id} 
                        className={(sortField === 'b_bookingID_Visual') ? 'visualID-box current' : 'visualID-box'}
                    >
                        <span
                            className={booking.b_error_Capture
                                ? 'c-red bold'
                                : booking.b_status === 'Closed' ? 'c-black bold' : 'c-dme bold'}
                            onClick={() => this.onClickBookingVisualId(booking)}
                        >
                            {booking.b_bookingID_Visual}
                        </span>
                    </td>
                    <td name='vx_freight_provider' className={(sortField === 'vx_freight_provider') ? 'current' : ''}>{booking.vx_freight_provider}</td>
                    <td name='v_FPBookingNumber' className={(sortField === 'v_FPBookingNumber') ? 'current' : ''}>{booking.v_FPBookingNumber}</td>
                    <td name='b_status' className={(sortField === 'b_status') ? 'current' : ''} id={'booking-' + 'b_status' + '-tooltip-' + booking.id}>
                        <p className="status">{booking.b_status}</p>
                        {!isEmpty(booking.b_status) &&
                            <TooltipItem object={booking} fields={['b_status']} />
                        }
                    </td>
                    {(clientname === 'dme' || clientname === 'Bathroom Sales Direct') &&
                        <td name='b_promo_code' className={(sortField === 'b_promo_code') ? 'current' : ''}>{booking.b_promo_code}</td>
                    }
                    {clientname === 'BioPak' ?
                        <td
                            name='b_clientReference_RA_Numbers'
                            className={(sortField === 'b_clientReference_RA_Numbers') ? 'current' : ''}
                            onClick={(e) => this.onCopyToClipboard(e, booking.b_clientReference_RA_Numbers, 'text')}
                        >
                            {booking.b_clientReference_RA_Numbers}
                        </td>
                        :
                        <td name='b_client_order_num' className={(sortField === 'b_client_order_num') ? 'current' : ''}>{booking.b_client_order_num}</td>
                    }
                    <td name='z_label_url' className={
                        (booking.z_downloaded_shipping_label_timestamp != null) ?
                            'bg-yellow'
                            :
                            (booking.z_label_url && booking.z_label_url.length > 0) ? 'bg-green' : 'bg-gray'
                    }>
                        {(booking.z_label_url && booking.z_label_url.length > 0) ?
                            <div className="booking-status">
                                <a onClick={() => this.onClickLabelOrPOD(booking, 'label')}>
                                    <i className="icon icon-printer"></i>
                                </a>
                            </div>
                            :
                            null
                        }
                    </td>
                    <td name='z_pod_url' className={
                        (!isEmpty(booking.z_pod_url) || !isEmpty(booking.z_pod_signed_url)) ?
                            (!isEmpty(booking.z_downloaded_pod_timestamp)) ? 'bg-yellow' : 'dark-blue'
                            :
                            null
                    }>
                        {
                            (!isEmpty(booking.z_pod_url) || !isEmpty(booking.z_pod_signed_url)) ?
                                <div className="pod-status">
                                    <i className="icon icon-image"></i>
                                </div>
                                :
                                null
                        }
                    </td>
                    {activeTabInd === 6 ? <td name='b_booking_Priority' className={priorityBgColor + ' nowrap bold uppercase'}>{booking.b_booking_Priority}</td> : null}
                    <td
                        name='puPickUpAvailFrom_Date' 
                        id={'edit-cell-popover-' + booking.id}
                        className={(sortField === 'puPickUpAvailFrom_Date') ? 'current' : ''}
                    >
                        {booking.puPickUpAvailFrom_Date ? moment(booking.puPickUpAvailFrom_Date).format('ddd DD MMM YYYY'): ''}
                    </td>
                    <td name='b_dateBookedDate' className={(sortField === 'b_dateBookedDate') ? 'current' : ''}>
                        {booking.b_dateBookedDate ? moment(booking.b_dateBookedDate).format('ddd DD MMM YYYY'): ''}
                    </td>
                    <td name='deToCompanyName' className={(sortField === 'deToCompanyName') ? 'current nowrap' : ' nowrap'}>{booking.deToCompanyName}</td>
                    <td name='de_To_Address_Suburb' className={(sortField === 'de_To_Address_Suburb') ? 'current' : ''}>{booking.de_To_Address_Suburb}</td>
                    <td name='de_To_Address_State' className={(sortField === 'de_To_Address_State') ? 'current' : ''}>{booking.de_To_Address_State}</td>
                    <td name='de_To_Address_PostalCode' className={(sortField === 'de_To_Address_PostalCode') ? 'current' : ''}>{booking.de_To_Address_PostalCode}</td>
                    <td name='puCompany' className={(sortField === 'puCompany') ? 'current nowrap' : ' nowrap'}>{booking.puCompany}</td>
                    <td name='pu_Address_Suburb' className={(sortField === 'pu_Address_Suburb') ? 'current' : ''}>{booking.pu_Address_Suburb}</td>
                    <td name='pu_Address_State' className={(sortField === 'pu_Address_State') ? 'current' : ''}>{booking.pu_Address_State}</td>
                    <td name='pu_Address_PostalCode' className={(sortField === 'pu_Address_PostalCode') ? 'current' : ''}>{booking.pu_Address_PostalCode}</td>
                    <td name='b_client_name' className={(sortField === 'b_client_name') ? 'current nowrap' : ' nowrap'}>{booking.b_client_name}</td>
                    <td name='b_client_name_sub' className={(sortField === 'b_client_name_sub') ? 'current nowrap' : ' nowrap'}>{booking.b_client_name_sub}</td>
                    <td name='manifest_timestamp' className={(sortField === 'manifest_timestamp') ? 'current' : ''}>
                        {booking.manifest_timestamp ? moment(booking.manifest_timestamp).format('DD/MM/YYYY HH:mm') : null}
                    </td>
                    <td name='b_client_sales_inv_num' className={(sortField === 'b_client_sales_inv_num') ? 'current' : ''}>{booking.b_client_sales_inv_num}</td>
                    <td name='vx_serviceName' className={(sortField === 'vx_serviceName') ? 'current' : ''}>{booking.vx_serviceName}</td>
                    <td name='z_lock_status' className={booking.z_lock_status ? 'status-active' : 'status-inactive'} onClick={() => this.onClickStatusLock(booking)}>
                        <i className="fa fa-lock"></i>
                    </td>
                    <td name='pu_PickUp_By_Date' className={(sortField === 'pu_PickUp_By_Date') ? 'current' : ''}>
                        {booking.pu_PickUp_By_Date ? moment(booking.pu_PickUp_By_Date).format('DD/MM/YYYY') : ''}
                    </td>
                    <td name='de_Deliver_By_Time'>{booking.de_Deliver_By_Time}</td>
                    <td name='b_given_to_transport_date_time' className={(sortField === 'b_given_to_transport_date_time') ? 'current' : ''}>
                        {booking.b_given_to_transport_date_time ? moment(booking.b_given_to_transport_date_time).format('DD/MM/YYYY HH:mm') : ''}
                    </td>
                </tr>
            );
        });

        return (
            <div className="qbootstrap-nav allbookings">
                <LoadingOverlay
                    active={loadingDownload}
                    spinner
                    text='Ready to download...'
                >
                    <div id="headr" className="col-md-12">
                        <div className="col-md-7 col-sm-12 col-lg-8 col-xs-12 col-md-push-1">
                            <ul className="nav nav-tabs">
                                <li className="active"><Link to="/allbookings">All Bookings</Link></li>
                            </ul>
                        </div>
                        <div id="icn" className="col-md-4 col-sm-12 col-lg-4 col-xs-12 text-right col-lg-pull-1">
                            <a className="none" href=""><i className="icon-plus" aria-hidden="true"></i></a>
                            <div className="popup" onClick={() => this.onClickSimpleSearch(0)}>
                                <i className="icon-search3" aria-hidden="true"></i>
                                {showSimpleSearchBox &&
                                    <div ref={this.setWrapperRef}>
                                        <form onSubmit={(e) => this.onSimpleSearch(e)}>
                                            <input className="popuptext" type="text" placeholder="Search.." name="search" value={simpleSearchKeyword} onChange={(e) => this.onInputChange(e)} />
                                        </form>
                                    </div>
                                }
                            </div>
                            <a onClick={() => this.toggleFindModal()}>
                                <i className="fa fa-search-plus" aria-hidden="true"></i>
                            </a>
                            <div className="popup" onClick={(e) => this.onClickGetAll(e)}>
                                <i className="icon icon-th-list" aria-hidden="true"></i>
                            </div>

                            <a className="none" href=""><i className="icon-calendar3" aria-hidden="true"></i></a>
                            <a
                                className={clientname && (
                                    clientname === 'dme' ||
                                    clientname === 'BioPak' ||
                                    clientname === 'Jason L' ||
                                    clientname === 'Bathroom Sales Direct') ? '' : 'none'}
                                onClick={() => this.onClickMANI()}
                            >
                                <span title="Manifest"><i className="fa fa-clipboard"></i></span>
                            </a>
                            <a href="" className="help none"><i className="fa fa-sliders"></i></a>
                        </div>
                    </div>
                    <div className="top-menu">
                        <div className="container fix-box">
                            <div className="row1 fix-box">
                                <div className="tab-content fix-box">
                                    <div id="all_booking" className="tab-pane fix-box fade in active">
                                        <div className="row userclock">
                                            <Clock format={'DD MMM YYYY h:mm:ss A'} disabled={true} ticking={true} timezone={'Australia/Sydney'} />
                                        </div>
                                        <div className="row filter-controls">
                                            <DatePicker
                                                id="startDate"
                                                selected={startDate ? new Date(startDate) : null}
                                                onChange={(e) => this.onDateChange(e, 'startDate')}
                                                dateFormat="dd MMM yyyy"
                                                className=""
                                            />
                                            <span className='flow-sign'>~</span>
                                            <DatePicker
                                                id="endDate"
                                                selected={endDate ? new Date(endDate) : ''}
                                                onChange={(e) => this.onDateChange(e, 'endDate')}
                                                dateFormat="dd MMM yyyy"
                                                className=""
                                            />
                                            {(clientname === 'dme') &&
                                                <label className="left-30px right-10px">
                                                    Client: 
                                                    <select 
                                                        id="client-select" 
                                                        required 
                                                        onChange={(e) => this.onSelected(e, 'client')}
                                                        value={clientPK}>
                                                        { clientOptionsList }
                                                    </select>
                                                </label>
                                            }
                                            <label className={(clientname === 'dme') ? 'right-10px' : 'left-30px right-10px' }>
                                                Warehouse: 
                                                <select 
                                                    id="warehouse" 
                                                    required 
                                                    onChange={(e) => this.onSelected(e, 'warehouse')} 
                                                    value={selectedWarehouseId}
                                                >
                                                    <option value="all">All</option>
                                                    { warehousesList }
                                                </select>
                                            </label>
                                            <label className='right-10px'>
                                                FP:&nbsp;
                                                <select 
                                                    id="fp" 
                                                    required 
                                                    onChange={(e) => this.onSelected(e, 'fp')} 
                                                    value={selectedFPId}
                                                >
                                                    <option value="all">All</option>
                                                    { fpsList }
                                                </select>
                                            </label>
                                            <button className="btn btn-primary left-10px right-50px" onClick={() => this.onClickFind()}><i className="fa fa-search"></i> Find</button>
                                            <div className="disp-inline-block">
                                                <button className="btn btn-primary left-10px right-10px" onClick={() => this.onClickShowBulkUpdateButton()}>Update(bulk)</button>
                                            </div>
                                            <div className="disp-inline-block">
                                                <button className="btn btn-primary left-10px right-10px" onClick={() => this.onClickBulkLabeleButton()}>Label(bulk)</button>
                                            </div>
                                            {(
                                                (
                                                    clientname === 'dme' ||
                                                    clientname === 'Jason L' ||
                                                    clientname === 'Bathroom Sales Direct' ||
                                                    clientname === 'Anchor Packaging Pty Ltd'
                                                ) &&
                                                (activeTabInd === 3 || activeTabInd === 7)) &&
                                                <div className="disp-inline-block">
                                                    <button className="btn btn-primary left-10px right-10px" onClick={() => this.onClickShowManifestSliderButton()}>Manifest</button>
                                                </div>
                                            }
                                        </div>
                                        <div className="tabs">
                                            <div className="scrollmenu">
                                                <a className={activeTabInd === 7 ? 'active' : ''} onClick={() => this.onClickTab(7)}>Today | Date Range</a>
                                                <a className={activeTabInd === 3 ? 'active' : ''} onClick={() => this.onClickTab(3)}>To Manifest</a>
                                                <a className={activeTabInd === 41 ? 'active' : ''} onClick={() => this.onClickTab(41)}>Cancel Requested</a>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className='row'>
                                            <div className="col-sm-6 tbl-stats">
                                                <select value={downloadOption} onChange={(e) => this.onDownloadOptionChange(e)} className="download-select">
                                                    <option value="label">Label</option>
                                                </select>
                                                <label className='left-30px right-10px'>
                                                    Total Cnt: <strong>{bookingsSummary ? `${parseFloat(bookingsSummary.total_qty.toFixed(2)).toLocaleString('en')}` : '*'}</strong>
                                                </label>
                                                <label className='right-10px'>
                                                    Total KG: <strong>{bookingsSummary ? `${parseFloat(bookingsSummary.total_kgs.toFixed(2)).toLocaleString('en')} KG` : '*'}</strong>
                                                </label>
                                                <label className='right-10px'>
                                                    Total Cubic: <strong>{bookingsSummary ? `${parseFloat(bookingsSummary.total_cbm.toFixed(2)).toLocaleString('en')} m3` : '*'}</strong>
                                                </label>
                                            </div>
                                            <div className="col-sm-6 tbl-pagination">
                                                <button
                                                    className={filteredBookingIds.length > 0 ? 'btn btn-success right-20px' : 'btn btn-gray right-20px'}
                                                    disabled={filteredBookingIds.length === 0}
                                                    onClick={() => this.onClickSync(filteredBookingIds)}
                                                    title="Sync bookings"
                                                >
                                                    <i className="fa fa-sync"></i>
                                                </button>
                                                <label>
                                                    Per page:&nbsp;
                                                    <select value={this.state.pageItemCnt} onChange={(e) => this.onPageItemCntChange(e)}>
                                                        <option value="10">10</option>
                                                        <option value="50">50</option>
                                                        <option value="100">100</option>
                                                        <option value="200">200</option>
                                                    </select>
                                                </label>
                                                <CustomPagination 
                                                    onClickPagination={(type) => this.onClickPagination(type)}
                                                    pageCnt={this.state.pageCnt}
                                                    pageInd={parseInt(this.state.pageInd)}
                                                />
                                                <label className="float-right">
                                                    Selected / Found: <strong>{selectedBookingIds.length}/{bookingsCnt ? bookingsCnt : '*'}</strong>
                                                </label>
                                            </div>
                                        </div>
                                        <LoadingOverlay
                                            active={loading}
                                            spinner
                                            text='Loading...'
                                        >
                                            <div className="table-responsive" onScroll={this.handleScroll} ref={this.myRef}>
                                                <div className="tbl-header">
                                                    <table className="table table-hover table-bordered sortable fixed_headers">
                                                        <tbody>
                                                            <tr>
                                                                <th name="checkbox" className="">
                                                                    <button className="btn btn-primary multi-download" onClick={() => this.onDownload()}>
                                                                        <i className="icon icon-download"></i>
                                                                    </button>
                                                                </th>
                                                                <th name="lines_info" className=""></th>
                                                                <th name="additional_info" className=""></th>
                                                                <th
                                                                    name="b_error_Capture"
                                                                    id={'booking-column-header-tooltip-Error'}
                                                                    className={(sortField === 'b_error_Capture') ? 'narrow-column current' : 'narrow-column'}
                                                                    onClick={() => this.onChangeSortField('b_error_Capture')} 
                                                                >
                                                                    <i className="fa fa-exclamation-triangle"></i>
                                                                    <SimpleTooltipComponent text={'Error'} />
                                                                </th>
                                                                <th name='lines_count' title='Lines count'>Cnt</th>
                                                                <th name='total_kgs' title='Total KGs'>KGs</th>
                                                                <th name='total_cbm' title='Total Cubic Meter'>CBM</th>
                                                                <th
                                                                    name="b_bookingID_Visual"
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
                                                                    name="vx_freight_provider"
                                                                    className={(sortField === 'vx_freight_provider') ? 'current' : ''}
                                                                    onClick={() => this.onChangeSortField('vx_freight_provider')} 
                                                                    scope="col" 
                                                                    nowrap="true"
                                                                >
                                                                    <p>Freight Provider</p>
                                                                    {(sortField === 'vx_freight_provider') ?
                                                                        (sortDirection > 0) ?
                                                                            <i className="fa fa-sort-up"></i>
                                                                            : <i className="fa fa-sort-amount-desc"></i>
                                                                        : <i className="fa fa-sort"></i>
                                                                    }
                                                                </th>
                                                                <th
                                                                    name="v_FPBookingNumber"
                                                                    className={(sortField === 'v_FPBookingNumber') ? 'current' : ''}
                                                                    onClick={() => this.onChangeSortField('v_FPBookingNumber')} 
                                                                    scope="col" 
                                                                    nowrap="true"
                                                                >
                                                                    <p>Consignment</p>
                                                                    {(sortField === 'v_FPBookingNumber') ?
                                                                        (sortDirection > 0) ?
                                                                            <i className="fa fa-sort-up"></i>
                                                                            : <i className="fa fa-sort-down"></i>
                                                                        : <i className="fa fa-sort"></i>
                                                                    }
                                                                </th>
                                                                <th 
                                                                    name="b_status"
                                                                    className={(sortField === 'b_status') ? 'current' : ''}
                                                                    onClick={() => this.onChangeSortField('b_status')}
                                                                    scope="col" 
                                                                    nowrap="true"
                                                                >
                                                                    <p>Status</p>
                                                                    {(sortField === 'b_status') ?
                                                                        (sortDirection > 0) ?
                                                                            <i className="fa fa-sort-up"></i>
                                                                            : <i className="fa fa-sort-down"></i>
                                                                        : <i className="fa fa-sort"></i>
                                                                    }
                                                                </th>
                                                                {(clientname === 'Bathroom Sales Direct' || clientname === 'dme') &&
                                                                    <th
                                                                        name="b_promo_code"
                                                                        className={(sortField === 'b_promo_code') ? 'current' : ''}
                                                                        onClick={() => this.onChangeSortField('b_promo_code')} 
                                                                        scope="col" 
                                                                        nowrap="true"
                                                                    >
                                                                        <p>Promo Code</p>
                                                                        {(sortField === 'b_promo_code') ?
                                                                            (sortDirection > 0) ?
                                                                                <i className="fa fa-sort-up"></i>
                                                                                : <i className="fa fa-sort-down"></i>
                                                                            : <i className="fa fa-sort"></i>
                                                                        }
                                                                    </th>
                                                                }
                                                                {clientname === 'BioPak' ?
                                                                    <th 
                                                                        name="b_clientReference_RA_Numbers"
                                                                        className={(sortField === 'b_clientReference_RA_Numbers') ? 'current' : ''}
                                                                        onClick={() => this.onChangeSortField('b_clientReference_RA_Numbers')} 
                                                                        scope="col" 
                                                                        nowrap="true"
                                                                    >
                                                                        <p>Reference</p>
                                                                        {(sortField === 'b_clientReference_RA_Numbers') ?
                                                                            (sortDirection > 0) ?
                                                                                <i className="fa fa-sort-up"></i>
                                                                                : <i className="fa fa-sort-down"></i>
                                                                            : <i className="fa fa-sort"></i>
                                                                        }
                                                                    </th>
                                                                    :
                                                                    <th 
                                                                        name="b_client_order_num"
                                                                        className={(sortField === 'b_client_order_num') ? 'current' : ''}
                                                                        onClick={() => this.onChangeSortField('b_client_order_num')} 
                                                                        scope="col" 
                                                                        nowrap="true"
                                                                    >
                                                                        <p>Client Order Num</p>
                                                                        {(sortField === 'b_client_order_num') ?
                                                                            (sortDirection > 0) ?
                                                                                <i className="fa fa-sort-up"></i>
                                                                                : <i className="fa fa-sort-down"></i>
                                                                            : <i className="fa fa-sort"></i>
                                                                        }
                                                                    </th>
                                                                }
                                                                <th
                                                                    name="z_label_url"
                                                                    id={'booking-column-header-tooltip-Label'}
                                                                    className={(sortField === 'z_label_url') ? 'narrow-column current' : 'narrow-column'}
                                                                    onClick={() => this.onChangeSortField('z_label_url')} 
                                                                >
                                                                    L
                                                                    <SimpleTooltipComponent text={'Label'} />
                                                                </th>
                                                                <th
                                                                    name="z_pod_url"
                                                                    id={'booking-column-header-tooltip-PODorPODSigned'}
                                                                    className={(sortField === 'z_pod_url') ? 'narrow-column current' : 'narrow-column'}
                                                                    onClick={() => this.onChangeSortField('z_pod_url')} 
                                                                >
                                                                    P|S
                                                                    <SimpleTooltipComponent text={'POD-or-POD-Signed'} />
                                                                </th>
                                                                {activeTabInd === 6 &&
                                                                    <th
                                                                        name="b_booking_Priority"
                                                                        className={(sortField === 'b_booking_Priority') ? 'current' : ''}
                                                                        scope="col" 
                                                                        nowrap="true"
                                                                    >
                                                                        <p>Priority</p>
                                                                    </th>
                                                                }
                                                                <th 
                                                                    name="puPickUpAvailFrom_Date"
                                                                    className={(sortField === 'puPickUpAvailFrom_Date') ? 'current' : ''}
                                                                    onClick={() => this.onChangeSortField('puPickUpAvailFrom_Date')} 
                                                                    scope="col" 
                                                                    nowrap="true"
                                                                >
                                                                    <p>To Pickup / Manifest</p>
                                                                    {
                                                                        (sortField === 'puPickUpAvailFrom_Date') ?
                                                                            (sortDirection > 0) ?
                                                                                <i className="fa fa-sort-up"></i>
                                                                                : <i className="fa fa-sort-down"></i>
                                                                            : <i className="fa fa-sort"></i>
                                                                    }
                                                                </th>
                                                                <th 
                                                                    name="b_dateBookedDate"
                                                                    className={(sortField === 'b_dateBookedDate') ? 'current' : ''}
                                                                    onClick={() => this.onChangeSortField('b_dateBookedDate')} 
                                                                    scope="col" 
                                                                    nowrap="true"
                                                                >
                                                                    <p>Booked Date</p>
                                                                    {
                                                                        (sortField === 'b_dateBookedDate') ?
                                                                            (sortDirection > 0) ?
                                                                                <i className="fa fa-sort-up"></i>
                                                                                : <i className="fa fa-sort-down"></i>
                                                                            : <i className="fa fa-sort"></i>
                                                                    }
                                                                </th>
                                                                <th 
                                                                    name="deToCompanyName"
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
                                                                    name="de_To_Address_Suburb"
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
                                                                    name="de_To_Address_State"
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
                                                                    name="de_To_Address_PostalCode"
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
                                                                <th 
                                                                    name="puCompany"
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
                                                                    name="pu_Address_Suburb"
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
                                                                    name="pu_Address_State"
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
                                                                    name="pu_Address_PostalCode"
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
                                                                    name="b_client_name"
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
                                                                    name="manifest_timestamp"
                                                                    className={(sortField === 'manifest_timestamp') ? 'current' : ''}
                                                                    onClick={() => this.onChangeSortField('manifest_timestamp')} 
                                                                    scope="col" 
                                                                    nowrap="true"
                                                                >
                                                                    <p>Manifested At</p>
                                                                    {(sortField === 'manifest_timestamp') ?
                                                                        (sortDirection > 0) ?
                                                                            <i className="fa fa-sort-up"></i>
                                                                            : <i className="fa fa-sort-down"></i>
                                                                        : <i className="fa fa-sort"></i>
                                                                    }
                                                                </th>
                                                                <th 
                                                                    name="b_client_sales_inv_num"
                                                                    className={(sortField === 'b_client_sales_inv_num') ? 'current' : ''}
                                                                    onClick={() => this.onChangeSortField('b_client_sales_inv_num')} 
                                                                    scope="col" 
                                                                    nowrap="true"
                                                                >
                                                                    <p>Client Sales Inv Num</p>
                                                                    {(sortField === 'b_client_sales_inv_num') ?
                                                                        (sortDirection > 0) ?
                                                                            <i className="fa fa-sort-up"></i>
                                                                            : <i className="fa fa-sort-down"></i>
                                                                        : <i className="fa fa-sort"></i>
                                                                    }
                                                                </th>
                                                                <th 
                                                                    name="vx_serviceName"
                                                                    className={(sortField === 'vx_serviceName') ? 'current' : ''}
                                                                    onClick={() => this.onChangeSortField('vx_serviceName')} 
                                                                    scope="col" 
                                                                    nowrap="true"
                                                                >
                                                                    <p>Service</p>
                                                                    {(sortField === 'vx_serviceName') ?
                                                                        (sortDirection > 0) ?
                                                                            <i className="fa fa-sort-up"></i>
                                                                            : <i className="fa fa-sort-down"></i>
                                                                        : <i className="fa fa-sort"></i>
                                                                    }
                                                                </th>
                                                                <th name="z_lock_status" className=""><i className="fa fa-lock"></i></th>
                                                                <th 
                                                                    name="pu_PickUp_By_Date"
                                                                    className={(sortField === 'pu_PickUp_By_Date') ? 'current' : ''}
                                                                    onClick={() => this.onChangeSortField('pu_PickUp_By_Date')}
                                                                    scope="col" 
                                                                    nowrap="true"
                                                                >
                                                                    <p>Pickup Due</p>
                                                                    {(sortField === 'pu_PickUp_By_Date') ?
                                                                        (sortDirection > 0) ?
                                                                            <i className="fa fa-sort-up"></i>
                                                                            : <i className="fa fa-sort-down"></i>
                                                                        : <i className="fa fa-sort"></i>
                                                                    }
                                                                </th>
                                                                <th name="de_Deliver_By_Time" scope="col" nowrap="true">
                                                                    <p>DE By Time</p>
                                                                </th>
                                                                <th 
                                                                    name="b_given_to_transport_date_time"
                                                                    className={(sortField === 'b_given_to_transport_date_time') ? 'current' : ''}
                                                                    onClick={() => this.onChangeSortField('b_given_to_transport_date_time')} 
                                                                    scope="col"
                                                                >
                                                                    <p>Given to Transport</p>
                                                                    {(sortField === 'b_given_to_transport_date_time') ?
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
                                                                        name="checkbox"
                                                                        type="checkbox"
                                                                        className={(allCheckStatus === 'All' || allCheckStatus === 'None') ? 'checkall' : 'checkall some'}
                                                                        checked={allCheckStatus !== 'None' ? 'checked' : ''}
                                                                        onChange={() => this.onCheckAll()}
                                                                    />
                                                                </th>
                                                                <th name="lines_info"><i className="icon icon-th-list"></i></th>
                                                                <th name="additional_info"><i className="icon icon-plus"></i></th>
                                                                <th name="b_error_Capture"></th>
                                                                <td name='lines_count' className={'text-center'}></td>
                                                                <td name='total_kgs' className={'text-center'}></td>
                                                                <td name='total_cbm' className={'text-center'}></td>
                                                                <th name="b_bookingID_Visual" scope="col"><input type="text" name="b_bookingID_Visual" value={filterInputs['b_bookingID_Visual'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                                <th name="vx_freight_provider" scope="col"><input type="text" name="vx_freight_provider" value={filterInputs['vx_freight_provider'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                                <th name="v_FPBookingNumber" scope="col"><input type="text" name="v_FPBookingNumber" value={filterInputs['v_FPBookingNumber'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                                <th name="b_status" scope="col"><input type="text" name="b_status" value={filterInputs['b_status'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                                {(clientname === 'dme' || clientname === 'Bathroom Sales Direct') &&
                                                                    <th name="b_promo_code" scope="col"><input type="text" name="b_promo_code" value={filterInputs['b_promo_code'] || ''} onChange={(e) => this.onChangeFilterInput(e)} /></th>
                                                                }
                                                                {clientname === 'BioPak' ?
                                                                    <th name="b_clientReference_RA_Numbers" scope="col"><input type="text" name="b_clientReference_RA_Numbers" value={filterInputs['b_clientReference_RA_Numbers'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                                    :
                                                                    <th name="b_client_order_num" scope="col"><input type="text" name="b_client_order_num" value={filterInputs['b_client_order_num'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                                }
                                                                <th name="z_label_url"></th>
                                                                <th name="z_pod_url"></th>
                                                                {activeTabInd === 6 ? <th name="b_booking_Priority"></th> : null}
                                                                <th name="puPickUpAvailFrom_Date" scope="col">
                                                                    <input
                                                                        type="text"
                                                                        name="puPickUpAvailFrom_Date"
                                                                        value={filterInputs['puPickUpAvailFrom_Date'] || ''}
                                                                        placeholder="DD/MM/YY-DD/MM/YY"
                                                                        onChange={(e) => this.onChangeFilterInput(e)}
                                                                        onKeyPress={(e) => this.onKeyPress(e)}
                                                                        onClick={() => this.setState({isShowpuPickUpAvailFrom_DateRange: !this.state.isShowpuPickUpAvailFrom_DateRange, isShowb_dateBookedDateRange: false, isShowmanifest_timestampDateRange: false})}
                                                                    />
                                                                    {this.state.isShowpuPickUpAvailFrom_DateRange && (
                                                                        <DateRangePicker
                                                                            value={this.state.puPickUpAvailFrom_DateRange}
                                                                            onSelect={(e) => this.onSelectDateRange(e, 'puPickUpAvailFrom_Date')}
                                                                            singleDateRange={true}
                                                                        />
                                                                    )}
                                                                </th>
                                                                <th name="b_dateBookedDate" scope="col">
                                                                    <input
                                                                        type="text"
                                                                        name="b_dateBookedDate"
                                                                        value={filterInputs['b_dateBookedDate'] || ''}
                                                                        placeholder="DD/MM/YY-DD/MM/YY"
                                                                        onChange={(e) => this.onChangeFilterInput(e)}
                                                                        onKeyPress={(e) => this.onKeyPress(e)}
                                                                        onClick={() => this.setState({isShowb_dateBookedDateRange: !this.state.isShowb_dateBookedDateRange, isShowpuPickUpAvailFrom_DateRange: false, isShowmanifest_timestampDateRange: false})}
                                                                    />
                                                                    {this.state.isShowb_dateBookedDateRange && (
                                                                        <DateRangePicker
                                                                            value={this.state.b_dateBookedDateRange}
                                                                            onSelect={(e) => this.onSelectDateRange(e, 'b_dateBookedDate')}
                                                                            singleDateRange={true}
                                                                        />
                                                                    )}
                                                                </th>
                                                                <th name="deToCompanyName" scope="col"><input type="text" name="deToCompanyName" value={filterInputs['deToCompanyName'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                                <th name="de_To_Address_Suburb" scope="col"><input type="text" name="de_To_Address_Suburb" value={filterInputs['de_To_Address_Suburb'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                                <th name="de_To_Address_State" scope="col"><input type="text" name="de_To_Address_State" value={filterInputs['de_To_Address_State'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                                <th name="de_To_Address_PostalCode" scope="col"><input type="text" name="de_To_Address_PostalCode" value={filterInputs['de_To_Address_PostalCode'] || ''} placeholder="xxxx-xxxx" onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                                <th name="puCompany" scope="col"><input type="text" name="puCompany" value={filterInputs['puCompany'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                                <th name="pu_Address_Suburb" scope="col"><input type="text" name="pu_Address_Suburb" value={filterInputs['pu_Address_Suburb'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                                <th name="pu_Address_State" scope="col"><input type="text" name="pu_Address_State" value={filterInputs['pu_Address_State'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                                <th name="pu_Address_PostalCode" scope="col"><input type="text" name="pu_Address_PostalCode" value={filterInputs['pu_Address_PostalCode'] || ''} placeholder="xxxx-xxxx" onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                                <th name="b_client_name" scope="col"><input type="text" name="b_client_name" value={filterInputs['b_client_name'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                                <th name="manifest_timestamp" scope="col">
                                                                    <input
                                                                        type="text"
                                                                        name="manifest_timestamp"
                                                                        value={filterInputs['manifest_timestamp'] || ''}
                                                                        placeholder="DD/MM/YY-DD/MM/YY"
                                                                        onChange={(e) => this.onChangeFilterInput(e)}
                                                                        onKeyPress={(e) => this.onKeyPress(e)}
                                                                        onClick={() => this.setState({isShowmanifest_timestampDateRange: !this.state.isShowmanifest_timestampDateRange, isShowb_dateBookedDateRange: false, isShowpuPickUpAvailFrom_DateRange: false})}
                                                                    />
                                                                    {this.state.isShowmanifest_timestampDateRange && (
                                                                        <DateRangePicker
                                                                            value={this.state.manifest_timestampDateRange}
                                                                            onSelect={(e) => this.onSelectDateRange(e, 'manifest_timestamp')}
                                                                            singleDateRange={true}
                                                                        />
                                                                    )}
                                                                </th>
                                                                <th name="b_client_sales_inv_num" scope="col"><input type="text" name="b_client_sales_inv_num" value={filterInputs['b_client_sales_inv_num'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                                <th name="vx_serviceName" scope="col"><input type="text" name="vx_serviceName" value={filterInputs['vx_serviceName'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                                <th name="z_lock_status" className="narrow-column"></th>
                                                                <th name="pu_PickUp_By_Date" scope="col"><input type="text" name="pu_PickUp_By_Date" value={filterInputs['pu_PickUp_By_Date'] || ''} placeholder="20xx-xx-xx" onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                                <th name="de_Deliver_By_Time" scope="col"></th>
                                                                <th name="b_given_to_transport_date_time" scope="col"><input type="text" name="b_given_to_transport_date_time" value={filterInputs['b_given_to_transport_date_time'] || ''} placeholder="20xx-xx-xx hh:mm" onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="tbl-content" style={tblContentWidth} onScroll={this.handleScroll}>
                                                    <table className="table table-hover table-bordered sortable fixed_headers">
                                                        <tbody>
                                                            { bookingsList }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </LoadingOverlay>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </LoadingOverlay>

                <FindModal
                    isOpen={this.state.isShowFindModal}
                    toggleFindModal={this.toggleFindModal}
                    onFind={(findMode, selectedFieldName, valueSet) => this.onMultiFind(findMode, selectedFieldName, valueSet)}
                    bookings={bookings}
                />

                <ManifestSlider
                    isOpen={this.state.isShowManifestSlider}
                    toggleSlider={this.toggleManifestSlider}
                    selectedBookings={selectedBookings}
                    clientname={clientname}
                    onCreateOrder={(bookingIds, vx_freight_provider, needTruck, timestamp) => this.onCreateOrder(bookingIds, vx_freight_provider, needTruck, timestamp)}
                />

                <BulkUpdateSlider
                    isOpen={this.state.isShowBulkUpdateSlider}
                    toggleSlider={this.toggleBulkUpdateSlider}
                    allBookingStatus={[]}
                    clientname={clientname}
                    fps={allFPs}
                    selectedBookingIds={selectedBookingIds}
                    onUpdate={(field, value, bookingIds, optionalValue) => this.onBulkUpdate(field, value, bookingIds, optionalValue)}
                />

                <LineAndLineDetailSlider
                    isOpen={isShowLineSlider}
                    toggleLineSlider={this.toggleLineSlider}
                    lines={filteredProducts}
                    lineDetails={filterBookingLineDetailsProduct}
                    onClickDuplicate={(typeNum, data) => this.onClickDuplicate(typeNum, data)}
                    onClickDelete={(typeNum, data) => this.onClickDeleteLineOrLineData(typeNum, data)}
                    loadingBookingLine={this.state.loadingBookingLine}
                    loadingBookingLineDetail={this.state.loadingBookingLineDetail}
                    selectedLineIndex={this.state.selectedLineIndex}
                    onClickShowLine={(index) => this.onClickShowLine(index)}
                    booking={this.state.selectedBooking}
                    createBookingLine={(bookingLine) => this.props.createBookingLine(bookingLine)}
                    updateBookingLine={(bookingLine) => this.props.updateBookingLine(bookingLine)}
                    createBookingLineDetail={(bookingLine) => this.props.createBookingLineDetail(bookingLine)}
                    updateBookingLineDetail={(bookingLine) => this.props.updateBookingLineDetail(bookingLine)}
                    moveLineDetails={(lineId, lineDetailIds) => this.props.moveLineDetails(lineId, lineDetailIds)}
                    packageTypes={this.props.packageTypes}
                    currentPackedStatus={_currentPackedStatus}
                    onChangePackedStatus={(status) => this.onChangePackedStatus(status)}
                    toggleUpdateBookingModal={() => {}}
                />

                <ToastContainer />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        bookings: state.booking.bookings,
        filteredBookingIds: state.booking.filteredBookingIds,
        filteredBookingVisualIds: state.booking.filteredBookingVisualIds,
        filteredConsignments: state.booking.filteredConsignments,
        bookingsCnt: state.booking.bookingsCnt,
        needUpdateBookings: state.booking.needUpdateBookings,
        bookingLines: state.bookingLine.bookingLines,
        bookingLineDetails: state.bookingLineDetail.bookingLineDetails,
        selectedBookingLinesCnt: state.bookingLine.selectedBookingLinesCnt,
        redirect: state.auth.redirect,
        startDate: state.booking.startDate,
        endDate: state.booking.endDate,
        warehouseId: state.booking.warehouseId,
        fpId: state.booking.fpId,
        pageItemCnt: state.booking.pageItemCnt,
        pageInd: state.booking.pageInd,
        pageCnt: state.booking.pageCnt,
        sortField: state.booking.sortField,
        columnFilters: state.booking.columnFilters,
        activeTabInd: state.booking.activeTabInd,
        simpleSearchKeyword: state.booking.simpleSearchKeyword,
        downloadOption: state.booking.downloadOption,
        dmeStatus: state.booking.dmeStatus,
        multiFindField: state.booking.multiFindField,
        multiFindValues: state.booking.multiFindValues,
        bookingErrorMessage: state.booking.errorMessage,
        dmeClients: state.auth.dmeClients,
        clientname: state.auth.clientname,
        username: state.auth.username,
        clientPK: state.booking.clientPK,
        allFPs: state.extra.allFPs,
        bookingsSummary: state.booking.bookingsSummary,
        packageTypes: state.extra.packageTypes,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        getWareHouseLabelBookings: (startDate, endDate, clientPK, warehouseId, fpId, pageItemCnt, pageInd, sortField, columnFilters, activeTabInd, simpleSearchKeyword, downloadOption, dmeStatus, multiFindField, multiFindValues) => dispatch(getWareHouseLabelBookings(startDate, endDate, clientPK, warehouseId, fpId, pageItemCnt, pageInd, sortField, columnFilters, activeTabInd, simpleSearchKeyword, downloadOption, dmeStatus, multiFindField, multiFindValues)),
        setGetBookingsFilter: (key, value) => dispatch(setGetBookingsFilter(key, value)),
        setAllGetBookingsFilter: (startDate, endDate, clientPK, warehouseId, fpId, pageItemCnt, pageInd, sortField, columnFilters, activeTabInd, simpleSearchKeyword, downloadOption, dmeStatus, multiFindField, multiFindValues) => dispatch(setAllGetBookingsFilter(startDate, endDate, clientPK, warehouseId, fpId, pageItemCnt, pageInd, sortField, columnFilters, activeTabInd, simpleSearchKeyword, downloadOption, dmeStatus, multiFindField, multiFindValues)),
        setNeedUpdateBookingsState: (boolFlag) => dispatch(setNeedUpdateBookingsState(boolFlag)),
        getWarehouses: () => dispatch(getWarehouses()),
        getUserDateFilterField: () => dispatch(getUserDateFilterField()),
        alliedBooking: (bookingId) => dispatch(alliedBooking(bookingId)),
        fpLabel: (bookingId, vx_freight_provider) => dispatch(fpLabel(bookingId, vx_freight_provider)),
        getAlliedLabel: (bookingId) => dispatch(getAlliedLabel(bookingId)),
        fpOrder: (bookingIds, vx_freight_provider) => dispatch(fpOrder(bookingIds, vx_freight_provider)),
        fpOrderSummary: (bookingIds, vx_freight_provider) => dispatch(fpOrderSummary(bookingIds, vx_freight_provider)),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        changeBookingsStatus: (status, bookingIds, optionalValue) => dispatch(changeBookingsStatus(status, bookingIds, optionalValue)),
        changeBookingsFlagStatus: (flagStatus, bookingIds) => dispatch(changeBookingsFlagStatus(flagStatus, bookingIds)),
        getAllFPs: () => dispatch(getAllFPs()),
        clearErrorMessage: (boolFlag) => dispatch(clearErrorMessage(boolFlag)),
        getSummaryOfBookings: (bookingIds, from) => dispatch(getSummaryOfBookings(bookingIds, from)),
        getPackageTypes: () => dispatch(getPackageTypes()),
        getBookingLinesCnt: (bookingIds) => dispatch(getBookingLinesCnt(bookingIds)),
        getBookingLines: (bookingId) => dispatch(getBookingLines(bookingId)),
        createBookingLine: (bookingLine) => dispatch(createBookingLine(bookingLine)),
        duplicateBookingLine: (bookingLine) => dispatch(duplicateBookingLine(bookingLine)),
        deleteBookingLine: (bookingLine) => dispatch(deleteBookingLine(bookingLine)),
        updateBookingLine: (bookingLine) => dispatch(updateBookingLine(bookingLine)),
        getBookingLineDetails: (bookingId) => dispatch(getBookingLineDetails(bookingId)),
        createBookingLineDetail: (bookingLineDetail) => dispatch(createBookingLineDetail(bookingLineDetail)),
        duplicateBookingLineDetail: (bookingLineDetail) => dispatch(duplicateBookingLineDetail(bookingLineDetail)),
        deleteBookingLineDetail: (bookingLineDetail) => dispatch(deleteBookingLineDetail(bookingLineDetail)),
        updateBookingLineDetail: (bookingLineDetail) => dispatch(updateBookingLineDetail(bookingLineDetail)),
        moveLineDetails: (lineId, lineDetailIds) => dispatch(moveLineDetails(lineId, lineDetailIds)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(WarehouseLabelPage));

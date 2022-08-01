// React Libs
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
// Libs
import moment from 'moment-timezone';
import {isEmpty, isUndefined, join, union,  difference, isNull, clone, indexOf, size} from 'lodash';
import axios from 'axios';
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Clock from 'react-live-clock';
import LoadingOverlay from 'react-loading-overlay';
import BarLoader from 'react-spinners/BarLoader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DateRangePicker from 'react-daterange-picker';
import 'react-daterange-picker/dist/css/react-calendar.css'; // For some basic styling. (OPTIONAL)
// Constants
import { API_HOST, STATIC_HOST, HTTP_PROTOCOL } from '../config';
// Actions
import { verifyToken, cleanRedirectState, getDMEClients } from '../state/services/authService';
import { getWarehouses } from '../state/services/warehouseService';
import {
    getBookings, getPricingAnalysis, getUserDateFilterField, alliedBooking, fpLabel, getAlliedLabel,
    allTrigger, updateBooking, setGetBookingsFilter, setAllGetBookingsFilter, setNeedUpdateBookingsState,
    fpOrder, getExcel, generateXLS, changeBookingsStatus, changeBookingsFlagStatus, calcCollected,
    clearErrorMessage, fpOrderSummary, getSummaryOfBookings
} from '../state/services/bookingService';
import { getBookingLines, getBookingLinesCnt } from '../state/services/bookingLinesService';
import { getBookingLineDetails } from '../state/services/bookingLineDetailsService';
import { getAllBookingStatus, getAllFPs, getAllProjectNames, getBookingSets, createBookingSet, updateBookingSet } from '../state/services/extraService';
// Components
import TooltipItem from '../components/Tooltip/TooltipComponent';
import SimpleTooltipComponent from '../components/Tooltip/SimpleTooltipComponent';
import EditablePopover from '../components/Popovers/EditablePopover';
import XLSModal from '../components/CommonModals/XLSModal';
import ProjectNameModal from '../components/CommonModals/ProjectNameModal';
import StatusLockModal from '../components/CommonModals/StatusLockModal';
import CustomPagination from '../components/Pagination/Pagination';
import CheckPodModal from '../components/CommonModals/CheckPodModal';
import StatusInfoSlider from '../components/Sliders/StatusInfoSlider';
import FindModal from '../components/CommonModals/FindModal';
import OrderModal from '../components/CommonModals/OrderModal';
import BulkUpdateSlider from '../components/Sliders/BulkUpdateSlider';
import PricingAnalyseSlider from '../components/Sliders/PricingAnalyseSlider';
import BookingSetModal from '../components/CommonModals/BookingSetModal';
import ManifestSlider from '../components/Sliders/ManifestSlider';
import SurchargeSlider from '../components/Sliders/SurchargeSlider';

class AllBookingsPage extends React.Component {
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
            pricingAnalyses: [],
            isShowStatusLockModal: false,
            pageItemCnt: 100,
            pageInd: 0,
            pageCnt: 0,
            selectedOneBooking: {},
            activeBookingId: null,
            dmeStatus: null,
            selectedWarehouseId: 0,
            selectedFPId: 0,
            isShowXLSModal: false,
            isShowProjectNameModal: false,
            isShowCheckPodModal: false,
            isShowStatusInfoSlider: false,
            isShowFindModal: false,
            selectedBookingIds2Order: [],
            selectedFP2Order: null,
            isShowOrderModal: false,
            selectedBookingLinesCnt: 0,
            projectNames: [],
            projectName: '',
            isShowBulkUpdateSlider: false,
            isShowPricingAnalyseSlider: false,
            isShowBookingSetModal: false,
            isShowManifestSlider: false,
            isShowSurchargeSlider: false,
        };

        moment.tz.setDefault('Australia/Sydney');
        this.myRef = React.createRef();
        this.drRef = React.createRef();
        this.togglePopover = this.togglePopover.bind(this);
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.toggleXLSModal = this.toggleXLSModal.bind(this);
        this.toggleStatusLockModal = this.toggleStatusLockModal.bind(this);
        this.toggleCheckPodModal = this.toggleCheckPodModal.bind(this);
        this.toggleStatusInfoSlider = this.toggleStatusInfoSlider.bind(this);
        this.toggleFindModal = this.toggleFindModal.bind(this);
        this.toggleOrderModal = this.toggleOrderModal.bind(this);
        this.toggleProjectNameModal = this.toggleProjectNameModal.bind(this);
        this.toggleBulkUpdateSlider = this.toggleBulkUpdateSlider.bind(this);
        this.togglePricingAnalyseSlider = this.togglePricingAnalyseSlider.bind(this);
        this.toggleBookingSetModal = this.toggleBookingSetModal.bind(this);
        this.toggleManifestSlider = this.toggleManifestSlider.bind(this);
        this.toggleSurchargeSlider = this.toggleSurchargeSlider.bind(this);
    }

    static propTypes = {
        // Prop funcs
        verifyToken: PropTypes.func.isRequired,
        getBookings: PropTypes.func.isRequired,
        updateBooking: PropTypes.func.isRequired,
        getBookingLines: PropTypes.func.isRequired,
        getBookingLineDetails: PropTypes.func.isRequired,
        getWarehouses: PropTypes.func.isRequired,
        getUserDateFilterField: PropTypes.func.isRequired,
        allTrigger: PropTypes.func.isRequired,
        alliedBooking: PropTypes.func.isRequired,
        fpLabel: PropTypes.func.isRequired,
        fpOrder: PropTypes.func.isRequired,
        fpOrderSummary: PropTypes.func.isRequired,
        getAlliedLabel: PropTypes.func.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
        setGetBookingsFilter: PropTypes.func.isRequired,
        setAllGetBookingsFilter: PropTypes.func.isRequired,
        setNeedUpdateBookingsState: PropTypes.func.isRequired,
        getExcel: PropTypes.func.isRequired,
        getDMEClients: PropTypes.func.isRequired,
        generateXLS: PropTypes.func.isRequired,
        changeBookingsStatus: PropTypes.func.isRequired,
        changeBookingsFlagStatus: PropTypes.func.isRequired,
        getAllBookingStatus: PropTypes.func.isRequired,
        getAllFPs: PropTypes.func.isRequired,
        calcCollected: PropTypes.func.isRequired,
        getBookingLinesCnt: PropTypes.func.isRequired,
        getAllProjectNames: PropTypes.func.isRequired,
        getPricingAnalysis: PropTypes.func.isRequired,
        getBookingSets: PropTypes.func.isRequired,
        createBookingSet: PropTypes.func.isRequired,
        updateBookingSet: PropTypes.func.isRequired,
        getSummaryOfBookings: PropTypes.func.isRequired,

        // Prop vars
        history: PropTypes.object.isRequired,
        redirect: PropTypes.bool.isRequired,
        location: PropTypes.object.isRequired,
        bookingsets: PropTypes.array,
        bookings: PropTypes.array,
        allBookingStatus: PropTypes.array,
        clientname: PropTypes.string,
        startDate: PropTypes.any,
        filteredBookingIds: PropTypes.array,
        filteredConsignments: PropTypes.array,
        clearErrorMessage: PropTypes.func.isRequired,
        bookingsSummary: PropTypes.object,
        allFPs: PropTypes.array,
    };

    componentDidMount() {
        const { startDate, bookings } = this.props;
        const token = localStorage.getItem('token');
        const b_bookingID_Visuals_4_report = localStorage.getItem('report:b_bookingID_Visuals');

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
                that.props.getDMEClients();
                that.props.getWarehouses();
                that.props.getUserDateFilterField();
                that.props.getAllBookingStatus();
                that.props.getAllFPs();
                that.props.getAllProjectNames();
            }, 2000);
        };

        if (b_bookingID_Visuals_4_report) {
            const today = moment().format('YYYY-MM-DD');
            this.props.setAllGetBookingsFilter('*', today, 0, 0, 0, 100, 0, '-id', {}, 0, '', 'label', '', 'b_bookingID_Visual', b_bookingID_Visuals_4_report);
            localStorage.removeItem('report:b_bookingID_Visuals');
            delayedFuncs();
        } else if (!bookings || (bookings && (isEmpty(bookings) || isUndefined(bookings)))) {
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
            pageCnt, dmeStatus, multiFindField, multiFindValues, bookingErrorMessage, selectedBookingLinesCnt,
            projectNames, projectName, pricingAnalyses
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

            if (bookingErrorMessage.indexOf('Successfully create order') !== -1) {
                this.props.fpOrderSummary(this.state.selectedBookingIds2Order, this.state.selectedFP2Order);
                this.setState({selectedBookingIds2Order: []});
            }
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
                        projectName,
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
                    successSearchFilterOptions.projectName
                );
                this.setState({successSearchFilterOptions: {}, hasSuccessSearchAndFilterOptions: false});
            }
        }

        if (bookingLineDetails) {
            this.setState({bookingLineDetails: this.calcBookingLineDetail(bookingLineDetails)});
        }

        if (bookingLines) {
            this.setState({bookingLines: this.calcBookingLine(bookingLines)});
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

        if (projectNames) {
            let newProjectNames = [...projectNames];

            newProjectNames.sort(function(a, b) {
                const nameA = a.toUpperCase();
                const nameB = b.toUpperCase();
                return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
            });
            this.setState({projectNames: newProjectNames});
        }

        if (pricingAnalyses) {
            this.setState({pricingAnalyses});
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
                projectName,
                pageItemCnt,
                pageInd,
                clientPK,
            });

            this.props.getBookings(startDate, endDate, clientPK, warehouseId, fpId, pageItemCnt, pageInd, sortField, columnFilters, activeTabInd, simpleSearchKeyword, downloadOption, dmeStatus, multiFindField, multiFindValues, projectName);
            this.props.getAllProjectNames();
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
        const { startDate, endDate, projectName, clientPK, selectedWarehouseId, selectedFPId, pageItemCnt, pageInd, sortField, sortDirection, activeTabInd, dmeStatus, columnFilters } = this.state;
        let _startDate = startDate;
        let _sortField = sortField;

        if (isNull(startDate))
            _startDate = '*';

        if (sortDirection === -1)
            _sortField = '-' + _sortField;

        this.props.setAllGetBookingsFilter(_startDate, endDate, clientPK, selectedWarehouseId, selectedFPId, pageItemCnt, pageInd, _sortField, columnFilters, activeTabInd, '', 'label', dmeStatus, null, null, projectName);
        this.setState({selectedBookingIds: [], allCheckStatus: 'None'});
    }

    onClickSync(bookingIds) {
        this.onMultiFind('currentTab', 'id', join(bookingIds, ', '));
    }

    onSelected(e, src) {
        if (src === 'warehouse') {
            const selectedWarehouseId = e.target.value;
            let warehouseId = 0;

            if (selectedWarehouseId !== 'all')
                warehouseId = selectedWarehouseId;

            this.setState({selectedBookingIds: [], allCheckStatus: 'None', selectedname: e.target.name, selectedWarehouseId: warehouseId});
        } else if (src === 'fp') {
            const selectedFPId = e.target.value;
            let fpId = 0;

            if (selectedFPId !== 'all')
                fpId = selectedFPId;

            this.setState({selectedBookingIds: [], allCheckStatus: 'None', selectedname: e.target.name, selectedFPId: fpId});
        } else if (src === 'client') {
            this.setState({selectedBookingIds: [], allCheckStatus: 'None', clientPK: e.target.value});
        } else if (src === 'status') {
            this.setState({selectedBookingIds: [], allCheckStatus: 'None', dmeStatus: e.target.value});
        } else if (src === 'projectName') {
            this.setState({selectedBookingIds: [], allCheckStatus: 'None', activeTabInd: 0, startDate: null, projectName: e.target.value});
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

    toggleXLSModal() {
        this.setState(prevState => ({isShowXLSModal: !prevState.isShowXLSModal}));
    }

    toggleStatusLockModal() {
        this.setState(prevState => ({isShowStatusLockModal: !prevState.isShowStatusLockModal}));
    }

    toggleCheckPodModal() {
        this.setState(prevState => ({isShowCheckPodModal: !prevState.isShowCheckPodModal})); 
    }

    toggleStatusInfoSlider() {
        this.setState(prevState => ({isShowStatusInfoSlider: !prevState.isShowStatusInfoSlider})); 
    }

    toggleFindModal() {
        this.setState(prevState => ({isShowFindModal: !prevState.isShowFindModal})); 
    }

    toggleOrderModal() {
        this.setState(prevState => ({isShowOrderModal: !prevState.isShowOrderModal})); 
    }

    toggleProjectNameModal() {
        this.setState(prevState => ({isShowProjectNameModal: !prevState.isShowProjectNameModal}));
    }

    toggleBulkUpdateSlider() {
        this.setState(prevState => ({isShowBulkUpdateSlider: !prevState.isShowBulkUpdateSlider}));
    }

    togglePricingAnalyseSlider() {
        let selectedBookingIds = this.state.selectedBookingIds;
        if ( !this.state.isShowPricingAnalyseSlider ) {
            console.log('getPricingAnalysis',selectedBookingIds);
            this.props.getPricingAnalysis(selectedBookingIds);
        }
        
        this.setState(prevState => ({isShowPricingAnalyseSlider: !prevState.isShowPricingAnalyseSlider}));
    }

    toggleBookingSetModal() {
        this.setState(prevState => ({isShowBookingSetModal: !prevState.isShowBookingSetModal}));
    }

    toggleManifestSlider() {
        this.setState(prevState => ({isShowManifestSlider: !prevState.isShowManifestSlider}));
    }

    toggleSurchargeSlider() {
        this.setState(prevState => ({isShowSurchargeSlider: !prevState.isShowSurchargeSlider}));
    }

    onClickAllTrigger() {
        this.props.allTrigger();
    }

    onClickGetLabel() {
        const { selectedBookingIds } = this.state;
        const { bookings } = this.props;
        const st_name = 'startrack';
        const allied_name = 'allied';
        const dhl_name = 'dhl';

        if (selectedBookingIds.length == 0 || selectedBookingIds.length > 1) {
            this.notify('Please check only one booking!');
        } else {
            let ind = -1;

            for (let i = 0; i < bookings.length; i++) {
                if (bookings[i].id === selectedBookingIds[0]) {
                    ind = i;
                    break;
                }
            }

            if (ind > -1) {
                if (bookings[ind].vx_freight_provider.toLowerCase() === st_name) {
                    this.props.fpLabel(bookings[ind].id, bookings[ind].vx_freight_provider);
                    this.setState({loadingBooking: true});
                } else if (bookings[ind].vx_freight_provider.toLowerCase() === allied_name) {
                    this.props.getAlliedLabel(bookings[ind].id);
                    this.setState({loadingBooking: true});
                } else if (bookings[ind].vx_freight_provider.toLowerCase() === dhl_name) {
                    this.buildPDF([bookings[ind].id], bookings[ind].vx_freight_provider);
                }
            }
        }

        this.setState({selectedBookingIds: [], allCheckStatus: 'None'});
    }

    onDownload() {
        const token = localStorage.getItem('token');
        const { selectedBookingIds, downloadOption, startDate, endDate, selectedname } = this.state;
        const { bookings } = this.props;

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
            } else if (downloadOption === 'pod' || downloadOption === 'new_pod') {
                let bookingIdsWithNewPOD = [];

                for (let j = 0; j < selectedBookingIds.length; j++) {
                    for (let i = 0; i < bookings.length; i++) {
                        if (bookings[i].id === selectedBookingIds[j]) {
                            if (bookings[i].z_downloaded_pod_timestamp === null &&
                                (bookings[i].z_pod_url &&
                                bookings[i].z_pod_url.length > 0))
                                bookingIdsWithNewPOD.push(bookings[i].id);
                        }
                    }
                }

                if ((downloadOption === 'new_pod' && bookingIdsWithNewPOD.length !== 0) || (downloadOption === 'pod')) {
                    const options = {
                        method: 'post',
                        url: HTTP_PROTOCOL + '://' + API_HOST + '/download/',
                        headers: {'Authorization': 'JWT ' + token },
                        data: {
                            ids: downloadOption === 'pod' ? selectedBookingIds : bookingIdsWithNewPOD,
                            downloadOption: downloadOption,
                        },
                        responseType: 'blob', // important
                    };

                    axios(options).then((response) => {
                        const url = window.URL.createObjectURL(new Blob([response.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', 'pod_' + selectedname + '_' + downloadOption === 'pod' ? selectedBookingIds.length : bookingIdsWithNewPOD.length + '_' + moment().utc().format('YYYY-MM-DD HH:mm') + '.zip');
                        document.body.appendChild(link);
                        link.click();
                        this.props.setGetBookingsFilter('date', {startDate, endDate});
                        this.setState({selectedBookingIds: [], allCheckStatus: 'None', loadingDownload: false});
                    });
                } else {
                    this.notify('No new POD info');
                    this.setState({selectedBookingIds: [], allCheckStatus: 'None', loadingDownload: false});
                }
            } else if (downloadOption === 'pod_sog' || downloadOption === 'new_pod_sog') {
                let bookingIdsWithNewPODSOG = [];

                for (let j = 0; j < selectedBookingIds.length; j++) {
                    for (let i = 0; i < bookings.length; i++) {
                        if (bookings[i].id === selectedBookingIds[j]) {
                            if (bookings[i].z_downloaded_pod_sog_timestamp === null &&
                                (bookings[i].z_pod_signed_url &&
                                bookings[i].z_pod_signed_url.length > 0))
                                bookingIdsWithNewPODSOG.push(bookings[i].id);
                        }
                    }
                }

                if ((downloadOption === 'new_pod_sog' && bookingIdsWithNewPODSOG.length !== 0) || (downloadOption === 'pod_sog')) {
                    const options = {
                        method: 'post',
                        url: HTTP_PROTOCOL + '://' + API_HOST + '/download/',
                        headers: {'Authorization': 'JWT ' + token },
                        data: {
                            ids: downloadOption === 'pod_sog' ? selectedBookingIds : bookingIdsWithNewPODSOG,
                            downloadOption: downloadOption,
                        },
                        responseType: 'blob', // important
                    };

                    axios(options).then((response) => {
                        const url = window.URL.createObjectURL(new Blob([response.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', 'pod_signed' + selectedname + '_' + downloadOption === 'pod_sog' ? selectedBookingIds.length : bookingIdsWithNewPODSOG.length + '_' + moment().utc().format('YYYY-MM-DD HH:mm') + '.zip');
                        document.body.appendChild(link);
                        link.click();
                        this.props.setGetBookingsFilter('date', {startDate, endDate});
                        this.setState({selectedBookingIds: [], allCheckStatus: 'None', loadingDownload: false});
                    });
                } else {
                    this.notify('No new POD SOG info');
                    this.setState({selectedBookingIds: [], allCheckStatus: 'None', loadingDownload: false});
                }
            } else if (downloadOption === 'connote' || downloadOption === 'new_connote') {
                let bookingIdsWithNewConnote = [];

                for (let j = 0; j < selectedBookingIds.length; j++) {
                    for (let i = 0; i < bookings.length; i++) {
                        if (bookings[i].id === selectedBookingIds[j]) {
                            if (bookings[i].z_downloaded_connote_timestamp === null &&
                                (bookings[i].z_connote_url &&
                                bookings[i].z_connote_url.length > 0))
                                bookingIdsWithNewConnote.push(bookings[i].id);
                        }
                    }
                }

                if ((downloadOption === 'new_connote' && bookingIdsWithNewConnote.length !== 0) || (downloadOption === 'connote')) {
                    const options = {
                        method: 'post',
                        url: HTTP_PROTOCOL + '://' + API_HOST + '/download/',
                        headers: {'Authorization': 'JWT ' + token },
                        data: {
                            ids: downloadOption === 'connote' ? selectedBookingIds : bookingIdsWithNewConnote,
                            downloadOption: downloadOption,
                        },
                        responseType: 'blob', // important
                    };

                    axios(options).then((response) => {
                        const url = window.URL.createObjectURL(new Blob([response.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', 'connote_' + selectedname + '_' + downloadOption === 'connote' ? selectedBookingIds.length : bookingIdsWithNewConnote.length + '_' + moment().utc().format('YYYY-MM-DD HH:mm') + '.zip');
                        document.body.appendChild(link);
                        link.click();
                        this.props.setGetBookingsFilter('date', {startDate, endDate});
                        this.setState({selectedBookingIds: [], allCheckStatus: 'None', loadingDownload: false});
                    });
                } else {
                    this.notify('No new Connote info');
                    this.setState({selectedBookingIds: [], allCheckStatus: 'None', loadingDownload: false});
                }
            } else if (downloadOption === 'label_and_connote') {
                let bookingIdsWithLabel = [];
                let bookingIdsWithConnote = [];

                for (let j = 0; j < selectedBookingIds.length; j++) {
                    for (let i = 0; i < bookings.length; i++) {
                        if (bookings[i].id === selectedBookingIds[j]) {
                            if (bookings[i].z_connote_url &&
                                bookings[i].z_connote_url.length > 0) {
                                bookingIdsWithConnote.push(bookings[i].id);
                            }

                            if (bookings[i].z_label_url &&
                                bookings[i].z_label_url.length > 0) {
                                bookingIdsWithLabel.push(bookings[i].id);
                            }
                        }
                    }
                }

                if (bookingIdsWithConnote.length > 0) {
                    const options = {
                        method: 'post',
                        url: HTTP_PROTOCOL + '://' + API_HOST + '/download/',
                        headers: {'Authorization': 'JWT ' + token},
                        data: {
                            ids: bookingIdsWithConnote,
                            downloadOption: 'connote',
                        },
                        responseType: 'blob', // important
                    };

                    axios(options).then((response) => {
                        const url = window.URL.createObjectURL(new Blob([response.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', 'connote_' + selectedname + '_' + bookingIdsWithConnote.length + '_' + moment().utc().format('YYYY-MM-DD HH:mm') + '.zip');
                        document.body.appendChild(link);
                        link.click();
                        this.props.setGetBookingsFilter('date', {startDate, endDate});
                        this.setState({selectedBookingIds: [], allCheckStatus: 'None', loadingDownload: false});
                    });
                }

                if (bookingIdsWithLabel.length > 0) {
                    const options = {
                        method: 'post',
                        url: HTTP_PROTOCOL + '://' + API_HOST + '/download/',
                        headers: {'Authorization': 'JWT ' + token},
                        data: {
                            ids: bookingIdsWithLabel,
                            downloadOption: 'label',
                        },
                        responseType: 'blob', // important
                    };

                    axios(options).then((response) => {
                        const url = window.URL.createObjectURL(new Blob([response.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', 'label_' + selectedname + '_' + bookingIdsWithLabel.length + '_' + moment().utc().format('YYYY-MM-DD HH:mm') + '.zip');
                        document.body.appendChild(link);
                        link.click();
                        this.props.setGetBookingsFilter('date', {startDate, endDate});
                        this.setState({selectedBookingIds: [], allCheckStatus: 'None', loadingDownload: false});
                    });
                }

                if (bookingIdsWithConnote.length === 0 && bookingIdsWithLabel.length === 0) {
                    this.notify('No Booking which has Label or Connote info');
                    this.setState({selectedBookingIds: [], allCheckStatus: 'None', loadingDownload: false});
                }
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
                if (booking.z_label_url.indexOf('http') !== -1) {
                    const win = window.open(booking.z_label_url, '_blank');
                    win.focus();
                } else {
                    this.bulkBookingUpdate([booking.id], 'z_downloaded_shipping_label_timestamp', new Date())
                        .then(() => {
                            this.onClickFind();
                        })
                        .catch((err) => {
                            this.notify(err.response.data.message);
                            this.setState({loading: false});
                        });
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
        const {downloadOption, pageItemCnt, startDate, endDate} = this.state;
        const today = moment().format('YYYY-MM-DD');

        if (activeTabInd === 0) { // All tab
            this.props.setAllGetBookingsFilter('*', today, 0, 0, 0, pageItemCnt, 0, '-id', {}, 0, '', downloadOption);
        } else if (
            activeTabInd === 8 ||   // Pre-Processing
            activeTabInd === 81 ||  // Processing
            activeTabInd === 9 ||   // Unprinted Lables
            activeTabInd === 11 ||  // Parent bookings (in progress)
            activeTabInd === 3 ||   // Manifest
            activeTabInd === 40 ||  // Booked
            activeTabInd === 41 ||  // Cancel Requested
            activeTabInd === 42 ||  // In Transit
            activeTabInd === 43 ||  // On Hold
            activeTabInd === 12 ||  // Delivered
            activeTabInd === 90 ||  // Returning
            activeTabInd === 91 ||  // Returned
            activeTabInd === 5 ||   // Closed
            activeTabInd === 51     // Closed with Issue
        ) {
            this.props.setAllGetBookingsFilter('*', today, 0, 0, 0, pageItemCnt, 0, '-id', {}, activeTabInd);
        } else if (activeTabInd === 7) { // Today
            this.props.setAllGetBookingsFilter(startDate, endDate, 0, 0, 0, pageItemCnt, 0, '-id', {}, activeTabInd);
        } else if (activeTabInd === 6) { // Delivery Management
            this.props.setAllGetBookingsFilter('*', '*', 0, 0, 0, pageItemCnt, 0, '-id', {}, activeTabInd);
        } else if (activeTabInd === 10) { // More tab
            this.toggleStatusInfoSlider();
        } else {
            this.props.setGetBookingsFilter('activeTabInd', activeTabInd);
            this.props.setGetBookingsFilter('columnFilters', {});
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
                            if (_vx_freight_provider.toUpperCase() === 'TASFR') {
                                this.buildXML(bookingIds, 'TASFR')
                                    .then((response) => {
                                        if (response.data.error && response.data.error === 'Found set has booked bookings') {
                                            this.notify('Listed are some bookings that should not be processed because they have already been booked\n' + response.data.booked_list);
                                            this.setState({loadingDownload: false});
                                        } else if (response.data.success && response.data.success === 'success') {
                                            this.notify('XML’s have been generated successfully.');
                                            this.setState({loading: true, loadingDownload: false});
                                            this.props.setNeedUpdateBookingsState(true);
                                        } else {
                                            this.notify('XML’s have been generated successfully. Labels will be generated');
                                            this.buildPDF(bookingIds, 'TASFR');
                                        }
                                    });
                            } else {
                                this.setState({loading: true, loadingDownload: false});
                                this.props.setNeedUpdateBookingsState(true);
                            }
                        })
                        .catch((err) => {
                            this.notify('Error: ' + err);
                            this.setState({loadingDownload: false});
                        });
                }
            }
        }

        this.setState({
            selectedBookingIds2Order: selectedBookingIds,
            allCheckStatus: 'None',
            selectedFP2Order: _vx_freight_provider,
            selectedBookingIds: [],
        });
    }

    onClickDownloadExcel() {
        this.toggleXLSModal();
    }

    onClickBOOK() {
        const { selectedBookingIds, dmeClients } = this.state;
        const { bookings } = this.props;

        if (selectedBookingIds && selectedBookingIds.length === 0) {
            this.notify('Please select bookings to BOOK.');
        } else if (selectedBookingIds.length > 500) {
            this.notify('You can generate XML or CSV with 500 bookings at most.');
        } else {
            const bookedBookings = [];
            const ids4csv = [];
            const ids4xml = [];
            const ids4notMatchFP = [];
            const noFPBookings = [];
            const fps = [];
            const selectedBookings = [];

            for (let i = 0; i < bookings.length; i++) {
                for (let j = 0; j < selectedBookingIds.length; j++) {
                    if (bookings[i].id === selectedBookingIds[j]) {
                        if (!bookings[i].vx_freight_provider) {
                            noFPBookings.push(bookings[i].b_bookingID_Visual);
                        } else if (indexOf(fps, bookings[i].vx_freight_provider) == -1) {
                            fps.push(bookings[i].vx_freight_provider);
                        }

                        if (!isNull(bookings[i].b_dateBookedDate)) {
                            bookedBookings.push(bookings[i].b_bookingID_Visual);
                        }

                        selectedBookings.push(bookings[i]);
                    }
                }
            }

            if (noFPBookings.length > 0) {
                this.notify('There are bookings without Freight Provider: ' + noFPBookings);
            } else if (fps.length !== 1) {
                this.notify('Please select only one kind `Freight Provider` bookings.');
            } else if (bookedBookings.length) {
                this.notify('There are already BOOK(ed) bookings: ' + bookedBookings);
            } else {
                for (let i = 0; i < selectedBookings.length; i++) {
                    for (let j = 0; j < dmeClients.length; j++) {
                        if (
                            selectedBookings[i].b_client_name && dmeClients[j].company_name &&
                            selectedBookings[i].b_client_name.toLowerCase() === dmeClients[j].company_name.toLowerCase()
                        ) {
                            const freight_provider = selectedBookings[i].vx_freight_provider.toLowerCase();

                            if (
                                !isNull(dmeClients[j].current_freight_provider) &&
                                dmeClients[j].current_freight_provider.toLowerCase() === freight_provider
                            ) {
                                if (freight_provider === 'cope' || freight_provider === 'dhl') {
                                    ids4csv.push(selectedBookings[i].id);
                                } else if (freight_provider === 'allied') {
                                    ids4xml.push(selectedBookings[i].id);
                                } else {
                                    ids4notMatchFP.push(selectedBookings[i].id);
                                }
                            } else {
                                if (freight_provider === 'state transport') {
                                    ids4csv.push(selectedBookings[i].id);
                                } else {
                                    ids4notMatchFP.push(selectedBookings[i].id);
                                }
                            }
                        }
                    }
                }

                if (ids4notMatchFP.length) {
                    this.notify('There are bookings not to be handled: ' + ids4notMatchFP);
                } else {
                    this.setState({loadingDownload: true});
                    this.bulkBookingUpdate(selectedBookingIds, 'b_error_Capture', '')
                        .then(() => {
                            Promise.all([
                                this.buildCSV(ids4csv, fps[0].toLowerCase()),
                                this.buildXML(ids4xml, 'allied'),
                            ])
                                .then(() => {
                                    if (ids4csv.length) {
                                        this.notify('Successfully created CSV.');

                                        if (fps[0].toLowerCase() === 'dhl') {
                                            this.buildPDF(ids4csv, fps[0].toLowerCase());
                                        }
                                    }

                                    if (ids4xml.length) {
                                        this.notify('Successfully created XML.');
                                    }

                                    this.setState({loading: true, loadingDownload: false, selectedBookingIds: []});
                                    this.props.setNeedUpdateBookingsState(true);
                                })
                                .catch((err) => {
                                    this.notify(err);
                                    this.setState({loading: true, loadingDownload: false, selectedBookingIds: []});
                                    this.props.setNeedUpdateBookingsState(true);
                                    console.log('#107 - ', err);
                                });
                        })
                        .catch((err) => {
                            this.setState({loading: true, loadingDownload: false, selectedBookingIds: []});
                            this.props.setNeedUpdateBookingsState(true);
                            console.log('#108 - ', err);
                        });
                }
            }
        }
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

    buildCSV(bookingIds, vx_freight_provider) {
        return new Promise((resolve, reject) => {
            const token = localStorage.getItem('token');
            const options = {
                method: 'post',
                url: HTTP_PROTOCOL + '://' + API_HOST + '/get-csv/',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
                data: {bookingIds, vx_freight_provider},
                responseType: 'blob', // important
            };

            axios(options)
                .then((response) => {
                    console.log('get-csv response: ', response);
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    buildXML(bookingIds, vx_freight_provider) {
        const token = localStorage.getItem('token');
        const options = {
            method: 'post',
            url: HTTP_PROTOCOL + '://' + API_HOST + '/get-xml/',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
            data: {bookingIds, vx_freight_provider},
        };

        return axios(options);
    }

    buildPDF(bookingIds, vx_freight_provider) {
        const token = localStorage.getItem('token');
        const options = {
            method: 'post',
            url: HTTP_PROTOCOL + '://' + API_HOST + '/get-pdf/',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
            data: {bookingIds, vx_freight_provider},
        };

        axios(options)
            .then((response) => {
                if (response.data.success && response.data.success === 'success') {
                    this.notify('Label(.pdf) have been generated successfully.');
                    this.props.setNeedUpdateBookingsState(true);
                } else {
                    this.notify('Label(.pdf) have *NOT* been generated.');
                    this.props.setNeedUpdateBookingsState(true);
                }
            })
            .catch((err) => {
                this.notify('Error: ' + err);
                this.props.setNeedUpdateBookingsState(true);
            });
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

    onClickMANI() {
        const {selectedBookingIds} = this.state;
        const {clientname} = this.props;

        if (selectedBookingIds.length === 0) {
            this.notify('Please select bookings to create Order!');
        } else {
            this.props.getBookingLinesCnt(selectedBookingIds);

            if (clientname === 'dme' || clientname === 'Jason L' || clientname === 'Bathroom Sales Direct') {
                this.toggleManifestSlider();
            } else {
                this.toggleOrderModal();
            }
        }
    }

    onClickGear() {
        this.setState({showGearMenu: true});
    }

    onDownloadOptionChange(e) {
        this.props.setGetBookingsFilter('downloadOption', e.target.value);
        this.setState({downloadOption: e.target.value});
    }

    onClickLink(num, b_bookingID_Visual) {
        if (num === 0)
            this.props.history.push('/booking?bookingId=' + b_bookingID_Visual);
        else if (num === 1)
            this.props.history.push('/booking?bookingId=' + b_bookingID_Visual);
    }

    onClickStatusLock(booking) {
        const { clientname } = this.state;

        if (clientname === 'dme') {
            if (booking.b_status_API === 'POD Delivered') {
                this.setState({selectedOneBooking: booking}, () => this.toggleStatusLockModal());
            } else {
                this.onChangeStatusLock(booking);
            }
        } else {
            this.notify('Locked status only allowed by dme user');
        }
    }

    onChangeStatusLock(booking) {
        if (booking.b_status_API === 'POD Delivered') {
            this.toggleStatusLockModal();
        }

        booking.z_lock_status = !booking.z_lock_status;
        booking.z_locked_status_time = moment().utc().format('YYYY-MM-DD HH:mm');

        if (!booking.z_lock_status) {
            booking.b_status_API = 'status update ' + moment().utc().format('DD_MM_YYYY');
        }

        this.props.updateBooking(booking.id, booking);
    }

    onClickPencil(type, booking) {
        if (type === 'manifest_timestamp' || type === 'b_dateBookedDate') {
            let editCellPopoverOpens = this.state.editCellPopoverOpens;
            let flag = editCellPopoverOpens['edit-cell-popover-' + booking.id];
            editCellPopoverOpens = [];

            if (flag)
                editCellPopoverOpens['edit-cell-popover-' + booking.id] = false;
            else
                editCellPopoverOpens['edit-cell-popover-' + booking.id] = true;

            this.setState({ additionalInfoOpens: [], bookingLinesInfoOpens: [], bookingLineDetails: [], linkPopoverOpens: [], editCellPopoverOpens });
        } else if (type === 'b_bookingID_Visual') {
            this.setState({selectedBooking: booking});
            this.toggleSurchargeSlider();
        }
    }

    // onClickChangeStatusButton() {
    //     const {selectedStatusValue, selectedBookingIds} = this.state;

    //     if (!selectedStatusValue) {
    //         this.notify('Please select a status.');
    //     } else if (selectedBookingIds.length === 0) {
    //         this.notify('Please select at least one booking.');
    //     } else if (selectedBookingIds.length > 25) {
    //         this.notify('You can change 25 bookings status at a time.');
    //     } else {
    //         this.props.changeBookingsStatus(selectedStatusValue, selectedBookingIds);
    //         this.setState({loading: true, selectedBookingIds: [], allCheckStatus: 'None'});
    //     }
    // }

    onClickCalcCollected(type) {
        const {selectedBookingIds} = this.state;

        if (selectedBookingIds.length === 0) {
            this.notify('Please select at least one booking!');
        } else {
            if (type === 'Calc') {
                this.props.calcCollected(selectedBookingIds, 'Calc');
            } else if (type === 'Clear') {
                this.props.calcCollected(selectedBookingIds, 'Clear');
            }
        }

        this.setState({selectedBookingIds: []});
    }

    onClickRow(booking) {
        const { downloadOption } = this.state;

        if (downloadOption === 'check_pod') {
            this.setState({selectedOneBooking: booking});
            this.toggleCheckPodModal();
        }

        this.setState({activeBookingId: booking.id});
    }

    onClickShowStatusInfo(startDate, endDate, clientPK, dme_delivery_status) {
        this.toggleStatusInfoSlider();
        this.props.setAllGetBookingsFilter(moment(startDate).format('YYYY-MM-DD'), moment(endDate).format('YYYY-MM-DD'), clientPK, 0, 0, this.state.pageItemCnt, 0, '-id', {}, 6, '', 'label', dme_delivery_status);
    }

    onClickSetProjectsName() {
        const { selectedBookingIds } = this.state;
        if (selectedBookingIds.length > 0) {
            this.toggleProjectNameModal();
        } else {
            this.notify('Please select at least one booking');
        }
    }

    onUpdateProjectsName(name) {
        const { selectedBookingIds } = this.state;
        this.bulkBookingUpdate(selectedBookingIds, 'b_booking_project', name)
            .then(() => {
                this.toggleProjectNameModal();
                this.notify('Successfully updated!');
                this.props.setNeedUpdateBookingsState(true);
                this.props.getAllProjectNames();
            })
            .catch(() => {
                this.notify('Failed operation!');
            });
    }

    onClickShowBulkUpdateButton() {
        const { selectedBookingIds, clientname } = this.state;

        if (selectedBookingIds.length === 0) {
            this.notify('Please select at least one booking');
        } else if (selectedBookingIds.length > 1000) {
            this.notify('Bulk operation can process 1000 bookings at once');
        } else {
            if (clientname === 'Jason L') {
                const bookings = this.getBookingsFromIds(selectedBookingIds);
                const bookedBookings = bookings.filter(booking => !isNull(booking.b_dateBookedDate));

                if (bookedBookings.length > 0) {
                    this.notify('Booked bookings are selected!');
                    return;
                }
            } else if (clientname === 'Bathroom Sales Direct') {
                const bookings = this.getBookingsFromIds(selectedBookingIds);
                const bookedBookings = bookings.filter(booking => booking.b_status === 'Delivered');

                if (bookedBookings.length > 0) {
                    this.notify('Delivered bookings are selected! (If you want to change Delivered bookings, please contact support center.)');
                    return;
                }
            }

            this.toggleBulkUpdateSlider();
        }
    }

    onClickPricingAnalyse() {
        this.togglePricingAnalyseSlider();
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

    onClickPagination(pageInd) {
        this.props.setGetBookingsFilter('pageInd', pageInd);
    }

    onClickBookingSet() {
        if (this.state.selectedBookingIds.length === 0) {
            this.notify('Please select bookings!');
        } else {
            this.props.getBookingSets();
            this.toggleBookingSetModal();
        }
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

    onClickUseCheapest(cheapest_quote, booking) {
        this.onBulkUpdate('vx_freight_provider', cheapest_quote.fp, [booking.id])
            .then(() => {
                this.onClickFind();
            })
            .catch((err) => {
                this.notify(err.response.data.message);
                this.setState({loading: false});
            });
        this.setState({loading: true, isShowBulkUpdateSlider: false});
    }

    onCopyToClipboard(e, data, type) {
        e.preventDefault();

        if (data) {
            let finalData = '';

            if (type === 'text') {
                finalData = data;
            } else if (type === 'bookingIds') {
                // Data is selected bookingIDs
                data.forEach((item) => finalData += item + '\n');
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
            isShowXLSModal, isShowProjectNameModal, clientname, isShowStatusLockModal, selectedOneBooking, activeBookingId,
            projectNames, projectName, allCheckStatus } = this.state;
        const { bookings, bookingsets, allBookingStatus, filteredBookingIds, bookingsSummary, allFPs } = this.props;

        // Table width
        const tblContentWidthVal = 'calc(100% + ' + scrollLeft + 'px)';
        const tblContentWidth = {width: tblContentWidthVal};

        // DateRange marge-left
        // console.log('@1 - ', 182 - scrollLeft);
        // if (this.drRef.current) {
        //     console.log(this.drRef);
        //     this.drRef.current.style.marginLeft = 182 - scrollLeft;
        // }

        const selectedBookings = this.getBookingsFromIds(selectedBookingIds);

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

        const projectNameOptions = projectNames
            .map((name, index) => (<option key={index} value={name}>{name}</option>));

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

        const bookingLinesList = bookingLines.map((bookingLine, index) =>
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
            ));

        const bookingsList = bookings.map((booking, index) => {
            let priorityBgColor = '';
            let remainingTimeBgColor = '';

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

            if (booking.remaining_time) {
                if (booking.remaining_time < 60)
                    remainingTimeBgColor = 'bg-lightred';
                else if (booking.remaining_time > 60 && booking.remaining_time < 120)
                    remainingTimeBgColor = 'bg-lightyellow';
                else if (booking.remaining_time > 120)
                    remainingTimeBgColor = 'bg-lightblue';
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
                                        { bookingLinesList }
                                    </tbody>
                                </table>
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
                        hideArrow={true} >
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
                            onClick={() => this.onClickLink(0, booking.b_bookingID_Visual)}
                        >
                            {booking.b_bookingID_Visual}
                        </span>
                        <i
                            className={booking.surcharge_cnt === 0 ? 'fa fa-columns c-gray' : 'fa fa-columns'}
                            title='Linked Services Slider'
                            onClick={() => this.onClickPencil('b_bookingID_Visual', booking)}>
                        </i>
                    </td>
                    <td name='vx_freight_provider' className={(sortField === 'vx_freight_provider') ? 'current' : ''}>{booking.vx_freight_provider} {booking.cost_dollar ? `($${booking.cost_dollar})` : ''}</td>
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
                    <Popover
                        isOpen={this.state.linkPopoverOpens['link-popover-' + booking.id]}
                        target={'link-popover-' + booking.id}
                        placement="right"
                        hideArrow={true} >
                        <PopoverBody>
                            <div className="links-div">
                                <Button color="primary" onClick={() => this.onClickLink(0, booking.b_bookingID_Visual)}>Go to Detail</Button>
                            </div>
                        </PopoverBody>
                    </Popover>
                    <td
                        name='puPickUpAvailFrom_Date' 
                        id={'edit-cell-popover-' + booking.id}
                        className={(sortField === 'puPickUpAvailFrom_Date') ? 'current' : ''}
                    >
                        {booking.puPickUpAvailFrom_Date ? moment(booking.puPickUpAvailFrom_Date).format('ddd DD MMM YYYY'): ''}
                        {
                            booking.b_client_name && booking.b_client_name.toLowerCase() == 'biopak' ?
                                booking.manifest_timestamp ?
                                    null
                                    :
                                    <i className="icon icon-pencil" onClick={() => this.onClickPencil('manifest_timestamp', booking)}></i>
                                :
                                booking.b_dateBookedDate ?
                                    null
                                    :
                                    <i className="icon icon-pencil" onClick={() => this.onClickPencil('b_dateBookedDate', booking)}></i>
                        }
                    </td>
                    <EditablePopover 
                        isOpen={this.state.editCellPopoverOpens['edit-cell-popover-' + booking.id]}
                        booking={booking}
                        key={booking.id}
                        onCancel={this.togglePopover}
                        onChange={(bookingId, booking) => this.props.updateBooking(bookingId, booking)}
                        inputType={'datepicker'}
                        fieldName={'puPickUpAvailFrom_Date'}
                    />
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
                    <td name='z_connote_url' className={
                        !isEmpty(booking.z_connote_url) ?
                            (!isEmpty(booking.z_downloaded_connote_timestamp)) ? 'bg-yellow' : 'dark-blue'
                            :
                            null
                    }>
                        {
                            !isEmpty(booking.z_connote_url) ?
                                <div className="pod-status">
                                    <i className="icon icon-image"></i>
                                </div>
                                :
                                null
                        }
                    </td>
                    <td name='z_manifest_url' className={
                        booking.z_manifest_url ?
                            (!isNull(booking.manifest_timestamp)) ? 'bg-yellow' : 'dark-blue'
                            :
                            null
                    }>
                        {(booking.z_manifest_url && booking.z_manifest_url.length > 0) ?
                            <div className="booking-status">
                                <a onClick={() => this.onClickLabelOrPOD(booking, 'manifest')}>M</a>
                            </div>
                            :
                            null
                        }
                    </td>
                    <td name='b_is_flagged_add_on_services' className={booking.b_is_flagged_add_on_services ? 'bg-yellow' : null}>
                        {booking.b_is_flagged_add_on_services ? <div className="pod-status">F</div> : null}
                    </td>
                    <td name='manifest_timestamp' className={(sortField === 'manifest_timestamp') ? 'current' : ''}>
                        {booking.manifest_timestamp ? moment(booking.manifest_timestamp).format('DD/MM/YYYY HH:mm') : null}
                    </td>
                    <td name='b_client_sales_inv_num' className={(sortField === 'b_client_sales_inv_num') ? 'current' : ''}>{booking.b_client_sales_inv_num}</td>
                    <td name='vx_serviceName' className={(sortField === 'vx_serviceName') ? 'current' : ''}>{booking.vx_serviceName}</td>
                    <td name='cheapest_freight_provider'>
                        <strong>{booking.cheapest_quote.fp ? `${booking.cheapest_quote.fp} ($${booking.cheapest_quote.cost_dollar})` : ''}</strong>
                        {booking.cheapest_quote.fp && <button className='btn btn-primary btn-use-cheapest-quote' onClick={() => this.onClickUseCheapest(booking.cheapest_quote, booking)}>USE</button>}
                    </td>
                    <td name='z_lock_status' className={booking.z_lock_status ? 'status-active' : 'status-inactive'} onClick={() => this.onClickStatusLock(booking)}>
                        <i className="fa fa-lock"></i>
                    </td>
                    <td name='b_status_category' className={(sortField === 'b_status_category') ? 'current' : ''} id={'booking-' + 'b_status_category' + '-tooltip-' + booking.id}>
                        <p className="status">{booking.b_status_category}</p>
                        {!isEmpty(booking.b_status_category) &&
                            <TooltipItem object={booking} fields={['b_status_category']} />
                        }
                    </td>
                    <td name='pu_PickUp_By_Date' className={(sortField === 'pu_PickUp_By_Date') ? 'current' : ''}>
                        {booking.pu_PickUp_By_Date ? moment(booking.pu_PickUp_By_Date).format('DD/MM/YYYY') : ''}
                    </td>
                    <td name='de_Deliver_By_Date' className={(sortField === 'de_Deliver_By_Date') ? 'current' : ''}>
                        {booking.de_Deliver_By_Date ? moment(booking.de_Deliver_By_Date).format('DD/MM/YYYY') : ''}
                    </td>
                    <td name='de_Deliver_By_Time'>{booking.de_Deliver_By_Time}</td>
                    <td name='remaining_time' className={remainingTimeBgColor}>{booking.remaining_time}</td>
                    <td
                        name='de_Deliver_From_Date'
                        id={'booking-' + 'de_Deliver_From_Date' + '-tooltip-' + booking.id}
                        className={(sortField === 'delivery_booking') ? 'current' : ''}
                    >
                        <p>{booking.fp_store_event_date ? moment(booking.fp_store_event_date).format('DD/MM/YYYY') : null}</p>
                    </td>
                    <td name='b_given_to_transport_date_time' className={(sortField === 'b_given_to_transport_date_time') ? 'current' : ''}>
                        {booking.b_given_to_transport_date_time ? moment(booking.b_given_to_transport_date_time).format('DD/MM/YYYY HH:mm') : ''}
                    </td>
                    <td name='fp_received_date_time' className={(sortField === 'fp_received_date_time') ? 'current' : ''}>
                        {booking.fp_received_date_time ? moment(booking.fp_received_date_time).format('DD/MM/YYYY HH:mm') : ''}
                    </td>
                    <td name='s_21_Actual_Delivery_TimeStamp' className={(sortField === 's_21_Actual_Delivery_TimeStamp') ? 'current' : ''}>
                        {booking.s_21_Actual_Delivery_TimeStamp ? moment(booking.s_21_Actual_Delivery_TimeStamp).format('DD/MM/YYYY HH:mm') : ''}
                    </td>
                    <td
                        name='dme_status_detail' 
                        id={'booking-' + 'dme_status_detail' + '-tooltip-' + booking.id}
                        className={(sortField === 'dme_status_detail') ? 'current nowrap' : 'nowrap'}
                    >
                        {booking.dme_status_detail}
                        {!isEmpty(booking.dme_status_detail) &&
                            <TooltipItem object={booking} fields={['dme_status_detail']} />
                        }
                    </td>
                    <td 
                        name='dme_status_action'
                        id={'booking-' + 'dme_status_action' + '-tooltip-' + booking.id}
                        className={(sortField === 'dme_status_action') ? 'current' : ''}
                    >
                        {booking.dme_status_action}
                        {!isEmpty(booking.dme_status_action) &&
                            <TooltipItem object={booking} fields={['dme_status_action']} />
                        }
                    </td>
                    <td name='s_06_Latest_Delivery_Date_TimeSet' className={(sortField === 's_06_Latest_Delivery_Date_TimeSet') ? 'current' : ''}>
                        {booking.s_06_Latest_Delivery_Date_TimeSet ? moment(booking.s_06_Latest_Delivery_Date_TimeSet).format('DD/MM/YYYY HH:mm') : ''}
                    </td>
                    <td name='s_06_Latest_Delivery_Date_Time_Override' className={(sortField === 's_06_Latest_Delivery_Date_Time_Override') ? 'current' : ''}>
                        {booking.s_06_Latest_Delivery_Date_Time_Override ? moment(booking.s_06_Latest_Delivery_Date_Time_Override).format('DD/MM/YYYY HH:mm') : ''}
                    </td>
                    <td 
                        name='de_to_PickUp_Instructions_Address'
                        id={'booking-' + 'de_to_PickUp_Instructions_Address' + '-tooltip-' + booking.id}
                        className={(sortField === 'de_to_PickUp_Instructions_Address') ? 'current nowrap' : 'nowrap'}
                    >
                        {booking.de_to_PickUp_Instructions_Address}
                        {!isEmpty(booking.de_to_PickUp_Instructions_Address) &&
                            <TooltipItem object={booking} fields={['de_to_PickUp_Instructions_Address']} />
                        }
                    </td>
                    <td 
                        name='b_booking_project'
                        id={'booking-' + 'b_booking_project' + '-tooltip-' + booking.id}
                        className={(sortField === 'b_booking_project') ? 'current nowrap' : 'nowrap'}
                    >
                        {booking.b_booking_project}
                        {!isEmpty(booking.b_booking_project) &&
                            <TooltipItem object={booking} fields={['b_booking_project']} />
                        }
                    </td>
                    <td name='b_project_due_date' className={(sortField === 'b_project_due_date') ? 'current nowrap' : 'nowrap'}>
                        {booking.b_project_due_date ? moment(booking.b_project_due_date).format('DD/MM/YYYY') : null}
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
                                <li><Link to="/booking">Header</Link></li>
                                <li className="active"><Link to="/allbookings">All Bookings</Link></li>
                                <li className=""><a href="/bookingsets">Booking Sets</a></li>
                                <li className=""><Link to="/pods">PODs</Link></li>
                                {clientname === 'dme' && <li className=""><Link to="/zoho">Zoho</Link></li>}
                                <li className=""><Link to="/reports">Reports</Link></li>
                                <li className="none"><a href="/bookinglines">Booking Lines</a></li>
                                <li className="none"><a href="/bookinglinedetails">Booking Line Data</a></li>
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

                            <div className="popup" onClick={() => this.onClickSimpleSearch(1)}>
                                <i className="icon-cog2" aria-hidden="true"></i>
                                {this.state.showGearMenu &&
                                    <div ref={this.setWrapperRef}>
                                        <div className="popuptext1">
                                            <button 
                                                className="btn btn-primary" 
                                                onClick={() => this.onClickCalcCollected('Calc')}
                                                disabled={(selectedBookingIds.length > 0) ? '' : true}
                                            >
                                                Calc Collected
                                            </button>
                                            <button 
                                                className="btn btn-primary" 
                                                onClick={() => this.onClickCalcCollected('Clear')}
                                                disabled={(selectedBookingIds.length > 0) ? '' : true}
                                            >
                                                Clear Collected
                                            </button>
                                            <button 
                                                className="btn btn-primary" 
                                                onClick={() => this.onClickSetProjectsName()}
                                            >
                                                Set Vehicle Loaded
                                            </button>
                                        </div>
                                    </div>
                                }
                            </div>
                            <a className="none" href=""><i className="icon-calendar3" aria-hidden="true"></i></a>
                            <a className={clientname === 'dme' ? '' : 'none'} onClick={() => this.onClickDownloadExcel()}>
                                <span title="Build XLS report">
                                    <i className="fa fa-file-excel" aria-hidden="true"></i>
                                </span>
                            </a>
                            <a className={clientname === 'dme' ? '' : 'none'} onClick={() => this.onClickBOOK()}>BOOK</a>
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
                            <a
                                className={clientname && clientname === 'dme' ? '' : 'none'} 
                                onClick={() => this.onClickBookingSet()}
                            >
                                <span title="Build a booking set"><i className="fa fa-layer-group"></i></span>
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
                                            <label className="right-10px">
                                                Vehicle Loaded: 
                                                <select 
                                                    id="project-name-select" 
                                                    required 
                                                    onChange={(e) => this.onSelected(e, 'projectName')} 
                                                    value = {projectName ? projectName : ''}
                                                >
                                                    <option value="" disabled hidden>Select a Vehicle Loaded</option>
                                                    { projectNameOptions }
                                                </select>
                                            </label>
                                            <button className="btn btn-primary left-10px right-50px" onClick={() => this.onClickFind()}><i className="fa fa-search"></i> Find</button>
                                            {(clientname === 'dme' || clientname === 'Jason L' || clientname === 'Bathroom Sales Direct') &&
                                                <div className="disp-inline-block">
                                                    <button className="btn btn-primary left-10px right-10px" onClick={() => this.onClickShowBulkUpdateButton()}>Update(bulk)</button>
                                                </div>
                                            }
                                            {((clientname === 'dme' || clientname === 'Jason L' || clientname === 'Bathroom Sales Direct') && (activeTabInd === 3 || activeTabInd === 7)) &&
                                                <div className="disp-inline-block">
                                                    <button className="btn btn-primary left-10px right-10px" onClick={() => this.onClickShowManifestSliderButton()}>Manifest</button>
                                                </div>
                                            }
                                            {(clientname === 'dme' || clientname === 'biopak') &&
                                                <div className="disp-inline-block none">
                                                    <button className="btn btn-primary " onClick={() => this.onClickPricingAnalyse()}>Price Analysis</button>
                                                    <div className="disp-inline-block">
                                                        <LoadingOverlay
                                                            active={false}
                                                            spinner={<BarLoader color={'#FFF'} />}
                                                            text=''
                                                        >
                                                            <button className="btn btn-primary all-trigger none" onClick={() => this.onClickAllTrigger()}>All trigger</button>
                                                            <button className="btn btn-primary get-label" onClick={() => this.onClickGetLabel()}>Get Label</button>
                                                            <button className="btn btn-primary map-bok1-to-bookings" onClick={() => this.onClickMapBok1ToBookings()}>Map Bok_1 to Bookings</button>
                                                            <button className="btn btn-primary" onClick={() => this.showMap(this.props.bookings)} disabled={this.state.activeTabInd === 0 ? false : true}>Display on map</button>
                                                        </LoadingOverlay>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                        <div className="tabs">
                                            <div className="scrollmenu">
                                                <a className={activeTabInd === 0 ? 'active none' : 'none'} onClick={() => this.onClickTab(0)}>All</a>
                                                <a className={activeTabInd === 7 ? 'active' : ''} onClick={() => this.onClickTab(7)}>Today | Date Range</a>
                                                <a className={activeTabInd === 8 ? 'active' : ''} onClick={() => this.onClickTab(8)}>Pre-Processing</a>
                                                <a className={activeTabInd === 81 ? 'active' : ''} onClick={() => this.onClickTab(81)}>Processing</a>
                                                <a className={activeTabInd === 9 ? 'active' : ''} onClick={() => this.onClickTab(9)}>Unprinted Labels</a>
                                                <a className={activeTabInd === 1 ? 'active' : ''} onClick={() => this.onClickTab(1)}>Errors to Correct</a>
                                                <a className={activeTabInd === 2 ? 'active' : ''} onClick={() => this.onClickTab(2)}>Missing Labels</a>
                                                <a className={activeTabInd === 3 ? 'active' : ''} onClick={() => this.onClickTab(3)}>To Manifest</a>
                                                <a className={activeTabInd === 40 ? 'active' : ''} onClick={() => this.onClickTab(40)}>Booked</a>
                                                <a className={activeTabInd === 41 ? 'active' : ''} onClick={() => this.onClickTab(41)}>Cancel Requested</a>
                                                <a className={activeTabInd === 42 ? 'active' : ''} onClick={() => this.onClickTab(42)}>In Transit</a>
                                                <a className={activeTabInd === 43 ? 'active' : ''} onClick={() => this.onClickTab(43)}>On Hold</a>
                                                <a className={activeTabInd === 12 ? 'active' : ''} onClick={() => this.onClickTab(12)}>Delivered</a>
                                                <a className={activeTabInd === 90 ? 'active' : ''} onClick={() => this.onClickTab(90)}>Returning</a>
                                                <a className={activeTabInd === 91 ? 'active' : ''} onClick={() => this.onClickTab(91)}>Returned</a>
                                                <a className={activeTabInd === 5 ? 'active' : ''} onClick={() => this.onClickTab(5)}>Closed</a>
                                                <a className={activeTabInd === 51 ? 'active' : ''} onClick={() => this.onClickTab(51)}>Closed with Issue</a>
                                                <a className={activeTabInd === 11 ? 'active' : ''} onClick={() => this.onClickTab(11)}>Parents (In Progress)</a>
                                                {(clientname === 'dme') &&
                                                    <a className={activeTabInd === 6 ? 'active' : ''} onClick={() => this.onClickTab(6)}>Delivery Management</a>
                                                }
                                                <a className={activeTabInd === 10 ? 'active' : ''} onClick={() => this.onClickTab(10)}>
                                                    More {this.state.dmeStatus && ' (' + this.state.dmeStatus + ')'}
                                                </a>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className='row'>
                                            <div className="col-sm-6 tbl-stats">
                                                <select value={downloadOption} onChange={(e) => this.onDownloadOptionChange(e)} className="download-select">
                                                    <option value="label">Label</option>
                                                    <option value="new_label">New Label</option>
                                                    <option value="pod">POD</option>
                                                    <option value="new_pod">New POD</option>
                                                    <option value="pod_sog">POD SOG</option>
                                                    <option value="new_pod_sog">New POD SOG</option>
                                                    <option value="connote">Connote</option>
                                                    <option value="new_connote">New Connote</option>
                                                    <option value="label_and_connote">Label & Connote</option>
                                                    <option value="check_pod">Check POD</option>
                                                    <option value="flagged">Flagged</option>
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
                                                <button 
                                                    className={selectedBookingIds.length > 0 ? 'position-relative btn btn-success right-20px' : 'position-relative btn btn-gray right-20px'} 
                                                    disabled={selectedBookingIds.length === 0}
                                                    onClick={() => this.onClickSimpleSearch(2)}
                                                    title="Copy button"
                                                >
                                                    <i className="fa fa-copy"></i>
                                                    {this.state.showCopyMenu &&
                                                        <div ref={this.setWrapperRef}>
                                                            <div className="copy-popup">
                                                                <button 
                                                                    className="btn btn-primary" 
                                                                    onClick={(e) => this.onCopyToClipboard(e, this.state.selectedBookingIds, 'bookingIds')}
                                                                    disabled={(selectedBookingIds.length > 0) ? '' : true}
                                                                >
                                                                    Booking IDs
                                                                </button>
                                                                <button 
                                                                    className="btn btn-primary" 
                                                                    onClick={(e) => this.onCopyToClipboard(e, this.state.selectedBookingIds, 'consignments')}
                                                                    disabled={(selectedBookingIds.length > 0) ? '' : true}
                                                                >
                                                                    Consignments
                                                                </button>
                                                            </div>
                                                        </div>
                                                    }
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
                                                                    id={'booking-column-header-tooltip-POD-or-POD-Signed'}
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
                                                                    <p>Pickup / Manifest</p>
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
                                                                    name="b_client_name_sub"
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
                                                                    name="z_connote_url"
                                                                    id={'booking-column-header-tooltip-Connote'}
                                                                    className={(sortField === 'z_connote_url') ? 'narrow-column current' : 'narrow-column'}
                                                                    onClick={() => this.onChangeSortField('z_connote_url')} 
                                                                >
                                                                    C
                                                                    <SimpleTooltipComponent text={'Connote'} />
                                                                </th>
                                                                <th
                                                                    name="z_manifest_url"
                                                                    id={'booking-column-header-tooltip-Manifest'}
                                                                    className={(sortField === 'z_manifest_url') ? 'narrow-column current' : 'narrow-column'}
                                                                    onClick={() => this.onChangeSortField('z_manifest_url')} 
                                                                >
                                                                    M
                                                                    <SimpleTooltipComponent text={'Manifest'} />
                                                                </th>
                                                                <th
                                                                    name="b_is_flagged_add_on_services"
                                                                    id={'booking-column-header-tooltip-Flagged'}
                                                                    className={(sortField === 'b_is_flagged_add_on_services') ? 'narrow-column current' : 'narrow-column'}
                                                                    onClick={() => this.onChangeSortField('b_is_flagged_add_on_services')} 
                                                                >
                                                                    F
                                                                    <SimpleTooltipComponent text={'Flagged'} />
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
                                                                <th
                                                                    name="cheapest_freight_provider"
                                                                    scope="col" 
                                                                    nowrap="true"
                                                                >
                                                                    <p>Cheapest FP</p>
                                                                </th>
                                                                <th name="z_lock_status" className=""><i className="fa fa-lock"></i></th>
                                                                <th
                                                                    name="b_status_category"
                                                                    className={(sortField === 'b_status_category') ? 'current' : ''}
                                                                    onClick={() => this.onChangeSortField('b_status_category')} 
                                                                    scope="col" 
                                                                    nowrap="true"
                                                                >
                                                                    <p>Status Category</p>
                                                                    {(sortField === 'b_status_category') ?
                                                                        (sortDirection > 0) ?
                                                                            <i className="fa fa-sort-up"></i>
                                                                            : <i className="fa fa-sort-down"></i>
                                                                        : <i className="fa fa-sort"></i>
                                                                    }
                                                                </th>
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
                                                                <th 
                                                                    name="de_Deliver_By_Date"
                                                                    className={(sortField === 'de_Deliver_By_Date') ? 'current' : ''}
                                                                    onClick={() => this.onChangeSortField('de_Deliver_By_Date')}
                                                                    scope="col" 
                                                                    nowrap="true"
                                                                >
                                                                    <p>Delivery Due</p>
                                                                    {(sortField === 'de_Deliver_By_Date') ?
                                                                        (sortDirection > 0) ?
                                                                            <i className="fa fa-sort-up"></i>
                                                                            : <i className="fa fa-sort-down"></i>
                                                                        : <i className="fa fa-sort"></i>
                                                                    }
                                                                </th>
                                                                <th name="de_Deliver_By_Time" scope="col" nowrap="true">
                                                                    <p>DE By Time</p>
                                                                </th>
                                                                <th name="remaining_time" scope="col" nowrap="true">
                                                                    <p>Delivery Due In</p>
                                                                </th>
                                                                <th 
                                                                    name="de_Deliver_From_Date"
                                                                    className={(sortField === 'delivery_booking') ? 'current' : ''}
                                                                    onClick={() => this.onChangeSortField('fp_store_event_date')}
                                                                    scope="col" 
                                                                    nowrap="true"
                                                                >
                                                                    <p>Delivery Booking</p>
                                                                    {(sortField === 'fp_store_event_date') ?
                                                                        (sortDirection > 0) ?
                                                                            <i className="fa fa-sort-up"></i>
                                                                            : <i className="fa fa-sort-down"></i>
                                                                        : <i className="fa fa-sort"></i>
                                                                    }
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
                                                                <th 
                                                                    name="fp_received_date_time"
                                                                    className={(sortField === 'fp_received_date_time') ? 'current' : ''}
                                                                    onClick={() => this.onChangeSortField('fp_received_date_time')} 
                                                                    scope="col"
                                                                >
                                                                    <p>Transport Received</p>
                                                                    {(sortField === 'fp_received_date_time') ?
                                                                        (sortDirection > 0) ?
                                                                            <i className="fa fa-sort-up"></i>
                                                                            : <i className="fa fa-sort-down"></i>
                                                                        : <i className="fa fa-sort"></i>
                                                                    }
                                                                </th>
                                                                <th 
                                                                    name="s_21_Actual_Delivery_TimeStamp"
                                                                    className={(sortField === 's_21_Actual_Delivery_TimeStamp') ? 'current' : ''} 
                                                                    onClick={() => this.onChangeSortField('s_21_Actual_Delivery_TimeStamp')} 
                                                                    scope="col"
                                                                >
                                                                    <p>Delivered</p>
                                                                    {(sortField === 's_21_Actual_Delivery_TimeStamp') ?
                                                                        (sortDirection > 0) ?
                                                                            <i className="fa fa-sort-up"></i>
                                                                            : <i className="fa fa-sort-down"></i>
                                                                        : <i className="fa fa-sort"></i>
                                                                    }
                                                                </th>
                                                                <th 
                                                                    name="dme_status_detail"
                                                                    className={(sortField === 'dme_status_detail') ? 'current' : ''}
                                                                    onClick={() => this.onChangeSortField('dme_status_detail')}
                                                                    scope="col" 
                                                                    nowrap="true"
                                                                >
                                                                    <p>Status Detail</p>
                                                                    {(sortField === 'dme_status_detail') ?
                                                                        (sortDirection > 0) ?
                                                                            <i className="fa fa-sort-up"></i>
                                                                            : <i className="fa fa-sort-down"></i>
                                                                        : <i className="fa fa-sort"></i>
                                                                    }
                                                                </th>
                                                                <th 
                                                                    name="dme_status_action"
                                                                    className={(sortField === 'dme_status_action') ? 'current' : ''}
                                                                    onClick={() => this.onChangeSortField('dme_status_action')}
                                                                    scope="col" 
                                                                    nowrap="true"
                                                                >
                                                                    <p>Status Action</p>
                                                                    {(sortField === 'dme_status_action') ?
                                                                        (sortDirection > 0) ?
                                                                            <i className="fa fa-sort-up"></i>
                                                                            : <i className="fa fa-sort-down"></i>
                                                                        : <i className="fa fa-sort"></i>
                                                                    }
                                                                </th>
                                                                <th 
                                                                    name="s_06_Latest_Delivery_Date_TimeSet"
                                                                    className={(sortField === 's_06_Latest_Delivery_Date_TimeSet') ? 'current' : ''}
                                                                    onClick={() => this.onChangeSortField('s_06_Latest_Delivery_Date_TimeSet')}
                                                                    scope="col" 
                                                                    nowrap="true"
                                                                >
                                                                    <p>Calculated DE ETA</p>
                                                                    {(sortField === 's_06_Latest_Delivery_Date_TimeSet') ?
                                                                        (sortDirection > 0) ?
                                                                            <i className="fa fa-sort-up"></i>
                                                                            : <i className="fa fa-sort-down"></i>
                                                                        : <i className="fa fa-sort"></i>
                                                                    }
                                                                </th>
                                                                <th 
                                                                    name="s_06_Latest_Delivery_Date_Time_Override"
                                                                    className={(sortField === 's_06_Latest_Delivery_Date_Time_Override') ? 'current' : ''}
                                                                    onClick={() => this.onChangeSortField('s_06_Latest_Delivery_Date_Time_Override')}
                                                                    scope="col" 
                                                                    nowrap="true"
                                                                >
                                                                    <p>Updated DE ETA</p>
                                                                    {(sortField === 's_06_Latest_Delivery_Date_Time_Override') ?
                                                                        (sortDirection > 0) ?
                                                                            <i className="fa fa-sort-up"></i>
                                                                            : <i className="fa fa-sort-down"></i>
                                                                        : <i className="fa fa-sort"></i>
                                                                    }
                                                                </th>
                                                                <th 
                                                                    name="de_to_PickUp_Instructions_Address"
                                                                    className={(sortField === 'de_to_PickUp_Instructions_Address') ? 'current' : ''}
                                                                    onClick={() => this.onChangeSortField('de_to_PickUp_Instructions_Address')}
                                                                    scope="col" 
                                                                    nowrap="true"
                                                                >
                                                                    <p>DE Instruction</p>
                                                                    {(sortField === 'de_to_PickUp_Instructions_Address') ?
                                                                        (sortDirection > 0) ?
                                                                            <i className="fa fa-sort-up"></i>
                                                                            : <i className="fa fa-sort-down"></i>
                                                                        : <i className="fa fa-sort"></i>
                                                                    }
                                                                </th>
                                                                <th 
                                                                    name="b_booking_project"
                                                                    className={(sortField === 'b_booking_project') ? 'current' : ''}
                                                                    onClick={() => this.onChangeSortField('b_booking_project')}
                                                                    scope="col" 
                                                                    nowrap="true"
                                                                >
                                                                    <p>Vehicle Loaded</p>
                                                                    {(sortField === 'b_booking_project') ?
                                                                        (sortDirection > 0) ?
                                                                            <i className="fa fa-sort-up"></i>
                                                                            : <i className="fa fa-sort-down"></i>
                                                                        : <i className="fa fa-sort"></i>
                                                                    }
                                                                </th>
                                                                <th 
                                                                    name="b_project_due_date"
                                                                    className={(sortField === 'b_project_due_date') ? 'current' : ''}
                                                                    onClick={() => this.onChangeSortField('b_project_due_date')}
                                                                    scope="col" 
                                                                    nowrap="true"
                                                                >
                                                                    <p>Vehicle Departure Date</p>
                                                                    {(sortField === 'b_project_due_date') ?
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
                                                                <th name="b_client_name_sub" scope="col"><input type="text" name="b_client_name_sub" value={filterInputs['b_client_name_sub'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                                <th name="z_connote_url"></th>
                                                                <th name="z_manifest_url"></th>
                                                                <th name="b_is_flagged_add_on_services"></th>
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
                                                                <th name="cheapest_freight_provider" scope="col"></th>
                                                                <th name="z_lock_status" className="narrow-column"></th>
                                                                <th name="b_status_category" scope="col"><input type="text" name="b_status_category" value={filterInputs['b_status_category'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                                <th name="pu_PickUp_By_Date" scope="col"><input type="text" name="pu_PickUp_By_Date" value={filterInputs['pu_PickUp_By_Date'] || ''} placeholder="20xx-xx-xx" onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                                <th name="de_Deliver_By_Date" scope="col"><input type="text" name="de_Deliver_By_Date" value={filterInputs['de_Deliver_By_Date'] || ''} placeholder="20xx-xx-xx" onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                                <th name="de_Deliver_By_Time" scope="col"></th>
                                                                <th name="remaining_time" scope="col">DD:HH:MM</th>
                                                                <th name="de_Deliver_From_Date" scope="col"><input type="text" name="delivery_booking" value={filterInputs['delivery_booking'] || ''} placeholder="20xx-xx-xx" onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                                <th name="b_given_to_transport_date_time" scope="col"><input type="text" name="b_given_to_transport_date_time" value={filterInputs['b_given_to_transport_date_time'] || ''} placeholder="20xx-xx-xx hh:mm" onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                                <th name="fp_received_date_time" scope="col"><input type="text" name="fp_received_date_time" value={filterInputs['fp_received_date_time'] || ''} placeholder="20xx-xx-xx hh:mm" onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                                <th name="s_21_Actual_Delivery_TimeStamp" scope="col"><input type="text" name="s_21_Actual_Delivery_TimeStamp" value={filterInputs['s_21_Actual_Delivery_TimeStamp'] || ''} placeholder="20xx-xx-xx hh:mm" onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                                <th name="dme_status_detail" scope="col"><input type="text" name="dme_status_detail" value={filterInputs['dme_status_detail'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                                <th name="dme_status_action" scope="col"><input type="text" name="dme_status_action" value={filterInputs['dme_status_action'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                                <th name="s_06_Latest_Delivery_Date_TimeSet" scope="col"><input type="text" name="s_06_Latest_Delivery_Date_TimeSet" value={filterInputs['s_06_Latest_Delivery_Date_TimeSet'] || ''} placeholder="20xx-xx-xx" onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                                <th name="s_06_Latest_Delivery_Date_Time_Override" scope="col"><input type="text" name="s_06_Latest_Delivery_Date_Time_Override" value={filterInputs['s_06_Latest_Delivery_Date_Time_Override'] || ''} placeholder="20xx-xx-xx" onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                                <th name="de_to_PickUp_Instructions_Address" scope="col"><input type="text" name="de_to_PickUp_Instructions_Address" value={filterInputs['de_to_PickUp_Instructions_Address'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                                <th name="b_booking_project" scope="col"><input type="text" name="b_booking_project" value={filterInputs['b_booking_project'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                                <th name="b_project_due_date" scope="col"><input type="text" name="b_project_due_date" value={filterInputs['b_project_due_date'] || ''} placeholder="20xx-xx-xx" onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
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

                <ProjectNameModal
                    isShowProjectNameModal={isShowProjectNameModal}
                    toggleProjectNameModal={this.toggleProjectNameModal}
                    onUpdate={(name) => this.onUpdateProjectsName(name)}
                />

                <XLSModal
                    isShowXLSModal={isShowXLSModal}
                    toggleXLSModal={this.toggleXLSModal}
                    allFPs={allFPs}
                    allClients={dmeClients}
                    clientname={clientname}
                    selectedBookingIds={this.state.selectedBookingIds}
                    generateXLS={(startDate, endDate, emailAddr, vx_freight_provider, report_type, showFieldName, useSelected, selectedBookingIds, pk_id_dme_client) => this.props.generateXLS(startDate, endDate, emailAddr, vx_freight_provider, report_type, showFieldName, useSelected, selectedBookingIds, pk_id_dme_client)}
                />

                <StatusLockModal
                    isOpen={isShowStatusLockModal}
                    toggleStatusLockModal={this.toggleStatusLockModal}
                    booking={selectedOneBooking}
                    onClickUpdate={(booking) => this.onChangeStatusLock(booking)}
                />

                <CheckPodModal
                    isOpen={this.state.isShowCheckPodModal}
                    toggleCheckPodModal={this.toggleCheckPodModal}
                    onClickSave={(id, booking) => this.props.updateBooking(id, booking)}
                    booking={this.state.selectedOneBooking}
                />

                <StatusInfoSlider
                    isOpen={this.state.isShowStatusInfoSlider}
                    toggleStatusInfoSlider={this.toggleStatusInfoSlider}
                    onClickShowStatusInfo={(startDate, endDate, clientPK, dme_delivery_status) => this.onClickShowStatusInfo(startDate, endDate, clientPK, dme_delivery_status)}
                    startDate={startDate ? startDate : ''}
                    endDate={endDate ? endDate : ''}
                />

                <FindModal
                    isOpen={this.state.isShowFindModal}
                    toggleFindModal={this.toggleFindModal}
                    onFind={(findMode, selectedFieldName, valueSet) => this.onMultiFind(findMode, selectedFieldName, valueSet)}
                    bookings={bookings}
                />

                <OrderModal
                    isOpen={this.state.isShowOrderModal}
                    toggle={this.toggleOrderModal}
                    selectedBookingIds={selectedBookingIds}
                    selectedBookingLinesCnt={this.state.selectedBookingLinesCnt}
                    bookings={bookings}
                    clientname={clientname}
                    onCreateOrder={(bookingIds, vx_freight_provider) => this.onCreateOrder(bookingIds, vx_freight_provider)}
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
                    allBookingStatus={allBookingStatus}
                    clientname={clientname}
                    fps={allFPs}
                    selectedBookingIds={selectedBookingIds}
                    onUpdate={(field, value, bookingIds, optionalValue) => this.onBulkUpdate(field, value, bookingIds, optionalValue)}
                />

                <PricingAnalyseSlider
                    isOpen={this.state.isShowPricingAnalyseSlider}
                    toggleSlider={this.togglePricingAnalyseSlider}
                    pricingAnalyses={this.state.pricingAnalyses}
                />

                <BookingSetModal
                    isOpen={this.state.isShowBookingSetModal}
                    toggle={this.toggleBookingSetModal}
                    notify={this.notify}
                    bookingIds={this.state.selectedBookingIds}
                    selectedBookings={selectedBookings}
                    bookingsets={bookingsets ? bookingsets : []}
                    createBookingSet={this.props.createBookingSet}
                    updateBookingSet={this.props.updateBookingSet}
                />

                <SurchargeSlider
                    isOpen={this.state.isShowSurchargeSlider}
                    toggleSlider={this.toggleSurchargeSlider}
                    booking={this.state.selectedBooking}
                    clientname={clientname}
                    fps={this.props.allFPs}
                />

                <ToastContainer />

                {/* <ReactstrapModal 
                    isOpen={!isEmpty(this.state.mapData)} 
                    className="bookingset-modal"
                    style={{
                        width: 800,
                        height: 800,
                        maxWidth: 800
                    }}
                >
                    <ModalHeader>Google map<a className="close-popover" onClick={() => this.setState({mapData: {}})}>x</a></ModalHeader>
                    <ModalBody style={{height: 770}}>
                        <Map 
                            center={this.state.mapData.center}
                            zoom={6}
                            markerInfos={this.state.mapData.markerInfos}
                            style={{
                                width: 'calc(100% - 30px)'
                            }}
                        />
                    </ModalBody>
                    <ModalFooter>
                    </ModalFooter>
                </ReactstrapModal> */}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        bookings: state.booking.bookings,
        filteredBookingIds: state.booking.filteredBookingIds,
        filteredConsignments: state.booking.filteredConsignments,
        bookingsCnt: state.booking.bookingsCnt,
        needUpdateBookings: state.booking.needUpdateBookings,
        bookingLines: state.bookingLine.bookingLines,
        bookingLineDetails: state.bookingLineDetail.bookingLineDetails,
        selectedBookingLinesCnt: state.bookingLine.selectedBookingLinesCnt,
        warehouses: state.warehouse.warehouses,
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
        allBookingStatus: state.extra.allBookingStatus,
        allFPs: state.extra.allFPs,
        projectNames: state.extra.projectNames,
        projectName: state.booking.projectName,
        pricingAnalyses: state.booking.pricingAnalyses,
        bookingsets: state.extra.bookingsets,
        bookingsSummary: state.booking.bookingsSummary,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        getBookings: (startDate, endDate, clientPK, warehouseId, fpId, pageItemCnt, pageInd, sortField, columnFilters, activeTabInd, simpleSearchKeyword, downloadOption, dmeStatus, multiFindField, multiFindValues, projectName) => dispatch(getBookings(startDate, endDate, clientPK, warehouseId, fpId, pageItemCnt, pageInd, sortField, columnFilters, activeTabInd, simpleSearchKeyword, downloadOption, dmeStatus, multiFindField, multiFindValues, projectName)),
        setGetBookingsFilter: (key, value) => dispatch(setGetBookingsFilter(key, value)),
        setAllGetBookingsFilter: (startDate, endDate, clientPK, warehouseId, fpId, pageItemCnt, pageInd, sortField, columnFilters, activeTabInd, simpleSearchKeyword, downloadOption, dmeStatus, multiFindField, multiFindValues, projectName) => dispatch(setAllGetBookingsFilter(startDate, endDate, clientPK, warehouseId, fpId, pageItemCnt, pageInd, sortField, columnFilters, activeTabInd, simpleSearchKeyword, downloadOption, dmeStatus, multiFindField, multiFindValues, projectName)),
        setNeedUpdateBookingsState: (boolFlag) => dispatch(setNeedUpdateBookingsState(boolFlag)),
        updateBooking: (id, booking) => dispatch(updateBooking(id, booking)),
        getBookingLines: (bookingId) => dispatch(getBookingLines(bookingId)),
        getBookingLinesCnt: (bookingIds) => dispatch(getBookingLinesCnt(bookingIds)),
        getBookingLineDetails: (bookingId) => dispatch(getBookingLineDetails(bookingId)),
        getWarehouses: () => dispatch(getWarehouses()),
        getUserDateFilterField: () => dispatch(getUserDateFilterField()),
        allTrigger: () => dispatch(allTrigger()),
        alliedBooking: (bookingId) => dispatch(alliedBooking(bookingId)),
        fpLabel: (bookingId, vx_freight_provider) => dispatch(fpLabel(bookingId, vx_freight_provider)),
        getAlliedLabel: (bookingId) => dispatch(getAlliedLabel(bookingId)),
        fpOrder: (bookingIds, vx_freight_provider) => dispatch(fpOrder(bookingIds, vx_freight_provider)),
        fpOrderSummary: (bookingIds, vx_freight_provider) => dispatch(fpOrderSummary(bookingIds, vx_freight_provider)),
        getExcel: () => dispatch(getExcel()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        getDMEClients: () => dispatch(getDMEClients()),
        generateXLS: (startDate, endDate, emailAddr, vx_freight_provider, report_type, showFieldName, useSelected, selectedBookingIds, pk_id_dme_client) => dispatch(generateXLS(startDate, endDate, emailAddr, vx_freight_provider, report_type, showFieldName, useSelected, selectedBookingIds, pk_id_dme_client)),
        changeBookingsStatus: (status, bookingIds, optionalValue) => dispatch(changeBookingsStatus(status, bookingIds, optionalValue)),
        changeBookingsFlagStatus: (flagStatus, bookingIds) => dispatch(changeBookingsFlagStatus(flagStatus, bookingIds)),
        getAllBookingStatus: () => dispatch(getAllBookingStatus()),
        getAllFPs: () => dispatch(getAllFPs()),
        getAllProjectNames: () => dispatch(getAllProjectNames()),
        calcCollected: (bookingIds, type) => dispatch(calcCollected(bookingIds, type)),
        clearErrorMessage: (boolFlag) => dispatch(clearErrorMessage(boolFlag)),
        getPricingAnalysis: (bookingIds) => dispatch(getPricingAnalysis(bookingIds)),
        getBookingSets: () => dispatch(getBookingSets()),
        createBookingSet: (bookingIds, name, note, auto_select_type, lineHaulDate) => dispatch(createBookingSet(bookingIds, name, note, auto_select_type, lineHaulDate)),
        updateBookingSet: (bookingIds, id) => dispatch(updateBookingSet(bookingIds, id)),
        getSummaryOfBookings: (bookingIds, from) => dispatch(getSummaryOfBookings(bookingIds, from)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AllBookingsPage));

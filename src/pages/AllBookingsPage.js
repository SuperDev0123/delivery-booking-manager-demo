import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';

import moment from 'moment-timezone';
import _ from 'lodash';
import axios from 'axios';
import { Button, Popover, PopoverHeader, PopoverBody, Nav, NavItem, NavLink } from 'reactstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Clock from 'react-live-clock';
import LoadingOverlay from 'react-loading-overlay';
import BarLoader from 'react-spinners/BarLoader';

import { API_HOST, STATIC_HOST, HTTP_PROTOCOL } from '../config';

import { verifyToken, cleanRedirectState, getDMEClients } from '../state/services/authService';
import { getWarehouses } from '../state/services/warehouseService';
import { getBookings, getUserDateFilterField, alliedBooking, stBooking, getSTLabel, getAlliedLabel, allTrigger, updateBooking, setGetBookingsFilter, setAllGetBookingsFilter, setNeedUpdateBookingsState, stOrder, getExcel, generateXLS, changeBookingsStatus } from '../state/services/bookingService';
import { getBookingLines } from '../state/services/bookingLinesService';
import { getBookingLineDetails } from '../state/services/bookingLineDetailsService';

import TooltipItem from '../components/Tooltip/TooltipComponent';
import BookingTooltipItem from '../components/Tooltip/BookingTooltipComponent';
import EditablePopover from '../components/Popovers/EditablePopover';
import XLSModal from '../components/CommonModals/XLSModal';

class AllBookingsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            bookings: [],
            bookingLines: [],
            bookingLineDetails: [],
            warehouses: [],
            bookingsCnt: 0,
            startDate: '',
            endDate: '',
            userDateFilterField: '',
            filterInputs: {},
            selectedBookingIds: [],
            additionalInfoOpens: [],
            bookingLinesInfoOpens: [],
            linkPopoverOpens: [],
            editCellPopoverOpens: [],
            bookingLinesQtyTotal: 0,
            bookingLineDetailsQtyTotal: 0,
            prefilterInd: 0,
            errorsToCorrect: 0,
            toManifest: 0,
            toProcess: 0,
            closed: 0,
            missingLabels: 0,
            simpleSearchKeyword: '',
            showSimpleSearchBox: false,
            loading: false,
            loadingBooking: false,
            loadingDownload: false,
            activeTabInd: 7,
            checkedAll: false,
            showGearMenu: false,
            selectedBookingsCnt: 0,
            currentBookInd: 0,
            downloadOption: 'label',
            total_qty: 0,
            total_kgs: 0,
            total_cubic_meter: 0,
            dmeClients: [],
            username: null,
            selectedClientId: null,
            hasSuccessSearchAndFilterOptions: false,
            successSearchFilterOptions: {},
            scrollLeft: 0,
            isShowXLSModal: false,
            selectedStatusValue: null,
        };

        this.togglePopover = this.togglePopover.bind(this);
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.toggleShowXLSModal = this.toggleShowXLSModal.bind(this);
        this.myRef = React.createRef();
    }

    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        getBookings: PropTypes.func.isRequired,
        updateBooking: PropTypes.func.isRequired,
        getBookingLines: PropTypes.func.isRequired,
        getBookingLineDetails: PropTypes.func.isRequired,
        getWarehouses: PropTypes.func.isRequired,
        getUserDateFilterField: PropTypes.func.isRequired,
        allTrigger: PropTypes.func.isRequired,
        alliedBooking: PropTypes.func.isRequired,
        stBooking: PropTypes.func.isRequired,
        getSTLabel: PropTypes.func.isRequired,
        getAlliedLabel: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
        setGetBookingsFilter: PropTypes.func.isRequired,
        setAllGetBookingsFilter: PropTypes.func.isRequired,
        setNeedUpdateBookingsState: PropTypes.func.isRequired,
        stOrder: PropTypes.func.isRequired,
        getExcel: PropTypes.func.isRequired,
        getDMEClients: PropTypes.func.isRequired,
        generateXLS: PropTypes.func.isRequired,
        changeBookingsStatus: PropTypes.func.isRequired,
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

        const today = localStorage.getItem('today');
        let startDate = '';
        let dateParam = '';

        if (today) {
            startDate = moment(today, 'YYYY-MM-DD').toDate();
            dateParam = moment(today, 'YYYY-MM-DD').format('YYYY-MM-DD');
            this.props.setNeedUpdateBookingsState(true);
        } else {
            startDate = moment().tz('Australia/Sydney').toDate();
            dateParam = moment().tz('Australia/Sydney').format('YYYY-MM-DD');

            this.setState({ 
                startDate: moment(startDate).format('YYYY-MM-DD'),
                endDate: moment(startDate).format('YYYY-MM-DD'),
            });

            this.props.setGetBookingsFilter('date', {startDate: dateParam, endDate: dateParam});
        }

        this.props.getDMEClients();
        this.props.getWarehouses();
        this.props.getUserDateFilterField();
    }

    componentWillMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
        // document.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
        // document.removeEventListener('scroll', this.handleScroll);
    }

    componentWillReceiveProps(newProps) {
        const { bookings, bookingsCnt, bookingLines, bookingLineDetails, warehouses, userDateFilterField, redirect, needUpdateBookings, errorsToCorrect, toManifest, toProcess, missingLabels, closed, startDate, endDate, warehouseId, itemCountPerPage, sortField, columnFilters, prefilterInd, simpleSearchKeyword, newPod, errorMessage, dmeClients, username, clientPK } = newProps;
        let {successSearchFilterOptions, hasSuccessSearchAndFilterOptions} = this.state;
        const currentRoute = this.props.location.pathname;

        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/');
        }

        if (bookings) {
            this.setState({ bookings, bookingsCnt, errorsToCorrect, toManifest, toProcess, closed, missingLabels });

            if (bookings.length > 0 && !needUpdateBookings) {
                this.setState({
                    successSearchFilterOptions: {
                        startDate,
                        endDate,
                        warehouseId,
                        sortField,
                        itemCountPerPage,
                        columnFilters: {...columnFilters},
                        prefilterInd,
                        simpleSearchKeyword,
                        newPod,
                        clientPK,
                    },
                    hasSuccessSearchAndFilterOptions: true,
                });
            } else if (bookings.length === 0 && !needUpdateBookings && hasSuccessSearchAndFilterOptions) {
                alert('Your search/filter has returned 0 records - Returning to your last found set.');
                this.props.setAllGetBookingsFilter(successSearchFilterOptions.startDate, successSearchFilterOptions.endDate, successSearchFilterOptions.clientPK, successSearchFilterOptions.warehouseId, successSearchFilterOptions.itemCountPerPage, successSearchFilterOptions.sortField, successSearchFilterOptions.columnFilters, successSearchFilterOptions.prefilterInd, successSearchFilterOptions.simpleSearchKeyword, successSearchFilterOptions.newPod );
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
            this.setState({ warehouses });
        }

        if (userDateFilterField) {
            this.setState({ userDateFilterField });
        }

        if ((errorMessage === 'Book success' || 
            errorMessage === 'book failed') && 
            needUpdateBookings) {
            this.onAfterBook();
        }

        if (dmeClients) {
            this.setState({dmeClients});
        }

        if (username) {
            this.setState({username});
        }

        if (needUpdateBookings) {
            this.setState({loading: true});

            // startDate
            if (_.isEmpty(startDate)) {
                const startDate = moment().tz('Australia/Sydney').toDate();
                const dateParam = moment().tz('Australia/Sydney').format('YYYY-MM-DD');
                this.props.setGetBookingsFilter('date', {startDate: dateParam});
                this.setState({startDate});
                return;
            } else if (startDate !== '*') {
                this.setState({startDate});
            }

            // endDate
            if (startDate !== '*' && _.isEmpty(endDate)) {
                const endDate = startDate;
                const dateParam = moment(startDate).format('YYYY-MM-DD');
                this.props.setGetBookingsFilter('date', {startDate: startDate, endDate: dateParam});
                this.setState({endDate});
                return;
            } else {
                this.setState({endDate});
            }

            // sortField
            if (!_.isEmpty(sortField)) {
                if (sortField[0] === '-') {
                    this.setState({sortDirection: -1, sortField: sortField.substring(1)});
                } else {
                    this.setState({sortDirection: 1, sortField});
                }
            }

            // prefilterInd
            if (startDate === '*') {
                this.setState({activeTabInd: 0});
            } else if (startDate !== '*' && prefilterInd === 0) {
                this.setState({activeTabInd: 7});
            } else {
                this.setState({activeTabInd: prefilterInd});
            }

            this.setState({
                selectedClientId: clientPK, 
                selectedWarehouseId: warehouseId, 
                filterInputs: columnFilters, 
                simpleSearchKeyword,
            });

            this.props.getBookings(startDate, endDate, clientPK, warehouseId, itemCountPerPage, sortField, columnFilters, prefilterInd, simpleSearchKeyword, newPod);
        } else {
            this.setState({loading: false});
        }
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target))
            this.setState({showSimpleSearchBox: false, showGearMenu: false});
    }

    handleScroll(event) {
        let scrollLeft = event.target.scrollLeft;
        const tblContent = this.myRef.current;
        if (scrollLeft !== this.state.scrollLeft) {
            this.setState({scrollLeft: tblContent.scrollLeft});
        }
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
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

        this.setState({total_qty, total_kgs, total_cubic_meter});
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
            if (_.isNull(date)) {
                startDate = moment().tz('Australia/Sydney').format('YYYY-MM-DD');
            } else {
                startDate = moment(date).format('YYYY-MM-DD');
            }

            if (moment(startDate, 'YYYY-MM-DD') > moment(this.state.endDate)) {
                endDate = startDate;
                this.setState({startDate, endDate});    
            } else {
                this.setState({startDate});
            }

            localStorage.setItem('today', startDate);
        } else if (dateType === 'endDate') {
            if (_.isNull(date)) {
                endDate = moment().tz('Australia/Sydney').format('YYYY-MM-DD');
            } else {
                endDate = moment(date).format('YYYY-MM-DD');
            }

            if (moment(endDate, 'YYYY-MM-DD') < moment(this.state.startDate)) {
                startDate = endDate;
                this.setState({startDate, endDate});    
            } else {
                this.setState({endDate});
            }
        }
    }

    onClickDateFilter() {
        const { startDate, endDate } = this.state;

        this.props.setGetBookingsFilter('date', {startDate, endDate});
        this.setState({selectedBookingIds: [], checkedAll: false, filterInputs: {}});
        this.props.setGetBookingsFilter('columnFilters', {});
    }

    onSelected(e, src) {
        if (src === 'warehouse') {
            const selectedWarehouseId = e.target.value;
            let warehouseId = 0;

            if (selectedWarehouseId !== 'all')
                warehouseId = selectedWarehouseId;

            this.props.setGetBookingsFilter('warehouseId', warehouseId);
            this.setState({selectedBookingIds: [], checkedAll: false});
        } else if (src === 'client') {
            const selectedClientId = e.target.value;
            this.props.setGetBookingsFilter('clientPK', selectedClientId);
            this.setState({selectedBookingIds: [], checkedAll: false});
        } else if (src === 'status') {
            this.setState({selectedStatusValue: e.target.value});
        }
    }

    onItemCountPerPageChange(e) {
        console.log('@80 - ', e.target.value);
        // const {startDate, selectedWarehouseId} = this.state;
        // const itemCountPerPage = e.target.value;
        //
        // if (selectedWarehouseId === 'all') {
        //     this.props.setGetBookingsFilter(startDate);
        // } else {
        //     this.props.setGetBookingsFilter(startDate, selectedWarehouseId, itemCountPerPage);
        // }
        //
        // this.setState({ itemCountPerPage });
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
        }
    }

    onClickPrefilter(prefilterInd) {
        this.props.setGetBookingsFilter('prefilterInd', prefilterInd);
        this.props.setGetBookingsFilter('columnFilters', {});
        this.setState({selectedBookingIds: [], checkedAll: false, filterInputs: {}});
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
        const {bookings} = this.state;
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

        this.setState({ bookingLinesInfoOpens, additionalInfoOpens: [], bookingLineDetails: [], linkPopoverOpens: [], editCellPopoverOpens: [] });
    }

    clearActivePopoverVar() {
        this.setState({ additionalInfoOpens: [], bookingLinesInfoOpens: [], bookingLineDetails: [], linkPopoverOpens: [], editCellPopoverOpens: [] });
    }

    togglePopover() {
        this.clearActivePopoverVar();
    }

    toggleShowXLSModal() {
        this.setState(prevState => ({isShowXLSModal: !prevState.isShowXLSModal}));
    }

    onCheck(e, id) {
        if (!e.target.checked) {
            this.setState({selectedBookingIds: _.difference(this.state.selectedBookingIds, [id])});
        } else {
            this.setState({selectedBookingIds: _.union(this.state.selectedBookingIds, [id])});
        }
    }

    onClickAllTrigger() {
        this.props.allTrigger();
    }

    onClickBook() {
        const { selectedBookingIds, bookings } = this.state;
        const st_name = 'startrack';
        const allied_name = 'allied';

        if (selectedBookingIds.length < 1) {
            alert('Please select at least one booking!');
        } else if (selectedBookingIds.length > 10) {
            alert('Please select less than 10 booking! 10+ bookings takes 5+ minutes to book');
        } else {
            this.setState({loadingBooking: true, selectedBookingsCnt: selectedBookingIds.length});
            let ind = -1;

            for (let i = 0; i < bookings.length; i++) {
                if (bookings[i].id === selectedBookingIds[0]) {
                    ind = i;
                    break;
                }
            }

            if (ind > -1) {
                if (bookings[ind].vx_freight_provider && bookings[ind].vx_freight_provider.toLowerCase() === st_name) {
                    this.props.stBooking(bookings[ind].id);
                } else if (bookings[ind].vx_freight_provider && bookings[ind].vx_freight_provider.toLowerCase() === allied_name) {
                    this.props.alliedBooking(bookings[ind].id);
                }
            }
        }
    }

    onAfterBook() {
        const { selectedBookingIds, bookings, selectedBookingsCnt, currentBookInd } = this.state;
        const st_name = 'startrack';
        const allied_name = 'allied';

        if (currentBookInd === selectedBookingsCnt - 1) {
            this.setState({selectedBookingIds: [], checkedAll: false, loadingBooking: false, selectedBookingsCnt: 0, currentBookInd: 0});
        } else {
            let ind = -1;

            for (let i = 0; i < bookings.length; i++) {
                if (bookings[i].id === selectedBookingIds[currentBookInd + 1]) {
                    ind = i;
                    break;
                }
            }

            if (ind > -1) {
                if (bookings[ind].vx_freight_provider && bookings[ind].vx_freight_provider.toLowerCase() === st_name) {
                    this.props.stBooking(bookings[ind].id);
                } else if (bookings[ind].vx_freight_provider && bookings[ind].vx_freight_provider.toLowerCase() === allied_name) {
                    this.props.alliedBooking(bookings[ind].id);
                }
            }
            
            this.setState({currentBookInd: currentBookInd + 1});
        }
    }

    onClickGetLabel() {
        const { selectedBookingIds, bookings } = this.state;
        const st_name = 'startrack';
        const allied_name = 'allied';

        if (selectedBookingIds.length == 0) {
            alert('Please check only one booking!');
        } else if (selectedBookingIds.length > 1) {
            alert('Please check only one booking!');
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
                    this.props.getSTLabel(bookings[ind].id);
                    this.setState({loadingBooking: true});
                } else if (bookings[ind].vx_freight_provider.toLowerCase() === allied_name) {
                    this.props.getAlliedLabel(bookings[ind].id);
                    this.setState({loadingBooking: true});
                }
            }
        }

        this.setState({selectedBookingIds: [], checkedAll: false});
    }

    onDownload() {
        const { selectedBookingIds, downloadOption, bookings, startDate, endDate } = this.state;

        if (selectedBookingIds.length > 0 && selectedBookingIds.length < 501) {
            this.setState({loadingDownload: true});

            if (downloadOption === 'label') {
                const options = {
                    method: 'post',
                    url: HTTP_PROTOCOL + '://' + API_HOST + '/download-pdf/',
                    data: {ids: selectedBookingIds},
                    responseType: 'blob', // important
                };

                axios(options).then((response) => {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'labels.zip');
                    document.body.appendChild(link);
                    link.click();
                    this.setState({selectedBookingIds: [], checkedAll: false, loadingDownload: false});
                });
            } else if (downloadOption === 'pod') {
                const options = {
                    method: 'post',
                    url: HTTP_PROTOCOL + '://' + API_HOST + '/download-pod/',
                    data: {
                        ids: selectedBookingIds,
                        onlyNew: 'ALL',
                    },
                    responseType: 'blob', // important
                };

                axios(options).then((response) => {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'pod_and_pod_signed.zip');
                    document.body.appendChild(link);
                    link.click();
                    this.props.setGetBookingsFilter('date', {startDate, endDate});
                    this.setState({selectedBookingIds: [], checkedAll: false, loadingDownload: false});
                });
            } else if (downloadOption === 'new_pod') {
                let bookingIdsWithNewPOD = [];

                for (let j = 0; j < selectedBookingIds.length; j++) {
                    for (let i = 0; i < bookings.length; i++) {
                        if (bookings[i].id === selectedBookingIds[j]) {
                            if (bookings[i].z_downloaded_pod_timestamp === null &&
                                ((bookings[i].z_pod_url &&
                                bookings[i].z_pod_url.length > 0) ||
                                (bookings[i].z_pod_signed_url &&
                                bookings[i].z_pod_signed_url.length > 0)))
                                bookingIdsWithNewPOD.push(bookings[i].id);
                        }
                    }
                }

                if (bookingIdsWithNewPOD.length > 0) {
                    const options = {
                        method: 'post',
                        url: HTTP_PROTOCOL + '://' + API_HOST + '/download-pod/',
                        data: {
                            ids: bookingIdsWithNewPOD,
                            onlyNew: 'NEW',
                        },
                        responseType: 'blob', // important
                    };

                    axios(options).then((response) => {
                        const url = window.URL.createObjectURL(new Blob([response.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', 'pod_and_pod_signed.zip');
                        document.body.appendChild(link);
                        link.click();
                        this.props.setGetBookingsFilter('date', {startDate, endDate});
                        this.setState({selectedBookingIds: [], checkedAll: false, loadingDownload: false});
                    });
                } else {
                    alert('No new POD info');
                    this.setState({selectedBookingIds: [], checkedAll: false, loadingDownload: false});
                }
            }
        } else if (selectedBookingIds.length > 100) {
            alert('Please selected less than 500 bookings to download.');
        } else {
            alert('No matching booking id');
        }
    }

    onClickPrinter(booking) {
        const st_name = 'startrack';
        const allied_name = 'allied';
        const cope_name = 'cope';

        if (booking.z_label_url && booking.z_label_url.length > 0) {
            if (booking.vx_freight_provider.toLowerCase() === st_name) {
                const win = window.open(booking.z_label_url);
                win.focus();
            } else if (booking.vx_freight_provider.toLowerCase() === allied_name ||
                booking.vx_freight_provider.toLowerCase() === cope_name) {
                const win = window.open(HTTP_PROTOCOL + '://' + STATIC_HOST + '/pdfs/' + booking.z_label_url, '_blank');
                win.focus();
            }

            booking.is_printed = true;
            booking.z_downloaded_shipping_label_timestamp = new Date();
            this.props.updateBooking(booking.id, booking);
        } else {
            alert('This booking has no label');
        }
    }

    onClickGetAll(e) {
        e.preventDefault();
        const {startDate, endDate} = this.state;
        this.props.setAllGetBookingsFilter(startDate, endDate);
        this.setState({selectedBookingIds: []});
    }

    onClickSimpleSearch(num) {
        if (num === 0) {
            this.setState({showSimpleSearchBox: true});
        } else if (num === 1) {
            this.setState({showGearMenu: true});
        }
    }

    onInputChange(e) {
        this.setState({simpleSearchKeyword: e.target.value});
    }

    onSimpleSearch(e) {
        e.preventDefault();
        const {simpleSearchKeyword} = this.state;

        if (simpleSearchKeyword.length === 0) {
            alert('Please input search keyword!');
        } else {
            this.props.setAllGetBookingsFilter('*', '2019-01-01', 0, 0, 0, '-id', {}, 0, simpleSearchKeyword);
            this.setState({activeTabInd: 0});
        }

        this.setState({selectedBookingIds: [], checkedAll: false});
    }

    onClickTab(activeTabInd) {
        if (activeTabInd === 0) {
            this.props.setAllGetBookingsFilter('*');
        } else if (activeTabInd === 7) {
            const {startDate, endDate} = this.state;
            this.props.setAllGetBookingsFilter(startDate, endDate, 0, 0, 0, '-id', {}, activeTabInd);
        } else {
            this.onClickPrefilter(activeTabInd);
        }

        this.setState({activeTabInd, selectedBookingIds: [], checkedAll: false});
    }

    onDatePlusOrMinus(number) {
        console.log('number - ', number);
        // const startDate = moment(this.state.startDate).add(number, 'd').format('YYYY-MM-DD');
        // const endDate = moment(this.state.endDate).add(number, 'd').format('YYYY-MM-DD');
        // this.props.setGetBookingsFilter('date', {startDate, endDate});
        // localStorage.setItem('today', startDate);
        // this.setState({startDate, selectedBookingIds: [], checkedAll: false});
    }

    onCheckAll() {
        const { bookings, checkedAll } = this.state;
        let selectedBookingIds = this.state.selectedBookingIds;

        for (let i = 0; i < bookings.length; i++) {
            if (!checkedAll) {
                selectedBookingIds = _.union(selectedBookingIds, [bookings[i].id]);
            } else {
                selectedBookingIds = _.difference(selectedBookingIds, [bookings[i].id]);
            }
        }
        this.setState({checkedAll: !checkedAll, selectedBookingIds});
    }

    onClickSTOrder() {
        this.props.stOrder();
        this.setState({selectedBookingIds: [], checkedAll: false});
    }

    onClickDownloadExcel() {
        this.toggleShowXLSModal();
    }

    onClickDownloadCSV() {
        const { bookings } = this.state;
        let bookingIds = [];

        if (bookings && bookings.length === 0) {
            alert('There is no bookings to build CSV.');
        } else {
            for (let i = 0; i < bookings.length; i++)
                bookingIds.push(bookings[i].id);

            this.setState({loadingDownload: true});
            const options = {
                method: 'post',
                url: HTTP_PROTOCOL + '://' + API_HOST + '/download-csv/',
                data: {bookingIds},
                responseType: 'blob', // important
            };

            axios(options).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'SEATEMP_' + bookings.length + '_' + moment().tz('Etc/GMT').format('YYYY-MM-DD hh:mm:ss') + '.csv');
                document.body.appendChild(link);
                link.click();
                this.setState({loadingDownload: false});
            });
        }
    }

    onClickXML() {
        const { bookings } = this.state;
        let bookingIds = [];

        if (bookings && bookings.length === 0) {
            alert('There is no bookings to build XML.');
        } else if (bookings.length > 100) {
            alert('You can generate xml with 100 bookings at most.');
        } else {
            for (let i = 0; i < bookings.length; i++)
                bookingIds.push(bookings[i].id);

            this.setState({loadingDownload: true});
            const options = {
                method: 'post',
                url: HTTP_PROTOCOL + '://' + API_HOST + '/generate-xml/',
                data: {bookingIds},
            };

            axios(options).then((response) => {
                if (response.data.error && response.data.error === 'Found set has booked bookings') {
                    alert('Listed are some bookings that should not be processed because they have already been booked\n' + response.data.booked_list);
                } else if (response.data.success && response.data.success === 'success') {
                    alert('XML’s are *not generated successfully.');
                    this.setState({loading: true});
                    this.props.setNeedUpdateBookingsState(true);
                } else {
                    alert('XML’s have been generated successfully.');
                    this.setState({loading: true});
                    this.props.setNeedUpdateBookingsState(true);
                }
                this.setState({loadingDownload: false});
            });
        }
    }

    onClickGear() {
        this.setState({showGearMenu: true});
    }

    onDownloadOptionChange(e) {
        if (e.target.value === 'new_pod') {
            this.props.setGetBookingsFilter('newPod', true);
        } else if (e.target.value !== 'new_pod' && this.state.downloadOption === 'new_pod') {
            this.props.setGetBookingsFilter('newPod', false);
        }

        this.setState({downloadOption: e.target.value});
    }

    onClickLink(num, bookingId) {
        if (num === 0)
            window.location.assign('/booking?bookingid=' + bookingId);
        else if (num === 1)
            window.location.assign('/comm?bookingid=' + bookingId);
    }

    onClickStatusLock(booking) {
        const { username } = this.state;

        if (username === 'dme') {
            booking.z_lock_status = !booking.z_lock_status;
            booking.z_locked_status_time = moment().tz('Etc/GMT').format('YYYY-MM-DD hh:mm:ss');
            this.props.updateBooking(booking.id, booking);
        } else {
            alert('Locked status only allowed by dme user');
        }
    }

    onClickEditCell(bookingId) {
        let editCellPopoverOpens = this.state.editCellPopoverOpens;
        let flag = editCellPopoverOpens['edit-cell-popover-' + bookingId];
        editCellPopoverOpens = [];

        if (flag)
            editCellPopoverOpens['edit-cell-popover-' + bookingId] = false;
        else
            editCellPopoverOpens['edit-cell-popover-' + bookingId] = true;

        this.setState({ additionalInfoOpens: [], bookingLinesInfoOpens: [], bookingLineDetails: [], linkPopoverOpens: [], editCellPopoverOpens });
    }

    onClickChangeStatusButton() {
        const {selectedStatusValue, selectedBookingIds} = this.state;

        if (!selectedStatusValue) {
            alert('Please select a status.');
        } else if (selectedBookingIds.length === 0) {
            alert('Please select at least one booking.');
        } else if (selectedBookingIds.length > 25) {
            alert('You can change 25 bookings status at a time.');
        } else {
            this.props.changeBookingsStatus(selectedStatusValue, selectedBookingIds);
            this.setState({loading: true, selectedBookingIds: [], checkedAll: false});
        }
    }

    render() {
        const { bookings, bookingsCnt, bookingLines, bookingLineDetails, startDate, endDate, selectedWarehouseId, warehouses, filterInputs, total_qty, total_kgs, total_cubic_meter, bookingLineDetailsQtyTotal, sortField, sortDirection, errorsToCorrect, toManifest, toProcess, missingLabels, closed, simpleSearchKeyword, showSimpleSearchBox, selectedBookingIds, loading, loadingBooking, activeTabInd, loadingDownload, downloadOption, dmeClients, username, selectedClientId, scrollLeft, isShowXLSModal } = this.state;

        const tblContentWidthVal = 'calc(100% + ' + scrollLeft + 'px)';
        const tblContentWidth = {width: tblContentWidthVal};

        const warehousesList = warehouses.map((warehouse, index) => {
            return (<option key={index} value={warehouse.pk_id_client_warehouses}>{warehouse.warehousename}</option>);
        });

        const clientOptionsList = dmeClients.map((client, index) => {
            return (<option key={index} value={client.pk_id_dme_client}>{client.company_name}</option>);
        });

        const bookingLineDetailsList = bookingLineDetails.map((bookingLineDetail, index) => {
            return (
                <tr key={index}>
                    <td>{bookingLineDetail.modelNumber}</td>
                    <td>{bookingLineDetail.itemDescription}</td>
                    <td className="qty">{bookingLineDetail.quantity}</td>
                    <td>{bookingLineDetail.itemFaultDescription}</td>
                    <td>{bookingLineDetail.insuranceValueEach}</td>
                    <td>{bookingLineDetail.gap_ra}</td>
                    <td>{bookingLineDetail.clientRefNumber}</td>
                </tr>
            );
        });

        const bookingLinesList = bookingLines.map((bookingLine, index) => {
            return (
                <tr key={index}>
                    <td>{bookingLine.pk_auto_id_lines}</td>
                    <td>{bookingLine.e_type_of_packaging}</td>
                    <td>{bookingLine.e_item}</td>
                    <td className="qty">{bookingLine.e_qty}</td>
                    <td>{bookingLine.e_weightUOM}</td>
                    <td>{bookingLine.e_weightPerEach}</td>
                    <td>{bookingLine.total_kgs}</td>
                    <td>{bookingLine.e_dimUOM}</td>
                    <td>{bookingLine.e_dimLength}</td>
                    <td>{bookingLine.e_dimWidth}</td>
                    <td>{bookingLine.e_dimHeight}</td>
                    <td>{bookingLine.cubic_meter}</td>
                </tr>
            );
        });

        const bookingsList = bookings.map((booking, index) => {
            return (
                <tr key={index}>
                    <td><input type="checkbox" checked={_.indexOf(selectedBookingIds, booking.id) > -1 ? 'checked' : ''} onChange={(e) => this.onCheck(e, booking.id)} /></td>
                    <td id={'booking-lines-info-popup-' + booking.id} className={this.state.bookingLinesInfoOpens['booking-lines-info-popup-' + booking.id] ? 'booking-lines-info active' : 'booking-lines-info'} onClick={() => this.showBookingLinesInfo(booking.id)}>
                        <i className="icon icon-th-list"></i>
                    </td>
                    <Popover
                        isOpen={this.state.bookingLinesInfoOpens['booking-lines-info-popup-' + booking.id]}
                        target={'booking-lines-info-popup-' + booking.id}
                        placement="right"
                        hideArrow={true} >
                        <PopoverHeader>Line and Line Details <a className="close-popover" onClick={this.togglePopover}>x</a></PopoverHeader>
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
                                            <td>{_.size(bookingLines)}</td>
                                            <td>{total_qty}</td>
                                            <td>{total_kgs}</td>
                                            <td>{total_cubic_meter}</td>
                                        </tr>
                                        <tr>
                                            <td>Line Details</td>
                                            <td>{_.size(bookingLineDetails)}</td>
                                            <td>{bookingLineDetailsQtyTotal}</td>
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
                    <td id={'additional-info-popup-' + booking.id} className={this.state.additionalInfoOpens['additional-info-popup-' + booking.id] ? 'additional-info active' : 'additional-info'} onClick={() => this.showAdditionalInfo(booking.id)}>
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
                                <span className={(_.isEmpty(booking.pu_Address_street_1)) ? ' none' :  ''}>
                                    {booking.pu_Address_street_1}<br />
                                </span>
                                <span className={(_.isEmpty(booking.pu_Address_street_2)) ? ' none' :  ''}>
                                    {booking.pu_Address_street_2}<br />
                                </span>
                                <span className={(_.isEmpty(booking.pu_Address_Suburb)) ? ' none' :  ''}>
                                    {booking.pu_Address_Suburb}<br />
                                </span>
                                <span className={(_.isEmpty(booking.pu_Address_City)) ? ' none' :  ''}>
                                    {booking.pu_Address_City}<br />
                                </span>
                                <span className={((_.isEmpty(booking.pu_Address_State)) && (_.isEmpty(booking.pu_Address_PostalCode))) ? ' none' :  ''}>
                                    {booking.pu_Address_State} {booking.pu_Address_PostalCode}<br />
                                </span>
                                <span className={(_.isEmpty(booking.pu_Address_Country)) ? ' none' :  ''}>
                                    {booking.pu_Address_Country}<br />
                                </span>
                            </div>
                            <div className="location-info disp-inline-block">
                                <span>Delivery Info</span><br />
                                <span>Delivery Location:</span><br />
                                <span className={(_.isEmpty(booking.de_To_Address_street_1)) ? ' none' :  ''}>
                                    {booking.de_To_Address_street_1}<br />
                                </span>
                                <span className={(_.isEmpty(booking.de_To_Address_street_2)) ? ' none' :  ''}>
                                    {booking.de_To_Address_street_2}<br />
                                </span>
                                <span className={(_.isEmpty(booking.de_To_Address_Suburb)) ? ' none' :  ''}>
                                    {booking.de_To_Address_Suburb}<br />
                                </span>
                                <span className={(_.isEmpty(booking.de_To_Address_City)) ? ' none' :  ''}>
                                    {booking.de_To_Address_City}<br />
                                </span>
                                <span className={((_.isEmpty(booking.de_To_Address_State)) && (_.isEmpty(booking.de_To_Address_PostalCode))) ? ' none' :  ''}>
                                    {booking.de_To_Address_State} {booking.de_To_Address_PostalCode}<br />
                                </span>
                                <span className={(_.isEmpty(booking.de_To_Address_Country)) ? ' none' :  ''}>
                                    {booking.de_To_Address_Country}<br />
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
                        id={'link-popover-' + booking.id} 
                        onClick={() => this.onClickLink(0, booking.id)}
                        className={(sortField === 'b_bookingID_Visual') ? 'visualID-box current' : 'visualID-box'}
                    >
                        <span className={booking.b_error_Capture ? 'c-red' : ''}>{booking.b_bookingID_Visual}</span>
                        { 
                            (booking.has_comms) ?
                                <i className="fa fa-comments" aria-hidden="true"></i>
                                :
                                null
                        }
                    </td>
                    <Popover
                        isOpen={this.state.linkPopoverOpens['link-popover-' + booking.id]}
                        target={'link-popover-' + booking.id}
                        placement="right"
                        hideArrow={true} >
                        <PopoverBody>
                            <div className="links-div">
                                <Button color="primary" onClick={() => this.onClickLink(0, booking.id)}>Go to Detail</Button>
                                <Button className="none" color="primary" onClick={() => this.onClickLink(1, booking.id)}>Go to Comms</Button>
                            </div>
                        </PopoverBody>
                    </Popover>
                    <td 
                        id={'edit-cell-popover-' + booking.id} 
                        className={(sortField === 'puPickUpAvailFrom_Date') ? 'current' : ''}
                    >
                        {booking.puPickUpAvailFrom_Date ? moment(booking.puPickUpAvailFrom_Date).format('ddd DD MMM YYYY'): ''}
                        {
                            booking.b_dateBookedDate ?
                                null
                                :
                                <i className="icon icon-pencil" onClick={() => this.onClickEditCell(booking.id)}></i>
                        }
                    </td>
                    <EditablePopover 
                        isOpen={this.state.editCellPopoverOpens['edit-cell-popover-' + booking.id]}
                        booking={booking}
                        onCancel={this.togglePopover}
                        onChange={(bookingId, booking) => this.props.updateBooking(bookingId, booking)}
                        inputType={'datepicker'}
                        fieldName={'puPickUpAvailFrom_Date'}
                    />
                    <td className={(sortField === 'b_dateBookedDate') ? 'current' : ''}>
                        {booking.b_dateBookedDate ? moment(booking.b_dateBookedDate).format('ddd DD MMM YYYY'): ''}
                    </td>
                    <td className={(sortField === 'puCompany') ? 'current' : ''}>{booking.puCompany}</td>
                    <td className={(sortField === 'pu_Address_Suburb') ? 'current' : ''}>{booking.pu_Address_Suburb}</td>
                    <td className={(sortField === 'pu_Address_State') ? 'current' : ''}>{booking.pu_Address_State}</td>
                    <td className={(sortField === 'pu_Address_PostalCode') ? 'current' : ''}>{booking.pu_Address_PostalCode}</td>
                    <td className={(sortField === 'deToCompanyName') ? 'current' : ''}>{booking.deToCompanyName}</td>
                    <td className={(sortField === 'de_To_Address_Suburb') ? 'current' : ''}>{booking.de_To_Address_Suburb}</td>
                    <td className={(sortField === 'de_To_Address_State') ? 'current' : ''}>{booking.de_To_Address_State}</td>
                    <td className={(sortField === 'de_To_Address_PostalCode') ? 'current' : ''}>{booking.de_To_Address_PostalCode}</td>
                    <td className={
                        (booking.b_error_Capture) ?
                            'dark-blue warning'
                            :
                            (booking.z_downloaded_shipping_label_timestamp != null) ?
                                'bg-yellow'
                                :
                                (booking.z_label_url && booking.z_label_url.length > 0) ?
                                    'bg-green'
                                    :
                                    'bg-gray'
                    }>
                        {
                            (booking.b_error_Capture) ?
                                <div className="booking-status">
                                    <TooltipItem booking={booking} />
                                </div>
                                :
                                <div className="booking-status">
                                    {
                                        <a href="#" onClick={() => this.onClickPrinter(booking)}>
                                            <i className="icon icon-printer"></i>
                                        </a>
                                    }
                                </div>
                        }
                    </td>
                    <td className={
                        (!_.isEmpty(booking.z_pod_url) || !_.isEmpty(booking.z_pod_signed_url)) ?
                            (!_.isEmpty(booking.z_downloaded_pod_timestamp)) ?
                                'bg-yellow'
                                :
                                'dark-blue'
                            :
                            null
                    }>
                        {
                            (!_.isEmpty(booking.z_pod_url) || !_.isEmpty(booking.z_pod_signed_url)) ?
                                <div className="pod-status">
                                    <i className="icon icon-image"></i>
                                </div>
                                :
                                null
                        }
                    </td>
                    <td className={(sortField === 'b_clientReference_RA_Numbers') ? 'current' : ''}>{booking.b_clientReference_RA_Numbers}</td>
                    <td className={(sortField === 'b_client_sales_inv_num') ? 'current' : ''}>{booking.b_client_sales_inv_num}</td>
                    <td className={(sortField === 'vx_freight_provider') ? 'current' : ''}>{booking.vx_freight_provider}</td>
                    <td className={(sortField === 'vx_serviceName') ? 'current' : ''}>{booking.vx_serviceName}</td>
                    <td className={(sortField === 'v_FPBookingNumber') ? 'current' : ''}>{booking.v_FPBookingNumber}</td>
                    <td className={booking.z_lock_status ? 'status-active' : 'status-inactive'} onClick={() => this.onClickStatusLock(booking)}>
                        <i className="fa fa-lock"></i>
                    </td>
                    <td className={(sortField === 'b_status') ? 'current' : ''} id={'booking-' + 'b_status' + '-tooltip-' + booking.id}>
                        <p className="status">{booking.b_status}</p>
                        {
                            !_.isEmpty(booking.b_status) ?
                                <BookingTooltipItem booking={booking} field={'b_status'} />
                                :
                                null
                        }
                    </td>
                    <td className={(sortField === 'b_status_API') ? 'current' : ''} id={'booking-' + 'b_status_API' + '-tooltip-' + booking.id}>
                        <p className="status">{booking.b_status_API}</p>
                        {
                            !_.isEmpty(booking.b_status_API) ?
                                <BookingTooltipItem booking={booking} field={'b_status_API'} />
                                :
                                null
                        }
                    </td>
                    <td className={(sortField === 's_05_LatestPickUpDateTimeFinal') ? 'current' : ''}>
                        {booking.s_05_LatestPickUpDateTimeFinal ? moment(booking.s_05_LatestPickUpDateTimeFinal).format('DD/MM/YYYY hh:mm:ss') : ''}
                    </td>
                    <td className={(sortField === 's_06_LatestDeliveryDateTimeFinal') ? 'current' : ''}>
                        {booking.s_06_LatestDeliveryDateTimeFinal ? moment(booking.s_06_LatestDeliveryDateTimeFinal).format('DD/MM/YYYY hh:mm:ss') : ''}
                    </td>
                    <td className={(sortField === 's_20_Actual_Pickup_TimeStamp') ? 'current' : ''}>
                        {booking.s_20_Actual_Pickup_TimeStamp}
                    </td>
                    <td className={(sortField === 's_21_Actual_Delivery_TimeStamp') ? 'current' : ''}>
                        {booking.s_21_Actual_Delivery_TimeStamp}
                    </td>
                    <td>
                        {booking.de_Deliver_From_Date}
                    </td>
                    <td>
                        {booking.de_Deliver_By_Date}
                    </td>
                </tr>
            );
        });

        return (
            <div className="qbootstrap-nav allbookings" >
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
                                <li className=""><Link to="/pods">PODs</Link></li>
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
                                            <input className="popuptext" type="text" placeholder="Search.." name="search" value={simpleSearchKeyword} onChange={(e) => this.onInputChange(e)} />
                                        </form>
                                    </div>
                                }
                            </div>
                            <div className="popup" onClick={(e) => this.onClickGetAll(e)}>
                                <i className="icon icon-th-list" aria-hidden="true"></i>
                            </div>
                            <div className="popup" onClick={() => this.onClickSimpleSearch(1)}>
                                <i className="icon-cog2" aria-hidden="true"></i>
                                {
                                    this.state.showGearMenu &&
                                    <div ref={this.setWrapperRef}>
                                        <button className="popuptext1 btn btn-primary" onClick={() => this.onClickSTOrder()}>ST temp</button>
                                    </div>
                                }
                            </div>
                            <a href=""><i className="icon-calendar3" aria-hidden="true"></i></a>
                            <a onClick={() => this.onClickDownloadExcel()}><i className="fa fa-file-excel-o" aria-hidden="true"></i></a>
                            <a onClick={() => this.onClickDownloadCSV()}>CSV</a>
                            <a onClick={() => this.onClickXML()}>XML</a>
                            <a href="">?</a>
                        </div>
                    </div>
                    <div className="top-menu">
                        <div className="container fix-box">
                            <div className="row1 fix-box">
                                <div className="tab-content fix-box">
                                    <div id="all_booking" className="tab-pane fix-box fade in active">
                                        <div className="userclock">
                                            <Clock format={'DD MMM YYYY h:mm:ss A'} disabled={true} ticking={true} timezone={'Australia/Sydney'} />
                                        </div>
                                        <div className="filter-controls">
                                            <div className="date-adjust none" onClick={() => this.onDatePlusOrMinus(-1)}><i className="fa fa-minus"></i></div>
                                            <DatePicker
                                                selected={startDate}
                                                onChange={(e) => this.onDateChange(e, 'startDate')}
                                                dateFormat="dd MMM yyyy"
                                            />
                                            <DatePicker
                                                selected={endDate}
                                                onChange={(e) => this.onDateChange(e, 'endDate')}
                                                dateFormat="dd MMM yyyy"
                                            />
                                            <button className="btn btn-primary left-10px" onClick={() => this.onClickDateFilter()}>Find</button>
                                            <div className="date-adjust none"  onClick={() => this.onDatePlusOrMinus(1)}><i className="fa fa-plus"></i></div>
                                            {
                                                (username === 'dme') ?
                                                    <label className="left-30px right-10px">
                                                        Client: 
                                                        <select 
                                                            id="client-select" 
                                                            required 
                                                            onChange={(e) => this.onSelected(e, 'client')} 
                                                            value={selectedClientId}>
                                                            { clientOptionsList }
                                                        </select>
                                                    </label>
                                                    :
                                                    null
                                            }
                                            <label className={(username === 'dme') ? 'right-10px' : 'left-30px right-10px' }>Warehouse: </label>
                                            <select 
                                                id="warehouse" 
                                                required 
                                                onChange={(e) => this.onSelected(e, 'warehouse')} 
                                                value={selectedWarehouseId}
                                            >
                                                <option value="all">All</option>
                                                { warehousesList }
                                            </select>
                                            <label className='right-10px'>Status: </label>
                                            <select 
                                                id="status" 
                                                required 
                                                onChange={(e) => this.onSelected(e, 'status')} 
                                            >
                                                <option value="" selected disabled hidden>Select a status</option>
                                                <option value="Collected">Collected</option>
                                                <option value="Status 01">Status 01</option>
                                                <option value="Status 02">Status 02</option>
                                            </select>
                                            <button className="btn btn-primary left-10px right-50px" onClick={() => this.onClickChangeStatusButton()}>Change</button>
                                            <div className="disp-inline-block">
                                                <LoadingOverlay
                                                    active={loadingBooking}
                                                    spinner={<BarLoader color={'#FFF'} />}
                                                    text=''
                                                >
                                                    <button className="btn btn-primary all-trigger none" onClick={() => this.onClickAllTrigger()}>All trigger</button>
                                                    <button className="btn btn-primary allied-booking" onClick={() => this.onClickBook()}>Book</button>
                                                    {
                                                        loadingBooking ? '(' + this.state.currentBookInd + '/' + this.state.selectedBookingsCnt + ') ' : ''
                                                    }
                                                    <button className="btn btn-primary get-label" onClick={() => this.onClickGetLabel()}>Get Label</button>
                                                    <button className="btn btn-primary map-bok1-to-bookings" onClick={() => this.onClickMapBok1ToBookings()}>Map Bok_1 to Bookings</button>
                                                </LoadingOverlay>
                                            </div>
                                            <p className="font-24px float-right">all bookings / today / by date: {bookingsCnt}</p>
                                        </div>
                                        <ul className="filter-conditions none">
                                            <li><a onClick={() => this.onClickPrefilter(1)}>Errors to Correct ({errorsToCorrect})</a></li>
                                            <li><a onClick={() => this.onClickPrefilter(2)}>Missing Labels ({missingLabels})</a></li>
                                            <li><a onClick={() => this.onClickPrefilter(3)}>To Manifest ({toManifest})</a></li>
                                            <li><a onClick={() => this.onClickPrefilter(4)}>To Process ({toProcess})</a></li>
                                            <li><a onClick={() => this.onClickPrefilter(5)}>Closed ({closed})</a></li>
                                        </ul>
                                        <div>
                                            <Nav tabs>
                                                <NavItem>
                                                    <NavLink
                                                        className={activeTabInd === 0 ? 'active' : ''}
                                                        onClick={() => this.onClickTab(0)}
                                                    >
                                                        All
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        className={activeTabInd === 7 ? 'active' : ''}
                                                        onClick={() => this.onClickTab(7)}
                                                    >
                                                        Today (or by date)
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        className={activeTabInd === 1 ? 'active' : ''}
                                                        onClick={() => this.onClickTab(1)}
                                                    >
                                                        Errors to Correct ({errorsToCorrect})
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        className={activeTabInd === 2 ? 'active' : ''}
                                                        onClick={() => this.onClickTab(2)}
                                                    >
                                                        Missing Labels ({missingLabels})
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        className={activeTabInd === 3 ? 'active' : ''}
                                                        onClick={() => this.onClickTab(3)}
                                                    >
                                                        To Manifest ({toManifest})
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        className={activeTabInd === 4 ? 'active' : ''}
                                                        onClick={() => this.onClickTab(4)}
                                                    >
                                                        To Process ({toProcess})
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        className={activeTabInd === 5 ? 'active' : ''}
                                                        onClick={() => this.onClickTab(5)}
                                                    >
                                                        Closed ({closed})
                                                    </NavLink>
                                                </NavItem>
                                            </Nav>
                                        </div>
                                        <hr />
                                        <div>
                                            <select value={downloadOption} onChange={(e) => this.onDownloadOptionChange(e)}>
                                                <option value="label">Label</option>
                                                <option value="pod">Pod</option>
                                                <option value="new_pod">New Pod</option>
                                            </select>
                                        </div>
                                        <LoadingOverlay
                                            active={loading}
                                            spinner
                                            text='Loading...'
                                        >
                                            <div className="table-responsive" onScroll={this.handleScroll} ref={this.myRef}>
                                                <div className="tbl-header">
                                                    <table className="table table-hover table-bordered sortable fixed_headers">
                                                        <tr>
                                                            <th className="">
                                                                <button className="btn btn-primary multi-download" onClick={() => this.onDownload()}>
                                                                    <i className="icon icon-download"></i>
                                                                </button>
                                                            </th>
                                                            <th className=""></th>
                                                            <th className=""></th>
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
                                                                className={(sortField === 'puPickUpAvailFrom_Date') ? 'current' : ''}
                                                                onClick={() => this.onChangeSortField('puPickUpAvailFrom_Date')} 
                                                                scope="col" 
                                                                nowrap
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
                                                                className={(sortField === 'b_dateBookedDate') ? 'current' : ''}
                                                                onClick={() => this.onChangeSortField('b_dateBookedDate')} 
                                                                scope="col" 
                                                                nowrap
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
                                                                cclassName={(sortField === 'pu_Address_PostalCode') ? 'current' : ''}
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
                                                            <th className=""></th>
                                                            <th className=""></th>
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
                                                                className={(sortField === 'b_client_sales_inv_num') ? 'current' : ''}
                                                                onClick={() => this.onChangeSortField('b_client_sales_inv_num')} 
                                                                scope="col" 
                                                                nowrap
                                                            >
                                                                <p>Client Sales Inv Num</p>
                                                                {
                                                                    (sortField === 'b_client_sales_inv_num') ?
                                                                        (sortDirection > 0) ?
                                                                            <i className="fa fa-sort-up"></i>
                                                                            : <i className="fa fa-sort-down"></i>
                                                                        : <i className="fa fa-sort"></i>
                                                                }
                                                            </th>
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
                                                                className={(sortField === 'v_FPBookingNumber') ? 'current' : ''}
                                                                onClick={() => this.onChangeSortField('v_FPBookingNumber')} 
                                                                scope="col" 
                                                                nowrap
                                                            >
                                                                <p>Consignment</p>
                                                                {
                                                                    (sortField === 'v_FPBookingNumber') ?
                                                                        (sortDirection > 0) ?
                                                                            <i className="fa fa-sort-up"></i>
                                                                            : <i className="fa fa-sort-down"></i>
                                                                        : <i className="fa fa-sort"></i>
                                                                }
                                                            </th>
                                                            <th className=""></th>
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
                                                                className={(sortField === 'b_status_API') ? 'current' : ''}
                                                                onClick={() => this.onChangeSortField('b_status_API')} 
                                                                scope="col" 
                                                                nowrap
                                                            >
                                                                <p>API Status</p>
                                                                {
                                                                    (sortField === 'b_status_API') ?
                                                                        (sortDirection > 0) ?
                                                                            <i className="fa fa-sort-up"></i>
                                                                            : <i className="fa fa-sort-down"></i>
                                                                        : <i className="fa fa-sort"></i>
                                                                }
                                                            </th>
                                                            <th 
                                                                className={(sortField === 's_05_LatestPickUpDateTimeFinal') ? 'current' : ''}
                                                                onClick={() => this.onChangeSortField('s_05_LatestPickUpDateTimeFinal')} 
                                                                scope="col" 
                                                                nowrap
                                                            >
                                                                <p>Pickup Due</p>
                                                                {
                                                                    (sortField === 's_05_LatestPickUpDateTimeFinal') ?
                                                                        (sortDirection > 0) ?
                                                                            <i className="fa fa-sort-up"></i>
                                                                            : <i className="fa fa-sort-down"></i>
                                                                        : <i className="fa fa-sort"></i>
                                                                }
                                                            </th>
                                                            <th 
                                                                className={(sortField === 's_06_LatestDeliveryDateTimeFinal') ? 'current' : ''}
                                                                onClick={() => this.onChangeSortField('s_06_LatestDeliveryDateTimeFinal')} 
                                                                scope="col" 
                                                                nowrap
                                                            >
                                                                <p>Delivery Due</p>
                                                                {
                                                                    (sortField === 's_06_LatestDeliveryDateTimeFinal') ?
                                                                        (sortDirection > 0) ?
                                                                            <i className="fa fa-sort-up"></i>
                                                                            : <i className="fa fa-sort-down"></i>
                                                                        : <i className="fa fa-sort"></i>
                                                                }
                                                            </th>
                                                            <th 
                                                                className={(sortField === 's_20_Actual_Pickup_TimeStamp') ? 'current' : ''}
                                                                onClick={() => this.onChangeSortField('s_20_Actual_Pickup_TimeStamp')} 
                                                                scope="col"
                                                            >
                                                                <p>Collected</p>
                                                                {
                                                                    (sortField === 's_20_Actual_Pickup_TimeStamp') ?
                                                                        (sortDirection > 0) ?
                                                                            <i className="fa fa-sort-up"></i>
                                                                            : <i className="fa fa-sort-down"></i>
                                                                        : <i className="fa fa-sort"></i>
                                                                }
                                                            </th>
                                                            <th 
                                                                className={(sortField === 's_21_Actual_Delivery_TimeStamp') ? 'current' : ''} 
                                                                onClick={() => this.onChangeSortField('s_21_Actual_Delivery_TimeStamp')} 
                                                                scope="col"
                                                            >
                                                                <p>Delivered</p>
                                                                {
                                                                    (sortField === 's_21_Actual_Delivery_TimeStamp') ?
                                                                        (sortDirection > 0) ?
                                                                            <i className="fa fa-sort-up"></i>
                                                                            : <i className="fa fa-sort-down"></i>
                                                                        : <i className="fa fa-sort"></i>
                                                                }
                                                            </th>
                                                            <th className="" scope="col"><p>Deliver_From_Date</p></th>
                                                            <th className="" scope="col"><p>Deliver_By_Date</p></th>
                                                        </tr>
                                                        <tr className="filter-tr">
                                                            <th><input type="checkbox" className="checkall" checked={this.state.checkedAll ? 'checked' : ''} onChange={() => this.onCheckAll()} /></th>
                                                            <th><i className="icon icon-th-list"></i></th>
                                                            <th><i className="icon icon-plus"></i></th>
                                                            <th scope="col"><input type="text" name="b_bookingID_Visual" value={filterInputs['b_bookingID_Visual'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                            <th scope="col"><input type="text" name="puPickUpAvailFrom_Date" value={filterInputs['puPickUpAvailFrom_Date'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                            <th scope="col"><input type="text" name="b_dateBookedDate" value={filterInputs['b_dateBookedDate'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                            <th scope="col"><input type="text" name="puCompany" value={filterInputs['puCompany'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                            <th scope="col"><input type="text" name="pu_Address_Suburb" value={filterInputs['pu_Address_Suburb'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                            <th scope="col"><input type="text" name="pu_Address_State" value={filterInputs['pu_Address_State'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                            <th scope="col"><input type="text" name="pu_Address_PostalCode" value={filterInputs['pu_Address_PostalCode'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                            <th scope="col"><input type="text" name="deToCompanyName" value={filterInputs['deToCompanyName'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                            <th scope="col"><input type="text" name="de_To_Address_Suburb" value={filterInputs['de_To_Address_Suburb'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                            <th scope="col"><input type="text" name="de_To_Address_State" value={filterInputs['de_To_Address_State'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                            <th scope="col"><input type="text" name="de_To_Address_PostalCode" value={filterInputs['de_To_Address_PostalCode'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                            <th className="narrow-column"><i className="icon icon-printer"></i></th>
                                                            <th className="narrow-column"><i className="icon icon-image"></i></th>
                                                            <th scope="col"><input type="text" name="b_clientReference_RA_Numbers" value={filterInputs['b_clientReference_RA_Numbers'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                            <th scope="col"><input type="text" name="b_client_sales_inv_num" value={filterInputs['b_client_sales_inv_num'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                            <th scope="col"><input type="text" name="vx_freight_provider" value={filterInputs['vx_freight_provider'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                            <th scope="col"><input type="text" name="vx_serviceName" value={filterInputs['vx_serviceName'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                            <th scope="col"><input type="text" name="v_FPBookingNumber" value={filterInputs['v_FPBookingNumber'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                            <th className="narrow-column"><i className="fa fa-lock"></i></th>
                                                            <th scope="col"><input type="text" name="b_status" value={filterInputs['b_status'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                            <th scope="col"><input type="text" name="b_status_API" value={filterInputs['b_status_API'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                            <th scope="col"><input type="text" name="s_05_LatestPickUpDateTimeFinal" value={filterInputs['s_05_LatestPickUpDateTimeFinal'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                            <th scope="col"><input type="text" name="s_06_LatestDeliveryDateTimeFinal" value={filterInputs['s_06_LatestDeliveryDateTimeFinal'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                            <th scope="col"><input type="text" name="s_20_Actual_Pickup_TimeStamp" value={filterInputs['s_20_Actual_Pickup_TimeStamp'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                            <th scope="col"><input type="text" name="s_21_Actual_Delivery_TimeStamp" value={filterInputs['s_21_Actual_Delivery_TimeStamp'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                            <th scope="col"></th>
                                                            <th scope="col"></th>
                                                        </tr>
                                                    </table>
                                                </div>
                                                <div className="tbl-content" style={tblContentWidth} onScroll={this.handleScroll}>
                                                    <table className="table table-hover table-bordered sortable fixed_headers">
                                                        <tr className="none">
                                                            <th className="">
                                                                <button className="btn btn-primary multi-download" onClick={() => this.onDownload()}>
                                                                    <i className="icon icon-download"></i>
                                                                </button>
                                                            </th>
                                                            <th className=""></th>
                                                            <th className=""></th>
                                                            <th className="" onClick={() => this.onChangeSortField('b_bookingID_Visual')} scope="col" nowrap>
                                                                <p>Booking ID</p>
                                                                {
                                                                    (sortField === 'b_bookingID_Visual') ?
                                                                        (sortDirection > 0) ?
                                                                            <i className="fa fa-sort-up"></i>
                                                                            : <i className="fa fa-sort-down"></i>
                                                                        : <i className="fa fa-sort"></i>
                                                                }
                                                            </th>
                                                            <th className="" onClick={() => this.onChangeSortField('puPickUpAvailFrom_Date')} scope="col" nowrap>
                                                                <p>Pickup / Manifest</p>
                                                                {
                                                                    (sortField === 'puPickUpAvailFrom_Date') ?
                                                                        (sortDirection > 0) ?
                                                                            <i className="fa fa-sort-up"></i>
                                                                            : <i className="fa fa-sort-down"></i>
                                                                        : <i className="fa fa-sort"></i>
                                                                }
                                                            </th>
                                                            <th className="" onClick={() => this.onChangeSortField('b_dateBookedDate')} scope="col" nowrap>
                                                                <p>Booked Date</p>
                                                                {
                                                                    (sortField === 'b_dateBookedDate') ?
                                                                        (sortDirection > 0) ?
                                                                            <i className="fa fa-sort-up"></i>
                                                                            : <i className="fa fa-sort-down"></i>
                                                                        : <i className="fa fa-sort"></i>
                                                                }
                                                            </th>
                                                            <th className="" onClick={() => this.onChangeSortField('puCompany')} scope="col" nowrap>
                                                                <p>From</p>
                                                                {
                                                                    (sortField === 'puCompany') ?
                                                                        (sortDirection > 0) ?
                                                                            <i className="fa fa-sort-up"></i>
                                                                            : <i className="fa fa-sort-down"></i>
                                                                        : <i className="fa fa-sort"></i>
                                                                }
                                                            </th>
                                                            <th className="" onClick={() => this.onChangeSortField('pu_Address_Suburb')} scope="col" nowrap>
                                                                <p>From Suburb</p>
                                                                {
                                                                    (sortField === 'pu_Address_Suburb') ?
                                                                        (sortDirection > 0) ?
                                                                            <i className="fa fa-sort-up"></i>
                                                                            : <i className="fa fa-sort-down"></i>
                                                                        : <i className="fa fa-sort"></i>
                                                                }
                                                            </th>
                                                            <th className="" onClick={() => this.onChangeSortField('pu_Address_State')} scope="col" nowrap>
                                                                <p>From State</p>
                                                                {
                                                                    (sortField === 'pu_Address_State') ?
                                                                        (sortDirection > 0) ?
                                                                            <i className="fa fa-sort-up"></i>
                                                                            : <i className="fa fa-sort-down"></i>
                                                                        : <i className="fa fa-sort"></i>
                                                                }
                                                            </th>
                                                            <th className="" onClick={() => this.onChangeSortField('pu_Address_PostalCode')} scope="col" nowrap>
                                                                <p>From Postal Code</p>
                                                                {
                                                                    (sortField === 'pu_Address_PostalCode') ?
                                                                        (sortDirection > 0) ?
                                                                            <i className="fa fa-sort-up"></i>
                                                                            : <i className="fa fa-sort-down"></i>
                                                                        : <i className="fa fa-sort"></i>
                                                                }
                                                            </th>
                                                            <th className="" onClick={() => this.onChangeSortField('deToCompanyName')} scope="col" nowrap>
                                                                <p>To</p>
                                                                {
                                                                    (sortField === 'deToCompanyName') ?
                                                                        (sortDirection > 0) ?
                                                                            <i className="fa fa-sort-up"></i>
                                                                            : <i className="fa fa-sort-down"></i>
                                                                        : <i className="fa fa-sort"></i>
                                                                }
                                                            </th>
                                                            <th className="" onClick={() => this.onChangeSortField('de_To_Address_Suburb')} scope="col" nowrap>
                                                                <p>To Suburb</p>
                                                                {
                                                                    (sortField === 'de_To_Address_Suburb') ?
                                                                        (sortDirection > 0) ?
                                                                            <i className="fa fa-sort-up"></i>
                                                                            : <i className="fa fa-sort-down"></i>
                                                                        : <i className="fa fa-sort"></i>
                                                                }
                                                            </th>
                                                            <th className="" onClick={() => this.onChangeSortField('de_To_Address_State')} scope="col" nowrap>
                                                                <p>To State</p>
                                                                {
                                                                    (sortField === 'de_To_Address_State') ?
                                                                        (sortDirection > 0) ?
                                                                            <i className="fa fa-sort-up"></i>
                                                                            : <i className="fa fa-sort-down"></i>
                                                                        : <i className="fa fa-sort"></i>
                                                                }
                                                            </th>
                                                            <th className="" onClick={() => this.onChangeSortField('de_To_Address_PostalCode')} scope="col" nowrap>
                                                                <p>To Postal Code</p>
                                                                {
                                                                    (sortField === 'de_To_Address_PostalCode') ?
                                                                        (sortDirection > 0) ?
                                                                            <i className="fa fa-sort-up"></i>
                                                                            : <i className="fa fa-sort-down"></i>
                                                                        : <i className="fa fa-sort"></i>
                                                                }
                                                            </th>
                                                            <th className=""></th>
                                                            <th className=""></th>
                                                            <th className="" onClick={() => this.onChangeSortField('b_clientReference_RA_Numbers')} scope="col" nowrap>
                                                                <p>Reference</p>
                                                                {
                                                                    (sortField === 'b_clientReference_RA_Numbers') ?
                                                                        (sortDirection > 0) ?
                                                                            <i className="fa fa-sort-up"></i>
                                                                            : <i className="fa fa-sort-down"></i>
                                                                        : <i className="fa fa-sort"></i>
                                                                }
                                                            </th>
                                                            <th className="" onClick={() => this.onChangeSortField('vx_freight_provider')} scope="col" nowrap>
                                                                <p>Freight Provider</p>
                                                                {
                                                                    (sortField === 'vx_freight_provider') ?
                                                                        (sortDirection > 0) ?
                                                                            <i className="fa fa-sort-up"></i>
                                                                            : <i className="fa fa-sort-amount-desc"></i>
                                                                        : <i className="fa fa-sort"></i>
                                                                }
                                                            </th>
                                                            <th className="" onClick={() => this.onChangeSortField('vx_serviceName')} scope="col" nowrap>
                                                                <p>Service</p>
                                                                {
                                                                    (sortField === 'vx_serviceName') ?
                                                                        (sortDirection > 0) ?
                                                                            <i className="fa fa-sort-up"></i>
                                                                            : <i className="fa fa-sort-down"></i>
                                                                        : <i className="fa fa-sort"></i>
                                                                }
                                                            </th>
                                                            <th className="" onClick={() => this.onChangeSortField('v_FPBookingNumber')} scope="col" nowrap>
                                                                <p>Consignment</p>
                                                                {
                                                                    (sortField === 'v_FPBookingNumber') ?
                                                                        (sortDirection > 0) ?
                                                                            <i className="fa fa-sort-up"></i>
                                                                            : <i className="fa fa-sort-down"></i>
                                                                        : <i className="fa fa-sort"></i>
                                                                }
                                                            </th>
                                                            <th className="" onClick={() => this.onChangeSortField('b_status')} scope="col" nowrap>
                                                                <p>Status</p>
                                                                {
                                                                    (sortField === 'b_status') ?
                                                                        (sortDirection > 0) ?
                                                                            <i className="fa fa-sort-up"></i>
                                                                            : <i className="fa fa-sort-down"></i>
                                                                        : <i className="fa fa-sort"></i>
                                                                }
                                                            </th>
                                                            <th className="" onClick={() => this.onChangeSortField('b_status_API')} scope="col" nowrap>
                                                                <p>API Status</p>
                                                                {
                                                                    (sortField === 'b_status_API') ?
                                                                        (sortDirection > 0) ?
                                                                            <i className="fa fa-sort-up"></i>
                                                                            : <i className="fa fa-sort-down"></i>
                                                                        : <i className="fa fa-sort"></i>
                                                                }
                                                            </th>
                                                            <th className="" onClick={() => this.onChangeSortField('s_05_LatestPickUpDateTimeFinal')} scope="col" nowrap>
                                                                <p>Pickup Due</p>
                                                                {
                                                                    (sortField === 's_05_LatestPickUpDateTimeFinal') ?
                                                                        (sortDirection > 0) ?
                                                                            <i className="fa fa-sort-up"></i>
                                                                            : <i className="fa fa-sort-down"></i>
                                                                        : <i className="fa fa-sort"></i>
                                                                }
                                                            </th>
                                                            <th className="" onClick={() => this.onChangeSortField('s_06_LatestDeliveryDateTimeFinal')} scope="col" nowrap>
                                                                <p>Delivery Due</p>
                                                                {
                                                                    (sortField === 's_06_LatestDeliveryDateTimeFinal') ?
                                                                        (sortDirection > 0) ?
                                                                            <i className="fa fa-sort-up"></i>
                                                                            : <i className="fa fa-sort-down"></i>
                                                                        : <i className="fa fa-sort"></i>
                                                                }
                                                            </th>
                                                            <th className="" onClick={() => this.onChangeSortField('s_20_Actual_Pickup_TimeStamp')} scope="col">
                                                                <p>Collected</p>
                                                                {
                                                                    (sortField === 's_20_Actual_Pickup_TimeStamp') ?
                                                                        (sortDirection > 0) ?
                                                                            <i className="fa fa-sort-up"></i>
                                                                            : <i className="fa fa-sort-down"></i>
                                                                        : <i className="fa fa-sort"></i>
                                                                }
                                                            </th>
                                                            <th className="" onClick={() => this.onChangeSortField('s_21_Actual_Delivery_TimeStamp')} scope="col">
                                                                <p>Delivered</p>
                                                                {
                                                                    (sortField === 's_21_Actual_Delivery_TimeStamp') ?
                                                                        (sortDirection > 0) ?
                                                                            <i className="fa fa-sort-up"></i>
                                                                            : <i className="fa fa-sort-down"></i>
                                                                        : <i className="fa fa-sort"></i>
                                                                }
                                                            </th>
                                                            <th className="" scope="col"><p>Deliver_From_Date</p></th>
                                                            <th className="" scope="col"><p>Deliver_By_Date</p></th>
                                                        </tr>
                                                        <tr className="filter-tr none">
                                                            <th><input type="checkbox" className="checkall" checked={this.state.checkedAll ? 'checked' : ''} onChange={() => this.onCheckAll()} /></th>
                                                            <th><i className="icon icon-th-list"></i></th>
                                                            <th><i className="icon icon-plus"></i></th>
                                                            <th scope="col"><input type="text" name="b_bookingID_Visual" value={filterInputs['b_bookingID_Visual'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                            <th scope="col"><input type="text" name="puPickUpAvailFrom_Date" value={filterInputs['puPickUpAvailFrom_Date'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                            <th scope="col"><input type="text" name="b_dateBookedDate" value={filterInputs['b_dateBookedDate'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                            <th scope="col"><input type="text" name="puCompany" value={filterInputs['puCompany'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                            <th scope="col"><input type="text" name="pu_Address_Suburb" value={filterInputs['pu_Address_Suburb'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                            <th scope="col"><input type="text" name="pu_Address_State" value={filterInputs['pu_Address_State'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                            <th scope="col"><input type="text" name="pu_Address_PostalCode" value={filterInputs['pu_Address_PostalCode'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                            <th scope="col"><input type="text" name="deToCompanyName" value={filterInputs['deToCompanyName'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                            <th scope="col"><input type="text" name="de_To_Address_Suburb" value={filterInputs['de_To_Address_Suburb'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                            <th scope="col"><input type="text" name="de_To_Address_State" value={filterInputs['de_To_Address_State'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                            <th scope="col"><input type="text" name="de_To_Address_PostalCode" value={filterInputs['de_To_Address_PostalCode'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                            <th className="narrow-column"><i className="icon icon-printer"></i></th>
                                                            <th className="narrow-column"><i className="icon icon-image"></i></th>
                                                            <th scope="col"><input type="text" name="b_clientReference_RA_Numbers" value={filterInputs['b_clientReference_RA_Numbers'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                            <th scope="col"><input type="text" name="vx_freight_provider" value={filterInputs['vx_freight_provider'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                            <th scope="col"><input type="text" name="vx_serviceName" value={filterInputs['vx_serviceName'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                            <th scope="col"><input type="text" name="v_FPBookingNumber" value={filterInputs['v_FPBookingNumber'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                            <th scope="col"><input type="text" name="b_status" value={filterInputs['b_status'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                            <th scope="col"><input type="text" name="b_status_API" value={filterInputs['b_status_API'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                            <th scope="col"><input type="text" name="s_05_LatestPickUpDateTimeFinal" value={filterInputs['s_05_LatestPickUpDateTimeFinal'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                            <th scope="col"><input type="text" name="s_06_LatestDeliveryDateTimeFinal" value={filterInputs['s_06_LatestDeliveryDateTimeFinal'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                            <th scope="col"><input type="text" name="s_20_Actual_Pickup_TimeStamp" value={filterInputs['s_20_Actual_Pickup_TimeStamp'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                            <th scope="col"><input type="text" name="s_21_Actual_Delivery_TimeStamp" value={filterInputs['s_21_Actual_Delivery_TimeStamp'] || ''} onChange={(e) => this.onChangeFilterInput(e)} onKeyPress={(e) => this.onKeyPress(e)} /></th>
                                                            <th scope="col"></th>
                                                            <th scope="col"></th>
                                                        </tr>
                                                        { bookingsList }
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

                <XLSModal
                    isShowXLSModal={isShowXLSModal}
                    toggleShowXLSModal={this.toggleShowXLSModal}
                    generateXLS={(startDate, endDate, emailAddr) => this.props.generateXLS(startDate, endDate, emailAddr)}
                />
            </div>            
        );
    }
}

const mapStateToProps = (state) => {
    return {
        bookings: state.booking.bookings,
        bookingsCnt: state.booking.bookingsCnt,
        errorsToCorrect: state.booking.errorsToCorrect,
        missingLabels: state.booking.missingLabels,
        toManifest: state.booking.toManifest,
        toProcess: state.booking.toProcess,
        closed: state.booking.closed,
        needUpdateBookings: state.booking.needUpdateBookings,
        bookingLines: state.bookingLine.bookingLines,
        bookingLineDetails: state.bookingLineDetail.bookingLineDetails,
        warehouses: state.warehouse.warehouses,
        redirect: state.auth.redirect,
        startDate: state.booking.startDate,
        endDate: state.booking.endDate,
        warehouseId: state.booking.warehouseId,
        itemCountPerPage: state.booking.itemCountPerPage,
        sortField: state.booking.sortField,
        columnFilters: state.booking.columnFilters,
        prefilterInd: state.booking.prefilterInd,
        simpleSearchKeyword: state.booking.simpleSearchKeyword,
        newPod: state.booking.newPod,
        errorMessage: state.booking.errorMessage,
        dmeClients: state.auth.dmeClients,
        username: state.auth.username,
        clientPK: state.booking.clientPK,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        getBookings: (startDate, endDate, clientPK, warehouseId, itemCountPerPage, sortField, columnFilters, prefilterInd, simpleSearchKeyword, newPod) => dispatch(getBookings(startDate, endDate, clientPK, warehouseId, itemCountPerPage, sortField, columnFilters, prefilterInd, simpleSearchKeyword, newPod)),
        setGetBookingsFilter: (key, value) => dispatch(setGetBookingsFilter(key, value)),
        setAllGetBookingsFilter: (startDate, endDate, clientPK, warehouseId, itemCountPerPage, sortField, columnFilters, prefilterInd, simpleSearchKeyword, newPod) => dispatch(setAllGetBookingsFilter(startDate, endDate, clientPK, warehouseId, itemCountPerPage, sortField, columnFilters, prefilterInd, simpleSearchKeyword, newPod)),
        setNeedUpdateBookingsState: (boolFlag) => dispatch(setNeedUpdateBookingsState(boolFlag)),
        updateBooking: (id, booking) => dispatch(updateBooking(id, booking)),
        getBookingLines: (bookingId) => dispatch(getBookingLines(bookingId)),
        getBookingLineDetails: (bookingId) => dispatch(getBookingLineDetails(bookingId)),
        getWarehouses: () => dispatch(getWarehouses()),
        getUserDateFilterField: () => dispatch(getUserDateFilterField()),
        allTrigger: () => dispatch(allTrigger()),
        alliedBooking: (bookingId) => dispatch(alliedBooking(bookingId)),
        stBooking: (bookingId) => dispatch(stBooking(bookingId)),
        getSTLabel: (bookingId) => dispatch(getSTLabel(bookingId)),
        getAlliedLabel: (bookingId) => dispatch(getAlliedLabel(bookingId)),
        stOrder: () => dispatch(stOrder()),
        getExcel: () => dispatch(getExcel()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        getDMEClients: () => dispatch(getDMEClients()),
        generateXLS: (startDate, endDate, emailAddr) => dispatch(generateXLS(startDate, endDate, emailAddr)),
        changeBookingsStatus: (status, bookingIds) => dispatch(changeBookingsStatus(status, bookingIds)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AllBookingsPage));

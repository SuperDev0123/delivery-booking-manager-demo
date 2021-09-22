import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';

import Clock from 'react-live-clock';
import _ from 'lodash';
import axios from 'axios';
import Select from 'react-select';
import moment from 'moment-timezone';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import cellEditFactory, {Type} from 'react-bootstrap-table2-editor';
import LoadingOverlay from 'react-loading-overlay';
import DropzoneComponent from 'react-dropzone-component';
import { Button, Modal as ReactstrapModal, ModalHeader, ModalBody, ModalFooter, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import Modal from 'react-modal';
import DateTimePicker from 'react-datetime-picker';
import TimePicker from 'react-time-picker';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import user from '../public/images/user.png';
import imgGeneral from  '../public/images/general_email_white.png';
import imgPod from  '../public/images/pod_email_white.png';
import imgReturn from  '../public/images/returns_email_white.png';
import imgUnpacked from  '../public/images/returns_unpacked_email.png';
import imgFutile from '../public/images/futile_email.png';
import imgLogsSlider from '../public/images/email_logs_slider.png';
import { API_HOST, STATIC_HOST, HTTP_PROTOCOL } from '../config';
// import CommTooltipItem from '../components/Tooltip/CommTooltipComponent';
// Custom Modals
// import SwitchClientModal from '../components/CommonModals/SwitchClientModal';
import StatusLockModal from '../components/CommonModals/StatusLockModal';
import StatusNoteModal from '../components/CommonModals/StatusNoteModal';
// Custom Sliders
import LineAndLineDetailSlider from '../components/Sliders/LineAndLineDetailSlider';
import LineTrackingSlider from '../components/Sliders/LineTrackingSlider';
import StatusHistorySlider from '../components/Sliders/StatusHistorySlider';
import ProjectDataSlider from '../components/Sliders/ProjectDataSlider';
import TooltipItem from '../components/Tooltip/TooltipComponent';
import ConfirmModal from '../components/CommonModals/ConfirmModal';
import FPPricingSlider from '../components/Sliders/FPPricingSlider';
import EmailLogSlider from '../components/Sliders/EmailLogSlider';
import CostSlider from '../components/Sliders/CostSlider';
import FreightOptionAccordion from '../components/Accordion/FreightOptionAccordion';
// Services
import { verifyToken, cleanRedirectState, getDMEClients } from '../state/services/authService';
import { getCreatedForInfos } from '../state/services/userService';
import { getBooking, getAttachmentHistory, getSuburbStrings, getDeliverySuburbStrings, saveBooking, updateBooking, duplicateBooking, setFetchGeoInfoFlag, clearErrorMessage, tickManualBook, manualBook, fpPricing, getPricingInfos, sendEmail, autoAugmentBooking, revertAugmentBooking, augmentPuDate, resetNoBooking, getClientProcessMgr, updateAugment, repack } from '../state/services/bookingService';
// FP Services
import { fpBook, fpEditBook, fpRebook, fpLabel, fpCancelBook, fpPod, fpReprint, fpTracking, dmeLabel } from '../state/services/bookingService';
import { getBookingLines, createBookingLine, updateBookingLine, deleteBookingLine, duplicateBookingLine, calcCollected } from '../state/services/bookingLinesService';
import { getBookingLineDetails, createBookingLineDetail, updateBookingLineDetail, deleteBookingLineDetail, duplicateBookingLineDetail, moveLineDetails } from '../state/services/bookingLineDetailsService';
import { getWarehouses } from '../state/services/warehouseService';
import { getPackageTypes, getAllBookingStatus, createStatusHistory, updateStatusHistory, getBookingStatusHistory, getStatusDetails, getStatusActions, createStatusDetail, createStatusAction, getApiBCLs, getAllFPs, getEmailLogs, saveStatusHistoryPuInfo, updateClientEmployee, getZohoTicketsWithBookingId, getAllErrors, updateZohoTicket, getZohoTicketSummaries, moveZohoTicket } from '../state/services/extraService';
// Validation
import { isFormValid, isValid4Label, isValid4Book } from '../commons/validations';
// Constants
import { timeDiff } from '../commons/constants';

class BookingPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            formInputs: {},
            selected: 'dme',
            booking: {},
            bookingLines: [],
            bookingLineDetails: [],
            nextBookingId: 0,
            prevBookingId: 0,
            loading: false,
            loadingGeoPU: false,
            loadingGeoDeTo: false,
            loadingBookingLine: false,
            loadingBookingLineDetail: false,
            loadingBookingSave: false,
            loadingBookingUpdate: false,
            loadingZohoTickets: false,
            loadingZohoDepartments: false,
            loadingZohoTicketSummaries: false,
            loadingComm: false,
            products: [],
            bookingLinesListProduct: [],
            bookingLineDetailsProduct: [],
            deletedBookingLine: -1,
            bBooking: null,
            isGoing: false,
            checkBoxStatus: [],
            selectedOption: null,
            puStates: [],
            puPostalCodes: [],
            puSuburbs: [],
            loadedPostal: false,
            loadedSuburb: false,
            deToStates: [],
            deToPostalCodes: [],
            deToSuburbs: [],
            deLoadedPostal: false,
            deLoadedSuburb: false,
            puState: {value: ''},
            puSuburb: {value: ''},
            puPostalCode: {value: ''},
            deToState: {value: ''},
            deToSuburb: {value: ''},
            deToPostalCode: {value: ''},
            isBookedBooking: false,
            isLockedBooking: false,
            puTimeZone: null,
            deTimeZone: null,
            attachmentsHistory: [],
            selectionChanged: 0,
            AdditionalServices: [],
            isShowDuplicateBookingOptionsModal: false,
            switchInfo: false,
            dupLineAndLineDetail: false,
            clientname: null,
            isBookingSelected: false,
            isShowSwitchClientModal: false,
            statusHistories: [],
            findKeyword: null,
            isShowLineSlider: false,
            isShowStatusHistorySlider: false,
            selectedLineIndex: -1,
            isBookingModified: false,
            curViewMode: 0, // 0: Show view, 1: Create view, 2: Update view
            packageTypes: [],
            allBookingStatus: [],
            isShowLineTrackingSlider: false,
            activeTabInd: 0,
            statusDetails: [],
            statusActions: [],
            isShowStatusLockModal: false,
            isShowProjectDataSlider: false,
            isShowStatusDetailInput: false,
            isShowStatusActionInput: false,
            isShowStatusNoteModal: false,
            isShowDeleteFileConfirmModal: false,
            isShowEmailLogSlider: false,
            isShowCostSlider: false,
            isShowAugmentInfoPopup: false,
            isAugmentEditable: false,
            isShowManualRepackModal: false,
            bookingId: null,
            apiBCLs: [],
            createdForInfos: [],
            currentNoteModalField: null,
            pricingInfos: [],
            isShowFPPricingSlider: false,
            selectedFileOption: null,
            uploadOption: null,
            xReadyStatus: null,
            zohoTickets: [],
            zohoDepartments: [],
            zohoTicketSummaries: [],
            errors: [],
            clientprocess: {},
            puCommunicates: [],
            deCommunicates: [],
            currentPackedStatus: 'original',
        };

        this.djsConfig = {
            addRemoveLinks: true,
            autoProcessQueue: false,
            params: { filename: 'file' }
        };

        this.attachmentsDropzoneComponentConfig = {
            iconFiletypes: ['.xlsx'],
            showFiletypeIcon: true,
            postUrl: HTTP_PROTOCOL + '://' + API_HOST + '/upload/attachments/',
        };

        this.labelDropzoneComponentConfig = {
            iconFiletypes: ['.pdf', '.png'],
            showFiletypeIcon: true,
            postUrl: HTTP_PROTOCOL + '://' + API_HOST + '/upload/label/',
        };

        this.podDropzoneComponentConfig = {
            iconFiletypes: ['.pdf', '.png'],
            showFiletypeIcon: true,
            postUrl: HTTP_PROTOCOL + '://' + API_HOST + '/upload/pod/',
        };

        moment.tz.setDefault('Australia/Sydney');
        this.tzOffset = new Date().getTimezoneOffset() === 0 ? 0 : -1 * new Date().getTimezoneOffset() / 60;
        this.attachmentsDz = null;
        this.labelDz = null;
        this.podDz = null;
        this.toggleDuplicateBookingOptionsModal = this.toggleDuplicateBookingOptionsModal.bind(this);
        this.toggleLineSlider = this.toggleLineSlider.bind(this);
        this.toggleLineTrackingSlider = this.toggleLineTrackingSlider.bind(this);
        this.toggleStatusHistorySlider = this.toggleStatusHistorySlider.bind(this);
        this.toggleDateSlider = this.toggleDateSlider.bind(this);
        this.toggleStatusLockModal = this.toggleStatusLockModal.bind(this);
        this.toggleStatusNoteModal = this.toggleStatusNoteModal.bind(this);
        this.toggleDeleteFileConfirmModal = this.toggleDeleteFileConfirmModal.bind(this);
        this.toggleUpdateCreatedForEmailConfirmModal = this.toggleUpdateCreatedForEmailConfirmModal.bind(this);
        this.toggleFPPricingSlider = this.toggleFPPricingSlider.bind(this);
        this.toggleEmailLogSlider = this.toggleEmailLogSlider.bind(this);
        this.toggleCostSlider = this.toggleCostSlider.bind(this);
        this.onLoadPricingErrors = this.onLoadPricingErrors.bind(this);
        this.toggleManualRepackModal = this.toggleManualRepackModal.bind(this);
    }

    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        saveBooking: PropTypes.func.isRequired,
        manualBook: PropTypes.func.isRequired,
        tickManualBook: PropTypes.func.isRequired,
        duplicateBooking: PropTypes.func.isRequired,
        autoAugmentBooking: PropTypes.func.isRequired,
        revertAugmentBooking: PropTypes.func.isRequired,
        augmentPuDate: PropTypes.func.isRequired,
        createBookingLine: PropTypes.func.isRequired,
        duplicateBookingLine: PropTypes.func.isRequired,
        deleteBookingLine: PropTypes.func.isRequired,
        updateBookingLine: PropTypes.func.isRequired,
        createBookingLineDetail: PropTypes.func.isRequired,
        duplicateBookingLineDetail: PropTypes.func.isRequired,
        deleteBookingLineDetail: PropTypes.func.isRequired,
        updateBookingLineDetail: PropTypes.func.isRequired,
        moveLineDetails: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.bool.isRequired,
        location: PropTypes.object.isRequired,
        getBooking: PropTypes.func.isRequired,
        getSuburbStrings: PropTypes.func.isRequired,
        getDeliverySuburbStrings: PropTypes.func.isRequired,
        getBookingLines: PropTypes.func.isRequired,
        getBookingLineDetails: PropTypes.func.isRequired,
        fpBook: PropTypes.func.isRequired,
        fpRebook: PropTypes.func.isRequired,
        fpPod: PropTypes.func.isRequired,
        fpEditBook: PropTypes.func.isRequired,
        fpLabel: PropTypes.func.isRequired,
        fpReprint: PropTypes.func.isRequired,
        fpTracking: PropTypes.func.isRequired,
        fpPricing: PropTypes.func.isRequired,
        dmeLabel: PropTypes.func.isRequired,
        getPricingInfos: PropTypes.func.isRequired,
        updateBooking: PropTypes.func.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
        getAttachmentHistory: PropTypes.func.isRequired,
        getWarehouses: PropTypes.func.isRequired,
        getDMEClients: PropTypes.func.isRequired,
        fpCancelBook: PropTypes.func.isRequired,
        getBookingStatusHistory: PropTypes.func.isRequired,
        getPackageTypes: PropTypes.func.isRequired,
        getAllBookingStatus: PropTypes.func.isRequired,
        createStatusHistory: PropTypes.func.isRequired,
        updateStatusHistory: PropTypes.func.isRequired,
        getStatusActions: PropTypes.func.isRequired,
        getStatusDetails: PropTypes.func.isRequired,
        createStatusAction: PropTypes.func.isRequired,
        createStatusDetail: PropTypes.func.isRequired,
        calcCollected: PropTypes.func.isRequired,
        getApiBCLs: PropTypes.func.isRequired,
        setFetchGeoInfoFlag: PropTypes.bool.isRequired,
        clearErrorMessage: PropTypes.bool.isRequired,
        getAllFPs: PropTypes.func.isRequired,
        sendEmail: PropTypes.func.isRequired,
        getEmailLogs: PropTypes.func.isRequired,
        saveStatusHistoryPuInfo: PropTypes.func.isRequired,
        getCreatedForInfos: PropTypes.func.isRequired,
        updateClientEmployee: PropTypes.func.isRequired,
        getZohoTicketsWithBookingId: PropTypes.func.isRequired,
        updateZohoTicket: PropTypes.func.isRequired,
        moveZohoTicket: PropTypes.func.isRequired,
        getZohoTicketSummaries: PropTypes.func.isRequired,
        getAllErrors: PropTypes.func.isRequired,
        resetNoBooking: PropTypes.func.isRequired,
        getClientProcessMgr: PropTypes.func.isRequired,
        updateAugment: PropTypes.func.isRequired,
        repack: PropTypes.func.isRequired,
        // Data
        allFPs: PropTypes.array.isRequired,
        dmeClients: PropTypes.array.isRequired,
        warehouses: PropTypes.array.isRequired,
        emailLogs: PropTypes.array.isRequired,
        clientId: PropTypes.string.isRequired,
        bookingLines: PropTypes.array,
    };

    componentDidMount() {
        const token = localStorage.getItem('token');

        if (token && token.length > 0) {
            this.props.verifyToken();
        } else {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.history.push('/');
        }

        var urlParams = new URLSearchParams(window.location.search);
        var bookingId = urlParams.get('bookingid');

        if (bookingId) {
            this.props.getBooking(bookingId, 'id');
            // this.props.getZohoTicketsWithBookingId(bookingId);
            // this.props.getZohoTicketSummaries();
            this.setState({bookingId, loading: true, curViewMode: 0});
        } else {
            this.props.getBooking();
            this.setState({loading: true, curViewMode: 0});
            // this.props.getSuburbStrings('state', undefined);
            // this.props.getDeliverySuburbStrings('state', undefined);
        }

        let that = this;
        setTimeout(() => {
            that.props.getAllBookingStatus();
            that.props.getCreatedForInfos();
            that.props.getWarehouses();
            that.props.getAllFPs();
        }, 1000);

        setTimeout(() => {
            that.props.getDMEClients();
            that.props.getPackageTypes();
            that.props.getStatusDetails();
            that.props.getStatusActions();
        }, 3000);

        Modal.setAppElement(this.el);
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const {attachments, puSuburbs, puPostalCodes, puStates, deToSuburbs, deToPostalCodes, deToStates, redirect, booking, bookingLines, bookingLineDetails, bBooking, nextBookingId, prevBookingId, needUpdateBooking, needUpdateBookingLines, needUpdateBookingLineDetails, clientname, noBooking, packageTypes, statusHistories, allBookingStatus, needUpdateStatusHistories, statusDetails, statusActions, needUpdateStatusActions, needUpdateStatusDetails, username, apiBCLs, needToFetchGeoInfo, bookingErrorMessage, qtyTotal, cntAttachments, pricingInfos, createdForInfos, zohoTickets, zohoDepartments, zohoTicketSummaries, loadingZohoDepartments, loadingZohoTickets, loadingZohoTicketSummaries, errors, clientprocess} = newProps;
        const {isBookedBooking} = this.state;
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

        if (zohoTickets) {
            this.setState({zohoTickets});
        }

        if (zohoDepartments) {
            this.setState({zohoDepartments});
        }

        if (zohoTicketSummaries) {
            this.setState({zohoTicketSummaries});
        }

        if (this.state.loadingZohoTickets !== loadingZohoTickets) {
            this.setState({loadingZohoTickets});
        }

        if (this.state.loadingZohoDepartments !== loadingZohoDepartments) {
            this.setState({loadingZohoDepartments});
        }

        if (this.state.loadingZohoTicketSummaries !== loadingZohoTicketSummaries) {
            this.setState({loadingZohoTicketSummaries});
        }

        if (createdForInfos) {
            this.setState({createdForInfos});
        }

        if (needUpdateStatusDetails) {
            this.props.getStatusDetails();
        }

        if (needUpdateStatusActions) {
            this.props.getStatusActions();
        }

        if (packageTypes) {
            this.setState({packageTypes});
        }

        if (statusHistories) {
            this.setState({statusHistories});
        }

        if (allBookingStatus) {
            this.setState({allBookingStatus});
        }

        if (statusActions) {
            this.setState({statusActions});
        }

        if (statusDetails) {
            this.setState({statusDetails});
        }

        if (apiBCLs) {
            this.setState({apiBCLs});
        }

        if (qtyTotal && qtyTotal > 0) {
            this.setState({ qtyTotal, cntAttachments });
        }

        if (bookingLines) {
            const calcedbookingLines = this.calcBookingLine(this.state.booking, bookingLines, false);
            this.setState({bookingLines: calcedbookingLines});
            let bookingLinesListProduct = [];
            bookingLinesListProduct = calcedbookingLines.map((bookingLine, index) => {
                let result = {};
                result['index'] = index + 1;
                result['pk_lines_id'] = bookingLine.pk_lines_id ? bookingLine.pk_lines_id : '';
                result['e_type_of_packaging'] = bookingLine.e_type_of_packaging ? bookingLine.e_type_of_packaging : '';
                result['e_item'] = bookingLine.e_item ? bookingLine.e_item : '';
                result['e_qty'] = bookingLine.e_qty ? bookingLine.e_qty : 0;
                result['e_weightUOM'] = bookingLine.e_weightUOM ? bookingLine.e_weightUOM : 'Kgs';
                result['e_weightPerEach'] = bookingLine.e_weightPerEach ? bookingLine.e_weightPerEach : 0;
                result['e_Total_KG_weight'] = bookingLine.e_Total_KG_weight ? bookingLine.e_Total_KG_weight.toFixed(2) : 0;
                result['e_dimUOM'] = bookingLine.e_dimUOM ? bookingLine.e_dimUOM : 'CM';
                result['e_dimLength'] = bookingLine.e_dimLength ? bookingLine.e_dimLength : 0;
                result['e_dimWidth'] = bookingLine.e_dimWidth ? bookingLine.e_dimWidth : 0;
                result['e_dimHeight'] = bookingLine.e_dimHeight ? bookingLine.e_dimHeight : 0;
                result['e_1_Total_dimCubicMeter'] = bookingLine.e_1_Total_dimCubicMeter ? bookingLine.e_1_Total_dimCubicMeter.toFixed(2) : 0;
                result['total_2_cubic_mass_factor_calc'] = bookingLine.e_1_Total_dimCubicMeter ? (Number.parseFloat(bookingLine.e_1_Total_dimCubicMeter).toFixed(4) * 250).toFixed(2) : 0;
                result['e_qty_awaiting_inventory'] = bookingLine.e_qty_awaiting_inventory ? bookingLine.e_qty_awaiting_inventory : 0;
                result['e_qty_collected'] = bookingLine.e_qty_collected ? bookingLine.e_qty_collected : 0;
                result['e_qty_scanned_depot'] = bookingLine.e_qty_scanned_depot ? bookingLine.e_qty_scanned_depot : 0;
                result['e_qty_delivered'] = bookingLine.e_qty_delivered ? bookingLine.e_qty_delivered : 0;
                result['e_qty_adjusted_delivered'] = bookingLine.e_qty_adjusted_delivered ? bookingLine.e_qty_adjusted_delivered : 0;
                result['e_qty_damaged'] = bookingLine.e_qty_damaged ? bookingLine.e_qty_damaged : 0;
                result['e_qty_returned'] = bookingLine.e_qty_returned ? bookingLine.e_qty_returned : 0;
                result['e_qty_shortages'] = bookingLine.e_qty_shortages ? bookingLine.e_qty_shortages : 0;
                result['e_qty_scanned_fp'] = bookingLine.e_qty_scanned_fp ? bookingLine.e_qty_scanned_fp : 0;
                result['is_scanned'] = bookingLine.is_scanned;
                result['pk_booking_lines_id'] = bookingLine.pk_booking_lines_id;
                result['picked_up_timestamp'] = bookingLine.picked_up_timestamp;
                result['sscc'] = bookingLine.sscc;
                result['packed_status'] = bookingLine.packed_status;

                // Calc
                result['e_qty_adjusted_delivered'] = result['e_qty_delivered'] - result['e_qty_damaged'] - result['e_qty_returned'] - result['e_qty_shortages'];

                return result;
            });

            if (bookingLineDetails) {
                const tempBookings = bookingLineDetails;
                let bookingLineDetailsProduct = [];
                bookingLineDetailsProduct = tempBookings.map((bookingLineDetail) => {
                    let result = {};
                    const product = bookingLinesListProduct.find(product => product.pk_booking_lines_id === bookingLineDetail.fk_booking_lines_id);
                    result['line_index'] = product ? product['index'] : 0;
                    result['pk_id_lines_data'] = bookingLineDetail.pk_id_lines_data ? bookingLineDetail.pk_id_lines_data : '';
                    result['modelNumber'] = bookingLineDetail.modelNumber ? bookingLineDetail.modelNumber : '';
                    result['itemDescription'] = bookingLineDetail.itemDescription ? bookingLineDetail.itemDescription : '';
                    result['quantity'] = bookingLineDetail.quantity ? bookingLineDetail.quantity : null;
                    result['itemFaultDescription'] = bookingLineDetail.itemFaultDescription ? bookingLineDetail.itemFaultDescription : '';
                    result['insuranceValueEach'] = bookingLineDetail.insuranceValueEach ? bookingLineDetail.insuranceValueEach : null;
                    result['gap_ra'] = bookingLineDetail.gap_ra ? bookingLineDetail.gap_ra : '';
                    result['clientRefNumber'] = bookingLineDetail.clientRefNumber ? bookingLineDetail.clientRefNumber : '';
                    result['fk_booking_lines_id'] = bookingLineDetail.fk_booking_lines_id ? bookingLineDetail.fk_booking_lines_id : '';
                    return result;
                });

                this.setState({bookingLineDetailsProduct, bookingLineDetails, loadingBookingLineDetail: false});
            }

            this.setState({products: bookingLinesListProduct, bookingLinesListProduct, loadingBookingLine: false});
        }

        if (needUpdateBookingLines && booking) {
            console.log('@1 - ');
            this.setState({loadingBookingLine: true});
            this.setState({loadingBookingLineDetail: true});
            this.props.getBookingLines(booking.pk_booking_id);
            this.props.getBookingLineDetails(booking.pk_booking_id);
            this.props.getClientProcessMgr(booking.id);
        }

        if (needUpdateBookingLineDetails && booking) {
            this.setState({loadingBookingLineDetail: true});
            this.props.getBookingLineDetails(booking.pk_booking_id);
            this.props.getClientProcessMgr(booking.id);
        }

        if (needUpdateStatusHistories && booking && booking.pk_booking_id) {
            this.props.getBookingStatusHistory(booking.pk_booking_id);
            this.props.getBooking(booking.id, 'id');
            this.setState({loading: true, curViewMode: 0});
        }

        if (needUpdateBooking && booking) {
            this.refreshBooking(booking);
        }

        if (bBooking) {
            if (bBooking === false) {
                this.notify('There is no such booking with that DME`/CON` number.');
                this.setState({bBooking: null});
            }
        }

        if (noBooking) {
            this.setState({loading: false, curViewMode: 1});
            this.showCreateView();
            this.props.resetNoBooking();
        }


        if (!_.isEmpty(bookingErrorMessage)) {
            this.notify(bookingErrorMessage);
            this.props.clearErrorMessage();
            this.setState({loading: false, loadingBookingSave: false, loadingBookingUpdate: false});

            if (this.state.booking
                && !this.state.isBookedBooking
                && this.state.booking.vx_freight_provider
                && !_.isUndefined(this.state.booking.vx_freight_provider)
                && this.state.booking.vx_freight_provider.toLowerCase() !== 'hunter'
                && this.state.booking.vx_freight_provider.toLowerCase() !== 'capital'
                && this.state.booking.vx_freight_provider.toLowerCase() !== 'dhl')
            {
                if (
                    bookingErrorMessage.indexOf('Successfully booked') !== -1 ||
                    bookingErrorMessage.indexOf('Successfully edit book') !== -1
                ) {
                    this.notify('Now trying to get Label!');
                    const currentBooking = this.state.booking;
                    const res = isValid4Label(currentBooking, this.state.bookingLineDetailsProduct);

                    if (currentBooking.vx_freight_provider === 'TNT' && res !== 'valid') {
                        this.notify(res);
                    } else {
                        this.props.fpLabel(currentBooking.id, currentBooking.vx_freight_provider);
                    }
                }
            }

            if (bookingErrorMessage === 'Sent Email Successfully') {
                this.props.getEmailLogs(booking.id);
            }
        }

        if ((!isBookedBooking && needToFetchGeoInfo) || this.state.loadingGeoPU || this.state.loadingGeoDeTo) {
            if (puStates && puStates.length > 0) {
                if ( !this.state.loadedPostal ) {
                    if (puPostalCodes == '' || puPostalCodes == null)
                        this.props.getSuburbStrings('postalcode', puStates[0].label);
                }

                if (booking && booking.pu_Address_State) {
                    let states = _.clone(puStates);
                    let bHas = false;

                    for (let i = 0; i < states.length; i++ ){
                        if (states[i].label == booking.pu_Address_State) {
                            bHas = true;
                            break;
                        }
                    }

                    if (bHas == false) {
                        states.push({'value':booking.pu_Address_State, 'label': booking.pu_Address_State});
                    }

                    this.setState({puStates: states});        
                } else {
                    this.setState({puStates});             
                }

                this.setState({puStates, loadedPostal: true, loadingGeoPU: false});
            } else if (this.state.loading || needToFetchGeoInfo) {
                this.setState({loadingGeoPU: true});
                this.props.getSuburbStrings('state', undefined);
            }

            if (puPostalCodes && puPostalCodes.length > 0 && this.state.selectionChanged === 1) {
                if (booking && booking.pu_Address_PostalCode) {
                    let postalcodes = _.clone(puPostalCodes);
                    let bHas = false;

                    for (let i = 0; i < postalcodes.length; i++ ){
                        if (postalcodes[i].label == booking.pu_Address_PostalCode) {
                            bHas = true;
                            break;
                        }
                    }

                    if (bHas == false) {
                        postalcodes.push({'value':booking.pu_Address_PostalCode, 'label': booking.pu_Address_PostalCode});
                    }

                    this.setState({puPostalCodes: postalcodes, loadingGeoPU: false});        
                } else {
                    this.setState({puPostalCodes, loadingGeoPU: false});
                }
            }

            if (puSuburbs && puSuburbs.length > 0 && this.state.selectionChanged === 1) {
                if (puSuburbs.length == 1) {
                    this.setState({puSuburb: puSuburbs[0], loadingGeoPU: false});
                } else if (puSuburbs.length > 1) {
                    if (booking && booking.pu_Address_Suburb) {
                        let suburbs = _.clone(puSuburbs);
                        let bHas = false;

                        for (let i = 0; i < suburbs.length; i++){
                            if (suburbs[i].label == booking.pu_Address_Suburb) {
                                bHas = true;
                                break;
                            }
                        }

                        if (bHas == false) {
                            suburbs.push({'value':booking.pu_Address_Suburb, 'label': booking.pu_Address_Suburb});
                        }

                        this.setState({puSuburbs: suburbs, loadingGeoPU: false});
                    } else {
                        this.setState({puSuburbs, loadingGeoPU: false});
                    }
                }
            }

            if (deToStates && deToStates.length > 0) {
                if ( !this.state.deLoadedPostal ) {
                    this.props.getDeliverySuburbStrings('postalcode', deToStates[0].label);
                }

                if (booking && booking.de_To_Address_State) {
                    let states = _.clone(deToStates);
                    let bHas = false;

                    for (let i = 0; i < states.length; i++ ){
                        if (states[i].label == booking.de_To_Address_State) {
                            bHas = true;
                            break;
                        }
                    }

                    if (bHas == false) {
                        states.push({'value': booking.de_To_Address_State, 'label': booking.de_To_Address_State});
                    }

                    this.setState({deToStates: states});        
                } else {
                    this.setState({deToStates});                    
                }

                this.setState({deToStates, deLoadedPostal: true, loadingGeoDeTo: false});
            } else if (this.state.loading || needToFetchGeoInfo) {
                this.props.getDeliverySuburbStrings('state', undefined);
                this.setState({loadingGeoDeTo: true});
            }

            if (deToPostalCodes && deToPostalCodes.length > 0 && this.state.selectionChanged === 2) {
                if (booking && booking.de_To_Address_PostalCode) {
                    let postalcode = _.clone(deToPostalCodes);
                    let bHas = false;

                    for (let i = 0; i < postalcode.length; i++ ){
                        if (postalcode[i].label == booking.de_To_Address_PostalCode) {
                            bHas = true;
                            break;
                        }
                    }

                    if (bHas == false) {
                        postalcode.push({'value':booking.de_To_Address_PostalCode, 'label': booking.de_To_Address_PostalCode});
                    }

                    this.setState({deToPostalCodes: postalcode, loadingGeoDeTo: false});        
                } else {
                    this.setState({deToPostalCodes, loadingGeoDeTo: false});             
                }
            }

            if (deToSuburbs && deToSuburbs.length > 0 && this.state.selectionChanged === 2) {
                if (deToSuburbs.length == 1) {
                    this.setState({deToSuburb: deToSuburbs[0]});
                } else if (deToSuburbs.length > 1) {
                    if (booking && booking.de_To_Address_Suburb) {
                        let suburbs = _.clone(deToSuburbs);
                        let bHas = false;

                        for (let i = 0; i < suburbs.length; i++ ){
                            if (suburbs[i].label == booking.de_To_Address_Suburb) {
                                bHas = true;
                                break;
                            }
                        }

                        if (bHas == false) {
                            suburbs.push({'value':booking.de_To_Address_Suburb, 'label': booking.de_To_Address_Suburb});
                        }

                        this.setState({deToSuburbs: suburbs});        
                    } else {
                        this.setState({deToSuburbs});             
                    }
                }
                this.setState({deToSuburbs, loadingGeoDeTo: false});
            }

            this.setState({selectionChanged: 0});
            this.props.setFetchGeoInfoFlag(false);
        }
     
        if (
            (booking && this.state.loading && parseInt(this.state.curViewMode) === 0)
            || (booking && this.state.loadingBookingSave && parseInt(this.state.curViewMode) === 1)
            || (booking && this.state.loadingBookingUpdate && parseInt(this.state.curViewMode) === 2)
        ) {
            if (booking.b_bookingID_Visual) {
                if (this.state.loadingBookingSave && _.isEmpty(bookingErrorMessage)) {
                    this.notify('Booking(' + booking.b_bookingID_Visual + ') is saved!');
                } else if (this.state.loadingBookingUpdate && _.isEmpty(bookingErrorMessage)) {
                    this.notify('Booking(' + booking.b_bookingID_Visual + ') is updated!');
                }
                
                // Is Booked Booking?
                if (!_.isNull(booking.b_dateBookedDate) &&
                    !_.isUndefined(booking.b_dateBookedDate) &&
                    !_.isEmpty(booking.b_dateBookedDate)) 
                {
                    this.setState({isBookedBooking: true});
                } else {
                    this.setState({isBookedBooking: false});
                }

                // Is Locked Booking?
                if (booking.z_lock_status) {
                    this.setState({isLockedBooking: true});
                } else {
                    this.setState({isLockedBooking: false});
                }

                if (
                    (this.state.loading ||
                    this.state.loadingBookingSave ||
                    this.state.loadingBookingUpdate) &&
                    !needUpdateBooking
                ) {
                    this.setState({loading: false, loadingBookingSave: false, loadingBookingUpdate: false}, () => this.afterSetState(0, booking));
                }

                let formInputs = this.state.formInputs;

                formInputs['id'] = booking.id;
                formInputs['b_bookingID_Visual'] = booking.b_bookingID_Visual;
                formInputs['pk_booking_id'] = booking.pk_booking_id;
                if (booking.puCompany != null) formInputs['puCompany'] = booking.puCompany;
                else formInputs['puCompany'] = '';
                if (booking.pu_Address_Street_1 != null) formInputs['pu_Address_Street_1'] = booking.pu_Address_Street_1;
                else formInputs['pu_Address_Street_1'] = '';
                if (booking.pu_Address_street_2 != null) formInputs['pu_Address_street_2'] = booking.pu_Address_street_2;
                else formInputs['pu_Address_street_2'] = '';
                if (booking.pu_Address_Country != null) formInputs['pu_Address_Country'] = booking.pu_Address_Country;
                else formInputs['pu_Address_Country'] = '';
                if (booking.pu_Contact_F_L_Name != null) formInputs['pu_Contact_F_L_Name'] = booking.pu_Contact_F_L_Name;
                else formInputs['pu_Contact_F_L_Name'] = '';
                if (booking.pu_Phone_Main != null) formInputs['pu_Phone_Main'] = booking.pu_Phone_Main;
                else formInputs['pu_Phone_Main'] = '';
                if (booking.pu_Email != null) formInputs['pu_Email'] = booking.pu_Email;
                else formInputs['pu_Email'] = '';
                if (booking.pu_email_Group_Name != null) formInputs['pu_email_Group_Name'] = booking.pu_email_Group_Name;
                else formInputs['pu_email_Group_Name'] = '';
                if (booking.pu_email_Group != null) formInputs['pu_email_Group'] = booking.pu_email_Group;
                else formInputs['pu_email_Group'] = '';
                if (booking.de_To_Address_Street_1 != null) formInputs['de_To_Address_Street_1'] = booking.de_To_Address_Street_1;
                else formInputs['de_To_Address_Street_1'] = '';
                if (booking.de_To_Address_Street_2 != null) {formInputs['de_To_Address_Street_2'] = booking.de_To_Address_Street_2;}
                else formInputs['de_To_Address_Street_2'] = '';
                formInputs['pu_Address_State'] = booking.pu_Address_State;
                formInputs['pu_Address_PostalCode'] = booking.pu_Address_PostalCode;
                formInputs['pu_Address_Suburb'] = booking.pu_Address_Suburb;
                formInputs['de_To_Address_State'] = booking.de_To_Address_State;
                formInputs['de_To_Address_PostalCode'] = booking.de_To_Address_PostalCode;
                formInputs['de_To_Address_Suburb'] = booking.de_To_Address_Suburb;
                if (booking.de_To_Address_Country != null) formInputs['de_To_Address_Country'] = booking.de_To_Address_Country;
                else formInputs['de_To_Address_Country'] = '';
                if (booking.de_to_Contact_F_LName != null) formInputs['de_to_Contact_F_LName'] = booking.de_to_Contact_F_LName;
                else formInputs['de_to_Contact_F_LName'] = '';
                if (booking.de_to_Phone_Main != null) formInputs['de_to_Phone_Main'] = booking.de_to_Phone_Main;
                else formInputs['de_to_Phone_Main'] = '';
                if (booking.de_Email != null) formInputs['de_Email'] = booking.de_Email;
                else formInputs['de_Email'] = '';
                if (booking.de_Email_Group_Name != null) formInputs['de_Email_Group_Name'] = booking.de_Email_Group_Name;
                else formInputs['de_Email_Group_Name'] = '';
                if (booking.de_Email_Group_Emails != null) formInputs['de_Email_Group_Emails'] = booking.de_Email_Group_Emails;
                else formInputs['de_Email_Group_Emails'] = '';
                if (booking.deToCompanyName != null) formInputs['deToCompanyName'] = booking.deToCompanyName;
                else formInputs['deToCompanyName'] = '';
                if (booking.s_20_Actual_Pickup_TimeStamp != null) formInputs['s_20_Actual_Pickup_TimeStamp'] = booking.s_20_Actual_Pickup_TimeStamp;
                else formInputs['s_20_Actual_Pickup_TimeStamp'] = null;
                if (booking.s_21_Actual_Delivery_TimeStamp != null) formInputs['s_21_Actual_Delivery_TimeStamp'] = booking.s_21_Actual_Delivery_TimeStamp;
                else formInputs['s_21_Actual_Delivery_TimeStamp'] = null;
                if (booking.b_client_name != null) formInputs['b_client_name'] = booking.b_client_name;
                else formInputs['b_client_name'] = '';
                if (booking.b_client_warehouse_code != null) formInputs['b_client_warehouse_code'] = booking.b_client_warehouse_code;
                else formInputs['b_client_warehouse_code'] = '';
                if (booking.b_clientPU_Warehouse != null) formInputs['b_clientPU_Warehouse'] = booking.b_clientPU_Warehouse;
                else formInputs['b_clientPU_Warehouse'] = '';
                if (booking.booking_Created_For_Email != null) formInputs['booking_Created_For_Email'] = booking.booking_Created_For_Email;
                else formInputs['booking_Created_For_Email'] = '';
                if (booking.booking_Created_For) formInputs['booking_Created_For'] = {'value': booking.booking_Created_For, 'label': booking.booking_Created_For};
                else formInputs['booking_Created_For'] = '';
                if (booking.b_booking_Category != null) formInputs['b_booking_Category'] = {'value': booking.b_booking_Category, 'label': booking.b_booking_Category};
                else formInputs['b_booking_Category'] = '';
                if (booking.b_booking_Priority != null) formInputs['b_booking_Priority'] = {'value': booking.b_booking_Priority, 'label': booking.b_booking_Priority};
                else formInputs['b_booking_Priority'] = '';

                // Saved `ETA PU BY`, `ETA DE BY`
                if (booking.eta_pu_by != null) formInputs['eta_pu_by'] = booking.eta_pu_by;
                else formInputs['eta_pu_by'] = null;
                if (booking.eta_de_by != null) formInputs['eta_de_by'] = booking.eta_de_by;
                else formInputs['eta_de_by'] = null;
                if (booking.s_05_Latest_Pick_Up_Date_TimeSet != null) formInputs['s_05_Latest_Pick_Up_Date_TimeSet'] = booking.s_05_Latest_Pick_Up_Date_TimeSet;
                else formInputs['s_05_Latest_Pick_Up_Date_TimeSet'] = null;
                if (booking.s_06_Latest_Delivery_Date_TimeSet != null) formInputs['s_06_Latest_Delivery_Date_TimeSet'] = booking.s_06_Latest_Delivery_Date_TimeSet;
                else formInputs['s_06_Latest_Delivery_Date_TimeSet'] = null;

                if (booking.b_clientReference_RA_Numbers != null) formInputs['b_clientReference_RA_Numbers'] = booking.b_clientReference_RA_Numbers;
                else formInputs['b_clientReference_RA_Numbers'] = '';
                if (booking.de_to_Pick_Up_Instructions_Contact != null) formInputs['de_to_Pick_Up_Instructions_Contact'] = booking.de_to_Pick_Up_Instructions_Contact;
                else formInputs['de_to_Pick_Up_Instructions_Contact'] = '';
                if (booking.de_to_PickUp_Instructions_Address != null) formInputs['de_to_PickUp_Instructions_Address'] = booking.de_to_PickUp_Instructions_Address;
                else formInputs['de_to_PickUp_Instructions_Address'] = '';
                if (booking.pu_pickup_instructions_address != null) formInputs['pu_pickup_instructions_address'] = booking.pu_pickup_instructions_address;
                else formInputs['pu_pickup_instructions_address'] = '';
                if (booking.pu_PickUp_Instructions_Contact != null) formInputs['pu_PickUp_Instructions_Contact'] = booking.pu_PickUp_Instructions_Contact;
                else formInputs['pu_PickUp_Instructions_Contact'] = '';
                if (booking.b_status_API != null) formInputs['b_status_API'] = booking.b_status_API;
                else formInputs['b_status_API'] = '';
                if (booking.b_booking_Notes != null) formInputs['b_booking_Notes'] = booking.b_booking_Notes;
                else formInputs['b_booking_Notes'] = '';
                if (booking.dme_status_detail != null) formInputs['dme_status_detail'] = booking.dme_status_detail;
                else formInputs['dme_status_detail'] = '';
                if (booking.dme_status_action != null) formInputs['dme_status_action'] = booking.dme_status_action;
                else formInputs['dme_status_action'] = '';
                if (booking.dme_status_linked_reference_from_fp != null) formInputs['dme_status_linked_reference_from_fp'] = booking.dme_status_linked_reference_from_fp;
                else formInputs['dme_status_linked_reference_from_fp'] = '';

                if (booking.puPickUpAvailFrom_Date) formInputs['puPickUpAvailFrom_Date'] = booking.puPickUpAvailFrom_Date;
                else formInputs['puPickUpAvailFrom_Date'] = null;
                if (!_.isNull(booking.pu_PickUp_Avail_Time_Hours)) formInputs['pu_PickUp_Avail_Time_Hours'] = booking.pu_PickUp_Avail_Time_Hours;
                else formInputs['pu_PickUp_Avail_Time_Hours'] = null;
                if (!_.isNull(booking.pu_PickUp_Avail_Time_Minutes)) formInputs['pu_PickUp_Avail_Time_Minutes'] = (booking.pu_PickUp_Avail_Time_Minutes);
                else formInputs['pu_PickUp_Avail_Time_Minutes'] = null;
                if (booking.pu_PickUp_By_Date) formInputs['pu_PickUp_By_Date'] = booking.pu_PickUp_By_Date;
                else formInputs['pu_PickUp_By_Date'] = null;
                if (!_.isNull(booking.pu_PickUp_By_Time_Hours)) formInputs['pu_PickUp_By_Time_Hours'] = (booking.pu_PickUp_By_Time_Hours);
                else formInputs['pu_PickUp_By_Time_Hours'] = null;
                if (!_.isNull(booking.pu_PickUp_By_Time_Minutes)) formInputs['pu_PickUp_By_Time_Minutes'] = (booking.pu_PickUp_By_Time_Minutes);
                else formInputs['pu_PickUp_By_Time_Minutes'] = null;

                if (booking.de_Deliver_From_Date) formInputs['de_Deliver_From_Date'] = booking.de_Deliver_From_Date;
                else formInputs['de_Deliver_From_Date'] = null;
                if (!_.isNull(booking.de_Deliver_From_Hours)) formInputs['de_Deliver_From_Hours'] = (booking.de_Deliver_From_Hours);
                else formInputs['de_Deliver_From_Hours'] = null;
                if (!_.isNull(booking.de_Deliver_From_Minutes)) formInputs['de_Deliver_From_Minutes'] = (booking.de_Deliver_From_Minutes);
                else formInputs['de_Deliver_From_Minutes'] = null;
                if (booking.de_Deliver_By_Date) formInputs['de_Deliver_By_Date'] = booking.de_Deliver_By_Date;
                else formInputs['de_Deliver_By_Date'] = null;
                if (!_.isNull(booking.de_Deliver_By_Hours)) formInputs['de_Deliver_By_Hours'] = (booking.de_Deliver_By_Hours);
                else formInputs['de_Deliver_By_Hours'] = null;
                if (!_.isNull(booking.de_Deliver_By_Minutes)) formInputs['de_Deliver_By_Minutes'] = (booking.de_Deliver_By_Minutes);
                else formInputs['de_Deliver_By_Minutes'] = null;
                if (!_.isNull(booking.s_02_Booking_Cutoff_Time)) formInputs['s_02_Booking_Cutoff_Time'] = booking.s_02_Booking_Cutoff_Time;
                else formInputs['s_02_Booking_Cutoff_Time'] = null;

                if (booking.b_project_due_date) formInputs['b_project_due_date'] = booking.b_project_due_date;
                else formInputs['b_project_due_date'] = null;
                if (booking.fp_store_event_date) formInputs['fp_store_event_date'] = booking.fp_store_event_date;
                else formInputs['fp_store_event_date'] = null;
                if (booking.z_calculated_ETA) formInputs['z_calculated_ETA'] = booking.z_calculated_ETA;
                else formInputs['z_calculated_ETA'] = null;
                if (booking.fp_received_date_time) formInputs['fp_received_date_time'] = booking.fp_received_date_time;
                else formInputs['fp_received_date_time'] = null;
                if (booking.b_given_to_transport_date_time) formInputs['b_given_to_transport_date_time'] = booking.b_given_to_transport_date_time;
                else formInputs['b_given_to_transport_date_time'] = null;

                if (booking.pu_Address_Country != undefined && booking.pu_Address_State != undefined) {
                    this.setState({puTimeZone: this.getTime(booking.pu_Address_Country, booking.pu_Address_State)});
                }
                if (booking.de_To_Address_Country != undefined && booking.de_To_Address_State != undefined) {
                    this.setState({deTimeZone: this.getTime(booking.de_To_Address_Country, booking.de_To_Address_State)});
                }

                if (booking.pu_Comm_Booking_Communicate_Via != undefined) {
                    this.setState({ puCommunicates:booking.pu_Comm_Booking_Communicate_Via.split(',')});
                }

                if (booking.de_To_Comm_Delivery_Communicate_Via != undefined) {
                    this.setState({ deCommunicates:booking.de_To_Comm_Delivery_Communicate_Via.split(',')});
                }

                //For Additional Services
                let tempAdditionalServices = this.state.AdditionalServices;
                if (booking.vx_freight_provider != null) tempAdditionalServices.vx_freight_provider = booking.vx_freight_provider;
                else tempAdditionalServices.vx_freight_provider = '';
                if (booking.vx_serviceName != null) tempAdditionalServices.vx_serviceName = booking.vx_serviceName;
                else tempAdditionalServices.vx_serviceName = '';
                if (booking.v_FPBookingNumber != null) tempAdditionalServices.v_FPBookingNumber = booking.v_FPBookingNumber;
                else tempAdditionalServices.v_FPBookingNumber = '';
                if (booking.s_02_Booking_Cutoff_Time != null) tempAdditionalServices.s_02_Booking_Cutoff_Time = booking.s_02_Booking_Cutoff_Time;
                else tempAdditionalServices.s_02_Booking_Cutoff_Time = null;
                if (booking.puPickUpAvailFrom_Date != null) tempAdditionalServices.puPickUpAvailFrom_Date = booking.puPickUpAvailFrom_Date;
                else tempAdditionalServices.puPickUpAvailFrom_Date = '';
                if (booking.z_CreatedTimestamp != null) tempAdditionalServices.z_CreatedTimestamp = booking.z_CreatedTimestamp;
                else tempAdditionalServices.z_CreatedTimestamp = '';
                tempAdditionalServices.Quoted = '';
                if (booking.b_dateBookedDate != null) tempAdditionalServices.b_dateBookedDate = booking.b_dateBookedDate;
                else tempAdditionalServices.b_dateBookedDate = '';
                tempAdditionalServices.Invoiced = '';

                // Added new main fields
                if (!_.isNull(booking.v_FPBookingNumber)) formInputs['v_FPBookingNumber'] = booking.v_FPBookingNumber;
                else formInputs['v_FPBookingNumber'] = '';
                if (!_.isNull(booking.vx_freight_provider)) formInputs['vx_freight_provider'] = booking.vx_freight_provider;
                else formInputs['vx_freight_provider'] = '';
                if (!_.isNull(booking.vx_serviceName)) formInputs['vx_serviceName'] = booking.vx_serviceName;
                else formInputs['vx_serviceName'] = '';
                if (!_.isNull(booking.vx_account_code)) formInputs['vx_account_code'] = booking.vx_account_code;
                else formInputs['vx_account_code'] = '';
                if (!_.isNull(booking.v_service_Type)) formInputs['v_service_Type'] = booking.v_service_Type;
                else formInputs['v_service_Type'] = '';
                if (!_.isNull(booking.fk_fp_pickup_id)) formInputs['fk_fp_pickup_id'] = booking.fk_fp_pickup_id;
                else formInputs['fk_fp_pickup_id'] = '';
                if (!_.isNull(booking.v_vehicle_Type)) formInputs['v_vehicle_Type'] = booking.v_vehicle_Type;
                else formInputs['v_vehicle_Type'] = '';
                if (!_.isNull(booking.inv_billing_status)) formInputs['inv_billing_status'] = booking.inv_billing_status;
                else formInputs['inv_billing_status'] = '';
                if (!_.isNull(booking.inv_billing_status_note)) formInputs['inv_billing_status_note'] = booking.inv_billing_status_note;
                else formInputs['inv_billing_status_note'] = '';
                if (!_.isNull(booking.b_client_sales_inv_num)) formInputs['b_client_sales_inv_num'] = booking.b_client_sales_inv_num;
                else formInputs['b_client_sales_inv_num'] = '';
                if (!_.isNull(booking.b_client_order_num)) formInputs['b_client_order_num'] = booking.b_client_order_num;
                else formInputs['b_client_order_num'] = '';
                if (!_.isNull(booking.b_client_name_sub)) formInputs['b_client_name_sub'] = booking.b_client_name_sub;
                else formInputs['b_client_name_sub'] = '';
                if (!_.isNull(booking.inv_dme_invoice_no)) formInputs['inv_dme_invoice_no'] = booking.inv_dme_invoice_no;
                else formInputs['inv_dme_invoice_no'] = '';
                if (!_.isNull(booking.fp_invoice_no)) formInputs['fp_invoice_no'] = booking.fp_invoice_no;
                else formInputs['fp_invoice_no'] = '';
                if (!_.isNull(booking.inv_cost_quoted)) formInputs['inv_cost_quoted'] = parseFloat(booking.inv_cost_quoted).toFixed(2);
                else formInputs['inv_cost_quoted'] = null;
                if (!_.isNull(booking.inv_cost_actual)) formInputs['inv_cost_actual'] = parseFloat(booking.inv_cost_actual).toFixed(2);
                else formInputs['inv_cost_actual'] = null;
                if (!_.isNull(booking.inv_sell_quoted)) formInputs['inv_sell_quoted'] = parseFloat(booking.inv_sell_quoted).toFixed(2);
                else formInputs['inv_sell_quoted'] = null;
                if (!_.isNull(booking.inv_sell_quoted_override)) formInputs['inv_sell_quoted_override'] = parseFloat(booking.inv_sell_quoted_override).toFixed(2);
                else formInputs['inv_sell_quoted_override'] = null;
                if (!_.isNull(booking.inv_sell_actual)) formInputs['inv_sell_actual'] = parseFloat(booking.inv_sell_actual).toFixed(2);
                else formInputs['inv_sell_actual'] = null;
                if (!_.isNull(booking.customer_cost)) formInputs['customer_cost'] = parseFloat(booking.customer_cost).toFixed(2);
                else formInputs['customer_cost'] = null;
                if (!_.isNull(booking.vx_futile_Booking_Notes) && !_.isNull(booking.vx_futile_Booking_Notes)) formInputs['vx_futile_Booking_Notes'] = booking.vx_futile_Booking_Notes;
                else formInputs['vx_futile_Booking_Notes'] = null;
                if (!_.isNull(booking.b_handling_Instructions) && !_.isNull(booking.b_handling_Instructions)) formInputs['b_handling_Instructions'] = booking.b_handling_Instructions;
                else formInputs['b_handling_Instructions'] = null;
                formInputs['x_manual_booked_flag'] = booking.x_manual_booked_flag;
                formInputs['booking_type'] = !_.isNull(booking.booking_type) ? booking.booking_type : null;

                // Freight Options
                formInputs['pu_Address_Type'] = booking.pu_Address_Type;
                formInputs['de_To_AddressType'] = booking.de_To_AddressType;
                formInputs['b_booking_tail_lift_pickup'] = booking.b_booking_tail_lift_pickup;
                formInputs['b_booking_tail_lift_deliver'] = booking.b_booking_tail_lift_deliver;
                formInputs['pu_no_of_assists'] = booking.pu_no_of_assists;
                formInputs['de_no_of_assists'] = booking.de_no_of_assists;
                formInputs['pu_location'] = booking.pu_location;
                formInputs['de_to_location'] = booking.de_to_location;
                formInputs['pu_access'] = booking.pu_access;
                formInputs['de_access'] = booking.de_access;
                formInputs['pu_floor_number'] = booking.pu_floor_number;
                formInputs['de_floor_number'] = booking.de_floor_number;
                formInputs['pu_floor_access_by'] = booking.pu_floor_access_by;
                formInputs['de_to_floor_access_by'] = booking.de_to_floor_access_by;
                formInputs['pu_service'] = booking.pu_service;
                formInputs['de_service'] = booking.de_service;
                
                let AdditionalServices = [];
                AdditionalServices.push(tempAdditionalServices);

                this.setState({
                    puPostalCode: {
                        'value': booking.pu_Address_PostalCode ? booking.pu_Address_PostalCode : null, 
                        'label': booking.pu_Address_PostalCode ? booking.pu_Address_PostalCode : null,
                    },
                    puSuburb: {
                        'value': booking.pu_Address_Suburb ? booking.pu_Address_Suburb : null, 
                        'label': booking.pu_Address_Suburb ? booking.pu_Address_Suburb : null
                    },
                    puState: {
                        'value': booking.pu_Address_State ? booking.pu_Address_State : null, 
                        'label': booking.pu_Address_State ? booking.pu_Address_State : null,
                    },
                    deToPostalCode: {
                        'value': booking.de_To_Address_PostalCode ? booking.de_To_Address_PostalCode : null, 
                        'label': booking.de_To_Address_PostalCode ? booking.de_To_Address_PostalCode : null,
                    },
                    deToSuburb: {
                        'value': booking.de_To_Address_Suburb ? booking.de_To_Address_Suburb : null, 
                        'label': booking.de_To_Address_Suburb ? booking.de_To_Address_Suburb : null
                    },
                    deToState: {
                        'value': booking.de_To_Address_State ? booking.de_To_Address_State : null, 
                        'label': booking.de_To_Address_State ? booking.de_To_Address_State : null,
                    },
                    curViewMode: booking.b_dateBookedDate && booking.b_dateBookedDate.length > 0 ? 0 : 2,
                });

                // Dropzone files reset
                if (this.attachmentsDz) this.attachmentsDz.removeAllFiles();
                if (this.labelDz) this.labelDz.removeAllFiles();
                if (this.podDz) this.podDz.removeAllFiles();

                this.setState({ booking, AdditionalServices, formInputs, nextBookingId, prevBookingId, isBookingSelected: true });
            } else {
                this.setState({ formInputs: {}, loading: false, isBookingSelected: false });
                if (!_.isNull(this.state.findKeyword)) this.notify('There is no such booking with that DME/CON number.');
            }
        }

        if (booking && pricingInfos) {
            if (this.state.pricingInfos.length != pricingInfos.length) {
                this.props.getBooking(booking.id, 'id');
                this.setState({loading: true, curViewMode: 0});
            }

            this.setState({pricingInfos, loadingPricingInfos: false});
        }

        if (errors) {
            this.setState({errors, loadingPricingInfos: false});
        }

        if (attachments) {
            const tempAttachments = attachments;
            const attachmentsHistory = tempAttachments.map((attach, index) => {
                let result = [];
                result.no = index + 1;
                result.description = attach.fk_id_dme_booking;
                result.filename = attach.fileName;
                result.uploadfile = attach.linkurl;
                result.dateupdated = attach.upload_Date;
                return result;
            });

            this.setState({attachmentsHistory});
        }

        if(clientprocess != this.state.clientprocess)  {
            this.setState({clientprocess});
        }
    }

    notify = (text) => toast(text);

    afterSetState(type, data) {
        if (type === 0) {
            this.props.getBookingLines(data.pk_booking_id);
            this.props.getBookingLineDetails(data.pk_booking_id);
            this.props.getBookingStatusHistory(data.pk_booking_id);
            this.props.getApiBCLs(data.id);
            this.props.setFetchGeoInfoFlag(true);
            this.props.getAttachmentHistory(data.pk_booking_id);
            this.props.getEmailLogs(data.id);
            this.props.getClientProcessMgr(data.id);
            this.props.getZohoTicketsWithBookingId(data.b_bookingID_Visual);
            this.props.getZohoTicketSummaries();
        } else if (type === 1) {
            this.props.setFetchGeoInfoFlag(true);
        }
    }

    refreshBooking(booking) {
        let that = this;
        this.props.getBooking(booking.id, 'id');
        setTimeout(() => {
            that.setState({loading: true, curViewMode: 0});
        }, 50);
    }

    calcBookingLine(booking, bookingLines, is4calcTotal) {
        let qty = 0;
        let total_qty_collected = 0;
        let total_qty_scanned = 0;
        let b_fp_qty_delivered = 0;
        let total_kgs = 0;
        let cubic_meter = 0;

        let newBookingLines = bookingLines.map((bookingLine) => {
            if (bookingLine.e_weightUOM) {
                const e_weightUOM = bookingLine.e_weightUOM.toUpperCase();

                if (e_weightUOM === 'GRAM' || e_weightUOM === 'GRAMS')
                    bookingLine['total_kgs'] = bookingLine.e_qty * bookingLine.e_weightPerEach / 1000;
                else if (
                    e_weightUOM === 'KILOGRAM' || e_weightUOM === 'KG' ||
                    e_weightUOM === 'KGS' || e_weightUOM === 'KILOGRAMS'
                )
                    bookingLine['total_kgs'] = bookingLine.e_qty * bookingLine.e_weightPerEach;
                else if (e_weightUOM === 'TON' || e_weightUOM === 'TONS')
                    bookingLine['total_kgs'] = bookingLine.e_qty * bookingLine.e_weightPerEach * 1000;
                else
                    bookingLine['total_kgs'] = bookingLine.e_qty * bookingLine.e_weightPerEach;
            } else {
                bookingLine['total_kgs'] = 0;
            }

            if (bookingLine.e_dimUOM) {
                const e_dimUOM = bookingLine.e_dimUOM.toUpperCase();

                if (e_dimUOM === 'CM' || e_dimUOM === 'CENTIMETER')
                    bookingLine['cubic_meter'] = bookingLine.e_qty * bookingLine.e_dimLength * bookingLine.e_dimWidth * bookingLine.e_dimHeight / 1000000;
                else if (e_dimUOM === 'METER' || e_dimUOM === 'M')
                    bookingLine['cubic_meter'] = bookingLine.e_qty * bookingLine.e_dimLength * bookingLine.e_dimWidth * bookingLine.e_dimHeight;
                else if (e_dimUOM === 'MILIMETER' || e_dimUOM === 'MM')
                    bookingLine['cubic_meter'] = bookingLine.e_qty * bookingLine.e_dimLength * bookingLine.e_dimWidth * bookingLine.e_dimHeight / 1000000000;
                else
                    bookingLine['cubic_meter'] = bookingLine.e_qty * bookingLine.e_dimLength * bookingLine.e_dimWidth * bookingLine.e_dimHeight;
            } else {
                bookingLine['cubic_meter'] = 0;
            }

            if (bookingLine.packed_status === this.state.currentPackedStatus) {
                qty += bookingLine.e_qty;
                total_kgs += bookingLine['total_kgs'];
                cubic_meter += bookingLine['cubic_meter'];
                total_qty_collected += bookingLine['e_qty_collected'];
                total_qty_scanned += bookingLine['e_qty_scanned_fp'];
            }

            return bookingLine;
        });

        if (booking)
            b_fp_qty_delivered = booking.b_fp_qty_delivered;

        if (is4calcTotal)
            return [{
                id: 0,
                qty,
                total_qty_collected,
                total_qty_scanned,
                b_fp_qty_delivered: b_fp_qty_delivered,
                total_kgs: total_kgs.toFixed(2),
                cubic_meter: cubic_meter.toFixed(2)
            }];

        return newBookingLines;
    }

    getTime(country, city) {
        const timeZoneTable = {
            'Australia': {
                'ACT': 'Australia/Currie',
                'NT': 'Australia/Darwin',
                'SA': 'Australia/Adelaide',
                'WA': 'Australia/Perth',
                'NSW': 'Australia/Sydney',
                'QLD': 'Australia/Brisbane',
                'VIC': 'Australia/Melbourne',
                'TAS': 'Australia/Hobart',
            },
            'AU': {
                'ACT': 'Australia/Currie',
                'NT': 'Australia/Darwin',
                'SA': 'Australia/Adelaide',
                'WA': 'Australia/Perth',
                'NSW': 'Australia/Sydney',
                'QLD': 'Australia/Brisbane',
                'VIC': 'Australia/Melbourne',
                'TAS': 'Australia/Hobart',
            }
        };

        if (timeZoneTable[country] == undefined || timeZoneTable[country] == 'undefined'  || timeZoneTable[country][city] == 'undefined' || timeZoneTable[country][city] == undefined) {
            return 'Australia/Currie';
        } else {
            return timeZoneTable[country][city];
        }
    }

    onClickViewFile(fileOption) {
        const {booking} = this.state;

        if (fileOption === 'label') {
            if (booking.z_label_url && booking.z_label_url.length > 0) {
                if (booking.z_label_url.indexOf('http') !== -1) {
                    const win = window.open(booking.z_label_url, '_blank');
                    win.focus();
                } else {
                    this.bulkBookingUpdate([booking.id], 'z_downloaded_shipping_label_timestamp', new Date())
                        .then(() => {
                            this.onClickDateFilter();
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
        } else if (fileOption === 'pod') {
            if (booking.z_pod_url && booking.z_pod_url.length > 0) {
                this.bulkBookingUpdate([booking.id], 'z_downloaded_pod_timestamp', new Date())
                    .then(() => {
                        this.onClickDateFilter();
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
                        this.onClickDateFilter();
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
        }
    }

    onClickDownloadFile(fileOption) {
        const token = localStorage.getItem('token');
        const { booking } = this.state;
        const selectedBookingIds = [booking.id];

        if (fileOption === 'label') {
            const options = {
                method: 'post',
                url: HTTP_PROTOCOL + '://' + API_HOST + '/download/',
                headers: {'Authorization': 'JWT ' + token},
                data: {ids: selectedBookingIds, downloadOption: fileOption},
                responseType: 'blob', // important
            };

            axios(options).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'label_1_' + moment().format('YYYY-MM-DD HH:mm:ss') + '.zip');
                document.body.appendChild(link);
                link.click();
            });
        } else if (fileOption === 'pod') {
            const options = {
                method: 'post',
                url: HTTP_PROTOCOL + '://' + API_HOST + '/download/',
                headers: {'Authorization': 'JWT ' + token},
                data: {ids: selectedBookingIds, downloadOption: fileOption},
                responseType: 'blob', // important
            };

            axios(options).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'pod_1_' + moment().format('YYYY-MM-DD HH:mm:ss') + '.zip');
                document.body.appendChild(link);
                link.click();
            });
        } else if (fileOption === 'pod_sog') {
            const options = {
                method: 'post',
                url: HTTP_PROTOCOL + '://' + API_HOST + '/download/',
                headers: {'Authorization': 'JWT ' + token},
                data: {ids: selectedBookingIds, downloadOption: fileOption},
                responseType: 'blob', // important
            };

            axios(options).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'pod_signed_1_' + moment().format('YYYY-MM-DD HH:mm:ss') + '.zip');
                document.body.appendChild(link);
                link.click();
            });
        }
    }

    onClickDeleteFile(fileOption) {
        this.setState({selectedFileOption: fileOption});
        this.toggleDeleteFileConfirmModal();
    }

    onClickConfirmBtn(type) {
        const token = localStorage.getItem('token');
        const {booking, selectedFileOption, formInputs} = this.state;

        if (type === 'delete-file') {
            const options = {
                method: 'delete',
                url: HTTP_PROTOCOL + '://' + API_HOST + '/delete-file/',
                headers: {'Authorization': 'JWT ' + token },
                data: {bookingId: booking.id, deleteFileOption: selectedFileOption},
            };

            axios(options)
                .then((response) => {
                    console.log('#301 - ', response.data);
                    if (selectedFileOption === 'label') {
                        booking.z_label_url = null;
                    } else if (selectedFileOption === 'pod') {
                        booking.z_pod_url = null;
                    }

                    this.toggleDeleteFileConfirmModal();
                })
                .catch(error => {
                    this.notify('Failed to delete a file: ' + error);
                    this.toggleDeleteFileConfirmModal();
                });    
        } else if (type === 'booking_Created_For') {
            const selectedCreatedFor = this.state.createdForInfos.filter(item => {
                const name_last = item.name_last ? item.name_last : '';
                const name_first = item.name_first ? item.name_first : '';

                if (`${name_first} ${name_last}` === formInputs['booking_Created_For'].label) {
                    return true;
                }
            });

            if (selectedCreatedFor.length > 0 && formInputs['booking_Created_For_Email']) {
                const newEmployeeObj = {
                    'pk_id_client_emp': selectedCreatedFor[0]['id'],
                    'email': formInputs['booking_Created_For_Email']
                };

                this.props.updateClientEmployee(newEmployeeObj);
                setTimeout(() => {
                    this.props.getCreatedForInfos();
                }, 2000);
            }

            this.toggleUpdateCreatedForEmailConfirmModal();
        } else if (type === 'manual-from-original') {
            this.props.repack(booking.id, type);
            this.setState({loadingBooking: true, currentPackedStatus: 'manual'});
            this.toggleManualRepackModal();
        } else if (type === 'manual-from-auto') {
            this.props.repack(booking.id, type);
            this.setState({loadingBooking: true, currentPackedStatus: 'manual'});
            this.toggleManualRepackModal();
        } else if (type === 'enter-from-scratch') {
            this.setState({currentPackedStatus: 'manual'});
            this.toggleManualRepackModal();
        }
    }

    onClickTrackingStatus() {
        const { booking } = this.state;

        this.props.fpTracking(booking.id, booking.vx_freight_provider);
    }

    onClickPOD() {
        const { booking } = this.state;

        this.props.fpPod(booking.id, booking.vx_freight_provider);
    }

    onClickGetLabel() {
        const {booking, isBookedBooking, formInputs, bookingLineDetailsProduct} = this.state;
        const {bookingLines} = this.state;

        // JasonL - Always create DME built-in label
        if (booking.kf_client_id === '1af6bcd2-6148-11eb-ae93-0242ac130002') {
            // Check if ready for build label
            let isReady4Label = true;

            for (let index=0; index < bookingLines.length; index++) {
                const line = bookingLines[index];

                if (!line.sscc) {
                    isReady4Label = false;
                    break;
                }
            }

            if (!isReady4Label)
                this.notify('Some lines doesn`t have SSCC, so will be populated auto-SSCC.');

            this.props.dmeLabel(booking.id);
        } else if (isBookedBooking) {
            const result = isValid4Label(formInputs, bookingLineDetailsProduct);

            if (result === 'valid') {
                this.props.fpLabel(booking.id, booking.vx_freight_provider);
            } else {
                this.notify(result);
            }
        } else {
            this.notify('Booking is not BOOKED!');
        }
    }

    onClickReprintLabel() {
        const {booking, isBookedBooking} = this.state;

        if (isBookedBooking) {
            this.props.fpReprint(booking.id, booking.vx_freight_provider);
        }
    }

    onClickAutoAugment() {
        const {booking} = this.state;

        if(!booking.is_auto_augmented) {
            this.setState({loadingBookingUpdate: true, curViewMode: 2});
            this.props.autoAugmentBooking(booking.id);
        }
    }

    // Disabled 2021-02-07
    // onClickRevertAugment() {
    //     const {booking} = this.state;

    //     if(booking.is_auto_augmented) {
    //         this.setState({loadingBookingUpdate: true, curViewMode: 2});
    //         this.props.revertAugmentBooking(booking.id);
    //     }
    // }

    onClickAugmentPuDate() {
        const {booking} = this.state;

        this.setState({loadingBookingUpdate: true, curViewMode: 2});
        this.props.augmentPuDate(booking.id);
    }

    onClickBook() {
        const { booking, isBookedBooking, clientname, isBookingModified } = this.state;

        if (isBookingModified) {
            this.notify('You can lose modified booking info. Please update it');
        } else if (isBookedBooking) {
            this.notify('Error: This booking (' + booking.b_bookingID_Visual + ') for ' + clientname + ' - has already been booked"');
        } else {
            this.bulkBookingUpdate([booking.id], 'b_error_Capture', '');

            if (!booking.x_manual_booked_flag) {  // NOT manual booking
                if (booking.id) {
                    if (booking.vx_freight_provider) {
                        const freight_provider = booking.vx_freight_provider.toLowerCase();

                        if (
                            freight_provider === 'cope' ||
                            freight_provider === 'century' ||
                            freight_provider === 'state transport'
                        ) {
                            this.buildCSV([booking.id], freight_provider);
                            this.setState({loading: true, curViewMode: 0});
                        } else if (freight_provider === 'act') {
                            this.buildXML([booking.id], freight_provider);
                            this.setState({loading: true, curViewMode: 0});
                        } else {
                            const res = isValid4Book(booking);

                            if (res !== 'valid') {
                                this.notify(res);
                            } else {
                                this.props.fpBook(booking.id, booking.vx_freight_provider);
                                this.setState({loading: true, curViewMode: 0});
                            }
                        }
                    } else {
                        this.notify('Can not *BOOK* since booking has no Freight Provider');
                    }
                } else {
                    this.notify('Please select a booking and then try BOOK again!');
                }
            } else { // Manual booking
                this.props.manualBook(booking.id);
                this.setState({loadingBookingUpdate: true, curViewMode: 2});
            }
        }
    }

    onClickRebook() {
        const { booking } = this.state;
        this.props.fpRebook(booking.id, booking.vx_freight_provider);
        this.setState({ loading: true, curViewMode: 0});
    }

    onSavePuInfo () {
        const { booking } = this.state;
        this.props.saveStatusHistoryPuInfo(booking.id);
    }

    bulkBookingUpdate(bookingIds, fieldName, fieldContent) {
        return new Promise((resolve, reject) => {
            const token = localStorage.getItem('token');
            const options = {
                method: 'post',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
                url: HTTP_PROTOCOL + '://' + API_HOST + '/bookings/bulk_booking_update/',
                data: {bookingIds, fieldName, fieldContent},
            };

            axios(options)
                .then(() => {
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    buildCSV(bookingIds, vx_freight_provider) {
        return new Promise((resolve, reject) => {
            const token = localStorage.getItem('token');
            const options = {
                method: 'post',
                url: HTTP_PROTOCOL + '://' + API_HOST + '/get-csv/',
                data: {bookingIds, vx_freight_provider},
                headers: {'Content-Type': 'application/json', 'Authorization': 'JWT ' + token},
            };

            axios(options)
                .then((response) => {
                    console.log('get-csv response: ', response);
                    this.notify('Successfully booked via CSV');
                    this.refreshBooking(this.state.booking);
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    buildXML(bookingIds, vx_freight_provider) {
        return new Promise((resolve, reject) => {
            const token = localStorage.getItem('token');
            let options = {
                method: 'post',
                url: HTTP_PROTOCOL + '://' + API_HOST + '/get-xml/',
                headers: {'Content-Type': 'application/json', 'Authorization': 'JWT ' + token},
                data: {bookingIds, vx_freight_provider},
            };

            axios(options)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    onKeyPress(e) {
        const {selected} = this.state;
        const findKeyword = e.target.value;

        if (e.key === 'Enter' && !this.state.loading) {
            e.preventDefault();

            if ((selected == undefined) || (selected == '')) {
                this.notify('id value is empty');
                return;
            }

            if ((findKeyword == undefined) || (findKeyword == '')) {
                this.notify('id value is empty');
                return;
            }

            this.props.getBooking(findKeyword, selected);
            this.setState({loading: true, curViewMode: 0});
        }

        this.setState({findKeyword});
    }

    onChangeText(e) {
        this.setState({findKeyword: e.target.value});
    }

    handleChangeState = (num, selectedOption) => {
        if (this.state.isBookedBooking == false || this.state.clientname === 'dme') {
            if (num === 0) {
                this.props.getSuburbStrings('postalcode', selectedOption.label);
                this.setState({puState: selectedOption, puPostalCode: null, puSuburb: null, selectionChanged: 1, loadingGeoPU: true});
            } else if (num === 1) {
                this.props.getDeliverySuburbStrings('postalcode', selectedOption.label);
                this.setState({deToState: selectedOption, deToPostalCode: null, deToSuburb: null, selectionChanged: 2, loadingGeoDeTo: true});
            }

            this.setState({isBookingModified: true});
        }
    };

    handleChangePostalCode = (num, selectedOption) => {
        if (this.state.isBookedBooking == false || this.state.clientname === 'dme') {
            if (num === 0) {
                this.props.getSuburbStrings('suburb', selectedOption.label);
                this.setState({puPostalCode: selectedOption, puSuburb: null, puSuburbs: [], selectionChanged: 1, loadingGeoPU: true});
            } else if (num === 1) {
                this.props.getDeliverySuburbStrings('suburb', selectedOption.label);
                this.setState({deToPostalCode: selectedOption, deToSuburb: null, deToSuburbs: [], selectionChanged: 2, loadingGeoDeTo: true});
            }

            this.setState({isBookingModified: true});
        }
    };

    handleChangeSuburb = (num, selectedOption) => {
        if (this.state.isBookedBooking == false || this.state.clientname === 'dme') {
            if (num === 0) {
                this.setState({ puSuburb: selectedOption});    
            } else if (num === 1) {
                this.setState({ deToSuburb: selectedOption});
            }

            this.setState({isBookingModified: true});
        }
    };

    onHandleInput(e) {
        const {isBookedBooking, clientname, formInputs, booking} = this.state;

        if (clientname === 'dme' ||
            isBookedBooking === false || 
            (clientname.lower() === 'biopak' && !booking.manifest_timestamp))
        {
            if (e.target.name === 'dme_status_detail' && e.target.value === 'other') {
                this.setState({isShowStatusDetailInput: true});
            } else if (e.target.name === 'dme_status_detail' && e.target.value !== 'other') {
                this.setState({isShowStatusDetailInput: false});
            } else if (e.target.name === 'dme_status_action' && e.target.value === 'other') {
                this.setState({isShowStatusActionInput: true});
            } else if (e.target.name === 'dme_status_action' && e.target.value === 'other') {
                this.setState({isShowStatusDetailInput: false});
            }

            let canUpdateField = true;
            if (!_.isEmpty(e.target.value)) {
                if (e.target.name === 'pu_PickUp_Avail_Time_Hours' ||
                    e.target.name === 'pu_PickUp_By_Time_Hours' ||
                    e.target.name === 'de_Deliver_From_Hours' ||
                    e.target.name === 'de_Deliver_By_Hours') {
                    if (_.isNaN(parseInt(e.target.value))) {
                        this.notify('Please input correct hour!');
                        canUpdateField = false;
                    } else if (parseInt(e.target.value) > 23) {
                        this.notify('Please input correct hour!');
                        canUpdateField = false;
                    }
                }

                if (e.target.name === 'pu_PickUp_Avail_Time_Minutes' ||
                    e.target.name === 'pu_PickUp_By_Time_Minutes' ||
                    e.target.name === 'de_Deliver_From_Minutes' ||
                    e.target.name === 'de_Deliver_By_Minutes'
                ) {
                    if (_.isNaN(parseInt(e.target.value))) {
                        this.notify('Please input correct minutes!');
                        canUpdateField = false;
                    } else if (parseInt(e.target.value) > 59) {
                        this.notify('Please input correct minutes!');
                        canUpdateField = false;
                    }
                }
            }

            if (canUpdateField) {
                if (e.target.name === 'inv_sell_quoted' ||
                    e.target.name === 'inv_sell_quoted_override' ||
                    e.target.name === 'inv_cost_quoted' ||
                    e.target.name === 'inv_sell_actual' ||
                    e.target.name === 'inv_cost_actual'
                ) {
                    let value = e.target.value.replace(',', '').replace('$', '');

                    if (value == '' || value == null) {
                        formInputs[e.target.name] = null;
                    } else {
                        let value = e.target.value.replace(',', '').replace('$', '');
                        formInputs[e.target.name] = value;
                    }
                } else if (
                    e.target.name === 'pu_no_of_assists' ||
                    e.target.name === 'pu_floor_number' ||
                    e.target.name === 'de_no_of_assists' ||
                    e.target.name === 'de_floor_number'
                ) {
                    formInputs[e.target.name] = parseInt(e.target.value);
                } else if (
                    e.target.name === 'b_booking_tail_lift_pickup' ||
                    e.target.name === 'b_booking_tail_lift_deliver'
                ) {
                    formInputs[e.target.name] = e.target.checked;
                } else {
                    formInputs[e.target.name] = e.target.value;
                }

                this.setState({ formInputs, isBookingModified: true });
            }
        }
    }

    onHandleInputBlur(e) {
        let {formInputs} = this.state;

        if (e.target.name === 'inv_sell_quoted' ||
            e.target.name === 'inv_sell_quoted_override' ||
            e.target.name === 'inv_cost_quoted' ||
            e.target.name === 'inv_sell_actual' ||
            e.target.name === 'inv_cost_actual'
        ) {
            let value = e.target.value.replace(',', '').replace('$', '');

            if (value == '' || value == null) {
                formInputs[e.target.name] = null;
            // } else if (value && _.isNaN(parseFloat(value))) {
                // this.notify('Please input float number!');
            } else {
                formInputs[e.target.name] = parseFloat(value).toFixed(2);
            }
        }

        this.setState({ formInputs });
    }

    handleChangeSelect = (selectedOption, fieldName) => {
        const {formInputs, createdForInfos} = this.state;

        if (fieldName === 'warehouse') {
            let selectedWarehouse;
            formInputs['b_client_warehouse_code'] = selectedOption.value;

            for (let i = 0; i < this.props.warehouses.length; i++)
                if (this.props.warehouses[i].client_warehouse_code === formInputs['b_client_warehouse_code'])
                    selectedWarehouse = this.props.warehouses[i];

            formInputs['b_clientPU_Warehouse'] = selectedWarehouse.name;
            formInputs['fk_client_warehouse'] = selectedWarehouse.pk_id_client_warehouses;
            formInputs['puCompany'] = selectedWarehouse.name;
            formInputs['pu_Address_Street_1'] = selectedWarehouse.address1;
            formInputs['pu_Address_street_2'] = selectedWarehouse.address2;
            const puState = {'value': selectedWarehouse.state, 'label': selectedWarehouse.state};
            const puPostalCode = {'value': selectedWarehouse.postal_code, 'label': selectedWarehouse.postal_code};
            const puSuburb = {'value': selectedWarehouse.suburb, 'label': selectedWarehouse.suburb};
            formInputs['pu_Address_Country'] = 'Australia';
            formInputs['pu_Contact_F_L_Name'] = selectedWarehouse.contact_name;
            formInputs['pu_Phone_Main'] = selectedWarehouse.phone_main;
            formInputs['pu_Email'] = selectedWarehouse.contact_email;

            this.setState({puState, puPostalCode, puSuburb});
        } else if (fieldName === 'b_client_name') {
            formInputs['b_client_name'] = selectedOption.value;

            // Init 'Created For' and 'Warehouse Code', 'Warehouse Name'
            formInputs['booking_Created_For'] = '';
            formInputs['booking_Created_For_Email'] = '';
            formInputs['b_clientPU_Warehouse'] = '';
            formInputs['b_client_warehouse_code'] = '';
        } else if (fieldName === 'vx_freight_provider') {
            formInputs['vx_freight_provider'] = selectedOption.value;
        } else if (fieldName === 'inv_billing_status') {
            formInputs['inv_billing_status'] = selectedOption.value;
        } else if (fieldName === 'b_booking_Priority') {
            formInputs['b_booking_Priority'] = {'value': selectedOption.value, 'label': selectedOption.value};
        } else if (fieldName === 'b_booking_Category') {
            formInputs['b_booking_Category'] = {'value': selectedOption.value, 'label': selectedOption.value};
        } else if (fieldName == 'booking_Created_For') {
            const createdForInfo = createdForInfos.filter(info => info.id === selectedOption.value);
            formInputs['booking_Created_For'] = {'value': selectedOption.value, 'label': selectedOption.label};

            if (createdForInfo.length > 0) {
                formInputs['booking_Created_For_Email'] = createdForInfo[0]['email'];
            }
        }

        this.setState({formInputs, isBookingModified: true});
    }

    onDateChange(date, fieldName) {
        const formInputs = this.state.formInputs;

        if (date) {
            formInputs[fieldName] = moment(date).format('YYYY-MM-DD');
        } else {
            formInputs[fieldName] = null;
        }

        if (fieldName === 'fp_store_event_date') {
            formInputs['de_Deliver_From_Date'] = formInputs[fieldName];
            formInputs['de_Deliver_By_Date'] = formInputs[fieldName];
        }

        this.setState({formInputs, isBookingModified: true});
    }

    onChangeDateTime(date, fieldName) {
        const formInputs = this.state.formInputs;
        const booking = this.state.booking;

        let conveted_date = moment(date).add(this.tzOffset, 'h');   // Current -> UTC
        conveted_date = conveted_date.add(timeDiff, 'h');                // UTC -> Sydney

        if (fieldName === 's_05_Latest_Pick_Up_Date_TimeSet' || 
            fieldName === 's_20_Actual_Pickup_TimeStamp' ||
            fieldName === 's_06_Latest_Delivery_Date_TimeSet' ||
            fieldName === 's_21_Actual_Delivery_TimeStamp') {
            formInputs[fieldName] = moment(conveted_date).format('YYYY-MM-DD HH:mm:ssZ');
            this.setState({formInputs});
        } else if (fieldName === 'b_given_to_transport_date_time') {
            if (conveted_date) {
                formInputs['z_calculated_ETA'] = moment(conveted_date).add(booking.delivery_kpi_days, 'd').format('YYYY-MM-DD');
                formInputs[fieldName] = moment(conveted_date).format('YYYY-MM-DD HH:mm:ssZ');
            } else {
                formInputs[fieldName] = null;

                if (booking.fp_received_date_time) {
                    formInputs['z_calculated_ETA'] = moment(booking.fp_received_date_time).add(booking.delivery_kpi_days, 'd').format('YYYY-MM-DD');
                } else {
                    formInputs['z_calculated_ETA'] = null;
                }
            }
            this.setState({formInputs});
        } else if (fieldName === 'fp_received_date_time') {
            if (!conveted_date) {
                formInputs['z_calculated_ETA'] = null;
                formInputs[fieldName] = null;
            } else if (conveted_date && !booking.b_given_to_transport_date_time) {
                formInputs['z_calculated_ETA'] = moment(conveted_date).add(booking.delivery_kpi_days, 'd').format('YYYY-MM-DD');
                formInputs[fieldName] = moment(conveted_date).format('YYYY-MM-DD HH:mm:ssZ');
            } else {
                formInputs[fieldName] = moment(conveted_date).format('YYYY-MM-DD HH:mm:ssZ');
            }
            this.setState({formInputs});
        } else {
            booking[fieldName] = moment(conveted_date).format('YYYY-MM-DD HH:mm:ssZ');
            this.setState({formInputs});
        }

        this.setState({isBookingModified: true});
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        
        if (name === 'tickManualBook') {
            const {booking, clientname} = this.state;

            if (clientname === 'dme') {
                this.props.tickManualBook(booking.id);
                this.setState({loadingBookingUpdate: true, curViewMode: 2});
            } else {
                this.notify('Only `DME` role users can use this feature');
            }
        } else if (name === 'b_send_POD_eMail') {
            let newBooking = this.state.booking;
            newBooking.b_send_POD_eMail = !newBooking.b_send_POD_eMail;
            this.props.updateBooking(newBooking.id, newBooking);
            this.setState({loadingBookingUpdate: true});
        } else if (name == 'b_pu_communicate') {
            const {puCommunicates, booking} = this.state;
            if(puCommunicates.indexOf(target.dataset.method) > -1)
                puCommunicates.splice(puCommunicates.indexOf(target.dataset.method), 1);
            else 
                puCommunicates.push(target.dataset.method);

            booking.pu_Comm_Booking_Communicate_Via = puCommunicates.join(',');
            this.setState({booking, puCommunicates});
        } else if (name == 'b_de_To_communicate') {
            const {booking, deCommunicates} = this.state;
            if(deCommunicates.indexOf(target.dataset.method) > -1) 
                deCommunicates.splice(deCommunicates.indexOf(target.dataset.method), 1);
            else 
                deCommunicates.push(target.dataset.method);

            booking.de_To_Comm_Delivery_Communicate_Via = deCommunicates.join(',');
            this.setState({booking, deCommunicates});
        }
        else {
            this.setState({[name]: value});
        }
    }

    onChangeTime(time, type) {
        const {formInputs} = this.state;

        if (type === 's_02_Booking_Cutoff_Time') {
            formInputs[type] = time;
        }

        this.setState({formInputs});
    }

    handleRadioInputChange(type) {
        const {formInputs} = this.state;
        formInputs['x_ReadyStatus'] = type;
        this.setState({formInputs});
    }

    onClickCreateBooking() {
        const {formInputs, clientname, puState, puSuburb, puPostalCode, deToState, deToSuburb, deToPostalCode, isShowStatusDetailInput, isShowStatusActionInput} = this.state;
        const {clientId} = this.props;

        if (isShowStatusDetailInput && 
            (_.isNull(formInputs['new_dme_status_detail']) || _.isEmpty(formInputs['new_dme_status_detail']))) 
        {
            this.notify('Please select or input Status Detail');
        } else if (isShowStatusActionInput && 
            (_.isNull(formInputs['new_dme_status_action']) || _.isEmpty(formInputs['new_dme_status_action']))) 
        {
            this.notify('Please select or input Status Action');
        } else if (parseInt(this.state.curViewMode) === 1) {
            if (isShowStatusDetailInput) {
                formInputs['dme_status_detail'] = formInputs['new_dme_status_detail'];
                this.props.createStatusDetail(formInputs['dme_status_detail']);
            }

            if (isShowStatusActionInput) {
                formInputs['dme_status_action'] = formInputs['new_dme_status_action'];
                this.props.createStatusAction(formInputs['dme_status_action']);
            }

            if (clientname !== 'dme') {
                formInputs['z_CreatedByAccount'] = clientname;
                formInputs['kf_client_id'] = clientId;
                formInputs['fk_client_warehouse'] = this.getSelectedWarehouseInfoFromCode(formInputs['b_client_warehouse_code'], 'id');
            } else {
                formInputs['z_CreatedByAccount'] = 'dme';

                let ind = 0;
                for (let i = 0; i < this.props.dmeClients.length; i++) {
                    if (this.props.dmeClients[i].company_name.toLowerCase() === formInputs['b_client_name'].toLowerCase()) {
                        ind = i;
                        break;
                    }
                }

                formInputs['kf_client_id'] = this.props.dmeClients[ind].dme_account_num;
                formInputs['fk_client_warehouse'] = this.getSelectedWarehouseInfoFromCode(formInputs['b_client_warehouse_code'], 'id');
            }

            formInputs['pu_Address_State'] = puState ? puState.label : '';
            formInputs['pu_Address_Suburb'] = puSuburb ? puSuburb.label : '';
            formInputs['pu_Address_PostalCode'] = puPostalCode ? puPostalCode.label : '';
            formInputs['de_To_Address_State'] = deToState ? deToState.label : '';
            formInputs['de_To_Address_Suburb'] = deToSuburb ? deToSuburb.label : '';
            formInputs['de_To_Address_PostalCode'] = deToPostalCode ? deToPostalCode.label : '';
            formInputs['b_booking_Category'] = formInputs['b_booking_Category'] ? formInputs['b_booking_Category']['value'] : '';
            formInputs['b_booking_Priority'] = formInputs['b_booking_Priority'] ? formInputs['b_booking_Priority']['value'] : '';
            formInputs['booking_Created_For'] = formInputs['booking_Created_For'] ? formInputs['booking_Created_For']['label'] : '';
            formInputs['x_booking_Created_With'] = 'Manual';
            formInputs['b_status'] = 'Entered';

            const res = isFormValid('booking', formInputs);
            if (res === 'valid') {
                this.props.saveBooking(formInputs);
                this.setState({loadingBookingSave: true});
            } else {
                this.notify(res);
            }
        }
    }

    onClickUpdateBooking() {
        const {isBookedBooking, formInputs, clientname, puState, puSuburb, puPostalCode, deToState, deToSuburb, deToPostalCode, isShowStatusDetailInput, isShowStatusActionInput, booking} = this.state;
        const {clientId} = this.props;

        if (isBookedBooking &&
            clientname.toLowerCase() !== 'dme' &&
            clientname.toLowerCase() !== 'biopak')
        {
            this.notify('Booking is already Booked!');
        } else if (
            clientname.toLowerCase() === 'biopak' &&
            !_.isNull(booking.manifest_timestamp) &&
            !_.isUndefined(booking.manifest_timestamp) &&
            !_.isEmpty(booking.manifest_timestamp)
        ) {
            this.notify('Booking is already Manifested!');
        } else {
            let bookingToUpdate = this.state.booking;

            if (isShowStatusDetailInput && 
                (_.isNull(formInputs['new_dme_status_detail']) || _.isEmpty(formInputs['new_dme_status_detail'])))
            {
                this.notify('Please select or input Status Detail');
            } else if (isShowStatusActionInput && 
                (_.isNull(formInputs['new_dme_status_action']) || _.isEmpty(formInputs['new_dme_status_action'])))
            {
                this.notify('Please select or input Status Action');
            } else if (parseInt(this.state.curViewMode) === 2) {
                if (isShowStatusDetailInput) {
                    formInputs['dme_status_detail'] = formInputs['new_dme_status_detail'];
                    this.props.createStatusDetail(formInputs['new_dme_status_detail']);
                }

                if (isShowStatusActionInput) {
                    formInputs['dme_status_action'] = formInputs['new_dme_status_action'];
                    this.props.createStatusAction(formInputs['new_dme_status_action']);
                }

                formInputs['pu_Address_State'] = puState ? puState.label : null;
                formInputs['pu_Address_Suburb'] = puSuburb ? puSuburb.label : null;
                formInputs['pu_Address_PostalCode'] = puPostalCode ? puPostalCode.label : null;
                formInputs['de_To_Address_State'] = deToState ? deToState.label : null;
                formInputs['de_To_Address_Suburb'] = deToSuburb ? deToSuburb.label : null;
                formInputs['de_To_Address_PostalCode'] = deToPostalCode ? deToPostalCode.label :null;
                formInputs['b_booking_Category'] = formInputs['b_booking_Category']['value'];
                formInputs['b_booking_Priority'] = formInputs['b_booking_Priority']['value'];
                formInputs['booking_Created_For'] = formInputs['booking_Created_For']['label'];

                if (clientname !== 'dme') {
                    formInputs['kf_client_id'] = clientId;
                    formInputs['fk_client_warehouse'] = this.getSelectedWarehouseInfoFromCode(formInputs['b_client_warehouse_code'], 'id');
                } else {
                    let ind = 0;
                    for (let i = 0; i < this.props.dmeClients.length; i++) {
                        if (this.props.dmeClients[i].company_name.toLowerCase() === formInputs['b_client_name'].toLowerCase()) {
                            ind = i;
                            break;
                        }
                    }

                    formInputs['kf_client_id'] = this.props.dmeClients[ind].dme_account_num;
                    formInputs['fk_client_warehouse'] = this.getSelectedWarehouseInfoFromCode(formInputs['b_client_warehouse_code'], 'id');
                }

                Object.keys(formInputs).forEach((key) => {bookingToUpdate[key] = formInputs[key];});
                const res = isFormValid('booking', bookingToUpdate);
                if (res === 'valid') {
                    this.props.updateBooking(booking.id, bookingToUpdate);
                    this.setState({loadingBookingUpdate: true, isBookingModified: false});
                } else {
                    this.notify(res);
                }
            }
        }
    }

    getSelectedWarehouseInfoFromCode = (warehouseCode, infoField) => {
        for (let i = 0; i < this.props.warehouses.length; i++) {
            if (this.props.warehouses[i].client_warehouse_code === warehouseCode) {
                if (infoField === 'name') {
                    return this.props.warehouses[i].name;
                } else if (infoField === 'id') {
                    return this.props.warehouses[i].pk_id_client_warehouses;
                }
            }
        }
    }

    handleUpload(e, type) {
        e.preventDefault();
        const {booking} = this.state;

        if (booking != null && booking.id != null) {
            const that = this;
            this.setState({uploadOption: type});
            setTimeout(() => {
                if (!booking.vx_freight_provider) {
                    that.notify('Please select a Freight Provider!');
                } else if (type === 'attachment') {
                    that.attachmentsDz.processQueue();
                } else if (type === 'label') {
                    that.labelDz.processQueue();
                } else if (type === 'pod') {
                    that.podDz.processQueue();
                }
            }, 300);
        } else {
            this.notify('Plase select a Booking!');
        }
    }

    displayNoOptionsMessage() {
        if (this.state.isBookedBooking == true) {
            return 'No Editable';
        }
    }

    handleFileSending(data, xhr, formData) {
        formData.append('bookingId', this.state.booking.id);
        formData.append('uploadOption', this.state.uploadOption);
    }

    handleAddedFiles(files) {
        var dropzone = this;

        if (files.length > 1) {
            this.notify('Please add only single file for POD and Label.');

            files.map(file => {
                dropzone.remove(file);
            });
        }
    }

    handleUploadSuccess(file, response) {
        let {booking} =  this.state;

        if (response['status'] === 'success' && response['type'] === 'label') {
            booking.z_label_url = response['file_path'];
        } else if (response['status'] === 'success' && response['type'] === 'pod') {
            booking.z_pod_url = response['file_path'];
        }

        this.setState({booking});
    }

    attachmentsHandleUploadFinish() {
        this.props.getBooking(this.state.booking.id, 'id');
        this.props.getAttachmentHistory(this.state.booking.pk_booking_id);
    }

    onClickDuplicate(typeNum, row={}) {
        console.log('onDuplicate: ', typeNum, row);
        const {booking} = this.state;

        if (typeNum === 0) { // Duplicate line
            let duplicatedBookingLine = { pk_lines_id: row.pk_lines_id };
            this.props.duplicateBookingLine(duplicatedBookingLine);
            this.setState({loadingBookingLine: true});
        } else if (typeNum === 1) { // Duplicate line detail
            let duplicatedBookingLineDetail = { pk_id_lines_data: row.pk_id_lines_data };
            this.props.duplicateBookingLineDetail(duplicatedBookingLineDetail);
            this.setState({loadingBookingLineDetail: true});
        } else if (typeNum === 2) { // On click `Duplicate Booking` button
            if (!booking.hasOwnProperty('id')) {
                this.notify('Please select a booking.');
            } else {
                this.toggleDuplicateBookingOptionsModal();
            }
        } else if (typeNum === 3) { // On click `Duplicate` on modal
            const {switchInfo, dupLineAndLineDetail} = this.state;
            this.props.duplicateBooking(booking.id, switchInfo, dupLineAndLineDetail);
            this.toggleDuplicateBookingOptionsModal();
            this.setState({switchInfo: false, dupLineAndLineDetail: false, loading: true, curViewMode: 0});
        }
    }

    onClickSwitchAddress() {
        const {booking} = this.state;
        const temp = {
            'puCompany': booking.deToCompanyName,
            'pu_Address_Street_1': booking.de_To_Address_Street_1,
            'pu_Address_street_2':booking.de_To_Address_Street_2,
            'pu_Address_PostalCode': booking.de_To_Address_PostalCode,
            'pu_Address_Suburb': booking.de_To_Address_Suburb,
            'pu_Address_Country': booking.de_To_Address_Country,
            'pu_Contact_F_L_Name': booking.de_to_Contact_F_LName,
            'pu_Phone_Main': booking.de_to_Phone_Main,
            'pu_Email': booking.de_Email,
            'pu_Address_State': booking.de_To_Address_State,
            'deToCompanyName': booking.puCompany,
            'de_To_Address_Street_1': booking.pu_Address_Street_1,
            'de_To_Address_Street_2': booking.pu_Address_street_2,
            'de_To_Address_PostalCode': booking.pu_Address_PostalCode,
            'de_To_Address_Suburb': booking.pu_Address_Suburb,
            'de_To_Address_Country': booking.pu_Address_Country,
            'de_to_Contact_F_LName': booking.pu_Contact_F_L_Name,
            'de_to_Phone_Main': booking.pu_Phone_Main,
            'de_Email': booking.pu_Email,
            'de_To_Address_State': booking.pu_Address_State,
            'pu_email_Group_Name': booking.de_Email_Group_Name,
            'pu_email_Group': booking.de_Email_Group_Emails,
            'de_Email_Group_Name': booking.pu_email_Group_Name,
            'de_Email_Group_Emails': booking.pu_email_Group,
        };

        booking.puCompany = temp['puCompany'];
        booking.pu_Address_Street_1 = temp['pu_Address_Street_1'];
        booking.pu_Address_street_2 = temp['pu_Address_street_2'];
        booking.pu_Address_PostalCode = temp['pu_Address_PostalCode'];
        booking.pu_Address_Suburb = temp['pu_Address_Suburb'];
        booking.pu_Address_Country = temp['pu_Address_Country'];
        booking.pu_Contact_F_L_Name = temp['pu_Contact_F_L_Name'];
        booking.pu_Phone_Main = temp['pu_Phone_Main'];
        booking.pu_Email = temp['pu_Email'];
        booking.deToCompanyName = temp['deToCompanyName'];
        booking.de_To_Address_Street_1 = temp['de_To_Address_Street_1'];
        booking.de_To_Address_Street_2 = temp['de_To_Address_Street_2'];
        booking.de_To_Address_PostalCode = temp['de_To_Address_PostalCode'];
        booking.de_To_Address_Suburb = temp['de_To_Address_Suburb'];
        booking.de_To_Address_Country = temp['de_To_Address_Country'];
        booking.de_to_Contact_F_LName = temp['de_to_Contact_F_LName'];
        booking.de_to_Phone_Main = temp['de_to_Phone_Main'];
        booking.de_Email = temp['de_Email'];
        booking.de_To_Address_State = temp['de_To_Address_State'];
        booking.pu_email_Group_Name = temp['pu_email_Group_Name'];
        booking.pu_email_Group = temp['pu_email_Group'];
        booking.de_Email_Group_Name = temp['de_Email_Group_Name'];
        booking.de_Email_Group_Emails = temp['de_Email_Group_Emails'];

        this.props.updateBooking(booking.id, booking);
        this.setState({loadingBookingUpdate: true, isBookingModified: false});
    }

    onClickDeleteLineOrLineData(typeNum, row) {
        console.log('#204 onDelete: ', typeNum, row);

        if (typeNum === 0) { // Duplicate line
            let deletedBookingLine = { pk_lines_id: row.pk_lines_id };
            this.props.deleteBookingLine(deletedBookingLine);
            this.setState({loadingBookingLine: true, loadingBookingLineDetail: true});
        } else if (typeNum === 1) { // Duplicate line detail
            let deletedBookingLineDetail = { pk_id_lines_data: row.pk_id_lines_data };
            this.props.deleteBookingLineDetail(deletedBookingLineDetail);
            this.setState({loadingBookingLineDetail: true});
        }
    }

    toggleDuplicateBookingOptionsModal() {
        this.setState(prevState => ({isShowDuplicateBookingOptionsModal: !prevState.isShowDuplicateBookingOptionsModal}));
    }

    handleModalInputChange(type, event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        if (type === 'note') {
            let noteFormInputs = this.state.noteFormInputs;
            noteFormInputs[name] = value;
            this.setState({noteFormInputs});
        }
    }

    toggleLineSlider() {
        const { isBookingSelected } = this.state;

        if (isBookingSelected) {
            this.setState(prevState => ({isShowLineSlider: !prevState.isShowLineSlider}));
        } else {
            this.notify('Please select a booking.');
        }
    }

    toggleLineTrackingSlider() {
        this.setState(prevState => ({isShowLineTrackingSlider: !prevState.isShowLineTrackingSlider}));
    }

    toggleStatusLockModal() {
        this.setState(prevState => ({isShowStatusLockModal: !prevState.isShowStatusLockModal}));
    }

    toggleStatusNoteModal(type='b_booking_Notes') {
        this.setState(prevState => ({isShowStatusNoteModal: !prevState.isShowStatusNoteModal, currentNoteModalField: type}));
    }

    toggleDeleteFileConfirmModal() {
        this.setState(prevState => ({isShowDeleteFileConfirmModal: !prevState.isShowDeleteFileConfirmModal}));
    }

    onToggleAugmentInfoPopup = () => {
        this.setState(prevState => ({isShowAugmentInfoPopup: !prevState.isShowAugmentInfoPopup}));
        this.setState({isAugmentEditable: false});
    }

    onShowEditAugment = () => {
        this.setState({isAugmentEditable: true});
    }

    onHideEditAugment = () => {
        this.setState({isAugmentEditable: false});
    }

    onUpdateAugment = () => {
        const {clientprocess} = this.state;
        this.props.updateAugment(clientprocess);
        this.onHideEditAugment();
    }

    onInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        const clientprocess = this.state.clientprocess;
        clientprocess[name] = value;
        this.setState({clientprocess, errorMessage: ''});
    }

    toggleUpdateCreatedForEmailConfirmModal() {
        this.setState(prevState => ({isShowUpdateCreatedForEmailConfirmModal: !prevState.isShowUpdateCreatedForEmailConfirmModal}));
    }

    toggleStatusHistorySlider() {
        const { isBookingSelected } = this.state;

        if (isBookingSelected) {
            this.setState(prevState => ({isShowStatusHistorySlider: !prevState.isShowStatusHistorySlider}));
        } else {
            this.notify('Please select a booking.');
        }
    }

    toggleDateSlider() {
        const { isBookingSelected } = this.state;

        if (isBookingSelected) {
            this.setState(prevState => ({isShowProjectDataSlider: !prevState.isShowProjectDataSlider}));
        } else {
            this.notify('Please select a booking.');
        }
    }

    toggleFPPricingSlider() {
        this.setState(prevState => ({isShowFPPricingSlider: !prevState.isShowFPPricingSlider}));
    }

    toggleEmailLogSlider() {
        this.setState(prevState => ({isShowEmailLogSlider: !prevState.isShowEmailLogSlider}));
    }

    toggleCostSlider() {
        if (!this.state.booking.vx_freight_provider) {
            this.notify('Freight Provider is required to open this slider.');
            return;
        }

        this.setState(prevState => ({isShowCostSlider: !prevState.isShowCostSlider}));   
    }

    toggleManualRepackModal() {
        this.setState(prevState => ({isShowManualRepackModal: !prevState.isShowManualRepackModal}));
    }

    // onClickSwitchClientNavIcon(e) {
    //     e.preventDefault();
    //     this.props.getDMEClients();
    //     this.toggleSwitchClientModal();
    // }

    // onSwitchClient(clientPK) {
    //     this.props.setClientPK(clientPK);
    //     this.toggleSwitchClientModal();
    // }

    onClickCancelBook() {
        const {booking} = this.state;

        if (!booking) {
            this.notify('Please select booking to cancel');
        } else {
            this.props.fpCancelBook(booking.id, booking.vx_freight_provider);
        }
    }

    onClickEditBook() {
        const {booking} = this.state;

        if (!booking) {
            this.notify('Please select booking to edit');
        } else {
            this.props.fpEditBook(booking.id, booking.vx_freight_provider);
        }
    }

    onClickPrev(e){
        e.preventDefault();
        const {prevBookingId, isBookingModified} = this.state;

        if (isBookingModified) {
            this.notify('You can lose modified booking info. Please update it');
        } else {
            if (prevBookingId && prevBookingId > -1) {
                this.props.getBooking(prevBookingId, 'id');
            }

            this.setState({loading: true, curViewMode: 0});
        }
    }

    onClickNext(e) {
        e.preventDefault();
        const {nextBookingId, isBookingModified} = this.state;

        if (isBookingModified) {
            this.notify('You can lose modified booking info. Please update it');
        } else {
            if (nextBookingId && nextBookingId > -1) {
                this.props.getBooking(nextBookingId, 'id');
            }

            this.setState({loading: true, curViewMode: 0});
        }
    }

    onClickRefreshBooking(e) {
        e.preventDefault();
        const {isBookingModified, booking} = this.state;

        if (isBookingModified) {
            this.notify('You can lose modified booking info. Please update it');
        } else {
            this.refreshBooking(booking);
        }
    }

    onClickGoToAllBookings(e) {
        e.preventDefault();
        const {isBookingModified} = this.state;

        if (isBookingModified) {
            this.notify('You can lose modified booking info. Please update it');
        } else {
            this.props.history.push('/allbookings');
        }
    }

    onChangeViewMode(newViewMode) {
        const { curViewMode, isBookingModified } = this.state;

        if (isBookingModified) { // -> Create or Update
            this.notify('You can lose modified booking info. Please update it');
        } else if (curViewMode === 1 && newViewMode === 2) { // Create -> Update
            this.notify('You can only change to `View` mode from `New From`.');
        } else if (newViewMode === 1) { // -> Create
            this.showCreateView();
            this.setState({
                curViewMode: newViewMode,
                isBookingModified: false
            }, () => this.afterSetState(1)); // Reload GEO info
        } else if (curViewMode === 1 && newViewMode === 0) { // Create -> View
            this.props.getBooking();
            this.setState({
                curViewMode: newViewMode,
                isBookingModified: false,
                loading: true
            }, () => this.afterSetState(1)); // Reload GEO info
        } else if (curViewMode === 0 && newViewMode === 2) { // View -> Update
            this.setState({
                curViewMode: newViewMode,
                isBookingModified: false
            }, () => this.afterSetState(1)); // Reload GEO info
        } else if (curViewMode === 2 && newViewMode === 0) { // Update -> View
            this.setState({
                curViewMode: newViewMode,
                isBookingModified: false
            }); // Reload GEO info
        }
    }

    showCreateView() {
        const {isBookingSelected, clientname, booking} = this.state;

        if (isBookingSelected) {
            let formInputs = {};
            Object.keys(booking).forEach((key) => {formInputs[key] = null;});
            formInputs['pu_Address_Country'] = 'AU';
            formInputs['de_To_Address_Country'] = 'AU';
            formInputs['b_client_name'] = clientname;
            formInputs['b_client_warehouse_code'] = 'No - Warehouse';
            formInputs['booking_Created_For_Email'] = '';
            formInputs['fk_client_warehouse'] = 100;
            formInputs['dme_status_detail'] = null;
            formInputs['dme_status_action'] = null;

            this.setState({
                isBookingSelected: false, 
                products: [], 
                bookingLineDetailsProduct: [],
                puState: null,
                puSuburb: null,
                puPostalCode: null,
                deToState: null,
                deToSuburb: null,
                deToPostalCode: null,
                formInputs,
            });
        }
    }

    onClickOpenSlide(e) {
        e.preventDefault();
        this.toggleStatusHistorySlider();
    }

    onClickOpenDateSlide(e) {
        e.preventDefault();
        this.toggleDateSlider();
    }

    OnCreateStatusHistory(statusHistory) {
        const {booking} = this.state;

        statusHistory['dme_status_detail'] = booking.dme_status_detail;
        statusHistory['dme_status_action'] = booking.dme_status_action;
        statusHistory['dme_status_linked_reference_from_fp'] = booking.dme_status_linked_reference_from_fp;
        this.props.createStatusHistory(statusHistory);
    }

    OnUpdateStatusHistory(statusHistory) {
        this.props.updateStatusHistory(statusHistory);
    }

    onUpdateProjectData(newBooking) {
        this.setState({curViewMode: 2, loadingBookingUpdate: true});
        this.props.updateBooking(this.state.booking.id, newBooking);
    }

    onClickStatusLock(booking) {
        const { clientname } = this.state;

        if (clientname === 'dme') {
            if (booking.b_status_API === 'POD Delivered') {
                this.toggleStatusLockModal();
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
        booking.z_locked_status_time = moment().format('YYYY-MM-DD HH:mm:ss');

        if (!booking.z_lock_status) {
            booking.b_status_API = 'status update ' + moment().format('DD_MM_YYYY');
        }

        this.props.updateBooking(booking.id, booking);
        this.setState({curViewMode: 2, loadingBookingUpdate: true});
    }

    onClickBottomTap(e, activeTabInd) {
        e.preventDefault();
        this.setState({activeTabInd});
    }

    onUpdateStatusNote(note) {
        let formInputs = this.state.formInputs;
        const {currentNoteModalField} = this.state;

        formInputs[currentNoteModalField] = note;
        this.setState({formInputs, isBookingModified: true});
        this.toggleStatusNoteModal();
    }

    onClearStatusNote() {
        let formInputs = this.state.formInputs;
        const {currentNoteModalField} = this.state;

        formInputs[currentNoteModalField] = '';
        this.setState({formInputs, isBookingModified: true});
        this.toggleStatusNoteModal();
    }

    onClickFC() { // On click Freight Calculation button
        const {booking, formInputs} = this.state;

        if (!formInputs['puPickUpAvailFrom_Date']) {
            this.notify('PU Available From Date is required!');
        } else {
            this.props.fpPricing(booking.id);
            this.setState({loading: true});
            this.toggleFPPricingSlider();
        }
    }

    onClickOpenPricingSlider() {
        this.props.getPricingInfos(this.state.booking.pk_booking_id);
        this.setState({loadingPricingInfos: true, pricingInfos: []});
        this.toggleFPPricingSlider();
    }

    onSelectPricing(pricingInfo) {
        const {formInputs, booking} = this.state;

        formInputs['vx_freight_provider'] = pricingInfo['freight_provider'];
        booking['vx_freight_provider'] = pricingInfo['freight_provider'];
        booking['vx_account_code'] = pricingInfo['account_code'];
        formInputs['vx_account_code'] = pricingInfo['account_code'];
        booking['vx_serviceName'] = pricingInfo['service_name'];
        formInputs['vx_serviceName'] = pricingInfo['service_name'];
        booking['v_service_Type'] = pricingInfo['service_code'];
        formInputs['v_service_Type'] = pricingInfo['service_code'];
        booking['inv_cost_quoted'] = pricingInfo['inv_cost_quoted'];
        formInputs['inv_cost_quoted'] = pricingInfo['inv_cost_quoted'];
        booking['inv_sell_quoted'] = parseFloat(pricingInfo['client_mu_1_minimum_values']).toFixed(3);
        formInputs['inv_sell_quoted'] = booking['inv_sell_quoted'];
        booking['api_booking_quote'] = pricingInfo['id'];

        const selectedFP = this.props.allFPs
            .find(fp => fp.fp_company_name.toLowerCase() === pricingInfo['freight_provider'].toLowerCase());
        booking['s_02_Booking_Cutoff_Time'] = selectedFP['service_cutoff_time'];
        formInputs['s_02_Booking_Cutoff_Time'] = booking['s_02_Booking_Cutoff_Time'];

        this.setState({formInputs, booking, loading: true, curViewMode: 0});
        this.props.updateBooking(booking.id, booking);
        this.toggleFPPricingSlider();
    }

    onClickEnvelop(templateName) {
        const { booking } = this.state;

        if (!booking) {
            this.notify('Please select booking!');
        } else {
            if (templateName === 'Email Log') {
                this.toggleEmailLogSlider();
            } else {
                this.props.sendEmail(booking.id, templateName);
            }
        }
    }

    onLoadPricingErrors() {
        this.setState({loadingPricingInfos: true});
        this.props.getAllErrors(this.state.booking.pk_booking_id);
    }

    // status: `original`, `auto`, `manual`
    onChangePackedStatus(status) {
        const {booking, products} = this.state;

        if (products.length === 0) {
            this.notify('There are no lines. Please add lines first.');
            return;
        }

        const currentPackedStatus = status;
        const filteredProducts = products.filter(product => {
            if (currentPackedStatus !== 'original')
                return product['packed_status'] === currentPackedStatus;
            else
                return _.isNull(product['packed_status']) || product['packed_status'] === currentPackedStatus;
        });

        if (filteredProducts.length === 0) {
            if (status === 'auto') {
                this.props.repack(booking.id, status);
                this.setState({loadingBooking: true, currentPackedStatus});
            } else if (status === 'scanned') {
                this.setState({currentPackedStatus});
            } else {
                this.toggleManualRepackModal();
            }
        } else {
            this.setState({currentPackedStatus});
        }
    }

    onAfterSaveCell = async (oldValue, newValue, row, column) => {
        let data = null;
        if (oldValue !== newValue){
            if (column.text === 'Summary') {
                data = {
                    cf: {
                        cf_summary: newValue
                    }
                };
                this.props.updateZohoTicket(row.id, data);
            } else if (column.text === 'Department') {
                data = {
                    departmentId: newValue
                };
                this.props.moveZohoTicket(row.id, data);
            }
        }
    }

    render() {
        const {
            isBookedBooking, isLockedBooking, attachmentsHistory, booking, products, AdditionalServices, bookingLineDetailsProduct, formInputs, puState, puStates, puPostalCode, puPostalCodes, puSuburb, puSuburbs, deToState, deToStates, deToPostalCode, deToPostalCodes, deToSuburb, deToSuburbs, clientname, isShowLineSlider, curViewMode, isBookingSelected,  statusHistories, isShowStatusHistorySlider, allBookingStatus, isShowLineTrackingSlider, activeTabInd, statusActions, statusDetails, isShowStatusLockModal, isShowStatusDetailInput, isShowStatusActionInput, currentNoteModalField, qtyTotal, cntAttachments, zohoTickets, clientprocess, puCommunicates, deCommunicates, isAugmentEditable, currentPackedStatus, zohoDepartments, zohoTicketSummaries
        } = this.state;
        const {warehouses, emailLogs, bookingLines} = this.props;

        const filteredProducts = products
            .filter(product => {
                if (currentPackedStatus !== 'original')
                    return product['packed_status'] === currentPackedStatus;
                else
                    return _.isNull(product['packed_status']) || product['packed_status'] === currentPackedStatus;
            })
            .map((line, index) => {
                line['index'] = index + 1;
                return line;
            });
        const filterBookingLineDetailsProduct = bookingLineDetailsProduct
            .filter((lineDetail) => {
                const index = filteredProducts.findIndex(product => product['pk_booking_lines_id'] === lineDetail['fk_booking_lines_id']);
                return index > -1 ? true : false;
            })
            .map(lineDetail => {
                const product = filteredProducts.find(product => product['pk_booking_lines_id'] === lineDetail['fk_booking_lines_id']);
                lineDetail['line_index'] = product['index'];
                return lineDetail;
            });
        const bookingTotals = bookingLines ? this.calcBookingLine(booking, bookingLines, true) : [];

        const bookingLineColumns = [
            {
                dataField: 'index',
                text: 'No.',
            }, {
                dataField: 'pk_lines_id',
                text: 'Id',
                hidden: true,
            }, {
                dataField: 'e_type_of_packaging',
                text: 'Packaging',
            }, {
                dataField: 'e_item',
                text: 'Item Description'
            }, {
                dataField: 'e_qty',
                text: 'Qty',
            }, {
                dataField: 'e_weightUOM',
                text: 'Wgt UOM'
            }, {
                dataField: 'e_weightPerEach',
                text: 'Wgt Each',
            }, {
                dataField: 'e_Total_KG_weight',
                text: 'Total Kgs',
                editable: false,
            }, {
                dataField: 'e_dimUOM',
                text: 'Dim UOM',
            }, {
                dataField: 'e_dimLength',
                text: 'Length',
            }, {
                dataField: 'e_dimWidth',
                text: 'Width',
            }, {
                dataField: 'e_dimHeight',
                text: 'Height',
            }, {
                dataField: 'e_1_Total_dimCubicMeter',
                text: 'Cubic Meter',
                editable: false,
            }, {
                dataField: 'total_2_cubic_mass_factor_calc',
                text: 'Cubic KG',
                editable: false,
            }
        ];

        let pickedUpProducts = [];
        if (booking && booking.b_status === 'Entered' && booking.b_client_name === 'Plum Products Australia Ltd') {
            pickedUpProducts = products
                .filter(product => !_.isNull(product['picked_up_timestamp']))
                .map(product => product['pk_lines_id']);
        }

        const bookingLineColumnsSelectRow = {
            mode: 'checkbox',
            hideSelectAll: true,
            hideSelectColumn: !(booking && booking.b_status === 'Entered' && booking.b_client_name === 'Plum Products Australia Ltd'),
            selected: pickedUpProducts,
            onSelect: (row, isSelect, rowIndex, e) => {
                console.log('Booking Line checkbox event - ', rowIndex, e);

                if (isSelect) {
                    let conveted_date = moment().add(this.tzOffset, 'h');           // Current -> UTC
                    conveted_date = conveted_date.add(timeDiff, 'h');               // UTC -> Sydney
                    row['picked_up_timestamp'] = conveted_date;
                } else {
                    row['picked_up_timestamp'] = null;
                }

                this.props.updateBookingLine(row);
            },
        };

        const bookingLineDetailsColumns = [
            {
                dataField: 'line_index',
                text: 'Line No.',
            }, {
                dataField: 'pk_id_lines_data',
                text: 'Id',
                hidden: true,
            }, {
                dataField: 'modelNumber',
                text: 'Model'
            }, {
                dataField: 'itemDescription',
                text: 'Item Description'
            }, {
                dataField: 'quantity',
                text: 'Qty'
            }, {
                dataField: 'itemFaultDescription',
                text: 'Fault Description'
            }, {
                dataField: 'insuranceValueEach',
                text: 'Insurance Value'
            }, {
                dataField: 'gap_ra',
                text: 'Gap/ RA'
            }, {
                dataField: 'clientRefNumber',
                text: 'Client Reference #'
            }
        ];

        let columnZohoTickets = [
            {
                dataField: 'ticketNumber',
                text: 'Ticket Number',
                editable: () => {
                    return false;
                }
            }, {
                dataField: 'createdTime',
                text: 'Created At',
                formatter: (cell) => {
                    moment.tz.setDefault('Australia/Sydney');
                    return moment(cell).format('DD/MM/YYYY HH:MM');
                },
                editable: () => {
                    return false;
                }
            }, {
                dataField: 'subject',
                text: 'Subject',
                editable: () => {
                    return false;
                }
            }, {
                dataField: 'cf.cf_summary',
                text: 'Summary',
                editor: {
                    type: Type.SELECT,
                    options: zohoTicketSummaries.map((summary) => ({ value: summary, label: summary }))
                },
                editable: () => {
                    return clientname === 'dme';
                }
            }, {
                dataField: 'departmentId',
                text: 'Department',
                formatter: (cell) => {
                    let depart = zohoDepartments.find(item => item.id === cell);
                    if (depart) return depart.name;
                    else return cell;
                },
                editor: {
                    type: Type.SELECT,
                    options: zohoDepartments.map(({ id, name }) => ({ value: id, label: name }))
                },
                editable: () => {
                    return clientname === 'dme';
                }
            }, {
                dataField: 'status',
                text: 'Status',
                editable: () => {
                    return false;
                }
            }, {
                dataField: 'id',
                text: 'View',
                formatter:  (cell, row) => {
                    return (<Link to={'/zohodetails?id=' + row.id}><i className="fa fa-eye"></i></Link>);
                },
                editable: () => {
                    return false;
                }
            }
        ];

        const columnAttachments = [
            {
                dataField: 'no',
                text: 'Attachment No'
            }, {
                dataField: 'description',
                text: 'Description'
            }, {
                dataField: 'filename',
                text: 'FileName'
            }, {
                dataField: 'dateupdated',
                text: 'Date Updated'
            }, {
                dataField: 'uploadfile',
                text: 'Upload File'
            }
        ];

        const columnAdditionalServices = [
            {
                dataField: 'vx_freight_provider',
                text: 'Freight Provider'
            }, {
                dataField: 'vx_serviceName',
                text: 'Service'
            }, {
                dataField: 'v_FPBookingNumber',
                text: 'Consignment No'
            }, {
                dataField: 's_02_Booking_Cutoff_Time',
                text: 'Booking Cutoff'
            }, {
                dataField: 'puPickUpAvailFrom_Date',
                text: 'Pickup / Manifest No'
            }, {
                dataField: 'z_CreatedTimestamp',
                text: 'Entered Date'
            }, {
                dataField: 'Quoted',
                text: 'Quoted'
            }, {
                dataField: 'b_dateBookedDate',
                text: 'Booked Date'
            }, {
                dataField: 'Invoiced',
                text: 'Invoiced'
            },
        ];

        const columnBookingTotals = [
            {
                dataField: 'qty',
                text: 'Total Ordered'
            }, {
                dataField: 'total_qty_collected',
                text: 'Total Collected'
            }, {
                dataField: 'total_qty_scanned',
                text: 'Total Scanned'
            }, {
                dataField: 'b_fp_qty_delivered',
                text: 'Total Delivered'
            }, {
                dataField: 'total_kgs',
                text: 'Total Kgs'
            }, {
                dataField: 'cubic_meter',
                text: 'Total Cubic Meter'
            },
        ];

        // DropzoneComponent config
        this.djsConfig['headers'] = {'Authorization': 'JWT ' + localStorage.getItem('token')};
        const djsConfig = this.djsConfig;

        const attachmentsDzConfig = this.attachmentsDropzoneComponentConfig;
        const labelDzConfig = this.labelDropzoneComponentConfig;
        const podDzConfig = this.podDropzoneComponentConfig;

        const attachmentsEventHandlers = {
            init: dz => this.attachmentsDz = dz,
            sending: this.handleFileSending.bind(this),
            success: this.handleUploadSuccess.bind(this),
            queuecomplete: this.attachmentsHandleUploadFinish.bind(this),
        };
        const labelEventHandlers = {
            init: dz => this.labelDz = dz,
            addedfiles: this.handleAddedFiles.bind(this),
            sending: this.handleFileSending.bind(this),
            success: this.handleUploadSuccess.bind(this),
        };
        const podEventHandlers = {
            init: dz => this.podDz = dz,
            addedfiles: this.handleAddedFiles.bind(this),
            sending: this.handleFileSending.bind(this),
            success: this.handleUploadSuccess.bind(this),
        };

        let warehouseCodeOptions = warehouses
            .filter(warehouse => (formInputs['b_client_name'] && formInputs['b_client_name'].toLowerCase() === 'dme')
            || warehouse.client_company_name === formInputs['b_client_name'])
            .map(warehouse => ({value: warehouse.client_warehouse_code, label: warehouse.client_warehouse_code}));

        const bookingCategroies = [
            'Repairs & Spare Parts Expense',
            'Refurbishment Expense',
            'Salvage Expense',
            'Samples & Sales Expense',
            'Standard Sales',
            'Testing Expense',
            'Admin / Other',
        ];

        let bookingCategoryOptions = bookingCategroies.map(category => ({value: category, label: category}));

        const bookingPriorities = ['Low', 'Standard', 'High', 'Critical'];

        let bookingProioriyOptions = bookingPriorities.map((priority) => {
            return {value: priority, label: priority};
        });

        const currentWarehouseCodeOption = {
            value: formInputs['b_client_warehouse_code'] ? formInputs['b_client_warehouse_code'] : null,
            label: formInputs['b_client_warehouse_code'] ? formInputs['b_client_warehouse_code'] : null,
        };

        const clientnameOptions = this.props.dmeClients
            .map(client => ({value: client.company_name, label: client.company_name}));
        const currentClientnameOption = {value: formInputs['b_client_name'], label: formInputs['b_client_name']};

        const fpOptions = this.props.allFPs
            .map(fp => ({value: fp.fp_company_name, label: fp.fp_company_name}));
        const currentFPOption = {value: formInputs['vx_freight_provider'], label: formInputs['vx_freight_provider']};

        const InvBillingOptions = [
            {value: 'Charge', label: 'Charge'},
            {value: 'Reduced Charge', label: 'Reduced Charge'},
            {value: 'Not to Charge', label: 'Not to Charge'},
        ];
        const currentInvBillingOption = {value: formInputs['inv_billing_status'], label: formInputs['inv_billing_status']};
        
        const generalEmailCnt = emailLogs.filter(emailLog => emailLog['emailName'] === 'General Booking').length;
        const podEmailCnt = emailLogs.filter(emailLog => emailLog['emailName'] === 'POD').length;
        const returnEmailCnt = emailLogs.filter(emailLog => emailLog['emailName'] === 'Return Booking').length;
        const unpackedReturnCnt = emailLogs.filter(emailLog => emailLog['emailName'] === 'Unpacked Return Booking').length;
        const futileEmailCnt = emailLogs.filter(emailLog => emailLog['emailName'] === 'Futile Pickup').length;

        const createdForInfosList = this.state.createdForInfos
            .filter(createdForInfo => createdForInfo.company_name === formInputs['b_client_name'])
            .map(createdForInfo => {
                const name_first = createdForInfo.name_first ? createdForInfo.name_first : '';
                const name_last = createdForInfo.name_last ? createdForInfo.name_last : '';
                return {value: createdForInfo.id, label: name_first + ' ' + name_last};
            });

        const statusActionOptions = statusActions
            .map((statusAction, key) => (
                <option key={key} value={statusAction.dme_status_action}>
                    {statusAction.dme_status_action}
                </option>
            ));

        const statusDetailOptions = statusDetails
            .map((statusDetail, key) => (
                <option key={key} value={statusDetail.dme_status_detail}>
                    {statusDetail.dme_status_detail}
                </option>
            ));

        return (
            <div className="qbootstrap-nav header">
                <div id="headr" className="col-md-12">
                    <div className="col-md-7 col-sm-12 col-lg-8 col-xs-12 col-md-push-1">
                        <ul className="nav nav-tabs">
                            <li className="active"><Link to="/booking">Header</Link></li>
                            <li><a onClick={(e) => this.onClickGoToAllBookings(e)}>All Bookings</a></li>
                            <li className=""><a href="/bookingsets">Booking Sets</a></li>
                            <li className=""><Link to="/pods">PODs</Link></li>
                            {clientname === 'dme' && <li className=""><Link to="/zoho">Zoho</Link></li>}
                            <li className=""><Link to="/reports">Reports</Link></li>
                            <li className="none"><a href="/bookinglines">Booking Lines</a></li>
                            <li className="none"><a href="/bookinglinedetails">Booking Line Data</a></li>
                        </ul>
                    </div>
                    <div id="icn" className="col-md-4 col-sm-12 col-lg-4 col-xs-12 text-right col-lg-pull-1">
                        <a className="none"><i className="icon-plus" aria-hidden="true"></i></a>
                        <div className="none">
                            <i className="icon-search3" aria-hidden="true"></i>
                        </div>
                        <div className="none">
                            <i className="icon icon-th-list" aria-hidden="true"></i>
                        </div>
                        <a className="none"><i className="icon-cog2" aria-hidden="true"></i></a>
                        <a className="none"><i className="icon-calendar3" aria-hidden="true"></i></a>
                       
                        {clientname === 'dme' && <a className='cur-pointer header-title-count' onClick={() => this.onClickEnvelop('General Booking')}> <img src={imgGeneral} alt=""/>{generalEmailCnt > 0 && ` (${generalEmailCnt})`}</a>}
                        {clientname === 'dme' && <a className='cur-pointer header-title-count' onClick={() => this.onClickEnvelop('POD')}><img src={imgPod} alt=""/> {podEmailCnt > 0 && ` (${podEmailCnt})`} </a>}
                        {clientname === 'dme' && <a className='cur-pointer header-title-count' onClick={() => this.onClickEnvelop('Return Booking')}><img src={imgReturn} alt=""/>{returnEmailCnt > 0 && ` (${returnEmailCnt})`} </a>}
                        {clientname === 'dme' && <a className='cur-pointer header-title-count' onClick={() => this.onClickEnvelop('Unpacked Return Booking')}> <img src={imgUnpacked} alt="" /> {unpackedReturnCnt > 0 && ` (${unpackedReturnCnt})`} </a>}
                        {clientname === 'dme' && <a className='cur-pointer header-title-count' onClick={() => this.onClickEnvelop('Futile Pickup')}> <img src={imgFutile} alt="" />{futileEmailCnt > 0 && ` (${futileEmailCnt})`} </a>}
                        {clientname === 'dme' && <a className='cur-pointer header-title-count' onClick={() => this.onClickEnvelop('Email Log')}><img src={imgLogsSlider} /> </a>}
                        
                        <a className="none">?</a>
                        {/*
                            clientname === 'dme' &&
                                <a 
                                    className='cur-pointer'
                                    onClick={(e) => this.onClickSwitchClientNavIcon(e)}
                                >
                                    <i className="fa fa-users" aria-hidden="true"></i>
                                </a>
                        */}
                    </div>
                </div>

                <div className="user-header">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-6">
                                <Button
                                    className={curViewMode === 0 ? 'active view-mode-btn' : 'view-mode-btn'}
                                    onClick={() => this.onChangeViewMode(0)}
                                >View</Button>
                                <Button
                                    className={curViewMode === 2 ? 'active view-mode-btn' : 'view-mode-btn'}
                                    onClick={() => this.onChangeViewMode(2)}
                                >Edit</Button>
                                <Button
                                    className={curViewMode === 1 ? 'active view-mode-btn' : 'view-mode-btn'}
                                    onClick={() => this.onChangeViewMode(1)}
                                >New Booking</Button>
                            </div>
                            <div className="col-sm-6 pad-top-8">
                                <div className="float-r disp-inline-block form-group">
                                    <input 
                                        className="form-control"
                                        type="text"
                                        onChange={this.onChangeText.bind(this)} 
                                        onKeyPress={(e) => this.onKeyPress(e)} 
                                        placeholder="Enter Number(Enter)"
                                        disabled={(this.state.loadingBookingLine || this.state.loadingBookingLineDetail || this.state.loading || this.state.loadingGeoPU) ? 'disabled' : ''}
                                    />
                                </div>
                                <div className="float-r disp-inline-block mar-right-20">
                                    <input type="radio" value="dme" name="gender" checked={this.state.selected === 'dme'} onChange={(e) => this.setState({ selected: e.target.value })} /> DME #<br />
                                    <input type="radio" value="con" name="gender" checked={this.state.selected === 'con'} onChange={(e) => this.setState({ selected: e.target.value })}/> CON #
                                </div>
                                <div className="user content none">
                                    <ul>
                                        <li><img src={user} alt="" /></li>
                                        <li>Stephen Madeisky</li>
                                        <li><a href=""><i className="fas fa-caret-down text-black"></i></a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <LoadingOverlay
                    active={this.state.loading || this.state.loadingBookingSave || this.state.loadingBookingUpdate}
                    spinner
                    text='Loading...'
                >
                    <section className="booking">
                        <div className="container">
                            <div className="grid">
                                <div className="userclock disp-inline-block">
                                    Sydney AU: <Clock format={'DD MMM YYYY h:mm:ss A'} disabled={true} ticking={true} timezone={'Australia/Sydney'} />
                                </div>
                                <div className="booked-date disp-inline-block">
                                    <span>Booked Date:</span>
                                    {
                                        (parseInt(curViewMode) === 0) ?
                                            <p className="show-mode">{booking && booking.b_dateBookedDate && moment(booking.b_dateBookedDate).format('DD/MM/YYYY HH:mm:ss')}</p>
                                            :
                                            <DateTimePicker
                                                onChange={(date) => this.onChangeDateTime(date, 'b_dateBookedDate')}
                                                value={(!_.isNull(booking) &&
                                                    !_.isNull(booking.b_dateBookedDate) &&
                                                    !_.isUndefined(booking.b_dateBookedDate)) &&
                                                    new Date(moment(booking.b_dateBookedDate).toDate().toLocaleString('en-US', {timeZone: 'Australia/Sydney'}))
                                                }
                                                format={'dd/MM/yyyy HH:mm'}
                                            />
                                    }
                                </div>

                                <div className="head">
                                    <div className="row">
                                        <div className="col-sm-7">
                                            <button
                                                onClick={(e) => this.onClickPrev(e)}
                                                disabled={this.state.prevBookingId === 0 || curViewMode === 1 ? 'disabled' : null}
                                                className="btn btn-theme prev-btn"
                                            >
                                                <i className="fa fa-caret-left"></i>
                                            </button>
                                            <p className="text-white disp-inline-block dme-id">DME ID: {isBookingSelected ? this.state.booking.b_bookingID_Visual : ''}</p>
                                            <button
                                                onClick={(e) => this.onClickNext(e)}
                                                disabled={this.state.nextBookingId === 0 || curViewMode === 1 ? 'disabled' : null}
                                                className="btn btn-theme next-btn"
                                            >
                                                <i className="fa fa-caret-right"></i>
                                            </button>
                                            <button
                                                onClick={(e) => this.onClickRefreshBooking(e)}
                                                disabled={!booking || curViewMode === 1 ? 'disabled' : null}
                                                className="btn btn-theme mar-left-20 refresh-btn"
                                            >
                                                <i className="fa fa-sync"></i>
                                            </button>
                                            {(curViewMode !== 1
                                                && booking && booking.x_booking_Created_With
                                                && booking.x_booking_Created_With.indexOf('Duped') !== -1) &&
                                                <label className="mar-left-20 color-white">({booking.x_booking_Created_With})</label>
                                            }
                                        </div>
                                        <div className="col-sm-5">
                                            <a onClick={(e) => this.onClickOpenSlide(e)} className="open-slide"><i className="fa fa-columns" aria-hidden="true"></i></a>
                                            <label className="color-white float-right">
                                                <p>{isBookingSelected ? booking.b_status : '***'}</p>
                                                <p 
                                                    id={'booking-' + 'b_status_API' + '-tooltip-' + booking.id}
                                                    className={booking.b_status_API ? 'status-icon active' : 'status-icon inactive'}
                                                >
                                                    <i className="fa fa-truck"></i>
                                                    {!_.isEmpty(booking.b_status_API) &&
                                                        <TooltipItem object={booking} placement='top' fields={['b_status_API']} />
                                                    }
                                                </p>
                                                <p 
                                                    id={'booking-' + 'b_error_Capture' + '-tooltip-' + booking.id}
                                                    className={booking.b_error_Capture ? 'status-icon active' : 'status-icon inactive'}
                                                >
                                                    <i className="fa fa-exclamation-triangle"></i>
                                                    {!_.isEmpty(booking.b_error_Capture) &&
                                                        <TooltipItem object={booking} placement='top' fields={['b_error_Capture']} />
                                                    }
                                                </p>
                                                <p 
                                                    id={'booking-' + 'b_booking_Notes' + '-tooltip-' + booking.id}
                                                    className={booking.b_booking_Notes ? 'status-icon active' : 'status-icon inactive'}
                                                >
                                                    <i className="fa fa-sticky-note"></i>
                                                    {!_.isEmpty(booking.b_booking_Notes) &&
                                                        <TooltipItem object={booking} placement='top' fields={['b_booking_Notes']} />
                                                    }
                                                </p>
                                                <p className={booking.z_lock_status ? 'status-icon active' : 'status-icon inactive'} onClick={() => this.onClickStatusLock(booking)}>
                                                    <i className="fa fa-lock"></i>
                                                </p>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="main-fields-section">
                                    <div className="row col-sm-12 booking-form-01">
                                        <div className="col-sm-3 form-group">
                                            <span>Client Name<span className='c-red'>*</span></span>
                                            {
                                                (parseInt(curViewMode) === 0) ?
                                                    <p className="show-mode">{formInputs['b_client_name']}</p>
                                                    :
                                                    <Select
                                                        value={currentClientnameOption}
                                                        onChange={(e) => this.handleChangeSelect(e, 'b_client_name')}
                                                        options={clientnameOptions}
                                                        placeholder='Select a client'
                                                        noOptionsMessage={() => this.displayNoOptionsMessage()}
                                                    />
                                            }
                                        </div>
                                        <div className="col-sm-3 form-group">
                                            <span>Sub Client</span>
                                            {
                                                (parseInt(curViewMode) === 0) ?
                                                    <p className="show-mode">{formInputs['b_client_name_sub']}</p>
                                                    :
                                                    <input
                                                        className="form-control"
                                                        type="text"
                                                        placeholder=""
                                                        name="b_client_name_sub"
                                                        value = {formInputs['b_client_name_sub'] ? formInputs['b_client_name_sub'] : ''}
                                                        onChange={(e) => this.onHandleInput(e)}
                                                    />
                                            }
                                        </div>
                                        <div className="col-sm-3 form-group">
                                            <span>Status Detail</span><br />
                                            {(parseInt(curViewMode) === 0) ?
                                                <p 
                                                    className="show-mode"
                                                    id={'booking-' + 'dme_status_detail' + '-tooltip-' + booking.id}
                                                >
                                                    {formInputs['dme_status_detail']}
                                                </p>
                                                :
                                                clientname === 'dme' ?
                                                    <select
                                                        id={'booking-' + 'dme_status_detail' + '-tooltip-' + booking.id}
                                                        name="dme_status_detail"
                                                        onChange={(e) => this.onHandleInput(e)}
                                                        value = {formInputs['dme_status_detail'] ? formInputs['dme_status_detail'] : ''}
                                                    >
                                                        <option value="" selected disabled hidden>Select a status detail</option>
                                                        {statusDetailOptions}
                                                        <option value={'other'}>Other</option>
                                                    </select>
                                                    :
                                                    <p 
                                                        className="show-mode"
                                                        id={'booking-' + 'dme_status_detail' + '-tooltip-' + booking.id}
                                                    >
                                                        {formInputs['dme_status_detail']}
                                                    </p>
                                            }
                                            {!_.isEmpty(formInputs['dme_status_detail']) &&
                                                <TooltipItem object={booking} placement='top' fields={['dme_status_detail']} />
                                            }
                                        </div>
                                        {(isShowStatusDetailInput && parseInt(curViewMode) !== 0) &&
                                            <div className={clientname === 'dme' ? 'col-sm-3 form-group' : 'none'}>
                                                <span>New Status Detail</span><br />
                                                <input 
                                                    className="form-control"
                                                    type="text"
                                                    placeholder="New Status Detail"
                                                    name="new_dme_status_detail"
                                                    value = {formInputs['new_dme_status_detail'] ? formInputs['new_dme_status_detail'] : ''}
                                                    onChange={(e) => this.onHandleInput(e)}
                                                />
                                            </div>
                                        }
                                        <div className="col-sm-3 form-group">
                                            <span>Status Action</span><br />
                                            {
                                                (parseInt(curViewMode) === 0) ?
                                                    <p 
                                                        className="show-mode"
                                                        id={'booking-' + 'dme_status_action' + '-tooltip-' + booking.id}
                                                    >
                                                        {formInputs['dme_status_action']}
                                                    </p>
                                                    :
                                                    clientname === 'dme' ?
                                                        <select
                                                            id={'booking-' + 'dme_status_action' + '-tooltip-' + booking.id}
                                                            name="dme_status_action"
                                                            onChange={(e) => this.onHandleInput(e)}
                                                            value = {formInputs['dme_status_action'] ? formInputs['dme_status_action'] : ''}
                                                        >
                                                            <option value="" selected disabled hidden>Select a status action</option>
                                                            {statusActionOptions}
                                                            <option value={'other'}>Other</option>
                                                        </select>
                                                        :
                                                        <p 
                                                            className="show-mode"
                                                            id={'booking-' + 'dme_status_action' + '-tooltip-' + booking.id}
                                                        >
                                                            {formInputs['dme_status_action']}
                                                        </p>
                                            }
                                            {!_.isEmpty(formInputs['dme_status_action']) &&
                                                <TooltipItem object={booking} placement='top' fields={['dme_status_action']} />
                                            }
                                        </div>
                                        {(isShowStatusActionInput && parseInt(curViewMode) !== 0) &&
                                            <div className={clientname === 'dme' ? 'col-sm-3 form-group' : 'none'}>
                                                <span>New Status Action</span><br />
                                                <input 
                                                    className="form-control"
                                                    type="text"
                                                    placeholder="New Status Action"
                                                    name="new_dme_status_action"
                                                    value = {formInputs['new_dme_status_action'] ? formInputs['new_dme_status_action'] : ''}
                                                    onChange={(e) => this.onHandleInput(e)}
                                                />
                                            </div>
                                        }
                                    </div>
                                    <div className="row col-sm-12 booking-form-01">
                                        <div className={(parseInt(curViewMode) === 0) ? 'col-sm-3 form-group' : 'col-sm-2 form-group'}>
                                            <span>Created For</span>
                                            {(parseInt(curViewMode) === 0) ?
                                                <p className="show-mode">{formInputs['booking_Created_For'] && formInputs['booking_Created_For'].value}</p>
                                                :
                                                <Select
                                                    value={formInputs['booking_Created_For']}
                                                    onChange={(e) => this.handleChangeSelect(e, 'booking_Created_For')}
                                                    options={createdForInfosList}
                                                    placeholder='Please select'
                                                    noOptionsMessage={() => this.displayNoOptionsMessage()}
                                                />
                                            }
                                        </div>
                                        <div className="col-sm-3 form-group">
                                            <span>Created For Email</span>
                                            {(parseInt(curViewMode) === 0) ?
                                                <p className="show-mode">{formInputs['booking_Created_For_Email']}</p>
                                                :
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    name="booking_Created_For_Email"
                                                    value = {formInputs['booking_Created_For_Email'] ? formInputs['booking_Created_For_Email'] : ''}
                                                    onChange={(e) => this.onHandleInput(e)}
                                                />
                                            }
                                        </div>
                                        <div className={(parseInt(curViewMode) === 0) ? 'none' : 'col-sm-1 form-group created-for-btn'}>
                                            <span>Update email</span>
                                            <Button
                                                className="custom-button edit-lld-btn btn-primary"
                                                onClick={() => this.toggleUpdateCreatedForEmailConfirmModal()} 
                                                disabled={parseInt(curViewMode) === 0 || !formInputs['booking_Created_For_Email'] ? 'disabled' : ''}
                                            >
                                                <i className="fa fa-save" aria-hidden="true"></i>
                                            </Button>
                                        </div>
                                        <div className="col-sm-3 form-group">
                                            <span>Category</span>
                                            {(parseInt(curViewMode) === 0) ?
                                                <p className="show-mode">{formInputs['b_booking_Category'] && formInputs['b_booking_Category'].value}</p>
                                                :
                                                <Select
                                                    value={formInputs['b_booking_Category']}
                                                    onChange={(e) => this.handleChangeSelect(e, 'b_booking_Category')}
                                                    options={bookingCategoryOptions}
                                                    placeholder='Select a Category'
                                                    noOptionsMessage={() => this.displayNoOptionsMessage()}
                                                />
                                            }
                                        </div>
                                        <div className="col-sm-3 form-group">
                                            <span>Priority</span>
                                            {(parseInt(curViewMode) === 0) ?
                                                <p className="show-mode">{formInputs['b_booking_Priority'] && formInputs['b_booking_Priority'].value}</p>
                                                :
                                                <Select
                                                    value={formInputs['b_booking_Priority']}
                                                    onChange={(e) => this.handleChangeSelect(e, 'b_booking_Priority')}
                                                    options={bookingProioriyOptions}
                                                    placeholder='Select a Priority'
                                                    noOptionsMessage={() => this.displayNoOptionsMessage()}
                                                />
                                            }
                                        </div>
                                    </div>

                                    <div className="row col-sm-12 booking-form-01">
                                        <div className="col-sm-2 form-group">
                                            <span>Warehouse Code</span>
                                            {(parseInt(curViewMode) === 0) ?
                                                <p className="show-mode">{currentWarehouseCodeOption.value}</p>
                                                :
                                                <Select
                                                    value={currentWarehouseCodeOption}
                                                    onChange={(e) => this.handleChangeSelect(e, 'warehouse')}
                                                    options={warehouseCodeOptions}
                                                    placeholder='Select a warehouse'
                                                    noOptionsMessage={() => this.displayNoOptionsMessage()}
                                                />
                                            }
                                        </div>
                                        <div className='col-sm-2 form-group'>
                                            <span>Warehouse Name</span><br />
                                            <input
                                                className="form-control"
                                                disabled="disabled"
                                                type="text"
                                                value={formInputs['b_clientPU_Warehouse'] ? formInputs['b_clientPU_Warehouse'] : ''}
                                            />
                                        </div>
                                        <div className="col-sm-2 form-group">
                                            <span>Linked Reference</span>
                                            {(parseInt(curViewMode) === 0) ?
                                                <p 
                                                    className="show-mode"
                                                    id={'booking-' + 'dme_status_linked_reference_from_fp' + '-tooltip-' + booking.id}
                                                >
                                                    {formInputs['dme_status_linked_reference_from_fp']}
                                                </p>
                                                :
                                                <input 
                                                    id={'booking-' + 'dme_status_linked_reference_from_fp' + '-tooltip-' + booking.id}
                                                    className="form-control"
                                                    type="text"
                                                    placeholder="Linked Reference"
                                                    name="dme_status_linked_reference_from_fp"
                                                    value={formInputs['dme_status_linked_reference_from_fp'] ? formInputs['dme_status_linked_reference_from_fp'] : ''} 
                                                    onChange={(e) => this.onHandleInput(e)}/>
                                            }
                                            {!_.isEmpty(formInputs['dme_status_linked_reference_from_fp']) &&
                                                <TooltipItem object={booking} placement='top' fields={['dme_status_linked_reference_from_fp']} />
                                            }
                                        </div>
                                        <div className="col-sm-3 form-group">
                                            <span>Your Invoice No</span>
                                            {
                                                (parseInt(curViewMode) === 0) ?
                                                    <p className="show-mode">{formInputs['b_client_sales_inv_num']}</p>
                                                    :
                                                    <input
                                                        className="form-control"
                                                        type="text"
                                                        name="b_client_sales_inv_num"
                                                        value = {formInputs['b_client_sales_inv_num'] ? formInputs['b_client_sales_inv_num'] : ''}
                                                        onChange={(e) => this.onHandleInput(e)}
                                                    />
                                            }
                                        </div>
                                        <div className="col-sm-3 form-group">
                                            <span>Your PO No</span>
                                            {
                                                (parseInt(curViewMode) === 0) ?
                                                    <p className="show-mode">{formInputs['b_client_order_num']}</p>
                                                    :
                                                    <input 
                                                        className="form-control"
                                                        type="text"
                                                        name="b_client_order_num"
                                                        value = {formInputs['b_client_order_num'] ? formInputs['b_client_order_num'] : ''}
                                                        onChange={(e) => this.onHandleInput(e)}
                                                    />
                                            }
                                        </div>
                                    </div>
                                    <div className="row col-sm-12 booking-form-01">
                                        <div className="col-sm-2 form-group">
                                            <div>
                                                <span>Consignment Number</span>
                                                {
                                                    (parseInt(curViewMode) === 0) ?
                                                        <p className="show-mode">{formInputs['v_FPBookingNumber']}</p>
                                                        :
                                                        <input
                                                            className="form-control"
                                                            type="text"
                                                            placeholder=""
                                                            name="v_FPBookingNumber"
                                                            value = {formInputs['v_FPBookingNumber'] ? formInputs['v_FPBookingNumber'] : ''}
                                                            onChange={(e) => this.onHandleInput(e)}
                                                        />
                                                }
                                            </div>
                                        </div>
                                        <div className="col-sm-2 form-group">
                                            <div>
                                                <span>Freight Provider<span className='c-red'>*</span></span>
                                                {
                                                    (parseInt(curViewMode) === 0) ?
                                                        <p className="show-mode">{formInputs['vx_freight_provider']}</p>
                                                        :
                                                        <Select
                                                            value={currentFPOption}
                                                            onChange={(e) => this.handleChangeSelect(e, 'vx_freight_provider')}
                                                            options={fpOptions}
                                                            placeholder='Select a FP'
                                                            noOptionsMessage={() => this.displayNoOptionsMessage()}
                                                        />
                                                }
                                            </div>
                                        </div>
                                        <div className="col-sm-2 form-group">
                                            <div>
                                                <span>Account Code</span>
                                                {
                                                    (parseInt(curViewMode) === 0) ?
                                                        <p className="show-mode">{formInputs['vx_account_code']}</p>
                                                        :
                                                        <input 
                                                            className="form-control"
                                                            type="text"
                                                            name="vx_account_code"
                                                            value = {formInputs['vx_account_code'] ? formInputs['vx_account_code'] : ''}
                                                            onChange={(e) => this.onHandleInput(e)}
                                                        />
                                                }
                                            </div>
                                        </div>
                                        <div className="col-sm-2 form-group">
                                            <div>
                                                <span>PU / Booking ID</span>
                                                {
                                                    (parseInt(curViewMode) === 0) ?
                                                        <p className="show-mode">{formInputs['fk_fp_pickup_id']}</p>
                                                        :
                                                        <input 
                                                            className="form-control"
                                                            type="text"
                                                            name="fk_fp_pickup_id"
                                                            value = {formInputs['fk_fp_pickup_id'] ? formInputs['fk_fp_pickup_id'] : ''}
                                                            onChange={(e) => this.onHandleInput(e)}
                                                        />
                                                }
                                            </div>
                                        </div>
                                        <div className='col-sm-2 form-group'>
                                            <div>
                                                <span>Service Name</span>
                                                {
                                                    (parseInt(curViewMode) === 0) ?
                                                        <p className="show-mode">{formInputs['vx_serviceName']}</p>
                                                        :
                                                        <input
                                                            className="form-control"
                                                            type="text"
                                                            name="vx_serviceName"
                                                            value = {formInputs['vx_serviceName'] ? formInputs['vx_serviceName'] : ''}
                                                            onChange={(e) => this.onHandleInput(e)}
                                                        />
                                                }
                                            </div>
                                        </div>
                                        <div className="col-sm-1 form-group">
                                            <div>
                                                <span>Service Type</span>
                                                {
                                                    (parseInt(curViewMode) === 0) ?
                                                        <p className="show-mode">{formInputs['v_service_Type']}</p>
                                                        :
                                                        <input
                                                            className="form-control"
                                                            type="text"
                                                            name="v_service_Type"
                                                            value = {formInputs['v_service_Type'] ? formInputs['v_service_Type'] : ''}
                                                            onChange={(e) => this.onHandleInput(e)}
                                                        />
                                                }
                                            </div>
                                        </div>
                                        <div className="col-sm-1 form-group">
                                            <div>
                                                <span>Vehicle Type</span>
                                                {
                                                    (parseInt(curViewMode) === 0) ?
                                                        <p className="show-mode">{formInputs['v_vehicle_Type']}</p>
                                                        :
                                                        <input 
                                                            className="form-control"
                                                            type="text"
                                                            name="v_vehicle_Type"
                                                            value = {formInputs['v_vehicle_Type'] ? formInputs['v_vehicle_Type'] : ''}
                                                            onChange={(e) => this.onHandleInput(e)}
                                                        />
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row col-sm-12 booking-form-01">
                                        <div className={clientname === 'dme' ? 'col-sm-3 form-group': 'none'}>
                                            <div>
                                                <span>Invoice Billing Status</span>
                                                {
                                                    (parseInt(curViewMode) === 0) ?
                                                        <p className="show-mode">{formInputs['inv_billing_status']}</p>
                                                        :
                                                        <Select
                                                            value={currentInvBillingOption}
                                                            onChange={(e) => this.handleChangeSelect(e, 'inv_billing_status')}
                                                            options={InvBillingOptions}
                                                            placeholder='Select a Inv/Billing status'
                                                            noOptionsMessage={() => this.displayNoOptionsMessage()}
                                                        />
                                                }
                                            </div>
                                        </div>
                                        <div className={clientname === 'dme' ? 'col-sm-3 form-group': 'none'}>
                                            <div>
                                                <span>FP Invoice No</span>
                                                {
                                                    (parseInt(curViewMode) === 0) ?
                                                        <p className="show-mode">{formInputs['fp_invoice_no']}</p>
                                                        :
                                                        <input
                                                            className="form-control"
                                                            type="text"
                                                            name="fp_invoice_no"
                                                            value = {formInputs['fp_invoice_no']}
                                                            onChange={(e) => this.onHandleInput(e)}
                                                        />
                                                }
                                            </div>
                                        </div>
                                        {clientname === 'dme' &&
                                            <div className='col-sm-1 form-group'>
                                                <div>
                                                    <span>Quoted Cost</span>
                                                    {parseInt(curViewMode) === 0 ?
                                                        <p className="show-mode">{formInputs['inv_cost_quoted'] && `$${parseFloat(formInputs['inv_cost_quoted']).toFixed(2)}`}</p>
                                                        :
                                                        <input
                                                            className="form-control"
                                                            type="text"
                                                            name="inv_cost_quoted"
                                                            value = {!_.isNull(formInputs['inv_cost_quoted']) ? `$${formInputs['inv_cost_quoted']}` : ''}
                                                            onChange={(e) => this.onHandleInput(e)}
                                                            onBlur={(e) => this.onHandleInputBlur(e)}
                                                        />
                                                    }
                                                </div>
                                            </div>
                                        }
                                        {clientname === 'dme' &&
                                            <div className='col-sm-1 form-group'>
                                                <div>
                                                    <span>Actual Cost</span>
                                                    {parseInt(curViewMode) === 0 ?
                                                        <p className="show-mode">{formInputs['inv_cost_actual'] && `$${parseFloat(formInputs['inv_cost_actual']).toFixed(2)}`}</p>
                                                        :
                                                        clientname === 'dme' ?
                                                            <input
                                                                className="form-control"
                                                                type="text"
                                                                name="inv_cost_actual"
                                                                value = {!_.isNull(formInputs['inv_cost_actual']) ? `$${formInputs['inv_cost_actual']}` : ''}
                                                                onChange={(e) => this.onHandleInput(e)}
                                                                onBlur={(e) => this.onHandleInputBlur(e)}
                                                            />
                                                            :
                                                            <p className="show-mode">{formInputs['inv_cost_actual'] && `$${parseFloat(formInputs['inv_cost_actual']).toFixed(2)}`}</p>
                                                    }
                                                </div>
                                            </div>
                                        }
                                        <div className="col-sm-1 form-group">
                                            <div>
                                                <span className="c-red">Quoted $</span>
                                                {(parseInt(curViewMode) === 0) ?
                                                    <p className="show-mode">{formInputs['inv_sell_quoted'] && `$${parseFloat(formInputs['inv_sell_quoted']).toFixed(2)}`}</p>
                                                    :
                                                    <input
                                                        className="form-control"
                                                        type="text"
                                                        name="inv_sell_quoted"
                                                        value = {!_.isNull(formInputs['inv_sell_quoted']) ? `$${formInputs['inv_sell_quoted']}` : ''}
                                                        onChange={(e) => this.onHandleInput(e)}
                                                        onBlur={(e) => this.onHandleInputBlur(e)}
                                                    />
                                                }
                                            </div>
                                        </div>
                                        <div className="col-sm-1 form-group">
                                            <div>
                                                <span className="c-red">Quoted $*</span>
                                                {(parseInt(curViewMode) === 0) ?
                                                    <p className="show-mode">{formInputs['inv_sell_quoted_override'] && `$${parseFloat(formInputs['inv_sell_quoted_override']).toFixed(2)}`}</p>
                                                    :
                                                    <input
                                                        className="form-control"
                                                        type="text"
                                                        name="inv_sell_quoted_override"
                                                        value = {!_.isNull(formInputs['inv_sell_quoted_override']) ? `$${formInputs['inv_sell_quoted_override']}` : ''}
                                                        onChange={(e) => this.onHandleInput(e)}
                                                        onBlur={(e) => this.onHandleInputBlur(e)}
                                                    />
                                                }
                                            </div>
                                        </div>
                                        {clientname === 'dme' &&
                                            <div className="col-sm-1 form-group">
                                                <div>
                                                    <span>Actual $</span>
                                                    {(parseInt(curViewMode) === 0) ?
                                                        <p className="show-mode">{formInputs['inv_sell_actual'] && `$${parseFloat(formInputs['inv_sell_actual']).toFixed(2)}`}</p>
                                                        :
                                                        clientname === 'dme' ?
                                                            <input
                                                                className="form-control"
                                                                type="text"
                                                                name="inv_sell_actual"
                                                                value = {!_.isNull(formInputs['inv_sell_actual']) ? `$${formInputs['inv_sell_actual']}` : ''}
                                                                onChange={(e) => this.onHandleInput(e)}
                                                                onBlur={(e) => this.onHandleInputBlur(e)}
                                                            />
                                                            :
                                                            <p className="show-mode">{formInputs['inv_sell_actual'] && `$${parseFloat(formInputs['inv_sell_actual']).toFixed(2)}`}</p>
                                                    }
                                                </div>
                                            </div>
                                        }
                                        {formInputs && formInputs['customer_cost'] &&
                                            <div className="col-sm-1 form-group">
                                                <div>
                                                    <span>Customer $</span>
                                                    {(parseInt(curViewMode) === 0) ?
                                                        <p className="show-mode">{formInputs['customer_cost'] && `$${parseFloat(formInputs['customer_cost']).toFixed(2)}`}</p>
                                                        :
                                                        <input
                                                            className="form-control"
                                                            type="text"
                                                            disabled="disabled"
                                                            value = {!_.isNull(formInputs['customer_cost']) ? `$${formInputs['customer_cost']}` : ''}
                                                        />
                                                    }
                                                </div>
                                            </div>
                                        }
                                        <div className="col-sm-1 form-group">
                                            <div>
                                                <span>Misc. Costs</span><br />
                                                <Button className="custom-button btn-primary" onClick={() => this.toggleCostSlider()} disabled={!isBookingSelected}>
                                                    <i className="fa fa-columns"></i>
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="col-sm-2 form-group">
                                            <div>
                                                <span>DME Invoice No</span>
                                                {(parseInt(curViewMode) === 0) ?
                                                    <p className="show-mode">{formInputs['inv_dme_invoice_no']}</p>
                                                    :
                                                    <input
                                                        className="form-control"
                                                        type="text"
                                                        name="inv_dme_invoice_no"
                                                        value = {formInputs['inv_dme_invoice_no'] ? formInputs['inv_dme_invoice_no'] : ''}
                                                        onChange={(e) => this.onHandleInput(e)}
                                                    />
                                                }
                                            </div>
                                        </div>
                                        {((clientname === 'dme' || clientname === 'Jason L') && booking.b_client_name === 'Jason L') &&
                                            <div className="col-sm-2 form-group">
                                                <div>
                                                    <span>Shipping Type</span>
                                                    {(parseInt(curViewMode) === 0) ?
                                                        <p className="show-mode">{formInputs['booking_type']}</p>
                                                        :
                                                        <select
                                                            name="booking_type"
                                                            onChange={(e) => this.onHandleInput(e)}
                                                            value = {formInputs['booking_type'] ? formInputs['booking_type'] : ''}
                                                        >
                                                            <option value="" selected disabled hidden>Select a Shipping type</option>
                                                            <option value='DMEA'>DMEA</option>
                                                            <option value='DMEM'>DMEM</option>
                                                            <option value='DMEP'>DMEP</option>
                                                        </select>
                                                    }
                                                </div>
                                            </div>
                                        }
                                    </div>
                                    <div className='row col-sm-12 booking-form-02'>
                                        <div className={clientname === 'dme' ? 'col-sm-6 form-group' : 'none'}>
                                            <span>Invoice Billing Status Note</span>
                                            <textarea
                                                className="show-mode"
                                                id={'booking-' + 'inv_billing_status_note' + '-tooltip-' + booking.id}
                                                name="inv_billing_status_note"
                                                value={formInputs['inv_billing_status_note'] ? formInputs['inv_billing_status_note'] : ''} 
                                                onClick={() => this.toggleStatusNoteModal('inv_billing_status_note')}
                                                rows="6"
                                                cols="83"
                                            />
                                            {!_.isEmpty(formInputs['inv_billing_status_note']) &&
                                                <TooltipItem object={booking} placement='top' fields={['inv_billing_status_note']} />
                                            }
                                        </div>
                                        <div className="col-sm-6 form-group">
                                            <span>Status History Note</span>
                                            {
                                                (parseInt(curViewMode) === 0) ?
                                                    <textarea 
                                                        className="show-mode"
                                                        onClick={() => this.toggleStatusNoteModal('b_booking_Notes')}
                                                        id={'booking-' + 'b_booking_Notes' + '-tooltip-' + booking.id}
                                                        value={formInputs['b_booking_Notes']}
                                                        disabled='disabled'
                                                        rows="6"
                                                        cols="83"
                                                    />
                                                    :
                                                    clientname === 'dme' ?
                                                        <textarea 
                                                            className="show-mode"
                                                            id={'booking-' + 'b_booking_Notes' + '-tooltip-' + booking.id}
                                                            name="dme_status_linked_reference_from_fp"
                                                            value={formInputs['b_booking_Notes'] ? formInputs['b_booking_Notes'] : ''} 
                                                            onClick={() => this.toggleStatusNoteModal('b_booking_Notes')}
                                                            rows="6"
                                                            cols="83"
                                                        />
                                                        :
                                                        <textarea 
                                                            className="show-mode"
                                                            onClick={() => this.toggleStatusNoteModal('b_booking_Notes')}
                                                            id={'booking-' + 'b_booking_Notes' + '-tooltip-' + booking.id}
                                                            value={formInputs['b_booking_Notes']}
                                                            disabled='disabled'
                                                            rows="6"
                                                            cols="83"
                                                        />
                                            }
                                            {!_.isEmpty(formInputs['b_booking_Notes']) &&
                                                <TooltipItem object={booking} placement='top' fields={['b_booking_Notes']} />
                                            }
                                        </div>
                                    </div>
                                    <div className="clearfix"></div>
                                </div>
                                <FreightOptionAccordion
                                    formInputs={formInputs}
                                    onHandleInput={(e) => this.onHandleInput(e)}
                                />
                                <div className="detail-tab">
                                    <div className="row">
                                        <div className="col-sm-4">
                                            <div className="pickup-detail">
                                                <div className="head text-white">
                                                    <ul>
                                                        <li>Pick Up Details</li>
                                                        <li className="peclock"><Clock format={'DD MMM YYYY h:mm:ss A'} ticking={true} timezone={this.state.puTimeZone} /></li>
                                                    </ul>
                                                </div>
                                                <form action="">
                                                    <div className="progress">
                                                        <div className="progress-bar progress-bar-striped" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100">
                                                            95%
                                                        </div>
                                                    </div>
                                                    <div className="row mt-2">
                                                        <div className="col-sm-4">
                                                            <label className="" htmlFor="">Pick Up Entity<span className='c-red'>*</span></label>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            {
                                                                (parseInt(curViewMode) === 0) ?
                                                                    <p className="show-mode">{formInputs['puCompany']}</p>
                                                                    :
                                                                    <input 
                                                                        placeholder=""
                                                                        name="puCompany"
                                                                        type="text"
                                                                        value={formInputs['puCompany'] ? formInputs['puCompany'] : ''} 
                                                                        className="form-control"
                                                                        onChange={(e) => this.onHandleInput(e)} />
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-4">
                                                            <label className="" htmlFor="">Street 1<span className='c-red'>*</span></label>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            {
                                                                (parseInt(curViewMode) === 0) ?
                                                                    <p className="show-mode">{formInputs['pu_Address_Street_1']}</p>
                                                                    :
                                                                    <input 
                                                                        type="text"
                                                                        name="pu_Address_Street_1"
                                                                        className="form-control"
                                                                        value = {formInputs['pu_Address_Street_1'] ? formInputs['pu_Address_Street_1'] : ''} 
                                                                        onChange={(e) => this.onHandleInput(e)} />
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-4">
                                                            <label className="" htmlFor="">Street 2</label>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            {
                                                                (parseInt(curViewMode) === 0) ?
                                                                    <p className="show-mode">{formInputs['pu_Address_street_2']}</p>
                                                                    :
                                                                    <input 
                                                                        type="text"
                                                                        name="pu_Address_street_2"
                                                                        className="form-control"
                                                                        value = {formInputs['pu_Address_street_2'] ? formInputs['pu_Address_street_2'] : ''} 
                                                                        onChange={(e) => this.onHandleInput(e)} />
                                                            }
                                                        </div>
                                                    </div>
                                                    <LoadingOverlay
                                                        active={this.state.loadingGeoPU}
                                                        spinner
                                                        text='Loading...'
                                                    >
                                                        <div className="row mt-1">
                                                            <div className="col-sm-4">
                                                                <label className="" htmlFor="">State<span className='c-red'>*</span></label>
                                                            </div>
                                                            <div className='col-sm-8 select-margin'>
                                                                {
                                                                    (parseInt(curViewMode) === 0) ?
                                                                        <p className="show-mode">{puState ? puState.value : ''}</p>
                                                                        :
                                                                        <Select
                                                                            value={puState}
                                                                            onChange={(e) => this.handleChangeState(0, e)}
                                                                            options={puStates}
                                                                            placeholder='select your state'
                                                                            noOptionsMessage={() => this.displayNoOptionsMessage()}
                                                                            openMenuOnClick={isBookedBooking ? false : true}
                                                                        />
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="row mt-1">
                                                            <div className="col-sm-4">
                                                                <label className="" htmlFor="">Postal Code<span className='c-red'>*</span></label>
                                                            </div>
                                                            <div className='col-sm-8 select-margin'>
                                                                {
                                                                    (parseInt(curViewMode) === 0) ?
                                                                        <p className="show-mode">{puPostalCode ? puPostalCode.value : ''}</p>
                                                                        :
                                                                        <Select
                                                                            value={puPostalCode}
                                                                            onChange={(e) => this.handleChangePostalCode(0, e)}
                                                                            options={puPostalCodes}
                                                                            placeholder='select your postal code'
                                                                            openMenuOnClick = {isBookedBooking ? false : true}
                                                                            noOptionsMessage={() => this.displayNoOptionsMessage()}
                                                                        />
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="row mt-1">
                                                            <div className="col-sm-4">
                                                                <label className="" htmlFor="">Suburb<span className='c-red'>*</span></label>
                                                            </div>
                                                            <div className='col-sm-8 select-margin'>
                                                                {
                                                                    (parseInt(curViewMode) === 0) ?
                                                                        <p className="show-mode">{puSuburb ? puSuburb.value : ''}</p>
                                                                        :
                                                                        <Select
                                                                            value={puSuburb}
                                                                            onChange={(e) => this.handleChangeSuburb(0, e)}
                                                                            options={puSuburbs}
                                                                            placeholder='select your suburb'
                                                                            openMenuOnClick = {isBookedBooking ? false : true}
                                                                            noOptionsMessage={() => this.displayNoOptionsMessage()}
                                                                        />
                                                                }
                                                            </div>
                                                        </div>
                                                    </LoadingOverlay>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-4">
                                                            <label className="" htmlFor="">Country<span className='c-red'>*</span></label>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            {
                                                                (parseInt(curViewMode) === 0) ?
                                                                    <p className="show-mode">{formInputs['pu_Address_Country']}</p>
                                                                    :
                                                                    <input 
                                                                        type="text"
                                                                        name="pu_Address_Country"
                                                                        className="form-control"
                                                                        value = {formInputs['pu_Address_Country'] ? formInputs['pu_Address_Country'] : ''} 
                                                                        onChange={(e) => this.onHandleInput(e)} />
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-4">
                                                            <label className="" htmlFor="">Contact<span className='c-red'>*</span></label>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            {
                                                                (parseInt(curViewMode) === 0) ?
                                                                    <p className="show-mode">{formInputs['pu_Contact_F_L_Name']}</p>
                                                                    :
                                                                    <input 
                                                                        type="text"
                                                                        name="pu_Contact_F_L_Name"
                                                                        className="form-control"
                                                                        value = {formInputs['pu_Contact_F_L_Name'] ? formInputs['pu_Contact_F_L_Name'] : ''} 
                                                                        onChange={(e) => this.onHandleInput(e)} />
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-4">
                                                            <label className="" htmlFor="">Tel</label>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            {
                                                                (parseInt(curViewMode) === 0) ?
                                                                    <p className="show-mode">{formInputs['pu_Phone_Main']}</p>
                                                                    :
                                                                    <input 
                                                                        type="text"
                                                                        name="pu_Phone_Main"
                                                                        className="form-control"
                                                                        value = {formInputs['pu_Phone_Main'] ? formInputs['pu_Phone_Main'] : ''} 
                                                                        onChange={(e) => this.onHandleInput(e)} />
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-4">
                                                            <label className="" htmlFor="">Email<span className='c-red'>*</span></label>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            {
                                                                (parseInt(curViewMode) === 0) ?
                                                                    <p className="show-mode">{formInputs['pu_Email']}</p>
                                                                    :
                                                                    <input 
                                                                        type="text"
                                                                        name="pu_Email"
                                                                        className="form-control"
                                                                        value = {formInputs['pu_Email'] ? formInputs['pu_Email'] : ''} 
                                                                        onChange={(e) => this.onHandleInput(e)} />
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-4">
                                                            <label className="" htmlFor="">PU Email Group Name</label>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            {
                                                                (parseInt(curViewMode) === 0) ?
                                                                    <p className="show-mode">{formInputs['pu_email_Group_Name']}</p>
                                                                    :
                                                                    <input 
                                                                        type="text"
                                                                        name="pu_email_Group_Name"
                                                                        className="form-control"
                                                                        value = {formInputs['pu_email_Group_Name'] ? formInputs['pu_email_Group_Name'] : ''} 
                                                                        onChange={(e) => this.onHandleInput(e)} />
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-4">
                                                            <label className="" htmlFor="">PU Email Group</label>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            {
                                                                (parseInt(curViewMode) === 0) ?
                                                                    <p className="show-mode">{formInputs['pu_email_Group']}</p>
                                                                    :
                                                                    <textarea 
                                                                        width="100%"
                                                                        className="textarea-width"
                                                                        name="pu_email_Group"
                                                                        rows="1"
                                                                        cols="9"
                                                                        value={formInputs['pu_email_Group'] ? formInputs['pu_email_Group'] : ''} 
                                                                        onChange={(e) => this.onHandleInput(e)}
                                                                        onClick={() => this.notify('Please input emails with comma(,) delimiter')}
                                                                    />
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-4">
                                                            <label className="" htmlFor="">PU Communicate Via</label>
                                                        </div>
                                                        <div className='col-sm-8 select-margin'>
                                                            {
                                                                (parseInt(curViewMode) === 0) ?
                                                                    <p className="show-mode">{booking.pu_Comm_Booking_Communicate_Via ? booking.pu_Comm_Booking_Communicate_Via : ''}</p>
                                                                    :
                                                                    <div className="mt-2">
                                                                        <span>
                                                                            <input
                                                                                name="b_pu_communicate"
                                                                                type="checkbox"
                                                                                data-method="Email"
                                                                                checked={puCommunicates.indexOf('Email') > -1}
                                                                                onChange={(e) => this.handleInputChange(e)}
                                                                            />
                                                                            &nbsp;Email
                                                                        </span>
                                                                        <span className="ml-3">
                                                                            <input
                                                                                name="b_pu_communicate"
                                                                                type="checkbox"
                                                                                data-method="SMS"
                                                                                checked={puCommunicates.indexOf('SMS') > -1}
                                                                                onChange={(e) => this.handleInputChange(e)}
                                                                            />
                                                                            &nbsp;SMS
                                                                        </span>
                                                                        <span className="ml-3">
                                                                            <input
                                                                                name="b_pu_communicate"
                                                                                type="checkbox"
                                                                                data-method="Call"
                                                                                checked={puCommunicates.indexOf('Call') > -1}
                                                                                onChange={(e) => this.handleInputChange(e)}
                                                                            />
                                                                            &nbsp;Call
                                                                        </span>
                                                                    </div>
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className="head text-white booking-panel-title mt-1">
                                                        PickUp Dates
                                                    </div>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-4">
                                                            <label className="" htmlFor="">ETA Pickup </label>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            {(parseInt(curViewMode) === 0) ?
                                                                (isBookedBooking) ? 
                                                                    <p className="show-mode">{formInputs['s_05_Latest_Pick_Up_Date_TimeSet'] ? moment(formInputs['s_05_Latest_Pick_Up_Date_TimeSet']).format('DD/MM/YYYY HH:mm:ss') : ''}</p>
                                                                    :
                                                                    <p className="show-mode">{formInputs['eta_pu_by'] ? moment(formInputs['eta_pu_by']).format('DD/MM/YYYY HH:mm:ss') : ''}</p>
                                                                :
                                                                (clientname === 'dme' && isBookedBooking) ?
                                                                    <DateTimePicker
                                                                        onChange={(date) => this.onChangeDateTime(date, 's_05_Latest_Pick_Up_Date_TimeSet')}
                                                                        value={(!_.isNull(formInputs['s_05_Latest_Pick_Up_Date_TimeSet']) && !_.isUndefined(formInputs['s_05_Latest_Pick_Up_Date_TimeSet'])) &&
                                                                        new Date(moment(formInputs['s_05_Latest_Pick_Up_Date_TimeSet']).toDate().toLocaleString('en-US', {timeZone: 'Australia/Sydney'}))}
                                                                        format={'dd/MM/yyyy HH:mm'}
                                                                    />
                                                                    :
                                                                    <p className="show-mode">{formInputs['eta_pu_by'] ? moment(formInputs['eta_pu_by']).format('DD/MM/YYYY HH:mm:ss') : ''}</p>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-4">
                                                            <label className="" htmlFor="">Given to transport</label>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            {
                                                                (parseInt(curViewMode) === 0) ?
                                                                    <p className="show-mode">{formInputs['b_given_to_transport_date_time'] ? moment(formInputs['b_given_to_transport_date_time']).format('DD/MM/YYYY HH:mm:ss') : ''}</p>
                                                                    :
                                                                    (clientname === 'dme') ?
                                                                        <DateTimePicker
                                                                            onChange={(date) => this.onChangeDateTime(date, 'b_given_to_transport_date_time')}
                                                                            value={(!_.isNull(formInputs['b_given_to_transport_date_time']) && !_.isUndefined(formInputs['b_given_to_transport_date_time'])) &&
                                                                            new Date(moment(formInputs['b_given_to_transport_date_time']).toDate().toLocaleString('en-US', {timeZone: 'Australia/Sydney'}))}
                                                                            format={'dd/MM/yyyy HH:mm'}
                                                                        />
                                                                        :
                                                                        <p className="show-mode">{formInputs['b_given_to_transport_date_time'] ? moment(formInputs['b_given_to_transport_date_time']).format('DD/MM/YYYY HH:mm:ss') : null}</p>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-4">
                                                            <label className="" htmlFor="">Transport Received</label>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            {
                                                                (parseInt(curViewMode) === 0) ?
                                                                    <p className="show-mode">{formInputs['fp_received_date_time'] ? moment(formInputs['fp_received_date_time']).format('DD/MM/YYYY'): ''}</p>
                                                                    :
                                                                    (clientname === 'dme') ?
                                                                        <DateTimePicker
                                                                            onChange={(date) => this.onChangeDateTime(date, 'fp_received_date_time')}
                                                                            value={(!_.isNull(formInputs['fp_received_date_time']) && !_.isUndefined(formInputs['fp_received_date_time'])) &&
                                                                            new Date(moment(formInputs['fp_received_date_time']).toDate().toLocaleString('en-US', {timeZone: 'Australia/Sydney'}))}
                                                                            format={'dd/MM/yyyy HH:mm'}
                                                                        />
                                                                        :
                                                                        <p className="show-mode">{formInputs['fp_received_date_time'] ? moment(formInputs['fp_received_date_time']).format('DD/MM/YYYY'): ''}</p>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-4">
                                                            <label className="" htmlFor="">Actual PickUp </label>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            {(parseInt(curViewMode) === 0) ?
                                                                <p className="show-mode">{formInputs['s_20_Actual_Pickup_TimeStamp'] ? moment(formInputs['s_20_Actual_Pickup_TimeStamp']).format('DD/MM/YYYY HH:mm:ss') : ''}</p>
                                                                :
                                                                (clientname === 'dme') ?
                                                                    <DateTimePicker
                                                                        onChange={(date) => this.onChangeDateTime(date, 's_20_Actual_Pickup_TimeStamp')}
                                                                        value={(!_.isNull(formInputs['s_20_Actual_Pickup_TimeStamp']) && !_.isUndefined(formInputs['s_20_Actual_Pickup_TimeStamp'])) &&
                                                                        new Date(moment(formInputs['s_20_Actual_Pickup_TimeStamp']).toDate().toLocaleString('en-US', {timeZone: 'Australia/Sydney'}))}
                                                                        format={'dd/MM/yyyy HH:mm'}
                                                                    />
                                                                    :
                                                                    <p className="show-mode">{formInputs['s_20_Actual_Pickup_TimeStamp'] ? moment(formInputs['s_20_Actual_Pickup_TimeStamp']).format('DD/MM/YYYY HH:mm:ss') : ''}</p>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-4">
                                                            <label className="" htmlFor="">Handling Inst</label>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            {(parseInt(curViewMode) === 0) ?
                                                                <p className="show-mode">{formInputs['b_handling_Instructions']}</p>
                                                                :
                                                                <textarea 
                                                                    width="100%"
                                                                    className="textarea-width"
                                                                    name="b_handling_Instructions"
                                                                    rows="1"
                                                                    cols="9"
                                                                    value={formInputs['b_handling_Instructions'] ? formInputs['b_handling_Instructions'] : ''}
                                                                    onChange={(e) => this.onHandleInput(e)}/>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-4">
                                                            <label className="" htmlFor="">PU Inst Address</label>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            {(parseInt(curViewMode) === 0) ?
                                                                <p className="show-mode">{formInputs['pu_pickup_instructions_address']}</p>
                                                                :
                                                                <textarea 
                                                                    width="100%"
                                                                    className="textarea-width"
                                                                    name="pu_pickup_instructions_address"
                                                                    rows="1"
                                                                    cols="9"
                                                                    value={formInputs['pu_pickup_instructions_address'] ? formInputs['pu_pickup_instructions_address'] : ''}
                                                                    onChange={(e) => this.onHandleInput(e)}/>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-4">
                                                            <label className="" htmlFor="">PU Inst Contact</label>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            {(parseInt(curViewMode) === 0) ?
                                                                <p className="show-mode">{formInputs['pu_PickUp_Instructions_Contact']}</p>
                                                                :
                                                                <textarea 
                                                                    width="100%"
                                                                    className="textarea-width"
                                                                    name="pu_PickUp_Instructions_Contact"
                                                                    rows="1"
                                                                    cols="9"
                                                                    value={formInputs['pu_PickUp_Instructions_Contact'] ? formInputs['pu_PickUp_Instructions_Contact'] : ''} 
                                                                    onChange={(e) => this.onHandleInput(e)}/>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="mt-1 additional-pickup-div">
                                                        <div className="col-sm-4">
                                                            <label className="" htmlFor="">Reference No</label>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            {(parseInt(curViewMode) === 0) ?
                                                                <p className="show-mode">{formInputs['b_clientReference_RA_Numbers']}</p>
                                                                :
                                                                <input
                                                                    type="text"
                                                                    name="b_clientReference_RA_Numbers"
                                                                    className="form-control"
                                                                    value = {formInputs['b_clientReference_RA_Numbers'] ? formInputs['b_clientReference_RA_Numbers'] : ''} 
                                                                    disabled={(booking && booking.b_status !== 'Closed') ? '' : 'disabled'}
                                                                    onChange={(e) => this.onHandleInput(e)}/>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="clearfix"></div>
                                                </form>
                                            </div>
                                            <div className="clearfix"></div>
                                        </div>
                                        <div className="col-sm-4">
                                            <div className="pickup-detail">
                                                <div className="head text-white">
                                                    <ul>
                                                        <li>Delivery Details</li>
                                                        <li className="peclock" >
                                                            <Clock format={'DD MMM YYYY h:mm:ss A'} ticking={true} timezone={this.state.deTimeZone} />
                                                        </li>
                                                    </ul>
                                                </div>
                                                <form action="">
                                                    <div className="progress">
                                                        <div className="progress-bar progress-bar-striped" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100">
                                                            50%
                                                        </div>
                                                    </div>
                                                    <div className="row mt-2">
                                                        <div className="col-sm-4">
                                                            <label className="" htmlFor="">Delivery Entity<span className='c-red'>*</span></label>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            {
                                                                (parseInt(curViewMode) === 0) ?
                                                                    <p className="show-mode">{formInputs['deToCompanyName']}</p>
                                                                    :
                                                                    <input 
                                                                        placeholder=""
                                                                        type="text"
                                                                        name="deToCompanyName"
                                                                        value = {formInputs['deToCompanyName'] ? formInputs['deToCompanyName'] : ''} 
                                                                        className="form-control"  
                                                                        onChange={(e) => this.onHandleInput(e)} />
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-4">
                                                            <label className="" htmlFor="">Street 1<span className='c-red'>*</span></label>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            {
                                                                (parseInt(curViewMode) === 0) ?
                                                                    <p className="show-mode">{formInputs['de_To_Address_Street_1']}</p>
                                                                    :
                                                                    <input 
                                                                        type="text"
                                                                        name="de_To_Address_Street_1"
                                                                        className="form-control"
                                                                        value = {formInputs['de_To_Address_Street_1'] ? formInputs['de_To_Address_Street_1'] : ''} 
                                                                        onChange={(e) => this.onHandleInput(e)} />
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-4">
                                                            <label className="" htmlFor="">Street 2</label>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            {
                                                                (parseInt(curViewMode) === 0) ?
                                                                    <p className="show-mode">{formInputs['de_To_Address_Street_2']}</p>
                                                                    :
                                                                    <input 
                                                                        type="text"
                                                                        name="de_To_Address_Street_2"
                                                                        className="form-control"
                                                                        value = {formInputs['de_To_Address_Street_2'] ? formInputs['de_To_Address_Street_2'] : ''} 
                                                                        onChange={(e) => this.onHandleInput(e)} />
                                                            }
                                                        </div>
                                                    </div>
                                                    <LoadingOverlay
                                                        active={this.state.loadingGeoDeTo}
                                                        spinner
                                                        text='Loading...'
                                                    >
                                                        <div className="row mt-1">
                                                            <div className="col-sm-4">
                                                                <label className="" htmlFor="">State<span className='c-red'>*</span></label>
                                                            </div>
                                                            <div className='col-sm-8 select-margin'>
                                                                {
                                                                    (parseInt(curViewMode) === 0) ?
                                                                        <p className="show-mode">{deToState ? deToState.value : ''}</p>
                                                                        :
                                                                        <Select
                                                                            value={deToState}
                                                                            onChange={(e) => this.handleChangeState(1, e)}
                                                                            options={deToStates}
                                                                            placeholder='select your state'
                                                                            noOptionsMessage={() => this.displayNoOptionsMessage()}
                                                                            openMenuOnClick = {isBookedBooking ? false : true}
                                                                        />
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="row mt-1">
                                                            <div className="col-sm-4">
                                                                <label className="" htmlFor="">Postal Code<span className='c-red'>*</span></label>
                                                            </div>
                                                            <div className='col-sm-8 select-margin'>
                                                                {
                                                                    (parseInt(curViewMode) === 0) ?
                                                                        <p className="show-mode">{deToPostalCode ? deToPostalCode.value : ''}</p>
                                                                        :
                                                                        <Select
                                                                            value={deToPostalCode}
                                                                            onChange={(e) => this.handleChangePostalCode(1, e)}
                                                                            options={deToPostalCodes}
                                                                            placeholder='select your postal code'
                                                                            noOptionsMessage={() => this.displayNoOptionsMessage()}
                                                                            openMenuOnClick = {isBookedBooking ? false : true}
                                                                        />
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="row mt-1">
                                                            <div className="col-sm-4">
                                                                <label className="" htmlFor="">Suburb<span className='c-red'>*</span></label>
                                                            </div>
                                                            <div className='col-sm-8 select-margin'>
                                                                {
                                                                    (parseInt(curViewMode) === 0) ?
                                                                        <p className="show-mode">{deToSuburb ? deToSuburb.value : ''}</p>
                                                                        :
                                                                        <Select
                                                                            value={deToSuburb}
                                                                            onChange={(e) => this.handleChangeSuburb(1, e)}
                                                                            options={deToSuburbs}
                                                                            placeholder='select your suburb'
                                                                            noOptionsMessage={() => this.displayNoOptionsMessage()}
                                                                            openMenuOnClick = {isBookedBooking ? false : true}
                                                                        />
                                                                }
                                                            </div>
                                                        </div>
                                                    </LoadingOverlay>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-4">
                                                            <label className="" htmlFor="">Country<span className='c-red'>*</span></label>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            {
                                                                (parseInt(curViewMode) === 0) ?
                                                                    <p className="show-mode">{formInputs['de_To_Address_Country']}</p>
                                                                    :
                                                                    <input 
                                                                        type="text"
                                                                        name="de_To_Address_Country"
                                                                        className="form-control"
                                                                        value = {formInputs['de_To_Address_Country'] ? formInputs['de_To_Address_Country'] : ''} 
                                                                        onChange={(e) => this.onHandleInput(e)} />
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-4">
                                                            <label className="" htmlFor="">Contact<span className='c-red'>*</span></label>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            {
                                                                (parseInt(curViewMode) === 0) ?
                                                                    <p className="show-mode">{formInputs['de_to_Contact_F_LName']}</p>
                                                                    :
                                                                    <input 
                                                                        type="text"
                                                                        name="de_to_Contact_F_LName"
                                                                        className="form-control"
                                                                        value = {formInputs['de_to_Contact_F_LName'] ? formInputs['de_to_Contact_F_LName'] : ''} 
                                                                        onChange={(e) => this.onHandleInput(e)} />
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-4">
                                                            <label className="" htmlFor="">Tel</label>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            {
                                                                (parseInt(curViewMode) === 0) ?
                                                                    <p className="show-mode">{formInputs['de_to_Phone_Main']}</p>
                                                                    :
                                                                    <input 
                                                                        type="text"
                                                                        name="de_to_Phone_Main"
                                                                        className="form-control"
                                                                        value = {formInputs['de_to_Phone_Main'] ? formInputs['de_to_Phone_Main'] : ''} 
                                                                        onChange={(e) => this.onHandleInput(e)} />
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-4">
                                                            <label className="" htmlFor="">Email<span className='c-red'>*</span></label>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            {
                                                                (parseInt(curViewMode) === 0) ?
                                                                    <p className="show-mode">{formInputs['de_Email']}</p>
                                                                    :
                                                                    <input 
                                                                        type="text"
                                                                        name="de_Email"
                                                                        className="form-control"
                                                                        value = {formInputs['de_Email'] ? formInputs['de_Email'] : ''} 
                                                                        onChange={(e) => this.onHandleInput(e)} />
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-4">
                                                            <label className="" htmlFor="">DE Email Group Name</label>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            {
                                                                (parseInt(curViewMode) === 0) ?
                                                                    <p className="show-mode">{formInputs['de_Email_Group_Name']}</p>
                                                                    :
                                                                    <input 
                                                                        type="text"
                                                                        name="de_Email_Group_Name"
                                                                        className="form-control"
                                                                        value = {formInputs['de_Email_Group_Name'] ? formInputs['de_Email_Group_Name'] : ''} 
                                                                        onChange={(e) => this.onHandleInput(e)} />
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-4">
                                                            <label className="" htmlFor="">DE Email Group</label>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            {
                                                                (parseInt(curViewMode) === 0) ?
                                                                    <p className="show-mode">{formInputs['de_Email_Group_Emails']}</p>
                                                                    :
                                                                    <textarea 
                                                                        width="100%"
                                                                        className="textarea-width"
                                                                        name="de_Email_Group_Emails"
                                                                        rows="1"
                                                                        cols="9"
                                                                        value={formInputs['de_Email_Group_Emails'] ? formInputs['de_Email_Group_Emails'] : ''} 
                                                                        onChange={(e) => this.onHandleInput(e)}
                                                                        onClick={() => this.notify('Please input emails with comma(,) delimiter')}
                                                                    />
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className="row mt-1">
                                                        <div className="col-sm-4">
                                                            <label className="" htmlFor="">DE Communicate Via</label>
                                                        </div>
                                                        <div className='col-sm-8 select-margin'>
                                                            {
                                                                (parseInt(curViewMode) === 0) ?
                                                                    <p className="show-mode">{booking.de_To_Comm_Delivery_Communicate_Via ? booking.de_To_Comm_Delivery_Communicate_Via : ''}</p>
                                                                    :
                                                                    <div className="mt-2">
                                                                        <span>
                                                                            <input
                                                                                name="b_de_To_communicate"
                                                                                type="checkbox"
                                                                                data-method="Email"
                                                                                checked={deCommunicates.indexOf('Email') > -1}
                                                                                onChange={(e) => this.handleInputChange(e)}
                                                                            />
                                                                            &nbsp;Email
                                                                        </span>
                                                                        <span className="ml-3">
                                                                            <input
                                                                                name="b_de_To_communicate"
                                                                                type="checkbox"
                                                                                data-method="SMS"
                                                                                checked={deCommunicates.indexOf('SMS') > -1}
                                                                                onChange={(e) => this.handleInputChange(e)}
                                                                            />
                                                                            &nbsp;SMS
                                                                        </span>
                                                                        <span className="ml-3">
                                                                            <input
                                                                                name="b_de_To_communicate"
                                                                                type="checkbox"
                                                                                data-method="Call"
                                                                                checked={deCommunicates.indexOf('Call') > -1}
                                                                                onChange={(e) => this.handleInputChange(e)}
                                                                            />
                                                                            &nbsp;Call
                                                                        </span>
                                                                    </div>
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className="head text-white panel-title mt-1">
                                                        Delivery Dates
                                                    </div>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-4">
                                                            <label className="" htmlFor="">ETA Delivery</label>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            {(parseInt(curViewMode) === 0) ?
                                                                (isBookedBooking) ?
                                                                    <p className="show-mode">{formInputs['s_06_Latest_Delivery_Date_TimeSet'] ? moment(formInputs['s_06_Latest_Delivery_Date_TimeSet']).format('DD/MM/YYYY'): ''}</p>
                                                                    :
                                                                    <p className="show-mode">{booking && booking.eta_de_by ? moment(booking.eta_de_by).format('DD/MM/YYYY'): ''}</p>
                                                                :
                                                                (clientname === 'dme' && isBookedBooking) ?
                                                                    <DatePicker
                                                                        className="date"
                                                                        selected={formInputs['s_06_Latest_Delivery_Date_TimeSet'] ? new Date(formInputs['s_06_Latest_Delivery_Date_TimeSet']) : null}
                                                                        onChange={(e) => this.onDateChange(e, 's_06_Latest_Delivery_Date_TimeSet')}
                                                                        dateFormat="dd/MM/yyyy"
                                                                    />
                                                                    :
                                                                    <p className="show-mode">{booking && booking.eta_de_by ? moment(booking.eta_de_by).format('DD/MM/YYYY'): ''}</p>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-4">
                                                            <label className="" htmlFor="">Delivery Booking</label>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            {
                                                                (parseInt(curViewMode) === 0) ?
                                                                    <p className="show-mode">{formInputs['fp_store_event_date'] ? moment(formInputs['fp_store_event_date']).format('DD/MM/YYYY'): ''}</p>
                                                                    :
                                                                    (clientname === 'dme') ?
                                                                        <DatePicker
                                                                            className="date"
                                                                            selected={formInputs['fp_store_event_date'] ? new Date(formInputs['fp_store_event_date']) : null}
                                                                            onChange={(e) => this.onDateChange(e, 'fp_store_event_date')}
                                                                            dateFormat="dd/MM/yyyy"
                                                                        />
                                                                        :
                                                                        <p className="show-mode">{formInputs['fp_store_event_date'] ? moment(formInputs['fp_store_event_date']).format('DD/MM/YYYY'): ''}</p>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-4">
                                                            <label className="" htmlFor="">Project Due Date</label>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            <p className="show-mode">{formInputs['b_project_due_date'] ? moment(formInputs['b_project_due_date']).format('DD/MM/YYYY') : ''}</p>
                                                        </div>
                                                    </div>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-4">
                                                            <label className="" htmlFor="">Actual Delivery </label>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            {
                                                                (parseInt(curViewMode) === 0) ?
                                                                    <p className="show-mode">{formInputs['s_21_Actual_Delivery_TimeStamp'] ? moment(formInputs['s_21_Actual_Delivery_TimeStamp']).format('DD/MM/YYYY HH:mm:ss') : ''}</p>
                                                                    :
                                                                    (clientname === 'dme') ?
                                                                        <DateTimePicker
                                                                            onChange={(date) => this.onChangeDateTime(date, 's_21_Actual_Delivery_TimeStamp')}
                                                                            value={(!_.isNull(formInputs['s_21_Actual_Delivery_TimeStamp']) && !_.isUndefined(formInputs['s_21_Actual_Delivery_TimeStamp'])) &&
                                                                            new Date(moment(formInputs['s_21_Actual_Delivery_TimeStamp']).toDate().toLocaleString('en-US', {timeZone: 'Australia/Sydney'}))}
                                                                            format={'dd/MM/yyyy HH:mm'}
                                                                        />
                                                                        :
                                                                        <p className="show-mode">{formInputs['s_21_Actual_Delivery_TimeStamp'] ? moment(formInputs['s_21_Actual_Delivery_TimeStamp']).format('DD/MM/YYYY HH:mm:ss') : ''}</p>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-4">
                                                            <label className="" htmlFor="">DE Inst Address</label>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            {(parseInt(curViewMode) === 0) ?
                                                                <p className="show-mode">{formInputs['de_to_PickUp_Instructions_Address']}</p>
                                                                :
                                                                <textarea 
                                                                    width="100%"
                                                                    className="textarea-width"
                                                                    name="de_to_PickUp_Instructions_Address"
                                                                    rows="1"
                                                                    cols="9"
                                                                    value={formInputs['de_to_PickUp_Instructions_Address'] ? formInputs['de_to_PickUp_Instructions_Address'] : ''}
                                                                    onChange={(e) => this.onHandleInput(e)}/>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-4">
                                                            <label className="" htmlFor="">DE Inst Contact</label>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            {(parseInt(curViewMode) === 0) ?
                                                                <p className="show-mode">{formInputs['de_to_Pick_Up_Instructions_Contact']}</p>
                                                                :
                                                                <textarea 
                                                                    width="100%"
                                                                    className="textarea-width"
                                                                    name="de_to_Pick_Up_Instructions_Contact"
                                                                    rows="1"
                                                                    cols="9"
                                                                    value={formInputs['de_to_Pick_Up_Instructions_Contact'] ? formInputs['de_to_Pick_Up_Instructions_Contact'] : ''} 
                                                                    onChange={(e) => this.onHandleInput(e)}/>
                                                            }
                                                        </div>
                                                    </div>
                                                    {(clientname === 'dme') &&
                                                        <div className="row mt-1">
                                                            <div className="col-sm-4">
                                                                <label className="" htmlFor="">Futile Note</label>
                                                            </div>
                                                            <div className="col-sm-8">
                                                                {(parseInt(curViewMode) === 0) ?
                                                                    <p className="show-mode">{formInputs['vx_futile_Booking_Notes']}</p>
                                                                    :
                                                                    <textarea 
                                                                        width="100%"
                                                                        className="textarea-width"
                                                                        name="vx_futile_Booking_Notes"
                                                                        rows="1"
                                                                        cols="9"
                                                                        value={formInputs['vx_futile_Booking_Notes'] ? formInputs['vx_futile_Booking_Notes'] : ''}
                                                                        onChange={(e) => this.onHandleInput(e)}/>
                                                                }
                                                            </div>
                                                        </div>
                                                    }
                                                </form>
                                            </div>
                                        </div>

                                        <Popover
                                            isOpen={this.state.isShowAugmentInfoPopup}
                                            target={'augment-info-popup'}
                                            placement="left"
                                            hideArrow={true}
                                            className="aa-modal"
                                        >
                                            <PopoverHeader>
                                                <a onClick={this.onShowEditAugment}><i className="icon icon-pencil float-left"></i></a>
                                                Auto Augment Info
                                                <a className="close-popover" onClick={this.onToggleAugmentInfoPopup}>x</a>
                                            </PopoverHeader>
                                            <PopoverBody>
                                                <div>
                                                    <label>
                                                        <h5 className="bold">PU Entity<span className='c-red'>*</span>: </h5>
                                                        {isAugmentEditable ?
                                                            <input name="origin_puCompany" type="text" placeholder="Enter origin puCompany" value={clientprocess['origin_puCompany']} onChange={(e) => this.onInputChange(e)} />
                                                            : <span>{clientprocess['origin_puCompany']}</span>
                                                        }
                                                    </label>
                                                    <label>
                                                        <h5 className="bold">PU Street 1<span className='c-red'>*</span>: </h5>
                                                        {isAugmentEditable ?
                                                            <input name="origin_pu_Address_Street_1" type="text" placeholder="Enter origin puStreet1" value={clientprocess['origin_pu_Address_Street_1']} onChange={(e) => this.onInputChange(e)} />
                                                            : <span>{clientprocess['origin_pu_Address_Street_1']}</span>
                                                        }
                                                    </label>
                                                    <label>
                                                        <h5 className="bold">PU Street 2: </h5>
                                                        {isAugmentEditable ?
                                                            <input name="origin_pu_Address_Street_2" type="text" placeholder="Enter origin puStreet2" value={clientprocess['origin_pu_Address_Street_2']} onChange={(e) => this.onInputChange(e)} />
                                                            : <span>{clientprocess['origin_pu_Address_Street_2']}</span>
                                                        }
                                                    </label>
                                                </div>
                                                <hr />
                                                <div>
                                                    <label>
                                                        <h5 className="bold">DE Entity<span className='c-red'>*</span>: </h5>
                                                        {isAugmentEditable ?
                                                            <input name="origin_deToCompanyName" type="text" placeholder="Enter dest ToCompanyName" value={clientprocess['origin_deToCompanyName']} onChange={(e) => this.onInputChange(e)} />
                                                            : <span>{clientprocess['origin_deToCompanyName']}</span>
                                                        }
                                                    </label>
                                                    <label>
                                                        <h5 className="bold">DE Instrunction: </h5>
                                                        {isAugmentEditable ?
                                                            <input name="origin_pu_pickup_instructions_address" type="text" placeholder="Enter origin pu pickup instructions address" value={clientprocess['origin_pu_pickup_instructions_address']} onChange={(e) => this.onInputChange(e)} />
                                                            : <span>{clientprocess['origin_pu_pickup_instructions_address']}</span>
                                                        }
                                                    </label>
                                                    <label>
                                                        <h5 className="bold">DE Group Emails: </h5>
                                                        {isAugmentEditable ?
                                                            <input name="origin_de_Email_Group_Emails" type="text" placeholder="Enter dest Email Group Emails" value={clientprocess['origin_de_Email_Group_Emails']} onChange={(e) => this.onInputChange(e)} />
                                                            : <span>{clientprocess['origin_de_Email_Group_Emails']}</span>
                                                        }
                                                    </label>
                                                </div>
                                                {isAugmentEditable &&
                                                    <div className="btns">
                                                        <button className="btn btn-danger" onClick={this.onHideEditAugment}>Cancel</button>
                                                        <button className="btn btn-primary" onClick={this.onUpdateAugment}>Update</button>
                                                    </div>
                                                }
                                            </PopoverBody>
                                        </Popover>

                                        <div className="col-sm-4">
                                            <div className="pickup-detail">
                                                <div className="head text-white">
                                                    <ul>
                                                        <li>Project: {booking.b_booking_project}</li>
                                                        <li>
                                                            {(clientname === 'dme' && booking && !booking.is_auto_augmented) ?
                                                                <button
                                                                    className='btn btn-theme btn-autoaugment'
                                                                    disabled={this.state.loading || this.state.loadingGeoPU || isBookedBooking}
                                                                    onClick={() => this.onClickAutoAugment()}
                                                                >
                                                                    AA
                                                                </button>
                                                                :
                                                                <button
                                                                    id="augment-info-popup"
                                                                    className='btn btn-theme btn-autoaugment-view'
                                                                    disabled={this.state.loading}
                                                                    onClick={() => this.onToggleAugmentInfoPopup()}
                                                                >
                                                                    AA
                                                                </button>
                                                            }
                                                            <a onClick={(e) => this.onClickAugmentPuDate(e)} ><i className="fa fa-calendar" aria-hidden="true"></i></a>
                                                            <a onClick={(e) => this.onClickOpenDateSlide(e)} ><i className="fa fa-columns" aria-hidden="true"></i></a>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="pu-de-dates">
                                                    <div className="row mt-1">
                                                        <div className="col-sm-3">
                                                            <label className="" htmlFor="">Ready Status: </label>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <input type="radio"
                                                                id="available-from"
                                                                value="Available From"
                                                                checked={formInputs['x_ReadyStatus'] === 'Available From'}
                                                                onChange={() => this.handleRadioInputChange('Available From')} />
                                                            <label htmlFor="available-from">&nbsp;&nbsp;Available From</label>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <input type="radio"
                                                                id="available-now"
                                                                value="Available Now"
                                                                checked={formInputs['x_ReadyStatus'] === 'Available Now'}
                                                                onChange={() => this.handleRadioInputChange('Available Now')} />
                                                            <label htmlFor="available-now">&nbsp;&nbsp;Available Now</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="pu-de-dates">
                                                    <div className="row mt-1">
                                                        <div className="col-sm-3">
                                                            <label className="" htmlFor="">PU From</label>
                                                        </div>
                                                        <div className="col-sm-9">
                                                            {(parseInt(curViewMode) === 0) ?
                                                                <label className="show-mode">
                                                                    <p className="date disp-inline-block">
                                                                        {formInputs['puPickUpAvailFrom_Date'] ? moment(formInputs['puPickUpAvailFrom_Date']).format('DD/MM/YYYY') : ''}
                                                                    </p>
                                                                    {!_.isNull(formInputs['pu_PickUp_Avail_Time_Hours']) &&
                                                                        <p className="time disp-inline-block">
                                                                            {parseInt(formInputs['pu_PickUp_Avail_Time_Hours']) > -1 && parseInt(formInputs['pu_PickUp_Avail_Time_Hours']) < 10 ?
                                                                                `0${formInputs['pu_PickUp_Avail_Time_Hours']}:` : `${formInputs['pu_PickUp_Avail_Time_Hours']}:`
                                                                            }
                                                                        </p>
                                                                    }
                                                                    {!_.isNull(formInputs['pu_PickUp_Avail_Time_Hours']) && !_.isNull(formInputs['pu_PickUp_Avail_Time_Minutes']) &&
                                                                        <p className="time disp-inline-block">
                                                                            {parseInt(formInputs['pu_PickUp_Avail_Time_Minutes']) > -1 && parseInt(formInputs['pu_PickUp_Avail_Time_Minutes']) < 10 ?
                                                                                `0${formInputs['pu_PickUp_Avail_Time_Minutes']}` : `${formInputs['pu_PickUp_Avail_Time_Minutes']}`
                                                                            }
                                                                        </p>
                                                                    }
                                                                </label>
                                                                :
                                                                <div>
                                                                    <DatePicker
                                                                        className="date"
                                                                        selected={formInputs['puPickUpAvailFrom_Date'] ? new Date(formInputs['puPickUpAvailFrom_Date']) : null}
                                                                        onChange={(e) => this.onDateChange(e, 'puPickUpAvailFrom_Date')}
                                                                        dateFormat="dd MMM yyyy"
                                                                    />
                                                                    <input
                                                                        className="hour"
                                                                        name='pu_PickUp_Avail_Time_Hours'
                                                                        value={!_.isNull(formInputs['pu_PickUp_Avail_Time_Hours']) ? formInputs['pu_PickUp_Avail_Time_Hours'] : ''}
                                                                        onChange={(e) => this.onHandleInput(e)}
                                                                    />
                                                                    {':'}
                                                                    <input
                                                                        className="time"
                                                                        name='pu_PickUp_Avail_Time_Minutes'
                                                                        value={!_.isNull(formInputs['pu_PickUp_Avail_Time_Minutes']) ? formInputs['pu_PickUp_Avail_Time_Minutes'] : ''}
                                                                        onChange={(e) => this.onHandleInput(e)}
                                                                    />
                                                                </div>
                                                            }
                                                        </div>
                                                        <div className="col-sm-3">
                                                            <label className="" htmlFor="">PU By</label>
                                                        </div>
                                                        <div className="col-sm-9">
                                                            {(parseInt(curViewMode) === 0) ?
                                                                <label className="show-mode">
                                                                    <p className="date disp-inline-block">
                                                                        {formInputs['pu_PickUp_By_Date'] ? moment(formInputs['pu_PickUp_By_Date']).format('DD/MM/YYYY') : ''}
                                                                    </p>
                                                                    {!_.isNull(formInputs['pu_PickUp_By_Time_Hours']) &&
                                                                        <p className="time disp-inline-block">
                                                                            {parseInt(formInputs['pu_PickUp_By_Time_Hours']) > -1 && parseInt(formInputs['pu_PickUp_By_Time_Hours']) < 10 ?
                                                                                `0${formInputs['pu_PickUp_By_Time_Hours']}:` : `${formInputs['pu_PickUp_By_Time_Hours']}:`
                                                                            }
                                                                        </p>
                                                                    }
                                                                    {!_.isNull(formInputs['pu_PickUp_By_Time_Hours']) && !_.isNull(formInputs['pu_PickUp_By_Time_Minutes']) &&
                                                                        <p className="time disp-inline-block">
                                                                            {parseInt(formInputs['pu_PickUp_By_Time_Minutes']) > -1 && parseInt(formInputs['pu_PickUp_By_Time_Minutes']) < 10 ?
                                                                                `0${formInputs['pu_PickUp_By_Time_Minutes']}` : `${formInputs['pu_PickUp_By_Time_Minutes']}`
                                                                            }
                                                                        </p>
                                                                    }
                                                                </label>
                                                                :
                                                                <div>
                                                                    <DatePicker
                                                                        className="date"
                                                                        selected={formInputs['pu_PickUp_By_Date'] ? new Date(formInputs['pu_PickUp_By_Date']) : null}
                                                                        onChange={(e) => this.onDateChange(e, 'pu_PickUp_By_Date')}
                                                                        dateFormat="dd MMM yyyy"
                                                                    />
                                                                    <input
                                                                        className="hour"
                                                                        name='pu_PickUp_By_Time_Hours'
                                                                        value={!_.isNull(formInputs['pu_PickUp_By_Time_Hours']) ? formInputs['pu_PickUp_By_Time_Hours'] : ''}
                                                                        onChange={(e) => this.onHandleInput(e)}
                                                                    />
                                                                    {':'}
                                                                    <input
                                                                        className="time"
                                                                        name='pu_PickUp_By_Time_Minutes'
                                                                        value={!_.isNull(formInputs['pu_PickUp_By_Time_Minutes']) ? formInputs['pu_PickUp_By_Time_Minutes'] : ''}
                                                                        onChange={(e) => this.onHandleInput(e)}
                                                                    />
                                                                </div>
                                                            }
                                                        </div>
                                                        <div className="col-sm-3">
                                                            <label className="" htmlFor="">DE from</label>
                                                        </div>
                                                        <div className="col-sm-9">
                                                            {(parseInt(curViewMode) === 0) ?
                                                                <label className="show-mode">
                                                                    <p className="date disp-inline-block">
                                                                        {formInputs['de_Deliver_From_Date'] ? moment(formInputs['de_Deliver_From_Date']).format('DD/MM/YYYY') : ''}
                                                                    </p>
                                                                    {!_.isNull(formInputs['de_Deliver_From_Hours']) &&
                                                                        <p className="time disp-inline-block">
                                                                            {parseInt(formInputs['de_Deliver_From_Hours']) > -1 && parseInt(formInputs['de_Deliver_From_Hours']) < 10 ?
                                                                                `0${formInputs['de_Deliver_From_Hours']}:` : `${formInputs['de_Deliver_From_Hours']}:`
                                                                            }
                                                                        </p>
                                                                    }
                                                                    {!_.isNull(formInputs['de_Deliver_From_Hours']) && !_.isNull(formInputs['de_Deliver_From_Minutes']) &&
                                                                        <p className="time disp-inline-block">
                                                                            {parseInt(formInputs['de_Deliver_From_Minutes']) > -1 && parseInt(formInputs['de_Deliver_From_Minutes']) < 10 ?
                                                                                `0${formInputs['de_Deliver_From_Minutes']}` : `${formInputs['de_Deliver_From_Minutes']}`
                                                                            }
                                                                        </p>
                                                                    }
                                                                </label>
                                                                :
                                                                <div>
                                                                    <DatePicker
                                                                        className="date"
                                                                        selected={formInputs['de_Deliver_From_Date'] ? new Date(formInputs['de_Deliver_From_Date']) : null}
                                                                        onChange={(e) => this.onDateChange(e, 'de_Deliver_From_Date')}
                                                                        dateFormat="dd MMM yyyy"
                                                                    />
                                                                    <input
                                                                        className="hour"
                                                                        name='de_Deliver_From_Hours'
                                                                        value={!_.isNull(formInputs['de_Deliver_From_Hours']) ? formInputs['de_Deliver_From_Hours'] : ''}
                                                                        onChange={(e) => this.onHandleInput(e)}
                                                                    />
                                                                    {':'}
                                                                    <input
                                                                        className="time"
                                                                        name='de_Deliver_From_Minutes'
                                                                        value={!_.isNull(formInputs['de_Deliver_From_Minutes']) ? formInputs['de_Deliver_From_Minutes'] : ''}
                                                                        onChange={(e) => this.onHandleInput(e)}
                                                                    />
                                                                </div>
                                                            }
                                                        </div>
                                                        <div className="col-sm-3">
                                                            <label className="" htmlFor="">DE By</label>
                                                        </div>
                                                        <div className="col-sm-9">
                                                            {(parseInt(curViewMode) === 0) ?
                                                                <label className="show-mode">
                                                                    <p className="date disp-inline-block">
                                                                        {formInputs['de_Deliver_By_Date'] ? moment(formInputs['de_Deliver_By_Date']).format('DD/MM/YYYY') : ''}
                                                                    </p>
                                                                    {!_.isNull(formInputs['de_Deliver_By_Hours']) &&
                                                                        <p className="time disp-inline-block">
                                                                            {parseInt(formInputs['de_Deliver_By_Hours']) > -1 && parseInt(formInputs['de_Deliver_By_Hours']) < 10 ?
                                                                                `0${formInputs['de_Deliver_By_Hours']}:` : `${formInputs['de_Deliver_By_Hours']}:`
                                                                            }
                                                                        </p>
                                                                    }
                                                                    {!_.isNull(formInputs['de_Deliver_By_Hours']) && !_.isNull(formInputs['de_Deliver_By_Minutes']) &&
                                                                        <p className="time disp-inline-block">
                                                                            {parseInt(formInputs['de_Deliver_By_Minutes']) > -1 && parseInt(formInputs['de_Deliver_By_Minutes']) < 10 ?
                                                                                `0${formInputs['de_Deliver_By_Minutes']}` : `${formInputs['de_Deliver_By_Minutes']}`
                                                                            }
                                                                        </p>
                                                                    }
                                                                </label>
                                                                :
                                                                <div>
                                                                    <DatePicker
                                                                        className="date"
                                                                        selected={formInputs['de_Deliver_By_Date'] ? new Date(formInputs['de_Deliver_By_Date']) : null}
                                                                        onChange={(e) => this.onDateChange(e, 'de_Deliver_By_Date')}
                                                                        dateFormat="dd MMM yyyy"
                                                                    />
                                                                    <input
                                                                        className="hour"
                                                                        name='de_Deliver_By_Hours'
                                                                        value={!_.isNull(formInputs['de_Deliver_By_Hours']) ? formInputs['de_Deliver_By_Hours'] : ''}
                                                                        onChange={(e) => this.onHandleInput(e)}
                                                                    />
                                                                    {':'}
                                                                    <input
                                                                        className="time"
                                                                        name='de_Deliver_By_Minutes'
                                                                        value={!_.isNull(formInputs['de_Deliver_By_Minutes']) ? formInputs['de_Deliver_By_Minutes'] : ''}
                                                                        onChange={(e) => this.onHandleInput(e)}
                                                                    />
                                                                </div>
                                                            }
                                                        </div>
                                                        <div className="col-sm-3">
                                                            <label className="" htmlFor="">Cutoff</label>
                                                        </div>
                                                        <div className="col-sm-9 mb-2">
                                                            {(parseInt(curViewMode) === 0) ?
                                                                <p className="show-mode">
                                                                    {booking ? booking.s_02_Booking_Cutoff_Time : ''}
                                                                </p>
                                                                :
                                                                (booking && clientname === 'dme' && !isBookedBooking) ?
                                                                    <TimePicker
                                                                        onChange={(time) => this.onChangeTime(time, 's_02_Booking_Cutoff_Time')}
                                                                        value={formInputs['s_02_Booking_Cutoff_Time']}
                                                                    />
                                                                    :
                                                                    <p className="show-mode">
                                                                        {booking.s_02_Booking_Cutoff_Time}
                                                                    </p>
                                                            }
                                                        </div>
                                                        <div className="col-sm-3">
                                                            <label className="" htmlFor="">POD Email</label>
                                                        </div>
                                                        <div className="col-sm-9">
                                                            {isBookingSelected &&
                                                                <input
                                                                    className="checkbox"
                                                                    name="b_send_POD_eMail"
                                                                    type="checkbox"
                                                                    checked={booking.b_send_POD_eMail}
                                                                    onChange={(e) => this.handleInputChange(e)}
                                                                    disabled={(clientname !== 'dme') || (curViewMode === 1) ? 'disabled' : ''}
                                                                />
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="buttons">
                                                    <div className="text-center mt-2 fixed-height form-view-btns">
                                                        <button
                                                            className={(parseInt(curViewMode) === 1) ?
                                                                'btn btn-theme custom-theme' : 'btn btn-theme custom-theme disabled'} 
                                                            onClick={() => this.onClickCreateBooking()}
                                                        >Create</button>
                                                        <button
                                                            className={(parseInt(curViewMode) === 2) ?
                                                                'btn btn-theme custom-theme' : 'btn btn-theme custom-theme disabled'}
                                                            onClick={() => this.onClickUpdateBooking()}
                                                            disabled={this.state.loadingBookingLine || this.state.loadingBookingLineDetail || this.state.loading || this.state.loadingGeoPU ? 'disabled' : ''}
                                                        >Update</button>
                                                    </div>
                                                    <div className="text-center mt-2 fixed-height pricing-btns">
                                                        <button
                                                            className="btn btn-theme custom-theme"
                                                            onClick={() => this.onClickFC()}
                                                            disabled={(booking && !isBookedBooking && curViewMode !== 1) ? '' : 'disabled'}
                                                        >
                                                            Price & Time Calc(FC)
                                                        </button>
                                                        <button
                                                            className="btn btn-theme custom-theme"
                                                            onClick={() => this.onClickOpenPricingSlider()}
                                                            disabled={curViewMode !== 1 ? '' : 'disabled'}
                                                        >
                                                            <i className="fa fa-caret-square-left"></i>
                                                        </button>
                                                    </div>
                                                    <div className="text-center mt-2 fixed-height">
                                                        {(clientname === 'dme'
                                                            && booking && isBookedBooking
                                                            && this.state.booking.vx_freight_provider.toLowerCase() == 'tnt'
                                                        ) ?
                                                            <div className="text-center mt-2 fixed-height half-size">
                                                                <button
                                                                    className="btn btn-theme custom-theme"
                                                                    onClick={() => this.onSavePuInfo()}
                                                                    disabled={
                                                                        (booking && isLockedBooking)
                                                                        || (curViewMode === 1) ? 'disabled' : ''
                                                                    }
                                                                >
                                                                    SH-PU
                                                                </button>
                                                                <button
                                                                    className="btn btn-theme custom-theme"
                                                                    onClick={() => this.onClickRebook()}
                                                                    disabled={
                                                                        (booking && isLockedBooking)
                                                                        || (curViewMode === 1) ? 'disabled' : ''
                                                                    }
                                                                >
                                                                    Rebook Pu
                                                                </button>
                                                            </div>
                                                            :
                                                            <button
                                                                className="btn btn-theme custom-theme"
                                                                onClick={() => this.onClickBook()}
                                                                disabled={
                                                                    (booking && (isBookedBooking || isLockedBooking))
                                                                    || (curViewMode === 1) ? 'disabled' : ''
                                                                }
                                                            >
                                                                Book
                                                            </button>
                                                        }
                                                    </div>
                                                    <div className="text-center mt-2 fixed-height manual-book">
                                                        <input
                                                            className="checkbox"
                                                            name="tickManualBook"
                                                            type="checkbox"
                                                            checked={formInputs['x_manual_booked_flag']}
                                                            onChange={(e) => this.handleInputChange(e)}
                                                            disabled={(booking && isBookedBooking && isLockedBooking) || (curViewMode === 1) ? 'disabled' : ''}
                                                        />
                                                        <p>Manual Book</p>
                                                    </div>
                                                    <div className="text-center mt-2 fixed-height">
                                                        <button
                                                            className="btn btn-theme custom-theme"
                                                            onClick={() => this.onClickEditBook()}
                                                            disabled={(isBookedBooking && !isLockedBooking && booking && booking.b_status !== 'Closed') ? '' : 'disabled'}
                                                        >
                                                            Amend Booking
                                                        </button>
                                                    </div>
                                                    <div className="text-center mt-2 fixed-height">
                                                        <button
                                                            className="btn btn-theme custom-theme"
                                                            onClick={() => this.onClickCancelBook()}
                                                            disabled={
                                                                booking
                                                                && (isBookedBooking || !isLockedBooking)
                                                                && booking.vx_freight_provider
                                                                && booking.vx_freight_provider.toLowerCase() === 'startrack'
                                                                    ? '' : 'disabled'
                                                            }
                                                        >
                                                            Cancel Request
                                                        </button>
                                                    </div>
                                                    <div className="text-center mt-2 fixed-height">
                                                        <button
                                                            className="btn btn-theme custom-theme"
                                                            onClick={() => this.onClickDuplicate(2)}
                                                            disabled={(curViewMode === 1) ? 'disabled' : ''}
                                                        >
                                                            Duplicate Booking
                                                        </button>
                                                    </div>
                                                    <div className="text-center mt-2 fixed-height">
                                                        <button
                                                            className="btn btn-theme custom-theme"
                                                            onClick={() => this.onClickSwitchAddress()}
                                                            disabled={(curViewMode === 1) ? 'disabled' : ''}
                                                        >
                                                            Switch PU & DE info
                                                        </button>
                                                    </div>
                                                    <div className="text-center mt-2 fixed-height half-size">
                                                        <button
                                                            className="btn btn-theme custom-theme"
                                                            onClick={() => this.onClickGetLabel()}
                                                            disabled={
                                                                ((booking && booking.z_label_url && booking.z_label_url.length > 0) || (curViewMode === 1)) && 
                                                                booking && booking.kf_client_id !== '1af6bcd2-6148-11eb-ae93-0242ac130002'
                                                                    ? 'disabled' : ''}
                                                        >
                                                            Get Label
                                                        </button>
                                                        <button
                                                            className="btn btn-theme custom-theme"
                                                            onClick={() => this.onClickViewFile('label')}
                                                            disabled={(booking && booking.z_label_url) ? '' : 'disabled'}
                                                            title="View Label"
                                                        >
                                                            View <i className="icon icon-printer"></i>
                                                        </button>
                                                    </div>
                                                    <div className="text-center mt-2 fixed-height">
                                                        <button
                                                            className={(booking && booking.vx_freight_provider && booking.vx_freight_provider.toLowerCase() != 'tnt') || (curViewMode === 1) ? 'none' : 'btn btn-theme custom-theme'}
                                                            onClick={() => this.onClickReprintLabel()}
                                                            disabled={(booking && booking.vx_freight_provider && booking.vx_freight_provider.toLowerCase() != 'tnt') || (curViewMode === 1) ? 'disabled' : ''}
                                                        >
                                                            Reprint TNT Label
                                                        </button>
                                                    </div>
                                                    <div className="text-center mt-2 fixed-height half-size">
                                                        <button
                                                            className="btn btn-theme custom-theme"
                                                            onClick={() => this.onClickTrackingStatus()}
                                                            disabled={(curViewMode === 1 || isLockedBooking) ? 'disabled' : ''}
                                                        >
                                                            Status
                                                        </button>
                                                        <button
                                                            className="btn btn-theme custom-theme"
                                                            onClick={() => this.onClickPOD()}
                                                            disabled={(curViewMode === 1) ? 'disabled' : ''}
                                                        >
                                                            Pod
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="tabs">
                                        <div className="tab-button-outer">
                                            <ul id="tab-button">
                                                <li className={activeTabInd === 0 ? 'selected' : ''}><a onClick={(e) => this.onClickBottomTap(e, 0)}>Shipment Packages / Goods({curViewMode === 1 ? 0 : qtyTotal})</a></li>
                                                <li className={activeTabInd === 1 ? 'selected' : ''}><a onClick={(e) => this.onClickBottomTap(e, 1)}>Additional Information</a></li>
                                                <li className={activeTabInd === 3 ? 'selected' : ''}>
                                                    <a onClick={(e) => this.onClickBottomTap(e, 3)}>
                                                        Zoho Tickets Log({zohoTickets.length})
                                                    </a>
                                                </li>
                                                <li className={activeTabInd === 4 ? 'selected' : ''}><a onClick={(e) => this.onClickBottomTap(e, 4)}>Attachments({curViewMode === 1 ? 0 : cntAttachments})</a></li>
                                                <li className={activeTabInd === 5 ? 'selected' : ''}><a onClick={(e) => this.onClickBottomTap(e, 5)}>Label & Pod</a></li>
                                            </ul>
                                        </div>
                                        <div className="tab-select-outer none">
                                            <select id="tab-select">
                                                <option value="#tab01">Shipment Packages / Goods</option>
                                                <option value="#tab02">Additional Services & Options</option>
                                                <option value="#tab03">ZOHO</option>
                                                <option value="#tab04">Attachments</option>
                                                <option value="#tab05">Label & Pod</option>
                                            </select>
                                        </div>
                                        <div id="tab01" className={activeTabInd === 0 ? 'tab-contents selected' : 'tab-contents none'}>
                                            {curViewMode === 1 ?
                                                <label className='red'>Click `Create` with pickup and delivery details completed to add shipping lines</label>
                                                :
                                                <div className={isBookedBooking ? 'tab-inner not-editable' : 'tab-inner'}>
                                                    <Button
                                                        className="edit-lld-btn btn-primary"
                                                        onClick={this.toggleLineSlider} 
                                                        disabled={!isBookingSelected || (isBookedBooking && clientname !== 'dme')}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        className="edit-lld-btn btn-primary"
                                                        onClick={this.toggleLineTrackingSlider}
                                                        disabled={!isBookingSelected}
                                                    >
                                                        Edit Tracking
                                                    </Button>
                                                    <span className=''> | </span>
                                                    <Button
                                                        className=''
                                                        color={currentPackedStatus === 'original' ? 'success' : 'secondary'}
                                                        onClick={() => this.onChangePackedStatus('original')}
                                                        disabled={!isBookingSelected}
                                                        title="Lines as sended"
                                                    >
                                                        Send As Is
                                                    </Button>
                                                    <Button
                                                        className=''
                                                        color={currentPackedStatus === 'auto' ? 'success' : 'secondary'}
                                                        onClick={() => this.onChangePackedStatus('auto')}
                                                        disabled={!isBookingSelected}
                                                        title="Auto packed lines"
                                                    >
                                                        Auto Repack
                                                    </Button>
                                                    <Button
                                                        className=''
                                                        color={currentPackedStatus === 'manual' ? 'success' : 'secondary'}
                                                        onClick={() => this.onChangePackedStatus('manual')}
                                                        disabled={!isBookingSelected}
                                                        title="Manual packed lines"
                                                    >
                                                        Manual Repack
                                                    </Button>
                                                    <Button
                                                        className=''
                                                        color={currentPackedStatus === 'scanned' ? 'success' : 'secondary'}
                                                        onClick={() => this.onChangePackedStatus('scanned')}
                                                        disabled={!isBookingSelected}
                                                        title="Scanned/Actual Shipped"
                                                    >
                                                        Scanned / Actual Shipped
                                                    </Button>
                                                    <hr />
                                                    <BootstrapTable
                                                        keyField="id"
                                                        data={ bookingTotals }
                                                        columns={ columnBookingTotals }
                                                        bootstrap4={ true }
                                                    />
                                                    <LoadingOverlay
                                                        active={this.state.loadingBookingLine}
                                                        spinner
                                                        text='Loading...'
                                                    >
                                                        <BootstrapTable
                                                            keyField='pk_lines_id'
                                                            data={ filteredProducts }
                                                            columns={ bookingLineColumns }
                                                            selectRow={ bookingLineColumnsSelectRow }
                                                            bootstrap4={ true }
                                                        />
                                                    </LoadingOverlay>
                                                    <LoadingOverlay
                                                        active={this.state.loadingBookingLineDetail}
                                                        spinner
                                                        text='Loading...'
                                                    >
                                                        <BootstrapTable
                                                            keyField="pk_id_lines_data"
                                                            data={ filterBookingLineDetailsProduct }
                                                            columns={ bookingLineDetailsColumns }
                                                            bootstrap4={ true }
                                                        />
                                                    </LoadingOverlay>
                                                </div>
                                            }
                                        </div>
                                        <div id="tab02" className={activeTabInd === 1 ? 'tab-contents selected' : 'tab-contents none'}>
                                            <div className="tab-inner">
                                                <p className="font-24px float-left">Additional Services & Options</p>
                                                <BootstrapTable
                                                    keyField='vx_freight_provider'
                                                    data={ AdditionalServices }
                                                    columns={ columnAdditionalServices }
                                                    bootstrap4={ true }
                                                />
                                                <p className="font-24px float-left none">Booking Counts & Totals</p>
                                            </div>
                                        </div>
                                        <div id="tab03" className={activeTabInd === 3 ? 'tab-contents selected' : 'tab-contents none'}>
                                            <LoadingOverlay
                                                active={this.state.loadingZohoTickets || this.state.loadingZohoDepartments}
                                                spinner
                                                text='Loading Zoho tickets...'
                                            >
                                                <div className="tab-inner">
                                                    <ToolkitProvider
                                                        id="zohoTicketsLog"
                                                        keyField="ticketNumber"
                                                        data={clientname === 'dme' ? zohoTickets: zohoTickets.filter(item => item.departmentId === '2199000000012806')}
                                                        columns={ columnZohoTickets }
                                                        bootstrap4={ true }
                                                    >
                                                        {
                                                            props => (
                                                                <div>
                                                                    {!_.isEmpty(zohoDepartments) && !_.isEmpty(zohoTickets) && <BootstrapTable id="zohoTickets"
                                                                        {...props.baseProps}
                                                                        cellEdit={cellEditFactory({ 
                                                                            mode: 'click', 
                                                                            blurToSave: true, 
                                                                            afterSaveCell: this.onAfterSaveCell 
                                                                        })}
                                                                    />}
                                                                </div>
                                                            )
                                                        }
                                                    </ToolkitProvider>
                                                </div>
                                            </LoadingOverlay>
                                        </div>
                                        <div id="tab04" className={activeTabInd === 4 ? 'tab-contents selected' : 'tab-contents none'}>
                                            <div className="col-12">
                                                <form onSubmit={(e) => this.handleUpload(e, 'attachment')}>
                                                    <DropzoneComponent
                                                        id="attachments-dz"
                                                        config={attachmentsDzConfig}
                                                        eventHandlers={attachmentsEventHandlers}
                                                        djsConfig={djsConfig}
                                                    />
                                                    <button className="btn btn-primary" type="submit">Upload</button>
                                                </form>
                                            </div>
                                            <div className="tab-inner">
                                                <BootstrapTable
                                                    keyField="modelNumber"
                                                    data={ attachmentsHistory }
                                                    columns={ columnAttachments }
                                                    bootstrap4={ true }
                                                />
                                            </div>
                                        </div>
                                        <div id="tab05" className={activeTabInd === 5 ? 'tab-contents selected' : 'tab-contents none'}>
                                            {isBookingSelected ?
                                                <div className="row">
                                                    <div className="col-6">
                                                        <label>Label upload</label>
                                                        <form onSubmit={(e) => this.handleUpload(e, 'label')}>
                                                            <DropzoneComponent
                                                                id="label-dz"
                                                                config={labelDzConfig}
                                                                eventHandlers={labelEventHandlers}
                                                                djsConfig={djsConfig}
                                                            />
                                                            <button className="btn btn-primary" type="submit">Upload</button>
                                                        </form>
                                                        {booking.z_label_url &&
                                                            <div>
                                                                <p>Label: {booking.z_label_url}</p>
                                                                <button
                                                                    className="btn btn-primary"
                                                                    onClick={() => this.onClickDownloadFile('label')}
                                                                >
                                                                    Download
                                                                </button>
                                                                <button
                                                                    className="btn btn-primary"
                                                                    onClick={() => this.onClickViewFile('label')}
                                                                >
                                                                    View
                                                                </button>
                                                                <button
                                                                    className="btn btn-danger"
                                                                    onClick={() => this.onClickDeleteFile('label')}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        }
                                                    </div>
                                                    <div className="col-6">
                                                        <label>POD upload</label>
                                                        <form onSubmit={(e) => this.handleUpload(e, 'pod')}>
                                                            <DropzoneComponent
                                                                id="pod-dz"
                                                                config={podDzConfig}
                                                                eventHandlers={podEventHandlers}
                                                                djsConfig={djsConfig}
                                                            />
                                                            <button className="btn btn-primary" type="submit">Upload</button>
                                                        </form>
                                                        {(booking.z_pod_url || booking.z_pod_signed_url) &&
                                                            <div>
                                                                <p>POD: {booking.z_pod_url}</p>
                                                                <button
                                                                    className="btn btn-primary"
                                                                    onClick={() => this.onClickDownloadFile('pod')}
                                                                >
                                                                    Download
                                                                </button>
                                                                <button
                                                                    className="btn btn-primary"
                                                                    onClick={() => this.onClickViewFile('pod')}
                                                                >
                                                                    View
                                                                </button>
                                                                <button
                                                                    className="btn btn-danger"
                                                                    onClick={() => this.onClickDeleteFile('pod')}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                                :
                                                <label className='red'>Please select booking first</label>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </LoadingOverlay>

                <ReactstrapModal isOpen={this.state.isShowDuplicateBookingOptionsModal} toggle={this.toggleDuplicateBookingOptionsModal} className="duplicate-option-modal">
                    <ModalHeader toggle={this.toggleDuplicateBookingOptionsModal}>Duplicate Booking Options</ModalHeader>
                    <ModalBody>
                        <label>
                            <input
                                name="switchInfo"
                                type="checkbox"
                                checked={this.state.switchInfo}
                                onChange={(e) => this.handleInputChange(e)} />
                            Switch Addresses & Contacts
                        </label>
                        <br />
                        <label>
                            <input
                                name="dupLineAndLineDetail"
                                type="checkbox"
                                checked={this.state.dupLineAndLineDetail}
                                onChange={(e) => this.handleInputChange(e)} />
                            Duplicate related Lines and LineDetails
                        </label>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => this.onClickDuplicate(3)}>Duplicate</Button>{' '}
                        <Button color="secondary" onClick={this.toggleDuplicateBookingOptionsModal}>Cancel</Button>
                    </ModalFooter>
                </ReactstrapModal>

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
                    booking={booking}
                    createBookingLine={(bookingLine) => this.props.createBookingLine(bookingLine)}
                    updateBookingLine={(bookingLine) => this.props.updateBookingLine(bookingLine)}
                    createBookingLineDetail={(bookingLine) => this.props.createBookingLineDetail(bookingLine)}
                    updateBookingLineDetail={(bookingLine) => this.props.updateBookingLineDetail(bookingLine)}
                    moveLineDetails={(lineId, lineDetailIds) => this.props.moveLineDetails(lineId, lineDetailIds)}
                    packageTypes={this.state.packageTypes}
                    currentPackedStatus={this.state.currentPackedStatus}
                />

                <StatusHistorySlider
                    isOpen={isShowStatusHistorySlider}
                    statusHistories={statusHistories}
                    booking={booking}
                    toggleStatusHistorySlider={this.toggleStatusHistorySlider}
                    allBookingStatus={allBookingStatus}
                    OnCreateStatusHistory={(statusHistory, isShowStatusDetailInput, isShowStatusActionInput) => this.OnCreateStatusHistory(statusHistory, isShowStatusDetailInput, isShowStatusActionInput)}
                    OnUpdateStatusHistory={(statusHistory, isShowStatusDetailInput, isShowStatusActionInput) => this.OnUpdateStatusHistory(statusHistory, isShowStatusDetailInput, isShowStatusActionInput)}
                    clientname={clientname}
                />

                <LineTrackingSlider
                    isOpen={isShowLineTrackingSlider}
                    toggleLineTrackingSlider={this.toggleLineTrackingSlider}
                    lines={products}
                    booking={booking}
                    clientname={clientname}
                    updateBookingLine={(bookingLine) => this.props.updateBookingLine(bookingLine)}
                    updateBooking={(id, booking) => this.props.updateBooking(id, booking)}
                    isBooked={isBookedBooking}
                    calcCollected={(ids, type) => this.props.calcCollected(ids, type)}
                    apiBCLs={this.state.apiBCLs}
                />

                <StatusLockModal
                    isOpen={isShowStatusLockModal}
                    toggleStatusLockModal={this.toggleStatusLockModal}
                    booking={booking}
                    onClickUpdate={(booking) => this.onChangeStatusLock(booking)}
                />

                <StatusNoteModal
                    isShowStatusNoteModal={this.state.isShowStatusNoteModal}
                    toggleStatusNoteModal={this.toggleStatusNoteModal}
                    onUpdate={(note) => this.onUpdateStatusNote(note)}
                    onClear={() => this.onClearStatusNote()}
                    note={formInputs[currentNoteModalField]}
                    fieldName={currentNoteModalField}
                    isEditable={(curViewMode===0) ? false : true}
                />

                <ConfirmModal
                    isOpen={this.state.isShowDeleteFileConfirmModal}
                    onOk={() => this.onClickConfirmBtn('delete-file')}
                    onCancel={this.toggleDeleteFileConfirmModal}
                    title={this.state.selectedFileOption === 'label' ? 'Delete Label' : 'Delete POD'}
                    text={'Are you sure you want to delete this file?'}
                    okBtnName={'Delete'}
                />

                {formInputs && formInputs['booking_Created_For'] && formInputs['booking_Created_For'].label &&
                    <ConfirmModal
                        isOpen={this.state.isShowUpdateCreatedForEmailConfirmModal}
                        onOk={() => this.onClickConfirmBtn('booking_Created_For')}
                        onCancel={this.toggleUpdateCreatedForEmailConfirmModal}
                        title={'Update Client Employee`s email'}
                        text={`Are you sure you want to update email for ${formInputs['booking_Created_For'].label.toUpperCase()}?`}
                        okBtnName={'Update'}
                    />
                }

                <ProjectDataSlider
                    isOpen={this.state.isShowProjectDataSlider}
                    booking={booking}
                    OnUpdate = {(bookingToUpdate) => this.onUpdateProjectData(bookingToUpdate)}
                    toggleDateSlider={this.toggleDateSlider}
                />

                <FPPricingSlider
                    isOpen={this.state.isShowFPPricingSlider}
                    toggleSlider={this.toggleFPPricingSlider}
                    pricingInfos={this.state.pricingInfos}
                    onSelectPricing={(pricingInfo) => this.onSelectPricing(pricingInfo)}
                    isLoading={this.state.loadingPricingInfos}
                    booking={booking}
                    isBooked={isBookedBooking}
                    clientname={clientname}
                    onLoadPricingErrors={this.onLoadPricingErrors}
                    errors={this.state.errors}
                />

                <EmailLogSlider
                    isOpen={this.state.isShowEmailLogSlider}
                    toggleSlider={this.toggleEmailLogSlider}
                    emailLogs={emailLogs}
                />

                <CostSlider
                    isOpen={this.state.isShowCostSlider}
                    toggleSlider={this.toggleCostSlider}
                    booking={booking}
                    clientname={clientname}
                />

                <ConfirmModal
                    isOpen={this.state.isShowManualRepackModal}
                    onOk={() => this.onClickConfirmBtn('manual-from-original')}
                    onOk2={() => this.onClickConfirmBtn('manual-from-auto')}
                    onOk3={() => this.onClickConfirmBtn('enter-from-scratch')}
                    onCancel={this.toggleManualRepackModal}
                    title={'Manual Repack source selection'}
                    text={'Copy data for manual re-repack from?'}
                    okBtnName={'From Send As Is'}
                    ok2BtnName={'From Auto Repack'}
                    ok3BtnName={'Enter from Scratch'}
                />

                <ToastContainer />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        booking: state.booking.booking,
        nextBookingId: state.booking.nextBookingId,
        prevBookingId: state.booking.prevBookingId,
        qtyTotal: state.booking.qtyTotal,
        cntAttachments: state.booking.cntAttachments,
        redirect: state.auth.redirect,
        bookingLines: state.bookingLine.bookingLines,
        bookingLineDetails: state.bookingLineDetail.bookingLineDetails,
        bBooking: state.booking.bBooking,
        puStates: state.booking.puStates,
        puPostalCodes: state.booking.puPostalCodes,
        puSuburbs: state.booking.puSuburbs,
        deToStates: state.booking.deToStates,
        deToPostalCodes: state.booking.deToPostalCodes,
        deToSuburbs: state.booking.deToSuburbs,
        attachments: state.booking.attachments,
        needUpdateBooking: state.booking.needUpdateBooking,
        needUpdateBookingLines: state.bookingLine.needUpdateBookingLines,
        needUpdateBookingLineDetails: state.bookingLineDetail.needUpdateBookingLineDetails,
        needUpdateLineAndLineDetail: state.booking.needUpdateLineAndLineDetail,
        clientprocess: state.booking.clientprocess,
        clientname: state.auth.clientname,
        username: state.auth.username,
        clientId: state.auth.clientId,
        warehouses: state.warehouse.warehouses,
        dmeClients: state.auth.dmeClients,
        noBooking: state.booking.noBooking,
        packageTypes: state.extra.packageTypes,
        allBookingStatus: state.extra.allBookingStatus,
        statusHistories: state.extra.statusHistories,
        needUpdateStatusHistories: state.extra.needUpdateStatusHistories,
        statusActions: state.extra.statusActions,
        statusDetails: state.extra.statusDetails,
        apiBCLs: state.extra.apiBCLs,
        allFPs: state.extra.allFPs,
        needUpdateStatusActions: state.extra.needUpdateStatusActions,
        needUpdateStatusDetails: state.extra.needUpdateStatusDetails,
        needToFetchGeoInfo: state.booking.needToFetchGeoInfo,
        isTickedManualBook: state.booking.isTickedManualBook,
        pricingInfos: state.booking.pricingInfos,
        emailLogs: state.extra.emailLogs,
        createdForInfos: state.user.createdForInfos,
        extraErrorMessage: state.extra.errorMessage,
        bookingErrorMessage: state.booking.errorMessage,
        zohoTickets: state.extra.zohoTickets,
        zohoDepartments: state.extra.zohoDepartments,
        zohoTicketSummaries: state.extra.zohoTicketSummaries,
        loadingZohoTickets: state.extra.loadingZohoTickets,
        loadingZohoDepartments: state.extra.loadingZohoDepartments,
        loadingZohoTicketSummaries: state.extra.loadingZohoTicketSummaries,
        errors: state.extra.errors,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        autoAugmentBooking: (bookingId) => dispatch(autoAugmentBooking(bookingId)),
        revertAugmentBooking: (bookingId) => dispatch(revertAugmentBooking(bookingId)),
        augmentPuDate: (bookingId) => dispatch(augmentPuDate(bookingId)),
        saveBooking: (booking) => dispatch(saveBooking(booking)),
        duplicateBooking: (bookingId, switchInfo, dupLineAndLineDetail) => dispatch(duplicateBooking(bookingId, switchInfo, dupLineAndLineDetail)),
        getBooking: (id, filter) => dispatch(getBooking(id, filter)),
        manualBook: (id) => dispatch(manualBook(id)),
        tickManualBook: (id) => dispatch(tickManualBook(id)),
        getSuburbStrings: (type, name) => dispatch(getSuburbStrings(type, name)),
        getAttachmentHistory: (pk_booking_id) => dispatch(getAttachmentHistory(pk_booking_id)),
        getDeliverySuburbStrings: (type, name) => dispatch(getDeliverySuburbStrings(type, name)),
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
        fpBook: (bookingId, vx_freight_provider) => dispatch(fpBook(bookingId, vx_freight_provider)),
        fpRebook: (bookingId, vx_freight_provider) => dispatch(fpRebook(bookingId, vx_freight_provider)),
        fpPod: (bookingId, vx_freight_provider) => dispatch(fpPod(bookingId, vx_freight_provider)),
        fpEditBook: (bookingId, vx_freight_provider) => dispatch(fpEditBook(bookingId, vx_freight_provider)),
        fpCancelBook: (bookingId, vx_freight_provider) => dispatch(fpCancelBook(bookingId, vx_freight_provider)),
        fpLabel: (bookingId, vx_freight_provider) => dispatch(fpLabel(bookingId, vx_freight_provider)),
        fpReprint: (bookingId, vx_freight_provider) => dispatch(fpReprint(bookingId, vx_freight_provider)),
        fpTracking: (bookingId, vx_freight_provider) => dispatch(fpTracking(bookingId, vx_freight_provider)),
        fpPricing: (bookingId) => dispatch(fpPricing(bookingId)),
        dmeLabel: (bookingId) => dispatch(dmeLabel(bookingId)),
        updateBooking: (id, booking) => dispatch(updateBooking(id, booking)),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        getWarehouses: () => dispatch(getWarehouses()),
        getDMEClients: () => dispatch(getDMEClients()),
        getBookingStatusHistory: (bookingId) => dispatch(getBookingStatusHistory(bookingId)),
        getPackageTypes: () => dispatch(getPackageTypes()),
        getAllBookingStatus: () => dispatch(getAllBookingStatus()),
        createStatusHistory: (statusHistory) => dispatch(createStatusHistory(statusHistory)),
        updateStatusHistory: (statusHistory) => dispatch(updateStatusHistory(statusHistory)),
        getStatusDetails: () => dispatch(getStatusDetails()),
        calcCollected: (bookingIds, type) => dispatch(calcCollected(bookingIds, type)),
        getStatusActions: () => dispatch(getStatusActions()),
        createStatusAction: (newStatusAction) => dispatch(createStatusAction(newStatusAction)),
        createStatusDetail: (newStatusDetail) => dispatch(createStatusDetail(newStatusDetail)),
        getApiBCLs: (bookingId) => dispatch(getApiBCLs(bookingId)),
        setFetchGeoInfoFlag: (boolFlag) => dispatch(setFetchGeoInfoFlag(boolFlag)),
        clearErrorMessage: (boolFlag) => dispatch(clearErrorMessage(boolFlag)),
        getAllFPs: () => dispatch(getAllFPs()),
        getPricingInfos: (pk_booking_id) => dispatch(getPricingInfos(pk_booking_id)),
        sendEmail: (bookingId, templateName) => dispatch(sendEmail(bookingId, templateName)),
        getEmailLogs: (bookingId) => dispatch(getEmailLogs(bookingId)),
        saveStatusHistoryPuInfo: (bookingId) => dispatch(saveStatusHistoryPuInfo(bookingId)),
        getCreatedForInfos: () => dispatch(getCreatedForInfos()),
        updateClientEmployee: (clientEmployee) => dispatch(updateClientEmployee(clientEmployee)), 
        getZohoTicketsWithBookingId:  (b_bookingID_Visual) => dispatch(getZohoTicketsWithBookingId(b_bookingID_Visual)),
        updateZohoTicket: (id, data) => dispatch(updateZohoTicket(id, data)),
        moveZohoTicket: (id, data) => dispatch(moveZohoTicket(id, data)),
        getZohoTicketSummaries: () => dispatch(getZohoTicketSummaries()),
        getAllErrors: (pk_booking_id) => dispatch(getAllErrors(pk_booking_id)),
        resetNoBooking: () => dispatch(resetNoBooking()),
        getClientProcessMgr: (pk_booking_id) => dispatch(getClientProcessMgr(pk_booking_id)),
        updateAugment: (clientprocess) => dispatch(updateAugment(clientprocess)),
        moveLineDetails: (lineId, lineDetailIds) => dispatch(moveLineDetails(lineId, lineDetailIds)),
        repack: (bookingId, repackStatus) => dispatch(repack(bookingId, repackStatus)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BookingPage));

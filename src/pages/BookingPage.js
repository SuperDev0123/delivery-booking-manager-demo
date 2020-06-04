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
// import cellEditFactory from 'react-bootstrap-table2-editor';
import LoadingOverlay from 'react-loading-overlay';
import DropzoneComponent from 'react-dropzone-component';
import { Button, Modal as ReactstrapModal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Modal from 'react-modal';
import CKEditor from 'ckeditor4-react';
import DateTimePicker from 'react-datetime-picker';
import TimePicker from 'react-time-picker';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import user from '../public/images/user.png';
import { API_HOST, STATIC_HOST, HTTP_PROTOCOL } from '../config';
// import CommTooltipItem from '../components/Tooltip/CommTooltipComponent';
// Custom Modals
import SwitchClientModal from '../components/CommonModals/SwitchClientModal';
import StatusLockModal from '../components/CommonModals/StatusLockModal';
import StatusNoteModal from '../components/CommonModals/StatusNoteModal';
// Custom Sliders
import LineAndLineDetailSlider from '../components/Sliders/LineAndLineDetailSlider';
import LineTrackingSlider from '../components/Sliders/LineTrackingSlider';
import StatusHistorySlider from '../components/Sliders/StatusHistorySlider';
import ProjectDataSlider from '../components/Sliders/ProjectDataSlider';
import NoteSlider from '../components/Sliders/NoteSlider';
import TooltipItem from '../components/Tooltip/TooltipComponent';
import ConfirmModal from '../components/CommonModals/ConfirmModal';
import FPPricingSlider from '../components/Sliders/FPPricingSlider';
import EmailLogSlider from '../components/Sliders/EmailLogSlider';
// Services
import { verifyToken, cleanRedirectState, getDMEClients, setClientPK } from '../state/services/authService';
import { getCreatedForInfos } from '../state/services/userService';
import { getBooking, getAttachmentHistory, getSuburbStrings, getDeliverySuburbStrings, saveBooking, updateBooking, duplicateBooking, setFetchGeoInfoFlag, clearErrorMessage, tickManualBook, manualBook, fpPricing, getPricingInfos, sendEmail, autoAugmentBooking, checkAugmentedBooking, revertAugmentBooking, augmentPuDate } from '../state/services/bookingService';
// FP Services
import { fpBook, fpEditBook, fpRebook, fpLabel, fpCancelBook, fpPod, fpReprint, fpTracking } from '../state/services/bookingService';
import { getBookingLines, createBookingLine, updateBookingLine, deleteBookingLine, duplicateBookingLine, calcCollected } from '../state/services/bookingLinesService';
import { getBookingLineDetails, createBookingLineDetail, updateBookingLineDetail, deleteBookingLineDetail, duplicateBookingLineDetail } from '../state/services/bookingLineDetailsService';
import { createComm, getComms, updateComm, deleteComm, getNotes, createNote, updateNote, deleteNote, getAvailableCreators } from '../state/services/commService';
import { getWarehouses } from '../state/services/warehouseService';
import { getPackageTypes, getAllBookingStatus, createStatusHistory, updateStatusHistory, getBookingStatusHistory, getStatusDetails, getStatusActions, createStatusDetail, createStatusAction, getApiBCLs, getAllFPs, getEmailLogs, saveStatusHistoryPuInfo, updateClientEmployee, getZohoTickets } from '../state/services/extraService';
// Validation
import { isFormValid, isValid4Label } from '../commons/validations';

class BookingPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            formInputs: {},
            commFormInputs: {
                assigned_to: '', 
                priority_of_log: 'Standard',
                dme_notes_type: 'Delivery',
                dme_action: 'No follow up required, noted for info purposes',
                additional_action_task: '',
                notes_type: 'Call',
                dme_notes: '',
                closed: false,
            },
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
            puTimeZone: null,
            deTimeZone: null,
            attachmentsHistory: [],
            selectionChanged: 0,
            AdditionalServices: [],
            bookingTotals: [],
            isShowDuplicateBookingOptionsModal: false,
            isShowCommModal: false,
            switchInfo: false,
            dupLineAndLineDetail: false,
            comms: [],
            notes: [],
            isNotePaneOpen: false,
            selectedCommId: null,
            commFormMode: 'create',
            isShowAdditionalActionTaskInput: false,
            isShowAssignedToInput: false,
            actionTaskOptions: [
                'No follow up required, noted for info purposes', 
                'Follow up with FP when to be collected',
                'Follow up with Booking Contact as per log',
                'Follow up with Cust if they still need collected',
                'Follow up Cust to confirm pickup date / time',
                'Follow up Cust to confirm packaging & pickup date / time',
                'Follow up with FP Booked in & on Schedule',
                'Follow up with FP Futile re-booked or collected',
                'Follow up FP Collection will be on Time',
                'Follow up FP / Cust Booking was Collected',
                'Follow up FP Delivery will be on Time',
                'Follow up FP / Cust Delivery Occurred',
                'Follow up Futile Email to Customer',
                'Close futile booking 5 days after 2nd email',
                'Follow up query to Freight Provider',
                'Follow up FP for Quote',
                'Follow up FP for Credit',
                'Awaiting Invoice to Process to FP File',
                'Confirm FP has not invoiced this booking',
                'Other',
            ],
            clientname: null,
            isBookingSelected: false,
            warehouses: [],
            isShowSwitchClientModal: false,
            dmeClients: [],
            statusHistories: [],
            clientPK: null,
            typed: null,
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
            availableCreators: [],
            isShowStatusLockModal: false,
            isShowProjectDataSlider: false,
            isShowStatusDetailInput: false,
            isShowStatusActionInput: false,
            isShowStatusNoteModal: false,
            isShowDeleteCommConfirmModal: false,
            isShowDeleteFileConfirmModal: false,
            isShowEmailLogSlider: false,
            bookingId: null,
            apiBCLs: [],
            allFPs: [],
            emailLogs: [],
            createdForInfos: [],
            currentNoteModalField: null,
            pricingInfos: [],
            isShowFPPricingSlider: false,
            isAutoAugmented: false,
            selectedFileOption: null,
            uploadOption: null,
            xReadyStatus: null,
            zoho_tickets: []
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
        this.handleOnSelectLineRow = this.handleOnSelectLineRow.bind(this);
        this.toggleDuplicateBookingOptionsModal = this.toggleDuplicateBookingOptionsModal.bind(this);
        this.toggleCreateCommModal = this.toggleCreateCommModal.bind(this);
        this.toggleUpdateCommModal = this.toggleUpdateCommModal.bind(this);
        this.toggleNoteSlider = this.toggleNoteSlider.bind(this);
        this.toggleSwitchClientModal = this.toggleSwitchClientModal.bind(this);
        this.toggleLineSlider = this.toggleLineSlider.bind(this);
        this.toggleLineTrackingSlider = this.toggleLineTrackingSlider.bind(this);
        this.toggleStatusHistorySlider = this.toggleStatusHistorySlider.bind(this);
        this.toggleDateSlider = this.toggleDateSlider.bind(this);
        this.toggleStatusLockModal = this.toggleStatusLockModal.bind(this);
        this.toggleStatusNoteModal = this.toggleStatusNoteModal.bind(this);
        this.toggleDeleteCommConfirmModal = this.toggleDeleteCommConfirmModal.bind(this);
        this.toggleDeleteFileConfirmModal = this.toggleDeleteFileConfirmModal.bind(this);
        this.toggleUpdateCreatedForEmailConfirmModal = this.toggleUpdateCreatedForEmailConfirmModal.bind(this);
        this.toggleFPPricingSlider = this.toggleFPPricingSlider.bind(this);
        this.toggleEmailLogSlider = this.toggleEmailLogSlider.bind(this);
    }

    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        saveBooking: PropTypes.func.isRequired,
        manualBook: PropTypes.func.isRequired,
        tickManualBook: PropTypes.func.isRequired,
        duplicateBooking: PropTypes.func.isRequired,
        autoAugmentBooking: PropTypes.func.isRequired,
        revertAugmentBooking: PropTypes.func.isRequired,
        checkAugmentedBooking: PropTypes.func.isRequired,
        augmentPuDate: PropTypes.func.isRequired,
        createBookingLine: PropTypes.func.isRequired,
        duplicateBookingLine: PropTypes.func.isRequired,
        deleteBookingLine: PropTypes.func.isRequired,
        updateBookingLine: PropTypes.func.isRequired,
        createBookingLineDetail: PropTypes.func.isRequired,
        duplicateBookingLineDetail: PropTypes.func.isRequired,
        deleteBookingLineDetail: PropTypes.func.isRequired,
        updateBookingLineDetail: PropTypes.func.isRequired,
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
        getPricingInfos: PropTypes.func.isRequired,
        updateBooking: PropTypes.func.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
        getAttachmentHistory: PropTypes.func.isRequired,
        createComm: PropTypes.func.isRequired,
        getComms: PropTypes.func.isRequired,
        updateComm: PropTypes.func.isRequired,
        deleteComm: PropTypes.func.isRequired,
        getNotes: PropTypes.func.isRequired,
        createNote: PropTypes.func.isRequired,
        updateNote: PropTypes.func.isRequired,
        deleteNote: PropTypes.func.isRequired,
        getWarehouses: PropTypes.func.isRequired,
        getDMEClients: PropTypes.func.isRequired,
        setClientPK: PropTypes.func.isRequired,
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
        getAvailableCreators: PropTypes.func.isRequired,
        calcCollected: PropTypes.func.isRequired,
        getApiBCLs: PropTypes.func.isRequired,
        setFetchGeoInfoFlag: PropTypes.bool.isRequired,
        clearErrorMessage: PropTypes.bool.isRequired,
        isAutoAugmented: PropTypes.bool.isRequired,
        getAllFPs: PropTypes.func.isRequired,
        sendEmail: PropTypes.func.isRequired,
        getEmailLogs: PropTypes.func.isRequired,
        saveStatusHistoryPuInfo: PropTypes.func.isRequired,
        getCreatedForInfos: PropTypes.func.isRequired,
        updateClientEmployee: PropTypes.func.isRequired,
        getZohoTickets: PropTypes.func.isRequired,
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

        if (bookingId != null) {
            this.props.getBooking(bookingId, 'id');
            this.props.getZohoTickets(bookingId);
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
            that.props.getAvailableCreators();

        }, 3000);

        Modal.setAppElement(this.el);
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const {attachments, puSuburbs, puPostalCodes, puStates, deToSuburbs, deToPostalCodes, deToStates, redirect, booking ,bookingLines, bookingLineDetails, bBooking, nextBookingId, prevBookingId, needUpdateBookingLines, needUpdateBookingLineDetails, comms, needUpdateComms, notes, needUpdateNotes, clientname, clientId, warehouses, dmeClients, clientPK, noBooking, packageTypes, statusHistories, allBookingStatus, needUpdateStatusHistories, statusDetails, statusActions, needUpdateStatusActions, needUpdateStatusDetails, username, availableCreators, apiBCLs, needToFetchGeoInfo, bookingErrorMessage, allFPs, qtyTotal, cntComms, cntAttachments, isTickedManualBook, needUpdateBooking, pricingInfos, isAutoAugmented, emailLogs, createdForInfos, zoho_tickets, loadingZohoTickets} = newProps;
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
            let commFormInputs = this.state.commFormInputs;
            commFormInputs['assigned_to'] = username;
            this.setState({username, commFormInputs});
        }

        if (allFPs) {
            this.setState({ allFPs });
        }

        if (availableCreators) {
            this.setState({availableCreators});
        }

        if (clientPK) {
            const formInputs = this.state.formInputs;
            formInputs['b_client_name'] = this.state.dmeClients[parseInt(clientPK)].company_name;
            this.setState({clientPK, formInputs});
        }

        if (dmeClients) {
            this.setState({dmeClients});
        }

        if (clientId) {
            this.setState({clientId});
        }

        if (comms) {
            let newComms = _.clone(comms);
            newComms = _.map(newComms, (comm, index) => {
                comm['index'] = index + 1;
                return comm;
            });
            this.setState({comms: newComms, cntComms, loadingComm: false});
        }

        if ( zoho_tickets ) {
            this.setState({zoho_tickets});
        }

        if (this.state.loadingZohoTickets != loadingZohoTickets) {
            this.setState({loadingZohoTickets});
        }
        
        if (notes) {
            this.setState({notes});
        }

        if (needUpdateComms && booking) {
            this.setState({loadingComm: true});
            this.props.getComms(booking.id);
        }

        if (needUpdateNotes) {
            this.props.getNotes(this.state.selectedCommId);
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

        if (warehouses) {
            this.setState({warehouses});
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

        if (emailLogs) {
            this.setState({emailLogs});
        }

        if (qtyTotal && qtyTotal > 0) {
            this.setState({ qtyTotal, cntAttachments });
        }

        if (isTickedManualBook === false) {
            let currentBooking = this.state.booking;
            let formInputs = this.state.formInputs;
            currentBooking.x_manual_booked_flag = !formInputs['x_manual_booked_flag'];
            formInputs['x_manual_booked_flag'] = !formInputs['x_manual_booked_flag'];
            this.setState({booking: currentBooking, formInputs, loadingBookingUpdate: false});
        }

        if (bookingLines) {
            const calcedbookingLines = this.calcBookingLine(this.state.booking, bookingLines);
            this.setState({bookingLines: calcedbookingLines});
            let bookingLinesListProduct = [];
            bookingLinesListProduct = calcedbookingLines.map((bookingLine) => {
                let result = {};
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
                result['total_2_cubic_mass_factor_calc'] = bookingLine.total_2_cubic_mass_factor_calc ? bookingLine.total_2_cubic_mass_factor_calc.toFixed(2) : 0;
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

                // Calc
                result['e_qty_adjusted_delivered'] = result['e_qty_delivered'] - result['e_qty_damaged'] - result['e_qty_returned'] - result['e_qty_shortages'];

                return result;
            });
            this.setState({products: bookingLinesListProduct, bookingLinesListProduct, loadingBookingLine: false});
        }

        if (bookingLineDetails) {
            const tempBookings = bookingLineDetails;
            let bookingLineDetailsProduct = [];
            bookingLineDetailsProduct = tempBookings.map((bookingLineDetail) => {
                let result = {};
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

        if (needUpdateBookingLines && booking) {
            this.setState({loadingBookingLine: true});
            this.props.getBookingLines(booking.pk_booking_id);
        }

        if (needUpdateBookingLineDetails && booking) {
            this.props.getBookingLineDetails(booking.pk_booking_id);
            this.setState({loadingBookingLineDetail: true});
        }

        if (needUpdateStatusHistories && booking && booking.pk_booking_id) {
            this.props.getBookingStatusHistory(booking.pk_booking_id);
        }

        if (bBooking) {
            if (bBooking === false) {
                alert('There is no such booking with that DME`/CON` number.');
                // console.log('@booking Data' + bBooking);
                this.setState({bBooking: null});
            }
        }

        if (noBooking) {
            this.setState({loading: false, curViewMode: 1});
            this.showCreateView();
        }


        if (!_.isEmpty(bookingErrorMessage)) {
            this.notify(bookingErrorMessage);
            this.props.clearErrorMessage();
            this.setState({loading: false, loadingBookingSave: false, loadingBookingUpdate: false});

            if (this.state.booking
                && this.state.booking.vx_freight_provider
                && !_.isUndefined(this.state.booking.vx_freight_provider)
                && this.state.booking.vx_freight_provider.toLowerCase() !== 'hunter'
                && this.state.booking.vx_freight_provider.toLowerCase() !== 'capital'
                && this.state.booking.vx_freight_provider.toLowerCase() !== 'dhl')
            {
                if (bookingErrorMessage.indexOf('Successfully booked') !== -1 ||
                    bookingErrorMessage.indexOf('Successfully edit book') !== -1
                ) {
                    this.notify('Now trying to get Label!');
                    const currentBooking = this.state.booking;
                    const res = isValid4Label(currentBooking);

                    if (currentBooking.vx_freight_provider === 'TNT' && res !== 'valid'
                    ) {
                        this.notify(res);
                    } else {
                        this.props.fpLabel(currentBooking.id, currentBooking.vx_freight_provider);
                    }
                }
            }

            if (needUpdateBooking && booking) {
                this.props.getBooking(booking.id, 'id');
                var that = this;
                setTimeout(() => {
                    that.setState({loading: true, curViewMode: 0});
                }, 50);
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
                    if (bHas == false)
                        states.push({'value':booking.pu_Address_State, 'label': booking.pu_Address_State});
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
                    if (bHas == false)
                        postalcodes.push({'value':booking.pu_Address_PostalCode, 'label': booking.pu_Address_PostalCode});
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
                        if (bHas == false)
                            suburbs.push({'value':booking.pu_Address_Suburb, 'label': booking.pu_Address_Suburb});
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
                    if (bHas == false)
                        states.push({'value': booking.de_To_Address_State, 'label': booking.de_To_Address_State});
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
                    if (bHas == false)
                        postalcode.push({'value':booking.de_To_Address_PostalCode, 'label': booking.de_To_Address_PostalCode});
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
                        if (bHas == false)
                            suburbs.push({'value':booking.de_To_Address_Suburb, 'label': booking.de_To_Address_Suburb});
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

                if (!_.isNull(booking.b_dateBookedDate) &&
                    !_.isUndefined(booking.b_dateBookedDate) &&
                    !_.isEmpty(booking.b_dateBookedDate)) 
                {
                    this.setState({isBookedBooking: true});
                } else {
                    this.setState({isBookedBooking: false});
                }

                if (
                    (this.state.loading || this.state.loadingBookingSave || this.state.loadingBookingUpdate) 
                    && booking.pk_booking_id
                ) {
                    this.props.getZohoTickets(booking.id);
                    this.setState({loading: false, loadingBookingSave: false, loadingBookingUpdate: false}, () => this.afterSetState(0, booking));
                }

                let formInputs = this.state.formInputs;
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
                if (booking.dme_status_history_notes != null) formInputs['dme_status_history_notes'] = booking.dme_status_history_notes;
                else formInputs['dme_status_history_notes'] = '';
                if (booking.dme_status_detail != null) formInputs['dme_status_detail'] = booking.dme_status_detail;
                else formInputs['dme_status_detail'] = '';
                if (booking.dme_status_action != null) formInputs['dme_status_action'] = booking.dme_status_action;
                else formInputs['dme_status_action'] = '';
                if (booking.dme_status_linked_reference_from_fp != null) formInputs['dme_status_linked_reference_from_fp'] = booking.dme_status_linked_reference_from_fp;
                else formInputs['dme_status_linked_reference_from_fp'] = '';

                if (booking.puPickUpAvailFrom_Date) formInputs['puPickUpAvailFrom_Date'] = booking.puPickUpAvailFrom_Date;
                else formInputs['puPickUpAvailFrom_Date'] = null;
                if (!_.isNull(booking.pu_PickUp_Avail_Time_Hours)) formInputs['pu_PickUp_Avail_Time_Hours'] = booking.pu_PickUp_Avail_Time_Hours;
                else formInputs['pu_PickUp_Avail_Time_Hours'] = '';
                if (!_.isNull(booking.pu_PickUp_Avail_Time_Minutes)) formInputs['pu_PickUp_Avail_Time_Minutes'] = (booking.pu_PickUp_Avail_Time_Minutes);
                else formInputs['pu_PickUp_Avail_Time_Minutes'] = '';
                if (booking.pu_PickUp_By_Date) formInputs['pu_PickUp_By_Date'] = booking.pu_PickUp_By_Date;
                else formInputs['pu_PickUp_By_Date'] = null;
                if (!_.isNull(booking.pu_PickUp_By_Time_Hours)) formInputs['pu_PickUp_By_Time_Hours'] = (booking.pu_PickUp_By_Time_Hours);
                else formInputs['pu_PickUp_By_Time_Hours'] = '';
                if (!_.isNull(booking.pu_PickUp_By_Time_Minutes)) formInputs['pu_PickUp_By_Time_Minutes'] = (booking.pu_PickUp_By_Time_Minutes);
                else formInputs['pu_PickUp_By_Time_Minutes'] = '';

                if (booking.de_Deliver_From_Date) formInputs['de_Deliver_From_Date'] = booking.de_Deliver_From_Date;
                else formInputs['de_Deliver_From_Date'] = null;
                if (!_.isNull(booking.de_Deliver_From_Hours)) formInputs['de_Deliver_From_Hours'] = (booking.de_Deliver_From_Hours);
                else formInputs['de_Deliver_From_Hours'] = '';
                if (!_.isNull(booking.de_Deliver_From_Minutes)) formInputs['de_Deliver_From_Minutes'] = (booking.de_Deliver_From_Minutes);
                else formInputs['de_Deliver_From_Minutes'] = '';
                if (booking.de_Deliver_By_Date) formInputs['de_Deliver_By_Date'] = booking.de_Deliver_By_Date;
                else formInputs['de_Deliver_By_Date'] = null;
                if (!_.isNull(booking.de_Deliver_By_Hours)) formInputs['de_Deliver_By_Hours'] = (booking.de_Deliver_By_Hours);
                else formInputs['de_Deliver_By_Hours'] = '';
                if (!_.isNull(booking.de_Deliver_By_Minutes)) formInputs['de_Deliver_By_Minutes'] = (booking.de_Deliver_By_Minutes);
                else formInputs['de_Deliver_By_Minutes'] = '';
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
                if (booking.inv_cost_quoted && !_.isNaN(parseFloat(booking.inv_cost_quoted))) formInputs['inv_cost_quoted'] = parseFloat(booking.inv_cost_quoted).toFixed(2);
                else formInputs['inv_cost_quoted'] = null;
                if (booking.inv_cost_actual && !_.isNaN(parseFloat(booking.inv_cost_actual))) formInputs['inv_cost_actual'] = parseFloat(booking.inv_cost_actual).toFixed(2);
                else formInputs['inv_cost_actual'] = null;
                if (booking.inv_sell_quoted && !_.isNaN(parseFloat(booking.inv_sell_quoted))) formInputs['inv_sell_quoted'] = parseFloat(booking.inv_sell_quoted).toFixed(2);
                else formInputs['inv_sell_quoted'] = null;
                if (booking.inv_sell_actual && !_.isNaN(parseFloat(booking.inv_sell_actual))) formInputs['inv_sell_actual'] = parseFloat(booking.inv_sell_actual).toFixed(2);
                else formInputs['inv_sell_actual'] = null;
                if (!_.isNull(booking.vx_futile_Booking_Notes) && !_.isNull(booking.vx_futile_Booking_Notes)) formInputs['vx_futile_Booking_Notes'] = booking.vx_futile_Booking_Notes;
                else formInputs['vx_futile_Booking_Notes'] = null;
                if (!_.isNull(booking.b_handling_Instructions) && !_.isNull(booking.b_handling_Instructions)) formInputs['b_handling_Instructions'] = booking.b_handling_Instructions;
                else formInputs['b_handling_Instructions'] = null;
                formInputs['x_manual_booked_flag'] = booking.x_manual_booked_flag;
                

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

                this.setState({ booking, AdditionalServices, formInputs, nextBookingId, prevBookingId, isBookingSelected: true });
            } else {
                this.setState({ formInputs: {}, loading: false });
                if (!_.isNull(this.state.typed))
                    alert('There is no such booking with that DME/CON number.');
            }
        }

        if (pricingInfos) {
            if (this.state.pricingInfos.length != pricingInfos.length) {
                this.props.getBooking(this.state.booking.id, 'id');
                this.setState({loading: true, curViewMode: 0});
            }
            this.setState({pricingInfos, loadingPricingInfos: false});
        }

        if (attachments) {
            const tempAttachments = attachments;
            const bookingLineDetailsProduct = tempAttachments.map((attach) => {
                let result = [];
                result.no = attach.pk_id_attachment;
                result.description = attach.fk_id_dme_booking;
                result.filename = attach.fileName;
                result.uploadfile = attach.linkurl;
                result.dateupdated = attach.upload_Date;
                return result;
            });

            this.setState({attachmentsHistory: bookingLineDetailsProduct});
        }

        if (isAutoAugmented != this.props.isAutoAugmented) {
            this.setState({isAutoAugmented});
        }
    }

    afterSetState(type, data) {
        if (type === 0) {
            this.props.checkAugmentedBooking(data.id);
            this.props.getBookingLines(data.pk_booking_id);
            this.props.getBookingLineDetails(data.pk_booking_id);
            this.props.getComms(data.id);
            this.props.getBookingStatusHistory(data.pk_booking_id);
            this.props.getApiBCLs(data.id);
            this.props.setFetchGeoInfoFlag(true);
            this.props.getAttachmentHistory(data.pk_booking_id);
            this.props.getEmailLogs(data.id);
        } else if (type === 1) {
            this.props.setFetchGeoInfoFlag(true);
        }
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

    onHandleInput(e) {
        const {isBookedBooking, clientname, formInputs, booking} = this.state;

        if (clientname === 'dme' ||
            isBookedBooking === false || 
            (clientname.lower() === 'biopak' && !booking.manifest_timestamp))
        {
            if (event.target.name === 'dme_status_detail' && event.target.value === 'other') {
                this.setState({isShowStatusDetailInput: true});
            } else if (event.target.name === 'dme_status_detail' && event.target.value !== 'other') {
                this.setState({isShowStatusDetailInput: false});
            } else if (event.target.name === 'dme_status_action' && event.target.value === 'other') {
                this.setState({isShowStatusActionInput: true});
            } else if (event.target.name === 'dme_status_action' && event.target.value === 'other') {
                this.setState({isShowStatusDetailInput: false});
            }

            let canUpdateField = true;
            if (!_.isEmpty(event.target.value)) {
                if (event.target.name === 'pu_PickUp_Avail_Time_Hours' ||
                    event.target.name === 'pu_PickUp_By_Time_Hours' ||
                    event.target.name === 'de_Deliver_From_Hours' ||
                    event.target.name === 'de_Deliver_By_Hours') {
                    if (_.isNaN(parseInt(event.target.value))) {
                        alert('Please input correct hour!');
                        canUpdateField = false;
                    } else if (parseInt(event.target.value) > 23) {
                        alert('Please input correct hour!');
                        canUpdateField = false;
                    }
                }

                if (event.target.name === 'pu_PickUp_Avail_Time_Minutes' ||
                    event.target.name === 'pu_PickUp_By_Time_Minutes' ||
                    event.target.name === 'de_Deliver_From_Minutes' ||
                    event.target.name === 'de_Deliver_By_Minutes'
                ) {
                    if (_.isNaN(parseInt(event.target.value))) {
                        alert('Please input correct minutes!');
                        canUpdateField = false;
                    } else if (parseInt(event.target.value) > 59) {
                        alert('Please input correct minutes!');
                        canUpdateField = false;
                    }
                }
            }

            if (canUpdateField) {
                if (e.target.name === 'inv_sell_quoted' ||
                    e.target.name === 'inv_cost_quoted' ||
                    e.target.name === 'inv_sell_actual' ||
                    e.target.name === 'inv_cost_actual'
                ) {
                    let value = e.target.value.replace(',', '').replace('$', '');

                    if (value == '' || value == null) {
                        formInputs[e.target.name] = null;
                        booking[e.target.name] = null;
                    // } else if (value && _.isNaN(parseFloat(value))) {
                        // this.notify('Please input float number!');
                    } else {
                        let value = e.target.value.replace(',', '').replace('$', '');
                        formInputs[e.target.name] = value;
                        booking[e.target.name] = value;
                    }
                } else {
                    formInputs[e.target.name] = e.target.value;
                    booking[e.target.name] = e.target.value;
                }

                this.setState({ formInputs, booking, isBookingModified: true });
            }
        }
    }

    onHandleInputBlur(e) {
        let {formInputs, booking} = this.state;

        if (e.target.name === 'inv_sell_quoted' ||
            e.target.name === 'inv_cost_quoted' ||
            e.target.name === 'inv_sell_actual' ||
            e.target.name === 'inv_cost_actual'
        ) {
            let value = e.target.value.replace(',', '').replace('$', '');

            if (value == '' || value == null) {
                formInputs[e.target.name] = null;
                booking[e.target.name] = null;
            // } else if (value && _.isNaN(parseFloat(value))) {
                // this.notify('Please input float number!');
            } else {
                formInputs[e.target.name] = parseFloat(value).toFixed(2);
                booking[e.target.name] = parseFloat(value).toFixed(2);
            }
        }

        this.setState({ formInputs, booking });
    }

    onClickViewFile(fileOption) {
        const {booking} = this.state;

        if (fileOption === 'label') {
            if (booking.z_label_url && booking.z_label_url.length > 0) {
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
            } else {
                alert('This booking has no label');
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
                alert('This booking has no POD or POD_SOG');
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
                data: { ids: selectedBookingIds, downloadOption: fileOption},
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
                data: { ids: selectedBookingIds, downloadOption: fileOption},
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
        const {booking, selectedFileOption} = this.state;

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
        } else if (type === 'delete-comm') {
            this.props.deleteComm(this.state.selectedCommId);
            this.toggleDeleteCommConfirmModal();
        } else if (type === 'booking_Created_For') {
            const selectedCreatedFor = this.state.createdForInfos.filter(item => {
                const name_last = item.name_last ? item.name_last : '';
                const name_first = item.name_first ? item.name_first : '';

                if (`${name_first} ${name_last}` === this.state.booking.booking_Created_For) {
                    return true;
                }
            });

            if (selectedCreatedFor.length > 0 && this.state.booking.booking_Created_For_Email) {
                const newEmployeeObj = {
                    'pk_id_client_emp': selectedCreatedFor[0]['id'],
                    'email': this.state.booking.booking_Created_For_Email
                };
                this.props.updateClientEmployee(newEmployeeObj);

                setTimeout(() => {
                    this.props.getCreatedForInfos();
                }, 2000);
            }

            this.toggleUpdateCreatedForEmailConfirmModal();
        }
    }

    onClickPrev(e){
        e.preventDefault();
        const {prevBookingId, isBookingModified} = this.state;

        if (isBookingModified) {
            alert('You can lose modified booking info. Please update it');
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
            alert('You can lose modified booking info. Please update it');
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
            alert('You can lose modified booking info. Please update it');
        } else {
            this.props.getBooking(booking.id, 'id');
            this.setState({loading: true, curViewMode: 0});
        }
    }

    calcBookingLine(booking, bookingLines) {
        let qty = 0;
        let total_qty_collected = 0;
        let total_qty_scanned = 0;
        let b_fp_qty_delivered = 0;
        let total_kgs = 0;
        let cubic_meter = 0;

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
                    bookingLine['total_kgs'] = bookingLine.e_qty * bookingLine.e_weightPerEach * 1000;
                else
                    bookingLine['total_kgs'] = bookingLine.e_qty * bookingLine.e_weightPerEach;
            } else {
                bookingLine['total_kgs'] = 0;
            }

            if (bookingLine.e_dimUOM) {
                if (bookingLine.e_dimUOM.toUpperCase() === 'CM' ||
                    bookingLine.e_dimUOM.toUpperCase() === 'CENTIMETER')
                    bookingLine['cubic_meter'] = bookingLine.e_qty * bookingLine.e_dimLength * bookingLine.e_dimWidth * bookingLine.e_dimHeight / 1000000;
                else if (bookingLine.e_dimUOM.toUpperCase() === 'METER' ||
                    bookingLine.e_dimUOM.toUpperCase() === 'M')
                    bookingLine['cubic_meter'] = bookingLine.e_qty * bookingLine.e_dimLength * bookingLine.e_dimWidth * bookingLine.e_dimHeight;
                else if (bookingLine.e_dimUOM.toUpperCase() === 'MILIMETER' ||
                    bookingLine.e_dimUOM.toUpperCase() === 'MM')
                    bookingLine['cubic_meter'] = bookingLine.e_qty * bookingLine.e_dimLength * bookingLine.e_dimWidth * bookingLine.e_dimHeight / 1000000000;
                else
                    bookingLine['cubic_meter'] = bookingLine.e_qty * bookingLine.e_dimLength * bookingLine.e_dimWidth * bookingLine.e_dimHeight;
            } else {
                bookingLine['cubic_meter'] = 0;
            }

            qty += bookingLine.e_qty;
            total_kgs += bookingLine['total_kgs'];
            cubic_meter += bookingLine['cubic_meter'];
            total_qty_collected += bookingLine['e_qty_collected'];
            total_qty_scanned += bookingLine['e_qty_scanned_fp'];
            return bookingLine;
        });

        if (booking) {
            b_fp_qty_delivered = booking.b_fp_qty_delivered;
        }

        this.setState({
            bookingTotals: [{
                id: 0,
                qty,
                total_qty_collected,
                total_qty_scanned,
                b_fp_qty_delivered: b_fp_qty_delivered,
                total_kgs: total_kgs.toFixed(2),
                cubic_meter: cubic_meter.toFixed(2)
            }]
        });

        return newBookingLines;
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
        const {booking, isBookedBooking, formInputs} = this.state;

        if (isBookedBooking) {
            const result = isValid4Label(formInputs);
            if (result === 'valid') {
                this.props.fpLabel(booking.id, booking.vx_freight_provider);
            } else {
                this.notify(result);
            }
        } else {
            this.notify('This booking is not Booked!');
        }
    }

    buildPDF(bookingIds, vx_freight_provider) {
        const options = {
            method: 'post',
            url: HTTP_PROTOCOL + '://' + API_HOST + '/generate-pdf/',
            data: {bookingIds, vx_freight_provider},
        };

        axios(options)
            .then((response) => {
                if (response.data.success && response.data.success === 'success') {
                    this.notify('PDF(Label)’s have been generated successfully.');
                } else {
                    this.notify('PDF(Label)’s have *not been generated.');
                }
            })
            .catch((err) => {
                this.notify('Error: ' + err);
            });
    }

    onClickReprintLabel() {
        const {booking, isBookedBooking} = this.state;

        if (isBookedBooking) {
            this.props.fpReprint(booking.id, booking.vx_freight_provider);
        }
    }

    onClickAutoAugment() {
        const {booking, isAutoAugmented} = this.state;

        if(!isAutoAugmented) {
            this.setState({loadingBookingUpdate: true, curViewMode: 2});
            this.props.autoAugmentBooking(booking.id);
        }
    }

    onClickRevertAugment() {
        const {booking, isAutoAugmented} = this.state;

        if(isAutoAugmented) {
            this.setState({loadingBookingUpdate: true, curViewMode: 2});
            this.props.revertAugmentBooking(booking.id);
        }
    }

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

            if (!booking.x_manual_booked_flag) {  // Not manual booking
                if (booking.id && (booking.id !== undefined)) {
                    this.setState({ loading: true, curViewMode: 0});
                    if (booking.vx_freight_provider) {
                        if (booking.vx_freight_provider.toLowerCase() === 'cope') {
                            this.buildCSV([booking.id], booking.vx_freight_provider.toLowerCase());
                        } else if (booking.vx_freight_provider.toLowerCase() === 'allied'
                            || booking.vx_freight_provider.toLowerCase() === 'act') {
                            this.buildXML([booking.id], booking.vx_freight_provider.toLowerCase());
                        } else {
                            this.props.fpBook(booking.id, booking.vx_freight_provider);
                        }
                    } else {
                        this.notify('Can not *Book* since booking has no Freight Provider');
                    }
                } else {
                    alert('Please Find any booking and then click this!');
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
            const options = {
                method: 'post',
                url: HTTP_PROTOCOL + '://' + API_HOST + '/generate-csv/',
                data: {bookingIds, vx_freight_provider},
                responseType: 'blob', // important
            };

            axios(options)
                .then((response) => {
                    console.log('generate-csv response: ', response);
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    buildXML(bookingIds, vx_freight_provider) {
        return new Promise((resolve, reject) => {
            let options = {
                method: 'post',
                url: HTTP_PROTOCOL + '://' + API_HOST + '/generate-xml/',
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
        const typed = e.target.value;

        if (e.key === 'Enter' && !this.state.loading) {
            e.preventDefault();

            if((selected == undefined) || (selected == '')){
                alert('id value is empty');
                return;
            }
            if((typed == undefined) || (typed == '')){
                alert('id value is empty');
                return;
            }
            this.props.getBooking(typed, selected);
            this.setState({loading: true, curViewMode: 0});
        }

        this.setState({typed});
    }

    handleOnSelectLineRow(row, isSelect) {
        if (isSelect) {
            const {bookingLinesListProduct} = this.state;
            var a = bookingLinesListProduct.indexOf(row);
            // console.log('@a value' + a);
            this.setState({deletedBookingLine: a});
        }
    }

    onChangeText(e) {
        this.setState({typed: e.target.value});
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

    handleChangeSelect = (selectedOption, fieldName) => {
        const {formInputs, booking, createdForInfos} = this.state;

        if (fieldName === 'warehouse') {
            formInputs['b_client_warehouse_code'] = selectedOption.value;
            formInputs['b_clientPU_Warehouse'] = this.getSelectedWarehouseInfoFromCode(selectedOption.value, 'name');
            booking['b_client_warehouse_code'] = formInputs['b_client_warehouse_code'];
            booking['b_clientPU_Warehouse'] = formInputs['b_clientPU_Warehouse'];
        } else if (fieldName === 'b_client_name') {
            formInputs['b_client_name'] = selectedOption.value;
            booking['b_client_name'] = formInputs['b_client_name'];
        } else if (fieldName === 'vx_freight_provider') {
            formInputs['vx_freight_provider'] = selectedOption.value;
            booking['vx_freight_provider'] = formInputs['vx_freight_provider'];
        } else if (fieldName === 'inv_billing_status') {
            formInputs['inv_billing_status'] = selectedOption.value;
            booking['inv_billing_status'] = formInputs['inv_billing_status'];
        } else if (fieldName === 'b_booking_Priority') {
            formInputs['b_booking_Priority'] = {'value': selectedOption.value, 'label': selectedOption.value};
            booking['b_booking_Priority'] = selectedOption.value;
        } else if (fieldName === 'b_booking_Category') {
            formInputs['b_booking_Category'] = {'value': selectedOption.value, 'label': selectedOption.value};
            booking['b_booking_Category'] = selectedOption.value;
        } else if (fieldName == 'booking_Created_For') {
            const createdForInfo = createdForInfos.filter(info => info.id === selectedOption.value);
            formInputs['booking_Created_For'] = {'value': selectedOption.value, 'label': selectedOption.label};
            booking['booking_Created_For'] = selectedOption.label;

            if (createdForInfo.length > 0) {
                formInputs['booking_Created_For_Email'] = createdForInfo[0]['email'];
                booking['booking_Created_For_Email'] = createdForInfo[0]['email'];
            }
        }

        this.setState({formInputs, booking, isBookingModified: true});
    }

    getSelectedWarehouseInfoFromCode = (warehouseCode, infoField) => {
        const warehouses = this.state.warehouses;

        for (let i = 0; i < warehouses.length; i++) {
            if (warehouses[i].client_warehouse_code === warehouseCode) {
                if (infoField === 'name') {
                    return warehouses[i].warehousename;
                } else if (infoField === 'id') {
                    return warehouses[i].pk_id_client_warehouses;
                }
            }
        }
    }

    handlePost(e, type) {
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
                alert('Please select a booking.');
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

    onClickDeleteLineOrLineData(typeNum, row) {
        console.log('onDelete: ', typeNum, row);

        if (typeNum === 0) { // Duplicate line
            let deletedBookingLine = { pk_lines_id: row.pk_lines_id };
            this.props.deleteBookingLine(deletedBookingLine);
            this.setState({loadingBookingLine: true});
        } else if (typeNum === 1) { // Duplicate line detail
            let deletedBookingLineDetail = { pk_id_lines_data: row.pk_id_lines_data };
            this.props.deleteBookingLineDetail(deletedBookingLineDetail);
            this.setState({loadingBookingLineDetail: true});
        }
    }

    onUpdateBookingLine(oldValue, newValue, row, column) {
        console.log('onUpdateBookingLine: ', row, oldValue, newValue, column);

        let products = this.state.products;
        let updatedBookingLine = { pk_lines_id: row.pk_lines_id };
        updatedBookingLine[column.dataField] = newValue;
        updatedBookingLine['e_1_Total_dimCubicMeter'] = this.getCubicMeter(row);
        updatedBookingLine['total_2_cubic_mass_factor_calc'] = Number.parseFloat(updatedBookingLine['e_1_Total_dimCubicMeter']).toFixed(4) * 250;
        updatedBookingLine['e_Total_KG_weight'] = this.getTotalWeight(row);

        for (let i = 0; i < products.length; i++) {
            if (products[i].pk_lines_id === row.pk_lines_id) {
                products[i]['e_Total_KG_weight'] = updatedBookingLine['e_Total_KG_weight'].toFixed(2);
                products[i]['e_1_Total_dimCubicMeter'] = updatedBookingLine['e_1_Total_dimCubicMeter'].toFixed(2);
                products[i]['total_2_cubic_mass_factor_calc'] = updatedBookingLine['total_2_cubic_mass_factor_calc'].toFixed(2);
            }
        }
        
        this.props.updateBookingLine(updatedBookingLine);
        this.setState({loadingBookingLine: true, products});
    }

    getCubicMeter(row) {
        if (row['e_dimUOM'].toUpperCase() === 'CM')
            return parseInt(row['e_qty']) * (parseInt(row['e_dimLength']) * parseInt(row['e_dimWidth']) * parseInt(row['e_dimHeight']) / 1000000);
        else if (row['e_dimUOM'].toUpperCase() === 'METER')
            return parseInt(row['e_qty']) * (parseInt(row['e_dimLength']) * parseInt(row['e_dimWidth']) * parseInt(row['e_dimHeight']));
        else
            return parseInt(row['e_qty']) * (parseInt(row['e_dimLength']) * parseInt(row['e_dimWidth']) * parseInt(row['e_dimHeight']) / 1000000000);
    }

    getTotalWeight(row) {
        if (row['e_weightUOM'].toUpperCase() === 'GRAM' || 
            row['e_weightUOM'].toUpperCase() === 'GRAMS')
            return parseInt(row['e_qty']) * parseInt(row['e_weightPerEach']) / 1000;
        else if (row['e_weightUOM'].toUpperCase() === 'KILOGRAM' || 
                 row['e_weightUOM'].toUpperCase() === 'KILOGRAMS' ||
                 row['e_weightUOM'].toUpperCase() === 'KG' ||
                 row['e_weightUOM'].toUpperCase() === 'KGS')
            return parseInt(row['e_qty']) * parseInt(row['e_weightPerEach']);
        else if (row['e_weightUOM'].toUpperCase() === 'TON' ||
                 row['e_weightUOM'].toUpperCase() === 'TONS')
            return parseInt(row['e_qty']) * parseInt(row['e_weightPerEach']) * 1000;
    }

    onUpdateBookingLineDetail(oldValue, newValue, row, column) {
        console.log('onUpdateBookingLineDetail: ', row, oldValue, newValue, column);

        let updatedBookingLineDetail = { pk_id_lines_data: row.pk_id_lines_data };
        updatedBookingLineDetail[column.dataField] = newValue;
        this.props.updateBookingLineDetail(updatedBookingLineDetail);
        this.setState({loadingBookingLineDetail: true});
    }

    toggleDuplicateBookingOptionsModal() {
        this.setState(prevState => ({isShowDuplicateBookingOptionsModal: !prevState.isShowDuplicateBookingOptionsModal}));
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
                alert('Only `DME` role users can use this feature');
            }
        } else {
            this.setState({[name]: value});
        }
    }

    handleCommModalInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        if (target.name === 'dme_action' && target.value === 'Other') {
            this.setState({isShowAdditionalActionTaskInput: true});
        } else if (target.name === 'assigned_to' && target.value === 'edit…') {
            this.setState({isShowAssignedToInput: true});
        }

        let commFormInputs = this.state.commFormInputs;
        commFormInputs[name] = value;
        this.setState({commFormInputs});
    }

    onClickGoToCommPage() {
        this.props.history.push('/comm?bookingid=' + this.state.booking.id);
    }

    onClickCreateComm() {
        this.toggleCreateCommModal();
        this.resetCommForm();
    }

    resetCommForm() {
        this.setState({commFormInputs: {
            assigned_to: this.state.username, 
            priority_of_log: 'Standard',
            dme_notes_type: 'Delivery',
            dme_action: 'No follow up required, noted for info purposes',
            additional_action_task: '',
            notes_type: 'Call',
            dme_notes: '',
            closed: false,
        }});
    }

    toggleCreateCommModal() {
        this.setState(prevState => ({isShowCommModal: !prevState.isShowCommModal, commFormMode: 'create'}));
    }

    onSubmitComm() {
        const {commFormMode, commFormInputs} = this.state;

        if (commFormInputs['dme_action'] === 'Other')
            commFormInputs['dme_action'] = commFormInputs['additional_action_task'];

        if (commFormInputs['assigned_to'] === 'edit…')
            commFormInputs['assigned_to'] = commFormInputs['new_assigned_to'];

        if (_.isUndefined(commFormInputs['due_date_time']) || _.isNull(commFormInputs['due_date_time'])) {
            commFormInputs['due_by_date'] = null;
            commFormInputs['due_by_time'] = null;
        } else {
            commFormInputs['due_by_date'] = moment(commFormInputs['due_date_time']).format('YYYY-MM-DD');
            commFormInputs['due_by_time'] = moment(commFormInputs['due_date_time']).format('HH:mm:ss');
        }

        if (commFormMode === 'create') {
            const {booking} = this.state;            
            let newComm = commFormInputs;

            this.resetCommForm();
            newComm['fk_booking_id'] = booking.pk_booking_id;
            this.props.createComm(newComm);
            this.toggleCreateCommModal();
        } else if (commFormMode === 'update') {
            const {selectedCommId} = this.state;
            this.resetCommForm();
            this.props.updateComm(selectedCommId, commFormInputs);
            this.toggleUpdateCommModal();
        }
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

    toggleUpdateCommModal() {
        this.setState(prevState => ({isShowCommModal: !prevState.isShowCommModal, commFormMode: 'update'}));
    }

    onUpdateBtnClick(type, data) {
        console.log('Click update comm button: ', type);
        
        const {comms, actionTaskOptions} = this.state;
        let comm = {};

        for (let i = 0; i < comms.length; i++) {
            if (comms[i].id === data.id) {
                comm = comms[i];
            }
        }

        const commFormInputs = comm;
        commFormInputs['due_date_time'] = comm.due_by_date ? moment(comm.due_by_date + ' ' + comm.due_by_time, 'YYYY-MM-DD HH:mm:ss').toDate() : null;
        if (_.intersection([comm.assigned_to], ['edit…', 'emadeisky', 'status query', 'nlimbauan']).length === 0) {
            commFormInputs['new_assigned_to'] = comm.assigned_to;
            commFormInputs['assigned_to'] = 'edit…';
            this.setState({isShowAssignedToInput: true});
        }

        if (_.intersection([comm.dme_action], actionTaskOptions).length === 0) {
            commFormInputs['additional_action_task'] = comm.dme_action;
            commFormInputs['dme_action'] = 'Other';
            this.setState({isShowAdditionalActionTaskInput: true});
        }

        this.setState({selectedCommId: comm.id, commFormInputs});
        this.toggleUpdateCommModal();
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

    onClickCommIdCell(id) {
        console.log('Comm ID: ', id);

        this.setState({ isNotePaneOpen: true, selectedCommId: id });
        this.props.getNotes(id);
    }

    onEditorChange(type, from, event) {
        if (type === 'note' && from === 'comm') {
            let commFormInputs = this.state.commFormInputs;
            commFormInputs['dme_notes'] = event.editor.getData();
            this.setState({commFormInputs});
        } else if (type === 'note' && from === 'note') {
            let noteFormInputs = this.state.noteFormInputs;
            noteFormInputs['dme_notes'] = event.editor.getData();
            this.setState({noteFormInputs});
        }
    }

    toggleNoteSlider() {
        this.setState(prevState => ({isNotePaneOpen: !prevState.isNotePaneOpen}));
    }

    toggleSwitchClientModal() {
        this.setState(prevState => ({isShowSwitchClientModal: !prevState.isShowSwitchClientModal}));
    }

    toggleLineSlider() {
        const { isBookingSelected } = this.state;

        if (isBookingSelected) {
            this.setState(prevState => ({isShowLineSlider: !prevState.isShowLineSlider}));
        } else {
            alert('Please select a booking.');
        }
    }

    toggleLineTrackingSlider() {
        this.setState(prevState => ({isShowLineTrackingSlider: !prevState.isShowLineTrackingSlider}));
    }

    toggleStatusLockModal() {
        this.setState(prevState => ({isShowStatusLockModal: !prevState.isShowStatusLockModal}));
    }

    toggleStatusNoteModal(type='dme_status_history_notes') {
        this.setState(prevState => ({isShowStatusNoteModal: !prevState.isShowStatusNoteModal, currentNoteModalField: type}));
    }

    toggleDeleteCommConfirmModal() {
        this.setState(prevState => ({isShowDeleteCommConfirmModal: !prevState.isShowDeleteCommConfirmModal}));
    }

    toggleDeleteFileConfirmModal() {
        this.setState(prevState => ({isShowDeleteFileConfirmModal: !prevState.isShowDeleteFileConfirmModal}));
    }

    toggleUpdateCreatedForEmailConfirmModal() {
        this.setState(prevState => ({isShowUpdateCreatedForEmailConfirmModal: !prevState.isShowUpdateCreatedForEmailConfirmModal}));
    }

    toggleStatusHistorySlider() {
        const { isBookingSelected } = this.state;

        if (isBookingSelected) {
            this.setState(prevState => ({isShowStatusHistorySlider: !prevState.isShowStatusHistorySlider}));
        } else {
            alert('Please select a booking.');
        }
    }

    toggleDateSlider() {
        const { isBookingSelected } = this.state;

        if (isBookingSelected) {
            this.setState(prevState => ({isShowProjectDataSlider: !prevState.isShowProjectDataSlider}));
        } else {
            alert('Please select a booking.');
        }
    }

    toggleFPPricingSlider() {
        this.setState(prevState => ({isShowFPPricingSlider: !prevState.isShowFPPricingSlider}));
    }

    toggleEmailLogSlider() {
        this.setState(prevState => ({isShowEmailLogSlider: !prevState.isShowEmailLogSlider}));
    }

    onClickSwitchClientNavIcon(e) {
        e.preventDefault();
        this.props.getDMEClients();
        this.toggleSwitchClientModal();
    }

    onSwitchClient(clientPK) {
        this.props.setClientPK(clientPK);
        this.toggleSwitchClientModal();
    }

    onClickCancelBook() {
        const {booking} = this.state;

        if (!booking) {
            alert('Please select booking to cancel');
        } else {
            this.props.fpCancelBook(booking.id, booking.vx_freight_provider);
        }
    }

    onClickEditBook() {
        const {booking} = this.state;

        if (!booking) {
            alert('Please select booking to edit');
        } else {
            this.props.fpEditBook(booking.id, booking.vx_freight_provider);
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

    onChangeViewMode(e) {
        const { curViewMode, isBookingModified } = this.state;
        let newViewMode = parseInt(e.target.value);

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
        const {isBookingSelected} = this.state;
        
        if (isBookingSelected) {
            this.setState({
                isBookingSelected: false, 
                products: [], 
                bookingLineDetailsProduct: [],
                bookingTotals: [],
                puState: null,
                puSuburb: null,
                puPostalCode: null,
                deToState: null,
                deToSuburb: null,
                deToPostalCode: null,
                formInputs: {
                    pu_Address_Country: 'AU',
                    de_To_Address_Country: 'AU',
                },
            });
        }
    }

    notify = (text) => {
        toast(text);
    };

    onClickCreateBooking() {
        const {formInputs, clientname, clientId, dmeClients, clientPK, puState, puSuburb, puPostalCode, deToState, deToSuburb, deToPostalCode, isShowStatusDetailInput, isShowStatusActionInput} = this.state;

        if (isShowStatusDetailInput && 
            (_.isNull(formInputs['new_dme_status_detail']) || _.isEmpty(formInputs['new_dme_status_detail']))) {
            alert('Please select or input Status Detail');
        } else if (isShowStatusActionInput && 
            (_.isNull(formInputs['new_dme_status_action']) || _.isEmpty(formInputs['new_dme_status_action']))) {
            alert('Please select or input Status Action');
        } else if (parseInt(this.state.curViewMode) === 1) {
            if (isShowStatusDetailInput) {
                formInputs['dme_status_detail'] = formInputs['new_dme_status_detail'];
                this.props.createStatusDetail(formInputs['dme_status_detail']);
            }

            if (isShowStatusActionInput) {
                formInputs['dme_status_action'] = formInputs['new_dme_status_action'];
                this.props.createStatusAction(formInputs['dme_status_action']);
            }

            if (clientPK === 0 || clientname !== 'dme') {
                formInputs['z_CreatedByAccount'] = clientname;
                // formInputs['b_client_name'] = clientname;
                formInputs['kf_client_id'] = clientId;
                formInputs['fk_client_warehouse'] = this.getSelectedWarehouseInfoFromCode(formInputs['b_client_warehouse_code'], 'id');

                if (!formInputs.hasOwnProperty('b_client_warehouse_code')) {
                    formInputs['b_client_warehouse_code'] = 'No - Warehouse';
                    formInputs['fk_client_warehouse'] = 100;
                }
            } else {
                formInputs['z_CreatedByAccount'] = 'dme';

                let ind = 0;
                for (let i = 0; i < dmeClients.length; i++) {
                    if (parseInt(dmeClients[i].pk_id_dme_client) === parseInt(clientPK)) {
                        ind = i;
                        break;
                    }
                }

                // formInputs['b_client_name'] = dmeClients[ind].company_name;
                formInputs['kf_client_id'] = dmeClients[ind].dme_account_num;
                formInputs['fk_client_warehouse'] = this.getSelectedWarehouseInfoFromCode(formInputs['b_client_warehouse_code'], 'id');
            }

            formInputs['pu_PickUp_Avail_Time_Hours'] = _.isEmpty(formInputs['pu_PickUp_Avail_Time_Hours']) ? null : formInputs['pu_PickUp_Avail_Time_Hours'];
            formInputs['pu_PickUp_By_Time_Hours'] = _.isEmpty(formInputs['pu_PickUp_By_Time_Hours']) ? null : formInputs['pu_PickUp_By_Time_Hours'];
            formInputs['de_Deliver_From_Hours'] = _.isEmpty(formInputs['de_Deliver_From_Hours']) ? null : formInputs['de_Deliver_From_Hours'];
            formInputs['de_Deliver_By_Hours'] = _.isEmpty(formInputs['de_Deliver_By_Hours']) ? null : formInputs['de_Deliver_By_Hours'];

            formInputs['pu_PickUp_Avail_Time_Minutes'] = _.isEmpty(formInputs['pu_PickUp_Avail_Time_Minutes']) ? null : formInputs['pu_PickUp_Avail_Time_Minutes'];
            formInputs['pu_PickUp_By_Time_Minutes'] = _.isEmpty(formInputs['pu_PickUp_By_Time_Minutes']) ? null : formInputs['pu_PickUp_By_Time_Minutes'];
            formInputs['de_Deliver_From_Minutes'] = _.isEmpty(formInputs['de_Deliver_From_Minutes']) ? null : formInputs['de_Deliver_From_Minutes'];
            formInputs['de_Deliver_By_Minutes'] = _.isEmpty(formInputs['de_Deliver_By_Minutes']) ? null : formInputs['de_Deliver_By_Minutes'];

            formInputs['pu_Address_State'] = puState ? puState.label : '';
            formInputs['pu_Address_Suburb'] = puSuburb ? puSuburb.label : '';
            formInputs['pu_Address_PostalCode'] = puPostalCode ? puPostalCode.label : '';
            formInputs['de_To_Address_State'] = deToState ? deToState.label : '';
            formInputs['de_To_Address_Suburb'] = deToSuburb ? deToSuburb.label : '';
            formInputs['de_To_Address_PostalCode'] = deToPostalCode ? deToPostalCode.label : '';

            if (_.isUndefined(formInputs['s_05_Latest_Pick_Up_Date_TimeSet']))
                formInputs['s_05_Latest_Pick_Up_Date_TimeSet'] = null;
            if (_.isUndefined(formInputs['s_06_Latest_Delivery_Date_TimeSet']))
                formInputs['s_06_Latest_Delivery_Date_TimeSet'] = null;
            if (_.isUndefined(formInputs['s_20_Actual_Pickup_TimeStamp']))
                formInputs['s_20_Actual_Pickup_TimeStamp'] = null;
            if (_.isUndefined(formInputs['s_21_Actual_Delivery_TimeStamp']))
                formInputs['s_21_Actual_Delivery_TimeStamp'] = null;

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
        const {clientname, isBookedBooking, booking} = this.state;

        if (isBookedBooking &&
            clientname.toLowerCase() !== 'dme' &&
            clientname.toLowerCase() !== 'biopak')
        {
            this.notify('Booking is already Booked!');
        } else if (clientname.toLowerCase() === 'biopak' &&
            !_.isNull(booking.manifest_timestamp) &&
            !_.isUndefined(booking.manifest_timestamp) &&
            !_.isEmpty(booking.manifest_timestamp))
        {
            this.notify('Booking is already Manifested!');
        }
        else {
            const {isShowStatusDetailInput, isShowStatusActionInput} = this.state;
            let bookingToUpdate = this.state.booking;

            if (isShowStatusDetailInput && 
                (_.isNull(bookingToUpdate.new_dme_status_detail) || _.isEmpty(bookingToUpdate.new_dme_status_detail))) {
                alert('Please select or input Status Detail');
            } else if (isShowStatusActionInput && 
                (_.isNull(bookingToUpdate.new_dme_status_action) || _.isEmpty(bookingToUpdate.new_dme_status_action))) {
                alert('Please select or input Status Action');
            } else if (parseInt(this.state.curViewMode) === 2) {
                if (isShowStatusDetailInput) {
                    bookingToUpdate.dme_status_detail = bookingToUpdate.new_dme_status_detail;
                    this.props.createStatusDetail(bookingToUpdate.new_dme_status_detail);
                }

                if (isShowStatusActionInput) {
                    bookingToUpdate.dme_status_action = bookingToUpdate.new_dme_status_action;
                    this.props.createStatusAction(bookingToUpdate.new_dme_status_action);
                }

                bookingToUpdate.pu_PickUp_Avail_Time_Hours = bookingToUpdate.pu_PickUp_Avail_Time_Hours === '' ? null : bookingToUpdate.pu_PickUp_Avail_Time_Hours;
                bookingToUpdate.pu_PickUp_By_Time_Hours = bookingToUpdate.pu_PickUp_By_Time_Hours === '' ? null : bookingToUpdate.pu_PickUp_By_Time_Hours;
                bookingToUpdate.de_Deliver_From_Hours = bookingToUpdate.de_Deliver_From_Hours === '' ? null : bookingToUpdate.de_Deliver_From_Hours;
                bookingToUpdate.de_Deliver_By_Hours = bookingToUpdate.de_Deliver_By_Hours === '' ? null : bookingToUpdate.de_Deliver_By_Hours;

                bookingToUpdate.pu_PickUp_Avail_Time_Minutes = bookingToUpdate.pu_PickUp_Avail_Time_Minutes === '' ? null : bookingToUpdate.pu_PickUp_Avail_Time_Minutes;
                bookingToUpdate.pu_PickUp_By_Time_Minutes = bookingToUpdate.pu_PickUp_By_Time_Minutes === '' ? null : bookingToUpdate.pu_PickUp_By_Time_Minutes;
                bookingToUpdate.de_Deliver_From_Minutes = bookingToUpdate.de_Deliver_From_Minutes === '' ? null : bookingToUpdate.de_Deliver_From_Minutes;
                bookingToUpdate.de_Deliver_By_Minutes = bookingToUpdate.de_Deliver_By_Minutes === '' ? null : bookingToUpdate.de_Deliver_By_Minutes;

                bookingToUpdate.pu_Address_State = this.state.puState.label;
                bookingToUpdate.pu_Address_PostalCode = this.state.puPostalCode.label;
                bookingToUpdate.pu_Address_Suburb = this.state.puSuburb.label;
                bookingToUpdate.de_To_Address_State = this.state.deToState.label;
                bookingToUpdate.de_To_Address_PostalCode = this.state.deToPostalCode.label;
                bookingToUpdate.de_To_Address_Suburb = this.state.deToSuburb.label;

                if (_.isUndefined(bookingToUpdate['s_05_Latest_Pick_Up_Date_TimeSet']))
                    bookingToUpdate['s_05_Latest_Pick_Up_Date_TimeSet'] = null;
                if (_.isUndefined(bookingToUpdate['s_06_Latest_Delivery_Date_TimeSet']))
                    bookingToUpdate['s_06_Latest_Delivery_Date_TimeSet'] = null;
                if (_.isUndefined(bookingToUpdate['s_20_Actual_Pickup_TimeStamp']))
                    bookingToUpdate['s_20_Actual_Pickup_TimeStamp'] = null;
                if (_.isUndefined(bookingToUpdate['s_21_Actual_Delivery_TimeStamp']))
                    bookingToUpdate['s_21_Actual_Delivery_TimeStamp'] = null;

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

    onClickOpenSlide(e) {
        e.preventDefault();
        this.toggleStatusHistorySlider();
    }

    onClickOpenDateSlide(e) {
        e.preventDefault();
        this.toggleDateSlider();
    }

    OnCreateStatusHistory(statusHistory) {
        let newBooking = this.state.booking;

        statusHistory['dme_status_detail'] = newBooking.dme_status_detail;
        statusHistory['dme_status_action'] = newBooking.dme_status_action;
        statusHistory['dme_status_linked_reference_from_fp'] = newBooking.dme_status_linked_reference_from_fp;
        this.props.createStatusHistory(statusHistory);

        if (statusHistory['status_last'] === 'In Transit' && statusHistory['event_time_stamp']) {
            newBooking.z_calculated_ETA = moment(statusHistory['event_time_stamp'])
                .add(newBooking.delivery_kpi_days, 'd')
                .format('YYYY-MM-DD');
            newBooking.b_given_to_transport_date_time = statusHistory['event_time_stamp'];
        } else if (statusHistory['status_last'] === 'In Transit' && !statusHistory['event_time_stamp']) {
            if (!newBooking.b_given_to_transport_date_time) {
                newBooking.b_given_to_transport_date_time = moment().format('YYYY-MM-DD HH:mm:ss');
                newBooking.z_calculated_ETA = moment()
                    .add(newBooking.delivery_kpi_days, 'd')
                    .format('YYYY-MM-DD');
            } else {
                newBooking.z_calculated_ETA = moment(newBooking.b_given_to_transport_date_time)
                    .add(newBooking.delivery_kpi_days, 'd')
                    .format('YYYY-MM-DD');
            }
        }

        newBooking.b_status = statusHistory['status_last'];
        this.props.updateBooking(this.state.booking.id, newBooking);
        this.setState({loadingBookingUpdate: true, curViewMode: 2, isBookingModified: false});
    }

    OnUpdateStatusHistory(statusHistory, needToUpdateBooking) {
        let newBooking = this.state.booking;

        // statusHistory['dme_status_detail'] = newBooking.dme_status_detail;
        // statusHistory['dme_status_action'] = newBooking.dme_status_action;
        // statusHistory['dme_status_linked_reference_from_fp'] = newBooking.dme_status_linked_reference_from_fp;
        this.props.updateStatusHistory(statusHistory);

        if (needToUpdateBooking) {
            if (statusHistory['status_last'] === 'In Transit' && statusHistory['event_time_stamp']) {
                newBooking.z_calculated_ETA = moment(statusHistory['event_time_stamp'])
                    .add(newBooking.delivery_kpi_days, 'd')
                    .format('YYYY-MM-DD');
                newBooking.b_given_to_transport_date_time = statusHistory['event_time_stamp'];
            } else if (statusHistory['status_last'] === 'In Transit' && !statusHistory['event_time_stamp']) {
                if (!newBooking.b_given_to_transport_date_time) {
                    newBooking.b_given_to_transport_date_time = moment().format('YYYY-MM-DD HH:mm:ss');
                    newBooking.z_calculated_ETA = moment()
                        .add(newBooking.delivery_kpi_days, 'd')
                        .format('YYYY-MM-DD');
                } else {
                    newBooking.z_calculated_ETA = moment(newBooking.b_given_to_transport_date_time)
                        .add(newBooking.delivery_kpi_days, 'd')
                        .format('YYYY-MM-DD');
                }
            }

            newBooking.b_status = statusHistory['status_last'];
            this.props.updateBooking(this.state.booking.id, newBooking);
            this.setState({loadingBookingUpdate: true, curViewMode: 2, isBookingModified: false});
        }
    }

    onClickComms(e) {
        e.preventDefault();

        if (this.state.isBookingSelected) {
            window.location.assign('/comm?bookingid=' + this.state.booking.id);
        } else {
            window.location.assign('/comm');
        }
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
            alert('Locked status only allowed by dme user');
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
    }

    onClickBottomTap(e, activeTabInd) {
        e.preventDefault();
        this.setState({activeTabInd});
    }

    onUpdateStatusNote(note) {
        let newBooking = this.state.booking;
        let formInputs = this.state.formInputs;
        const {currentNoteModalField} = this.state;

        newBooking[currentNoteModalField] = note;
        formInputs[currentNoteModalField] = note;
        this.setState({booking: newBooking, formInputs, isBookingModified: true});
        this.toggleStatusNoteModal();
    }

    onClearStatusNote() {
        let newBooking = this.state.booking;
        let formInputs = this.state.formInputs;
        const {currentNoteModalField} = this.state;

        newBooking[currentNoteModalField] = '';
        formInputs[currentNoteModalField] = '';
        this.setState({booking: newBooking, formInputs, isBookingModified: true});
        this.toggleStatusNoteModal();
    }

    onDeleteBtnClick(commId) {
        this.setState({selectedCommId: commId});
        this.toggleDeleteCommConfirmModal();
    }

    onClickConfirmDeleteCommBtn() {
    }

    onDateChange(date, fieldName) {
        const formInputs = this.state.formInputs;
        const booking = this.state.booking;

        if (date) {
            formInputs[fieldName] = moment(date).format('YYYY-MM-DD');
            booking[fieldName] = moment(date).format('YYYY-MM-DD');
        } else {
            formInputs[fieldName] = null;
            booking[fieldName] = null;
        }

        if (fieldName === 'fp_store_event_date') {
            formInputs['de_Deliver_From_Date'] = formInputs[fieldName];
            formInputs['de_Deliver_By_Date'] = formInputs[fieldName];
            booking['de_Deliver_From_Date'] = booking[fieldName];
            booking['de_Deliver_By_Date'] = booking[fieldName];
        }

        this.setState({formInputs, booking, isBookingModified: true});
    }

    onChangeDateTime(date, fieldName) {
        const commFormInputs = this.state.commFormInputs;
        const formInputs = this.state.formInputs;
        const booking = this.state.booking;

        let conveted_date = moment(date).add(this.tzOffset, 'h');   // Current -> UTC
        conveted_date = conveted_date.add(-10, 'h');                // UTC -> Sydney

        if (fieldName === 'due_date_time') {
            commFormInputs['due_date_time'] = conveted_date;
            commFormInputs['due_by_date'] = moment(conveted_date).format('YYYY-MM-DD');
            commFormInputs['due_by_time'] = moment(conveted_date).format('HH:mm:ssZ');
            this.setState({commFormInputs});
        } else if (fieldName === 's_05_Latest_Pick_Up_Date_TimeSet' || 
            fieldName === 's_20_Actual_Pickup_TimeStamp' ||
            fieldName === 's_06_Latest_Delivery_Date_TimeSet' ||
            fieldName === 's_21_Actual_Delivery_TimeStamp') {
            booking[fieldName] = moment(conveted_date).format('YYYY-MM-DD HH:mm:ssZ');
            formInputs[fieldName] = moment(conveted_date).format('YYYY-MM-DD HH:mm:ssZ');
            this.setState({formInputs, booking});
        } else if (fieldName === 'b_given_to_transport_date_time') {
            if (conveted_date) {
                formInputs['z_calculated_ETA'] = moment(conveted_date).add(booking.delivery_kpi_days, 'd').format('YYYY-MM-DD');
                booking['z_calculated_ETA'] = moment(conveted_date).add(booking.delivery_kpi_days, 'd').format('YYYY-MM-DD');
                formInputs[fieldName] = moment(conveted_date).format('YYYY-MM-DD HH:mm:ssZ');
                booking[fieldName] = moment(conveted_date).format('YYYY-MM-DD HH:mm:ssZ');
            } else {
                formInputs[fieldName] = null;
                booking[fieldName] = null;

                if (booking.fp_received_date_time) {
                    formInputs['z_calculated_ETA'] = moment(booking.fp_received_date_time).add(booking.delivery_kpi_days, 'd').format('YYYY-MM-DD');
                    booking['z_calculated_ETA'] = moment(booking.fp_received_date_time).add(booking.delivery_kpi_days, 'd').format('YYYY-MM-DD');
                } else {
                    formInputs['z_calculated_ETA'] = null;
                    booking['z_calculated_ETA'] = null;
                }
            }
            this.setState({formInputs, booking});
        } else if (fieldName === 'fp_received_date_time') {
            if (!conveted_date) {
                formInputs['z_calculated_ETA'] = null;
                booking['z_calculated_ETA'] = null;
                formInputs[fieldName] = null;
                booking[fieldName] = null;
            } else if (conveted_date && !booking.b_given_to_transport_date_time) {
                formInputs['z_calculated_ETA'] = moment(conveted_date).add(booking.delivery_kpi_days, 'd').format('YYYY-MM-DD');
                booking['z_calculated_ETA'] = moment(conveted_date).add(booking.delivery_kpi_days, 'd').format('YYYY-MM-DD');
                formInputs[fieldName] = moment(conveted_date).format('YYYY-MM-DD HH:mm:ssZ');
                booking[fieldName] = moment(conveted_date).format('YYYY-MM-DD HH:mm:ssZ');
            } else {
                formInputs[fieldName] = moment(conveted_date).format('YYYY-MM-DD HH:mm:ssZ');
                booking[fieldName] = moment(conveted_date).format('YYYY-MM-DD HH:mm:ssZ');
            }
            this.setState({formInputs, booking});
        } else {
            booking[fieldName] = moment(conveted_date).format('YYYY-MM-DD HH:mm:ssZ');
            formInputs[fieldName] = moment(conveted_date).format('YYYY-MM-DD HH:mm:ssZ');
            this.setState({formInputs, booking});
        }

        this.setState({isBookingModified: true});
    }

    onClickFC() { // On click Freight Calculation button
        const {booking} = this.state;
        this.props.fpPricing(booking.id);
        this.setState({loading: true});
        this.toggleFPPricingSlider();
    }

    onClickOpenPricingSlider() {
        const {booking} = this.state;
        this.setState({loadingPricingInfos: true});
        this.toggleFPPricingSlider();
        this.props.getPricingInfos(booking.pk_booking_id);
    }

    onSelectPricing(pricingInfo) {
        const formInputs = this.state.formInputs;
        const booking = this.state.booking;

        formInputs['vx_freight_provider'] = pricingInfo['fk_freight_provider_id'];
        booking['vx_freight_provider'] = pricingInfo['fk_freight_provider_id'];
        booking['vx_account_code'] = pricingInfo['account_code'];
        formInputs['vx_account_code'] = pricingInfo['account_code'];
        booking['vx_serviceName'] = pricingInfo['service_name'];
        formInputs['vx_serviceName'] = pricingInfo['service_name'];
        booking['v_service_Type'] = pricingInfo['service_code'];
        formInputs['v_service_Type'] = pricingInfo['service_code'];
        booking['inv_cost_quoted'] = parseFloat(pricingInfo['fee']).toFixed(2);
        formInputs['inv_cost_quoted'] = parseFloat(pricingInfo['fee']).toFixed(2);
        booking['inv_sell_quoted'] = pricingInfo['client_mu_1_minimum_values'];
        formInputs['inv_sell_quoted'] = pricingInfo['client_mu_1_minimum_values'];
        booking['api_booking_quote'] = pricingInfo['id'];

        const selectedFP = this.state.allFPs.find(
            fp => fp.fp_company_name.toLowerCase() === pricingInfo['fk_freight_provider_id'].toLowerCase());
        booking['s_02_Booking_Cutoff_Time'] = selectedFP['service_cutoff_time'];
        formInputs['s_02_Booking_Cutoff_Time'] = booking['s_02_Booking_Cutoff_Time'];

        this.setState({formInputs, booking, isBookingModified: true, loading: true, curViewMode: 0});
        this.props.updateBooking(booking.id, booking);
        this.toggleFPPricingSlider();
    }

    onChangeTime(time, type) {
        const {booking, formInputs} = this.state;

        if (type === 's_02_Booking_Cutoff_Time') {
            formInputs[type] = time;
            booking[type] = time;
        }

        this.setState({formInputs});
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

    onClickRadio(type) {
        const { booking } = this.state;
        booking['x_ReadyStatus'] = type;
        this.setState({booking});
    }

    render() {
        const {isBookedBooking, attachmentsHistory, booking, products, bookingTotals, AdditionalServices, bookingLineDetailsProduct, formInputs, commFormInputs, puState, puStates, puPostalCode, puPostalCodes, puSuburb, puSuburbs, deToState, deToStates, deToPostalCode, deToPostalCodes, deToSuburb, deToSuburbs, comms, isShowAdditionalActionTaskInput, isShowAssignedToInput, notes, isShowCommModal, isNotePaneOpen, commFormMode, actionTaskOptions, clientname, warehouses, isShowSwitchClientModal, dmeClients, clientPK, isShowLineSlider, curViewMode, isBookingSelected,  statusHistories, isShowStatusHistorySlider, allBookingStatus, isShowLineTrackingSlider, activeTabInd, selectedCommId, statusActions, statusDetails, availableCreators, isShowStatusLockModal, isShowStatusDetailInput, isShowStatusActionInput, allFPs, currentNoteModalField, qtyTotal, cntAttachments, isAutoAugmented, zoho_tickets } = this.state;
        const bookingLineColumns = [
            {
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

        const bookingLineDetailsColumns = [
            {
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

        const datetimeFormatter = (cell) => {
            return (
                moment(cell).format('DD/MM/YYYY HH:mm:ss')
            );
        };

        const commIdCell = (cell, row) => {
            let that = this;
            return (
                <div className="comm-id-cell, cur-pointer" onClick={() => that.onClickCommIdCell(row.id)}>{cell}</div>
            );
        };

        const commUpdateCell = (cell, row) => {
            let that = this;
            return (
                <Button className="comm-update-cell" color="primary" onClick={() => that.onUpdateBtnClick('comm', row)}>
                    <i className="icon icon-edit"></i>
                </Button>
            );
        };

        const commDeleteCell = (cell, row) => {
            let that = this;
            return (
                <Button className="comm-delete-cell" color="danger" onClick={() => that.onDeleteBtnClick(row.id)}>
                    <i className="icon icon-trash"></i>
                </Button>
            );
        };

        // const limitedHeightTitle = (cell, row) => {
        //     return (
        //         <div>
        //             <div className="max-height-45 overflow-hidden" id={'comm-' + 'dme_com_title' + '-tooltip-' + row.id}>
        //                 {cell}
        //             </div>
        //             <CommTooltipItem comm={row} field={'dme_com_title'} />
        //         </div>
        //     );
        // };

        // const limitedHeightAction = (cell, row) => {
        //     return (
        //         <div>
        //             <div className="max-height-45 overflow-hidden" id={'comm-' + 'dme_action' + '-tooltip-' + row.id}>
        //                 {cell}
        //             </div>
        //             <CommTooltipItem comm={row} field={'dme_action'} />
        //         </div>
        //     );
        // };

        const columnCommunication = [
            {
                dataField: 'index',
                text: 'No',
                style: {
                    width: '30px',
                },
                formatter: commIdCell,
            }, {
                dataField: 'dme_notes_type',
                text: 'Type',
                style: {
                    width: '40px',
                },
            }, {
                dataField: 'assigned_to',
                text: 'Assigned',
                style: {
                    width: '40px',
                },
            }, {
                dataField: 'dme_com_title',
                text: 'Title',
                style: {
                    width: '300px',
                },
                // formatter: limitedHeightTitle,
            }, {
                dataField: 'z_createdTimeStamp',
                text: 'Date/Time Created',
                formatter: datetimeFormatter,
            }, {
                dataField: 'due_by_datetime',
                text: 'Date/Time Due',
                formatter: datetimeFormatter,
            }, {
                dataField: 'dme_action',
                text: 'Action Task',
                style: {
                    width: '300px',
                },
                // formatter: limitedHeightAction,
            }, {
                dataField: 'id',
                text: 'Update',
                style: {
                    width: '20px',
                },
                formatter: commUpdateCell,
            }, {
                dataField: 'id',
                text: 'Delete',
                style: {
                    width: '20px',
                },
                formatter: commDeleteCell,
            },
        ];

        const columnZohoTickets = [
            {
                dataField: 'id',
                text: 'Ticket Id'
            }, {
                dataField: 'subject',
                text: 'Subject'
            }, {
                dataField: 'email',
                text: 'Email-Id'
            }, {
                dataField: 'status',
                text: 'Status'
            }, {
                dataField: 'id',
                text: 'View',
                formatter:  (cell, row) => {
                    console.log(cell,row);
                    return (<Link to={'/zohodetails?id='+row.id}><i className="fa fa-eye"></i> </Link>);
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

        const actionTaskOptionsList = actionTaskOptions.map((actionTaskOption, key) => {
            return (<option key={key} value={actionTaskOption}>{actionTaskOption}</option>);
        });

        let warehouseCodeOptions = warehouses.map((warehouse) => {
            return {value: warehouse.client_warehouse_code, label: warehouse.client_warehouse_code};
        });

        const bookingCategroies = [
            'Repairs & Spare Parts Expense',
            'Refurbishment Expense',
            'Salvage Expense',
            'Samples & Sales Expense',
            'Standard Sales',
            'Testing Expense',
            'Admin / Other',
        ];

        let bookingCategoryOptions = bookingCategroies.map((category) => {
            return {value: category, label: category};
        });

        const bookingPriorities = ['Low', 'Standard', 'High', 'Critical'];

        let bookingProioriyOptions = bookingPriorities.map((priority) => {
            return {value: priority, label: priority};
        });

        const currentWarehouseCodeOption = {
            value: formInputs.b_client_warehouse_code ? formInputs.b_client_warehouse_code : null,
            label: formInputs.b_client_warehouse_code ? formInputs.b_client_warehouse_code : null,
        };

        const clientnameOptions = dmeClients.map((client) => {
            return {value: client.company_name, label: client.company_name};
        });
        const currentClientnameOption = {value: formInputs['b_client_name'], label: formInputs['b_client_name']};

        const fpOptions = allFPs.map((fp) => {
            return {value: fp.fp_company_name, label: fp.fp_company_name};
        });
        const currentFPOption = {value: formInputs['vx_freight_provider'], label: formInputs['vx_freight_provider']};

        const InvBillingOptions = [
            {value: 'Charge', label: 'Charge'},
            {value: 'Reduced Charge', label: 'Reduced Charge'},
            {value: 'Not to Charge', label: 'Not to Charge'},
        ];
        const currentInvBillingOption = {value: formInputs['inv_billing_status'], label: formInputs['inv_billing_status']};

        const availableCreatorsList = availableCreators.map((availableCreator, index) => {
            return (
                <option key={index} value={availableCreator.username}>{availableCreator.first_name} {availableCreator.last_name}</option>
            );
        });

        const createdForInfosList = this.state.createdForInfos.map((createdForInfo) => {
            const name_first = createdForInfo.name_first ? createdForInfo.name_first : '';
            const name_last = createdForInfo.name_last ? createdForInfo.name_last : '';
            return {value: createdForInfo.id, label: name_first + ' ' + name_last};
        });

        const statusActionOptions = statusActions.map((statusAction, key) => {
            return (<option key={key} value={statusAction.dme_status_action}>{statusAction.dme_status_action}</option>);
        });

        const statusDetailOptions = statusDetails.map((statusDetail, key) => {
            return (<option key={key} value={statusDetail.dme_status_detail}>{statusDetail.dme_status_detail}</option>);
        });

        const generalEmailCnt = this.state.emailLogs.filter(emailLog => emailLog['emailName'] === 'General Booking').length;
        const podEmailCnt = this.state.emailLogs.filter(emailLog => emailLog['emailName'] === 'POD').length;
        const returnEmailCnt = this.state.emailLogs.filter(emailLog => emailLog['emailName'] === 'Return Booking').length;
        const futileEmailCnt = this.state.emailLogs.filter(emailLog => emailLog['emailName'] === 'Futile Pickup').length;

        return (
            <div className="qbootstrap-nav header">
                <div id="headr" className="col-md-12">
                    <div className="col-md-7 col-sm-12 col-lg-8 col-xs-12 col-md-push-1">
                        <ul className="nav nav-tabs">
                            <li className="active"><Link to="/booking">Header</Link></li>
                            <li><a onClick={(e) => this.onClickGoToAllBookings(e)}>All Bookings</a></li>
                            <li className=""><a href="/bookingsets">Booking Sets</a></li>
                            <li className=""><Link to="/pods">PODs</Link></li>
                            {clientname === 'dme' && <li className=""><Link to="/comm">Comm</Link></li>}
                            {clientname === 'dme' && <li className=""><Link to="/zoho">Zoho</Link></li>}
                            <li className=""><Link to="/reports">Reports</Link></li>
                            <li className="none"><a href="/bookinglines">Booking Lines</a></li>
                            <li className="none"><a href="/bookinglinedetails">Booking Line Datas</a></li>
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

                        {clientname === 'dme' && <a className='cur-pointer' onClick={() => this.onClickEnvelop('General Booking')}>General{generalEmailCnt > 0 && ` (${generalEmailCnt})`}</a>}
                        {clientname === 'dme' && <a className='cur-pointer' onClick={() => this.onClickEnvelop('POD')}>POD{podEmailCnt > 0 && ` (${podEmailCnt})`}</a>}
                        {clientname === 'dme' && <a className='cur-pointer' onClick={() => this.onClickEnvelop('Return Booking')}>Return{returnEmailCnt > 0 && ` (${returnEmailCnt})`}</a>}
                        {clientname === 'dme' && <a className='cur-pointer' onClick={() => this.onClickEnvelop('Futile Pickup')}>Futile{futileEmailCnt > 0 && ` (${futileEmailCnt})`}</a>}
                        {clientname === 'dme' && <a className='cur-pointer' onClick={() => this.onClickEnvelop('Email Log')}><i className="fa fa-envelope" aria-hidden="true"></i></a>}
                        
                        <a className="none">?</a>
                        {
                            clientname === 'dme' &&
                                <a 
                                    className='cur-pointer'
                                    onClick={(e) => this.onClickSwitchClientNavIcon(e)}
                                >
                                    <i className="fa fa-users" aria-hidden="true"></i>
                                </a>
                        }
                    </div>
                </div>

                <div className="user-header">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="text-left content view-select">
                                    <span>Booking Mode</span>
                                    <br />
                                    <select
                                        onChange = {(e) => this.onChangeViewMode(e)}
                                        value = {curViewMode}
                                    >
                                        <option value="0">View</option>
                                        <option value="2">Edit</option>
                                        <option value="1">New Form</option>
                                    </select>
                                </div>
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
                                        <div className="col-sm-4">
                                            <button onClick={(e) => this.onClickPrev(e)} disabled={this.state.prevBookingId == 0} className="btn btn-theme prev-btn">
                                                <i className="fa fa-caret-left"></i>
                                            </button>
                                            <p className="text-white disp-inline-block dme-id">DME ID: {isBookingSelected ? this.state.booking.b_bookingID_Visual : ''}</p>
                                            <button onClick={(e) => this.onClickNext(e)} disabled={this.state.nextBookingId == 0} className="btn btn-theme next-btn">
                                                <i className="fa fa-caret-right"></i>
                                            </button>
                                            <button onClick={(e) => this.onClickRefreshBooking(e)} disabled={!this.state.booking} className="btn btn-theme mar-left-20 refresh-btn">
                                                <i className="fa fa-sync"></i>
                                            </button>
                                            <button onClick={(e) => this.onClickComms(e)} className="btn btn-primary btn-comms none">comms</button>
                                        </div>
                                        <div className="col-sm-3">
                                            <p className="text-white text-right none">AUS Mon 18:00 2018-02-04</p>
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
                                            <span>Client Name</span>
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
                                            {
                                                (parseInt(curViewMode) === 0) ?
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
                                                            value = {formInputs['dme_status_detail']}
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
                                                            value = {formInputs['dme_status_action']}
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
                                        {
                                            (isShowStatusActionInput && parseInt(curViewMode) !== 0) &&
                                                <div className={clientname === 'dme' ? 'col-sm-3 form-group' : 'none'}>
                                                    <span>New Status Detail</span><br />
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
                                                className="edit-lld-btn btn-primary"
                                                onClick={() => this.toggleUpdateCreatedForEmailConfirmModal()} 
                                                disabled={parseInt(curViewMode) === 0 || !this.state.booking.booking_Created_For_Email ? 'disabled' : ''}
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
                                            {
                                                (parseInt(curViewMode) === 0) ?
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
                                            {
                                                (parseInt(curViewMode) === 0) ?
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
                                                <span>Freight Provider</span>
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
                                                            value = {formInputs['inv_cost_quoted'] && `$${formInputs['inv_cost_quoted']}`}
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
                                                                value = {formInputs['inv_cost_actual'] && `$${formInputs['inv_cost_actual']}`}
                                                                onChange={(e) => this.onHandleInput(e)}
                                                                onBlur={(e) => this.onHandleInputBlur(e)}
                                                            />
                                                            :
                                                            <p className="show-mode">{formInputs['inv_cost_actual'] && `$${parseFloat(formInputs['inv_cost_actual']).toFixed(2)}`}</p>
                                                    }
                                                </div>
                                            </div>
                                        }
                                        {clientname === 'dme' &&
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
                                                            value = {formInputs['inv_sell_quoted'] && `$${formInputs['inv_sell_quoted']}`}
                                                            onChange={(e) => this.onHandleInput(e)}
                                                            onBlur={(e) => this.onHandleInputBlur(e)}
                                                        />
                                                    }
                                                </div>
                                            </div>
                                        }
                                        {clientname === 'dme' &&
                                            <div className="col-sm-1 form-group">
                                                <div>
                                                    <span className="c-red">Actual $</span>
                                                    {(parseInt(curViewMode) === 0) ?
                                                        <p className="show-mode">{formInputs['inv_sell_actual'] && `$${parseFloat(formInputs['inv_sell_actual']).toFixed(2)}`}</p>
                                                        :
                                                        clientname === 'dme' ?
                                                            <input
                                                                className="form-control"
                                                                type="text"
                                                                name="inv_sell_actual"
                                                                value = {formInputs['inv_sell_actual'] && `$${formInputs['inv_sell_actual']}`}
                                                                onChange={(e) => this.onHandleInput(e)}
                                                                onBlur={(e) => this.onHandleInputBlur(e)}
                                                            />
                                                            :
                                                            <p className="show-mode">{formInputs['inv_sell_actual'] && `$${parseFloat(formInputs['inv_sell_actual']).toFixed(2)}`}</p>
                                                    }
                                                </div>
                                            </div>
                                        }
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
                                                        onClick={() => this.toggleStatusNoteModal('dme_status_history_notes')}
                                                        id={'booking-' + 'dme_status_history_notes' + '-tooltip-' + booking.id}
                                                        value={formInputs['dme_status_history_notes']}
                                                        disabled='disabled'
                                                        rows="6"
                                                        cols="83"
                                                    />
                                                    :
                                                    clientname === 'dme' ?
                                                        <textarea 
                                                            className="show-mode"
                                                            id={'booking-' + 'dme_status_history_notes' + '-tooltip-' + booking.id}
                                                            name="dme_status_linked_reference_from_fp"
                                                            value={formInputs['dme_status_history_notes'] ? formInputs['dme_status_history_notes'] : ''} 
                                                            onClick={() => this.toggleStatusNoteModal('dme_status_history_notes')}
                                                            rows="6"
                                                            cols="83"
                                                        />
                                                        :
                                                        <textarea 
                                                            className="show-mode"
                                                            onClick={() => this.toggleStatusNoteModal('dme_status_history_notes')}
                                                            id={'booking-' + 'dme_status_history_notes' + '-tooltip-' + booking.id}
                                                            value={formInputs['dme_status_history_notes']}
                                                            disabled='disabled'
                                                            rows="6"
                                                            cols="83"
                                                        />
                                            }
                                            {!_.isEmpty(formInputs['dme_status_history_notes']) &&
                                                <TooltipItem object={booking} placement='top' fields={['dme_status_history_notes']} />
                                            }
                                        </div>
                                    </div>
                                    <div className="clearfix"></div>
                                </div>
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
                                                            <label className="" htmlFor="">Pick Up Entity</label>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            {
                                                                (parseInt(curViewMode) === 0) ?
                                                                    <p className="show-mode">{formInputs['puCompany']}</p>
                                                                    :
                                                                    <input 
                                                                        placeholder="Tempo Pty Ltd"
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
                                                            <label className="" htmlFor="">Street 1</label>
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
                                                                <label className="" htmlFor="">State</label>
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
                                                                <label className="" htmlFor="">Postal Code</label>
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
                                                                <label className="" htmlFor="">Suburb</label>
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
                                                            <label className="" htmlFor="">Country</label>
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
                                                            <label className="" htmlFor="">Contact</label>
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
                                                            <label className="" htmlFor="">Email</label>
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
                                                    <div className="row mt-1 none">
                                                        <div className="col-sm-4">
                                                            <label className="" htmlFor="">Pickup Dates</label>
                                                        </div>
                                                        <div className='col-sm-8'>
                                                            <div className="input-group pad-left-20px">
                                                                {formInputs['s_20_Actual_Pickup_TimeStamp'] ? moment(formInputs['s_20_Actual_Pickup_TimeStamp']).format('DD/MM/YYYY HH:mm:ss') : ''}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="head text-white booking-panel-title">
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
                                                                        new Date(moment(booking.s_05_Latest_Pick_Up_Date_TimeSet).toDate().toLocaleString('en-US', {timeZone: 'Australia/Sydney'}))}
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
                                                                            new Date(moment(booking.fp_received_date_time).toDate().toLocaleString('en-US', {timeZone: 'Australia/Sydney'}))}
                                                                            format={'dd/MM/yyyy HH:mm'}
                                                                        />
                                                                        :
                                                                        <p className="show-mode">{formInputs['fp_received_date_time'] ? moment(formInputs['fp_received_date_time']).format('DD/MM/YYYY'): ''}</p>
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
                                                            {
                                                                (parseInt(curViewMode) === 0) ?
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
                                                            <label className="" htmlFor="">Delivery Entity</label>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            {
                                                                (parseInt(curViewMode) === 0) ?
                                                                    <p className="show-mode">{formInputs['deToCompanyName']}</p>
                                                                    :
                                                                    <input 
                                                                        placeholder="Tempo Pty Ltd"
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
                                                            <label className="" htmlFor="">Street 1</label>
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
                                                                <label className="" htmlFor="">State</label>
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
                                                                <label className="" htmlFor="">Postal Code</label>
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
                                                                <label className="" htmlFor="">Suburb</label>
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
                                                            <label className="" htmlFor="">Country</label>
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
                                                            <label className="" htmlFor="">Contact </label>
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
                                                            <label className="" htmlFor="">Email</label>
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
                                                    <div className="head text-white panel-title">
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
                                                                            new Date(moment(booking.s_21_Actual_Delivery_TimeStamp).toDate().toLocaleString('en-US', {timeZone: 'Australia/Sydney'}))}
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
                                        <div className="col-sm-4">
                                            <div className="pickup-detail">
                                                <div className="head text-white">
                                                    <ul>
                                                        <li>Project: {booking.b_booking_project}</li>
                                                        <li>
                                                            {(clientname === 'dme' && isAutoAugmented === false) ?
                                                                <button
                                                                    className='btn btn-theme btn-autoaugment'
                                                                    disabled={this.state.loadingBookingLine || this.state.loadingBookingLineDetail || this.state.loading || this.state.loadingGeoPU || isBookedBooking}
                                                                    onClick={() => this.onClickAutoAugment()}
                                                                >
                                                                    AA
                                                                </button>
                                                                :
                                                                <button
                                                                    className='btn btn-theme btn-autoaugment'
                                                                    disabled={this.state.loadingBookingLine || this.state.loadingBookingLineDetail || this.state.loading || this.state.loadingGeoPU || isBookedBooking}
                                                                    onClick={() => this.onClickRevertAugment()}
                                                                >
                                                                    AA-R
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
                                                                checked={booking.x_ReadyStatus === 'Available From'}
                                                                onChange={() => this.onClickRadio('Available From')} />
                                                            <label htmlFor="available-from">&nbsp;&nbsp;Available From</label>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <input type="radio"
                                                                id="available-now"
                                                                value="Available Now"
                                                                checked={booking.x_ReadyStatus === 'Available Now'}
                                                                onChange={() => this.onClickRadio('Available Now')} />
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
                                                            {
                                                                (parseInt(curViewMode) === 0) ?
                                                                    <label className="show-mode">
                                                                        <p className="date disp-inline-block">
                                                                            {formInputs['puPickUpAvailFrom_Date'] ? moment(formInputs['puPickUpAvailFrom_Date']).format('DD/MM/YYYY') : ''}
                                                                        </p>
                                                                        {!_.isNull(formInputs['pu_PickUp_Avail_Time_Hours'] && !_.isNull(formInputs['pu_PickUp_Avail_Time_Minutes'])) ?
                                                                            <p className="time disp-inline-block">
                                                                                {parseInt(formInputs['pu_PickUp_Avail_Time_Hours']) > -1 && parseInt(formInputs['pu_PickUp_Avail_Time_Hours']) < 10 ?
                                                                                    `0${formInputs['pu_PickUp_Avail_Time_Hours']}:` : `${formInputs['pu_PickUp_Avail_Time_Hours']}:`
                                                                                }
                                                                                {parseInt(formInputs['pu_PickUp_Avail_Time_Minutes']) > -1 && parseInt(formInputs['pu_PickUp_Avail_Time_Minutes']) < 10 ?
                                                                                    `0${formInputs['pu_PickUp_Avail_Time_Minutes']}:` : `${formInputs['pu_PickUp_Avail_Time_Minutes']}`
                                                                                }
                                                                            </p> : null
                                                                        }
                                                                    </label>
                                                                    :
                                                                    <div>
                                                                        <DatePicker
                                                                            className="date"
                                                                            selected={formInputs['puPickUpAvailFrom_Date'] ? new Date(booking.puPickUpAvailFrom_Date) : null}
                                                                            onChange={(e) => this.onDateChange(e, 'puPickUpAvailFrom_Date')}
                                                                            dateFormat="dd MMM yyyy"
                                                                        />
                                                                        <input
                                                                            className="hour"
                                                                            name='pu_PickUp_Avail_Time_Hours'
                                                                            value={formInputs['pu_PickUp_Avail_Time_Hours']}
                                                                            onChange={(e) => this.onHandleInput(e)}
                                                                        />
                                                                        {':'}
                                                                        <input
                                                                            className="time"
                                                                            name='pu_PickUp_Avail_Time_Minutes'
                                                                            value={formInputs['pu_PickUp_Avail_Time_Minutes']}
                                                                            onChange={(e) => this.onHandleInput(e)}
                                                                        />
                                                                    </div>
                                                            }
                                                        </div>
                                                        <div className="col-sm-3">
                                                            <label className="" htmlFor="">PU By</label>
                                                        </div>
                                                        <div className="col-sm-9">
                                                            {
                                                                (parseInt(curViewMode) === 0) ?
                                                                    <label className="show-mode">
                                                                        <p className="date disp-inline-block">
                                                                            {formInputs['pu_PickUp_By_Date'] ? moment(formInputs['pu_PickUp_By_Date']).format('DD/MM/YYYY') : ''}
                                                                        </p>
                                                                        {!_.isNull(formInputs['pu_PickUp_By_Time_Hours'] && !_.isNull(formInputs['pu_PickUp_By_Time_Minutes'])) ?
                                                                            <p className="time disp-inline-block">
                                                                                {parseInt(formInputs['pu_PickUp_By_Time_Hours']) > -1 && parseInt(formInputs['pu_PickUp_By_Time_Hours']) < 10 ?
                                                                                    `0${formInputs['pu_PickUp_By_Time_Hours']}:` : `${formInputs['pu_PickUp_By_Time_Hours']}:`
                                                                                }
                                                                                {parseInt(formInputs['pu_PickUp_By_Time_Minutes']) > -1 && parseInt(formInputs['pu_PickUp_By_Time_Minutes']) < 10 ?
                                                                                    `0${formInputs['pu_PickUp_By_Time_Minutes']}:` : `${formInputs['pu_PickUp_By_Time_Minutes']}`
                                                                                }
                                                                            </p> : null
                                                                        }
                                                                    </label>
                                                                    :
                                                                    <div>
                                                                        <DatePicker
                                                                            className="date"
                                                                            selected={formInputs['pu_PickUp_By_Date'] ? new Date(booking.pu_PickUp_By_Date) : null}
                                                                            onChange={(e) => this.onDateChange(e, 'pu_PickUp_By_Date')}
                                                                            dateFormat="dd MMM yyyy"
                                                                        />
                                                                        <input
                                                                            className="hour"
                                                                            name='pu_PickUp_By_Time_Hours'
                                                                            value={formInputs['pu_PickUp_By_Time_Hours']}
                                                                            onChange={(e) => this.onHandleInput(e)}
                                                                        />
                                                                        {':'}
                                                                        <input
                                                                            className="time"
                                                                            name='pu_PickUp_By_Time_Minutes'
                                                                            value={formInputs['pu_PickUp_By_Time_Minutes']}
                                                                            onChange={(e) => this.onHandleInput(e)}
                                                                        />
                                                                    </div>
                                                            }
                                                        </div>
                                                        <div className="col-sm-3">
                                                            <label className="" htmlFor="">DE From</label>
                                                        </div>
                                                        <div className="col-sm-9">
                                                            {
                                                                (parseInt(curViewMode) === 0) ?
                                                                    <label className="show-mode">
                                                                        <p className="date disp-inline-block">
                                                                            {formInputs['de_Deliver_From_Date'] ? moment(formInputs['de_Deliver_From_Date']).format('DD/MM/YYYY') : ''}
                                                                        </p>
                                                                        {!_.isNull(formInputs['de_Deliver_From_Hours'] && !_.isNull(formInputs['de_Deliver_From_Minutes'])) ?
                                                                            <p className="time disp-inline-block">
                                                                                {parseInt(formInputs['de_Deliver_From_Hours']) > -1 && parseInt(formInputs['de_Deliver_From_Hours']) < 10 ?
                                                                                    `0${formInputs['de_Deliver_From_Hours']}:` : `${formInputs['de_Deliver_From_Hours']}:`
                                                                                }
                                                                                {parseInt(formInputs['de_Deliver_From_Minutes']) > -1 && parseInt(formInputs['de_Deliver_From_Minutes']) < 10 ?
                                                                                    `0${formInputs['de_Deliver_From_Minutes']}:` : `${formInputs['de_Deliver_From_Minutes']}`
                                                                                }
                                                                            </p> : null
                                                                        }
                                                                    </label>
                                                                    :
                                                                    <div>
                                                                        <DatePicker
                                                                            className="date"
                                                                            selected={formInputs['de_Deliver_From_Date'] ? new Date(booking.de_Deliver_From_Date) : null}
                                                                            onChange={(e) => this.onDateChange(e, 'de_Deliver_From_Date')}
                                                                            dateFormat="dd MMM yyyy"
                                                                        />
                                                                        <input
                                                                            className="hour"
                                                                            name='de_Deliver_From_Hours'
                                                                            value={formInputs['de_Deliver_From_Hours']}
                                                                            onChange={(e) => this.onHandleInput(e)}
                                                                        />
                                                                        {':'}
                                                                        <input
                                                                            className="time"
                                                                            name='de_Deliver_From_Minutes'
                                                                            value={formInputs['de_Deliver_From_Minutes']}
                                                                            onChange={(e) => this.onHandleInput(e)}
                                                                        />
                                                                    </div>
                                                            }
                                                        </div>
                                                        <div className="col-sm-3">
                                                            <label className="" htmlFor="">DE By</label>
                                                        </div>
                                                        <div className="col-sm-9">
                                                            {
                                                                (parseInt(curViewMode) === 0) ?
                                                                    <label className="show-mode">
                                                                        <p className="date disp-inline-block">
                                                                            {formInputs['de_Deliver_By_Date'] ? moment(formInputs['de_Deliver_By_Date']).format('DD/MM/YYYY') : ''}
                                                                        </p>
                                                                        {!_.isNull(formInputs['de_Deliver_By_Hours'] && !_.isNull(formInputs['de_Deliver_By_Minutes'])) ?
                                                                            <p className="time disp-inline-block">
                                                                                {parseInt(formInputs['de_Deliver_By_Hours']) > -1 && parseInt(formInputs['de_Deliver_By_Hours']) < 10 ?
                                                                                    `0${formInputs['de_Deliver_By_Hours']}:` : `${formInputs['de_Deliver_By_Hours']}:`
                                                                                }
                                                                                {parseInt(formInputs['de_Deliver_By_Minutes']) > -1 && parseInt(formInputs['de_Deliver_By_Minutes']) < 10 ?
                                                                                    `0${formInputs['de_Deliver_By_Minutes']}:` : `${formInputs['de_Deliver_By_Minutes']}`
                                                                                }
                                                                            </p> : null
                                                                        }
                                                                    </label>
                                                                    :
                                                                    <div>
                                                                        <DatePicker
                                                                            className="date"
                                                                            selected={formInputs['de_Deliver_By_Date'] ? new Date(booking.de_Deliver_By_Date) : null}
                                                                            onChange={(e) => this.onDateChange(e, 'de_Deliver_By_Date')}
                                                                            dateFormat="dd MMM yyyy"
                                                                        />
                                                                        <input
                                                                            className="hour"
                                                                            name='de_Deliver_By_Hours'
                                                                            value={formInputs['de_Deliver_By_Hours']}
                                                                            onChange={(e) => this.onHandleInput(e)}
                                                                        />
                                                                        {':'}
                                                                        <input
                                                                            className="time"
                                                                            name='de_Deliver_By_Minutes'
                                                                            value={formInputs['de_Deliver_By_Minutes']}
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
                                                            <label className="" htmlFor="">Gaps</label>
                                                        </div>
                                                        <div className="col-sm-9">
                                                            <label className="show-mode">
                                                                {booking ? booking.client_item_references : ''}
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="buttons">
                                                    <div className="text-center mt-2 fixed-height form-view-btns">
                                                        <button className={(parseInt(curViewMode) === 1) ? 'btn btn-theme custom-theme' : 'btn btn-theme custom-theme disabled'} onClick={() => this.onClickCreateBooking()}>Create</button>
                                                        <button
                                                            className={(parseInt(curViewMode) === 2) ?
                                                                'btn btn-theme custom-theme' : 'btn btn-theme custom-theme disabled'}
                                                            onClick={() => this.onClickUpdateBooking()}
                                                            disabled={this.state.loadingBookingLine || this.state.loadingBookingLineDetail || this.state.loading || this.state.loadingGeoPU ? 'disabled' : ''}
                                                        >Update</button>
                                                    </div>
                                                    {(clientname === 'dme') &&
                                                        <div className="text-center mt-2 fixed-height pricing-btns">
                                                            <button
                                                                className="btn btn-theme custom-theme"
                                                                onClick={() => this.onClickFC()}
                                                                disabled={booking && !isBookedBooking ? '' : 'disabled'}
                                                            >
                                                                Price & Time Calc(FC)
                                                            </button>
                                                            <button
                                                                className="btn btn-theme custom-theme"
                                                                onClick={() => this.onClickOpenPricingSlider()}
                                                            >
                                                                <i className="fa fa-caret-square-left"></i>
                                                            </button>
                                                        </div>
                                                    }
                                                    <div className="text-center mt-2 fixed-height">
                                                        {(clientname === 'dme'
                                                            && isBookedBooking
                                                            && !_.isUndefined(this.state.booking.vx_freight_provider)
                                                            && this.state.booking.vx_freight_provider.toLowerCase() == 'tnt'
                                                        ) ?
                                                            <div className="text-center mt-2 fixed-height half-size">
                                                                <button
                                                                    className="btn btn-theme custom-theme"
                                                                    onClick={() => this.onSavePuInfo()}
                                                                >
                                                                    SH-PU
                                                                </button>
                                                                <button
                                                                    className="btn btn-theme custom-theme"
                                                                    onClick={() => this.onClickRebook()}
                                                                >
                                                                    Rebook Pu
                                                                </button>
                                                            </div>
                                                            :
                                                            <button
                                                                className="btn btn-theme custom-theme"
                                                                onClick={() => this.onClickBook()}
                                                                disabled={isBookedBooking ? 'disabled' : ''}
                                                            >
                                                                Book
                                                            </button>
                                                        }
                                                    </div>
                                                    {
                                                        (clientname === 'dme') ?
                                                            <div className="text-center mt-2 fixed-height manual-book">
                                                                <input
                                                                    name="tickManualBook"
                                                                    type="checkbox"
                                                                    checked={formInputs['x_manual_booked_flag']}
                                                                    onChange={(e) => this.handleInputChange(e)}
                                                                    disabled={isBookedBooking ? 'disabled' : ''}
                                                                />
                                                                <p>Manual Book</p>
                                                            </div>
                                                            :
                                                            null
                                                    }
                                                    <div className="text-center mt-2 fixed-height">
                                                        <button
                                                            className="btn btn-theme custom-theme"
                                                            onClick={() => this.onClickEditBook()}
                                                            disabled={(isBookedBooking && booking && booking.b_status !== 'Closed') ? '' : 'disabled'}
                                                        >
                                                            Amend Booking
                                                        </button>
                                                    </div>
                                                    <div className="text-center mt-2 fixed-height">
                                                        <button
                                                            className="btn btn-theme custom-theme"
                                                            onClick={() => this.onClickCancelBook()}
                                                            disabled={isBookedBooking && booking ? '' : 'disabled'}
                                                        >
                                                            Cancel Request
                                                        </button>
                                                    </div>
                                                    <div className="text-center mt-2 fixed-height">
                                                        <button className="btn btn-theme custom-theme" onClick={() => this.onClickDuplicate(2)}>Duplicate Booking</button>
                                                    </div>
                                                    <div className="text-center mt-2 fixed-height">
                                                        <button className="btn btn-theme custom-theme none" onClick={() => this.onClickLabel(booking, 'label')}><i className="icon icon-printer"></i> Print</button>
                                                    </div>
                                                    <div className="text-center mt-2 fixed-height half-size">
                                                        <button
                                                            className="btn btn-theme custom-theme"
                                                            onClick={() => this.onClickGetLabel()}
                                                            disabled={booking && booking.z_label_url && booking.z_label_url.length > 0 ? 'disabled' : ''}
                                                        >
                                                            Get Label
                                                        </button>
                                                        <button
                                                            className="btn btn-theme custom-theme"
                                                            onClick={() => this.onClickReprintLabel()}
                                                            disabled={booking && booking.vx_freight_provider && booking.vx_freight_provider.toLowerCase() != 'tnt' ? 'disabled' : ''}
                                                        >
                                                            Reprint
                                                        </button>
                                                    </div>
                                                    <div className="text-center mt-2 fixed-height half-size">
                                                        <button className="btn btn-theme custom-theme" onClick={() => this.onClickTrackingStatus()}>Status(Test)</button>
                                                        <button className="btn btn-theme custom-theme" onClick={() => this.onClickPOD()}>Pod(Test)</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="clearfix"></div>
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
                                                <li className={activeTabInd === 0 ? 'selected' : ''}><a onClick={(e) => this.onClickBottomTap(e, 0)}>Shipment Packages / Goods({qtyTotal})</a></li>
                                                <li className={activeTabInd === 1 ? 'selected' : ''}><a onClick={(e) => this.onClickBottomTap(e, 1)}>Additional Information</a></li>
                                                {
                                                    clientname === 'dme' ?
                                                        <li className={activeTabInd === 2 ? 'selected' : ''}><a onClick={(e) => this.onClickBottomTap(e, 2)}>Communication Log({comms.length})</a></li>
                                                        : null
                                                }
                                                {
                                                    clientname === 'dme' ?
                                                        <li className={activeTabInd === 3 ? 'selected' : ''}><a onClick={(e) => this.onClickBottomTap(e, 3)}>Zoho Tickets Log</a></li>
                                                        : null
                                                }
                                                <li className={activeTabInd === 4 ? 'selected' : ''}><a onClick={(e) => this.onClickBottomTap(e, 4)}>Attachments({cntAttachments})</a></li>
                                                <li className={activeTabInd === 5 ? 'selected' : ''}><a onClick={(e) => this.onClickBottomTap(e, 5)}>Label & Pod</a></li>
                                            </ul>
                                        </div>
                                        <div className="tab-select-outer none">
                                            <select id="tab-select">
                                                <option value="#tab01">Shipment Packages / Goods</option>
                                                <option value="#tab02">Additional Services & Options</option>
                                                <option value="#tab03">Communication Log</option>
                                                <option value="#tab04">Attachments</option>
                                                <option value="#tab05">Label & Pod</option>
                                            </select>
                                        </div>
                                        <div id="tab01" className={activeTabInd === 0 ? 'tab-contents selected' : 'tab-contents none'}>
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
                                                <BootstrapTable
                                                    keyField="qty"
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
                                                        data={ products }
                                                        columns={ bookingLineColumns }
                                                        // cellEdit={ cellEditFactory({ 
                                                        //     mode: 'click',
                                                        //     blurToSave: false,
                                                        //     afterSaveCell: (oldValue, newValue, row, column) => { this.onUpdateBookingLine(oldValue, newValue, row, column); }
                                                        // })}
                                                        bootstrap4={ true }
                                                    />
                                                </LoadingOverlay>
                                                <hr />
                                                <LoadingOverlay
                                                    active={this.state.loadingBookingLineDetail}
                                                    spinner
                                                    text='Loading...'
                                                >
                                                    <BootstrapTable
                                                        keyField="pk_id_lines_data"
                                                        data={ bookingLineDetailsProduct }
                                                        columns={ bookingLineDetailsColumns }
                                                        // cellEdit={ cellEditFactory({ 
                                                        //     mode: 'click',
                                                        //     blurToSave: true,
                                                        //     afterSaveCell: (oldValue, newValue, row, column) => { this.onUpdateBookingLineDetail(oldValue, newValue, row, column); }
                                                        // })}
                                                        bootstrap4={ true }
                                                    />
                                                </LoadingOverlay>
                                            </div>
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
                                        <div id="tab03" className={activeTabInd === 2 ? 'tab-contents selected' : 'tab-contents none'}>
                                            <button onClick={() => this.onClickGoToCommPage()} disabled={!booking.hasOwnProperty('id')} className="btn btn-theme btn-standard none" title="Go to all comms">
                                                <i className="icon icon-th-list"></i>
                                            </button>
                                            <button onClick={() => this.onClickCreateComm()} disabled={!booking.hasOwnProperty('id')} className="btn btn-theme btn-standard" title="Create a comm">
                                                <i className="icon icon-plus"></i>
                                            </button>
                                            <LoadingOverlay
                                                active={this.state.loadingComm}
                                                spinner
                                                text='Loading Communications...'
                                            >
                                                <div className="tab-inner">
                                                    <BootstrapTable
                                                        keyField="id"
                                                        data={ comms }
                                                        columns={ columnCommunication }
                                                        bootstrap4={ true }
                                                    />
                                                </div>
                                            </LoadingOverlay>
                                        </div>
                                        <div id="tab04" className={activeTabInd === 3 ? 'tab-contents selected' : 'tab-contents none'}>
                                            <LoadingOverlay
                                                active={this.state.loadingZohoTickets}
                                                spinner
                                                text='Loading Zoho tickets...'
                                            >
                                                <div className="tab-inner">
                                                    <BootstrapTable
                                                        keyField="id"
                                                        data={ zoho_tickets }
                                                        columns={ columnZohoTickets }
                                                        bootstrap4={ true }
                                                    />
                                                </div>
                                            </LoadingOverlay>
                                        </div>
                                        <div id="tab05" className={activeTabInd === 4 ? 'tab-contents selected' : 'tab-contents none'}>
                                            <div className="col-12">
                                                <form onSubmit={(e) => this.handlePost(e, 'attachment')}>
                                                    <DropzoneComponent
                                                        id="attachments-dz"
                                                        config={attachmentsDzConfig}
                                                        eventHandlers={attachmentsEventHandlers}
                                                        djsConfig={djsConfig}
                                                    />
                                                    <button className="btn btn-primary" type="submit">upload</button>
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
                                        <div id="tab06" className={activeTabInd === 5 ? 'tab-contents selected' : 'tab-contents none'}>
                                            {isBookingSelected ?
                                                <div className="row">
                                                    <div className="col-6">
                                                        <label>Label upload</label>
                                                        <form onSubmit={(e) => this.handlePost(e, 'label')}>
                                                            <DropzoneComponent
                                                                id="label-dz"
                                                                config={labelDzConfig}
                                                                eventHandlers={labelEventHandlers}
                                                                djsConfig={djsConfig}
                                                            />
                                                            <button className="btn btn-primary" type="submit">upload</button>
                                                        </form>
                                                        {
                                                            booking.z_label_url &&
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
                                                        <form onSubmit={(e) => this.handlePost(e, 'pod')}>
                                                            <DropzoneComponent
                                                                id="pod-dz"
                                                                config={podDzConfig}
                                                                eventHandlers={podEventHandlers}
                                                                djsConfig={djsConfig}
                                                            />
                                                            <button className="btn btn-primary" type="submit">upload</button>
                                                        </form>
                                                        {
                                                            (booking.z_pod_url || booking.z_pod_signed_url) &&
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

                <ReactstrapModal 
                    isOpen={isShowCommModal} 
                    toggle={this.toggleCreateCommModal} 
                    className="create-comm-modal">
                    <ModalHeader toggle={this.toggleCreateCommModal}>{(commFormMode === 'create') ? 'Create' : 'Update'} Communication Log: {booking.b_bookingID_Visual}</ModalHeader>
                    <ModalBody>
                        <label>
                            <p>Assigned To</p>
                            <select
                                required 
                                name="assigned_to"
                                onChange={(e) => this.handleCommModalInputChange(e)}
                                value = {commFormInputs['assigned_to']} >
                                {availableCreatorsList}
                            </select>
                        </label>
                        {
                            (isShowAssignedToInput) ?
                                <label>
                                    <p>Assigned To(New)</p>
                                    <input 
                                        className="form-control"
                                        type="text"
                                        placeholder=""
                                        name="new_assigned_to"
                                        value = {commFormInputs['new_assigned_to']}
                                        onChange={(e) => this.handleCommModalInputChange(e)} />    
                                </label>
                                :
                                null
                        }
                        <label>
                            <p>Priority</p>
                            <select
                                required 
                                name="priority_of_log"
                                onChange={(e) => this.handleCommModalInputChange(e)}
                                value = {commFormInputs['priority_of_log']} >
                                <option value="Standard">Standard</option>
                                <option value="Low">Low</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </label>
                        <label>
                            <p>DME Comm Title</p>
                            <input 
                                className="form-control"
                                type="text"
                                placeholder=""
                                name="dme_com_title"
                                value = {commFormInputs['dme_com_title']}
                                onChange={(e) => this.handleCommModalInputChange(e)} />
                        </label>
                        <label>
                            <p>Type</p>
                            <select
                                required 
                                name="dme_notes_type"
                                onChange={(e) => this.handleCommModalInputChange(e)}
                                value = {commFormInputs['dme_notes_type']} >
                                <option value="Delivery">Delivery</option>
                                <option value="Financial">Financial</option>
                                <option value="FP Query">FP Query</option>
                                <option value="Other">Other</option>
                            </select>
                        </label>
                        <label>
                            <p>Action Task</p>
                            <select
                                required 
                                name="dme_action"
                                onChange={(e) => this.handleCommModalInputChange(e)}
                                value = {commFormInputs['dme_action']} >
                                {actionTaskOptionsList}
                            </select>
                        </label>
                        {
                            (isShowAdditionalActionTaskInput) ?
                                <label>
                                    <p>Action Task(Other)</p>
                                    <input 
                                        className="form-control"
                                        type="text"
                                        placeholder=""
                                        name="additional_action_task"
                                        value = {commFormInputs['additional_action_task']}
                                        onChange={(e) => this.handleCommModalInputChange(e)} />    
                                </label>
                                :
                                null
                        }
                        {
                            (commFormMode === 'create') ?
                                <div>
                                    <label>
                                        <p>Note Type</p>
                                        <select
                                            required 
                                            name="notes_type"
                                            onChange={(e) => this.handleCommModalInputChange(e)}
                                            value = {commFormInputs['notes_type']} >
                                            <option value="Call">Call</option>
                                            <option value="Email">Email</option>
                                            <option value="SMS">SMS</option>
                                            <option value="Letter">Letter</option>
                                            <option value="Note">Note</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </label>
                                    <div className="editor">
                                        <p>First Note</p>
                                        <CKEditor
                                            data={commFormInputs['dme_notes']}
                                            onChange={(e) => this.onEditorChange('note', 'comm', e)} />
                                    </div>
                                </div>
                                :
                                null
                        }
                        <label>
                            <p>Due Date Time</p>
                            <DateTimePicker
                                onChange={(date) => this.onChangeDateTime(date, 'due_date_time')}
                                value={(!_.isNull(commFormInputs['due_date_time']) && !_.isUndefined(commFormInputs['due_date_time'])) &&
                                new Date(moment(commFormInputs['due_date_time']).toDate().toLocaleString('en-US', {timeZone: 'Australia/Sydney'}))}
                                format={'dd/MM/yyyy HH:mm'}
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
                        <Button color="primary" onClick={() => this.onSubmitComm()}>{(commFormMode === 'create') ? 'Create' : 'Update'}</Button>{' '}
                        <Button color="secondary" onClick={this.toggleCreateCommModal}>Cancel</Button>
                    </ModalFooter>
                </ReactstrapModal>

                <SwitchClientModal
                    isShowSwitchClientModal={isShowSwitchClientModal}
                    toggleSwitchClientModal={this.toggleSwitchClientModal}
                    onSwitchClient={(selectedClientId) => this.onSwitchClient(selectedClientId)}
                    clients={dmeClients}
                    selectedClientPK={clientPK}
                />

                <NoteSlider
                    isOpen={isNotePaneOpen}
                    toggleNoteSlider={this.toggleNoteSlider}
                    notes={notes}
                    createNote={(newNote) => this.props.createNote(newNote)} 
                    updateNote={(noteId, newNote) => this.props.updateNote(noteId, newNote)} 
                    deleteNote={(id) => this.props.deleteNote(id)}
                    clientname={clientname}
                    selectedCommId={selectedCommId}
                />

                <LineAndLineDetailSlider
                    isOpen={isShowLineSlider}
                    toggleLineSlider={this.toggleLineSlider}
                    lines={products}
                    lineDetails={bookingLineDetailsProduct}
                    onClickDuplicate={(typeNum, data) => this.onClickDuplicate(typeNum, data)}
                    onClickDelete={(typeNum, data) => this.onClickDeleteLineOrLineData(typeNum, data)}
                    loadingBookingLine={this.state.loadingBookingLine}
                    loadingBookingLineDetail={this.state.loadingBookingLineDetail}
                    selectedLineIndex={this.state.selectedLineIndex}
                    onClickShowLine={(index) => this.onClickShowLine(index)}
                    getCubicMeter={(row) => this.getCubicMeter(row)}
                    getTotalWeight={(row) => this.getTotalWeight(row)}
                    booking={booking}
                    createBookingLine={(bookingLine) => this.props.createBookingLine(bookingLine)}
                    updateBookingLine={(bookingLine) => this.props.updateBookingLine(bookingLine)}
                    createBookingLineDetail={(bookingLine) => this.props.createBookingLineDetail(bookingLine)}
                    updateBookingLineDetail={(bookingLine) => this.props.updateBookingLineDetail(bookingLine)}
                    packageTypes={this.state.packageTypes}
                />

                <StatusHistorySlider
                    isOpen={isShowStatusHistorySlider}
                    statusHistories={statusHistories}
                    booking={booking}
                    toggleStatusHistorySlider={this.toggleStatusHistorySlider}
                    allBookingStatus={allBookingStatus}
                    OnCreateStatusHistory={(statusHistory, isShowStatusDetailInput, isShowStatusActionInput) => this.OnCreateStatusHistory(statusHistory, isShowStatusDetailInput, isShowStatusActionInput)}
                    OnUpdateStatusHistory={(statusHistory, needToUpdateBooking, isShowStatusDetailInput, isShowStatusActionInput) => this.OnUpdateStatusHistory(statusHistory, needToUpdateBooking, isShowStatusDetailInput, isShowStatusActionInput)}
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
                    isOpen={this.state.isShowDeleteCommConfirmModal}
                    onOk={() => this.onClickConfirmBtn('delete-comm')}
                    onCancel={this.toggleDeleteCommConfirmModal}
                    title={'Delete Comm Log'}
                    text={'Are you sure you want to delete this comm, all related notes will also be deleted?'}
                    okBtnName={'Delete'}
                />

                <ConfirmModal
                    isOpen={this.state.isShowDeleteFileConfirmModal}
                    onOk={() => this.onClickConfirmBtn('delete-file')}
                    onCancel={this.toggleDeleteFileConfirmModal}
                    title={this.state.selectedFileOption === 'label' ? 'Delete Label' : 'Delete POD'}
                    text={'Are you sure you want to delete this file?'}
                    okBtnName={'Delete'}
                />

                {booking && booking.booking_Created_For &&
                    <ConfirmModal
                        isOpen={this.state.isShowUpdateCreatedForEmailConfirmModal}
                        onOk={() => this.onClickConfirmBtn('booking_Created_For')}
                        onCancel={this.toggleUpdateCreatedForEmailConfirmModal}
                        title={'Update Client Employee`s email'}
                        text={`Are you sure you want to update email for ${booking.booking_Created_For.toUpperCase()}?`}
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
                />

                <EmailLogSlider
                    isOpen={this.state.isShowEmailLogSlider}
                    toggleSlider={this.toggleEmailLogSlider}
                    emailLogs={this.state.emailLogs}
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
        cntComms: state.booking.cntComms,
        cntAttachments: state.booking.cntAttachments,
        isAutoAugmented: state.booking.isAutoAugmented,
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
        comms: state.comm.comms,
        needUpdateComms: state.comm.needUpdateComms,
        notes: state.comm.notes,
        needUpdateNotes: state.comm.needUpdateNotes,
        needUpdateBookingLines: state.bookingLine.needUpdateBookingLines,
        needUpdateBookingLineDetails: state.bookingLineDetail.needUpdateBookingLineDetails,
        needUpdateLineAndLineDetail: state.booking.needUpdateLineAndLineDetail,
        clientname: state.auth.clientname,
        username: state.auth.username,
        clientId: state.auth.clientId,
        warehouses: state.warehouse.warehouses,
        dmeClients: state.auth.dmeClients,
        clientPK: state.auth.clientPK,
        noBooking: state.booking.noBooking,
        packageTypes: state.extra.packageTypes,
        allBookingStatus: state.extra.allBookingStatus,
        statusHistories: state.extra.statusHistories,
        needUpdateStatusHistories: state.extra.needUpdateStatusHistories,
        statusActions: state.extra.statusActions,
        statusDetails: state.extra.statusDetails,
        availableCreators: state.comm.availableCreators,
        apiBCLs: state.extra.apiBCLs,
        allFPs: state.extra.allFPs,
        needUpdateStatusActions: state.extra.needUpdateStatusActions,
        needUpdateStatusDetails: state.extra.needUpdateStatusDetails,
        needUpdateBooking: state.booking.needUpdateBooking,
        needToFetchGeoInfo: state.booking.needToFetchGeoInfo,
        isTickedManualBook: state.booking.isTickedManualBook,
        pricingInfos: state.booking.pricingInfos,
        emailLogs: state.extra.emailLogs,
        createdForInfos: state.user.createdForInfos,
        extraErrorMessage: state.extra.errorMessage,
        bookingErrorMessage: state.booking.errorMessage,
        zoho_tickets: state.extra.zoho_tickets,
        loadingZohoTickets: state.extra.loadingZohoTickets,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        autoAugmentBooking: (bookingId) => dispatch(autoAugmentBooking(bookingId)),
        revertAugmentBooking: (bookingId) => dispatch(revertAugmentBooking(bookingId)),
        checkAugmentedBooking: (bookingId) => dispatch(checkAugmentedBooking(bookingId)),
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
        updateBooking: (id, booking) => dispatch(updateBooking(id, booking)),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        createComm: (comm) => dispatch(createComm(comm)),
        getComms: (id, sortField, columnFilters) => dispatch(getComms(id, sortField, columnFilters)),        
        updateComm: (id, updatedComm) => dispatch(updateComm(id, updatedComm)),
        deleteComm: (id) => dispatch(deleteComm(id)),
        getNotes: (commId) => dispatch(getNotes(commId)),
        createNote: (note) => dispatch(createNote(note)),
        updateNote: (id, updatedNote) => dispatch(updateNote(id, updatedNote)),
        deleteNote: (id) => dispatch(deleteNote(id)),
        getWarehouses: () => dispatch(getWarehouses()),
        getDMEClients: () => dispatch(getDMEClients()),
        setClientPK: (clientId) => dispatch(setClientPK(clientId)),
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
        getAvailableCreators: () => dispatch(getAvailableCreators()),
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
        getZohoTickets:  (dmeid) => dispatch(getZohoTickets(dmeid)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BookingPage));

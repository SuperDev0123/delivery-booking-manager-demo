import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';

import Clock from 'react-live-clock';
import _ from 'lodash';
import Select from 'react-select';
import moment from 'moment-timezone';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import LoadingOverlay from 'react-loading-overlay';
import DropzoneComponent from 'react-dropzone-component';
import { Button, Modal as ReactstrapModal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import Modal from 'react-modal';
import CKEditor from 'ckeditor4-react';

import user from '../public/images/user.png';
import { API_HOST, STATIC_HOST, HTTP_PROTOCOL } from '../config';
import CommTooltipItem from '../components/Tooltip/CommTooltipComponent';
import EditorPreview from '../components/EditorPreview/EditorPreview';
import SwitchClientModal from '../components/CommonModals/SwitchClientModal';
import LineAndLineDetailSlider from '../components/Sliders/LineAndLineDetailSlider';
import LineTrackingSlider from '../components/Sliders/LineTrackingSlider';
import StatusHistorySlider from '../components/Sliders/StatusHistorySlider';

import { verifyToken, cleanRedirectState, getDMEClients, setClientPK } from '../state/services/authService';
import { getBookingWithFilter, getAttachmentHistory, getSuburbStrings, getDeliverySuburbStrings, alliedBooking, stBooking, saveBooking, updateBooking, duplicateBooking, resetNeedUpdateLineAndLineDetail, getLatestBooking, cancelBook } from '../state/services/bookingService';
import { getBookingLines, createBookingLine, updateBookingLine, deleteBookingLine, duplicateBookingLine } from '../state/services/bookingLinesService';
import { getBookingLineDetails, createBookingLineDetail, updateBookingLineDetail, deleteBookingLineDetail, duplicateBookingLineDetail } from '../state/services/bookingLineDetailsService';
import { createComm, getCommsWithBookingId, updateComm, setGetCommsFilter, getNotes, createNote, updateNote } from '../state/services/commService';
import { getWarehouses } from '../state/services/warehouseService';
import { getPackageTypes, getAllBookingStatus, saveStatusHistory, getBookingStatusHistory } from '../state/services/extraService';

class BookingPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isShowAddServiceAndOpt: false,
            isShowBookingCntAndTot: false,
            formInputs: {},
            commFormInputs: {
                assigned_to: 'emadeisky', 
                priority_of_log: 'Standard',
                dme_notes_type: 'Delivery',
                dme_action: 'No follow up required, noted for info purposes',
                additional_action_task: '',
                notes_type: 'Call',
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
            bAllComboboxViewOnlyonBooking: false,
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
            selectedNoteId: null,
            selectedNoteNo: 0,
            selectedNoteDetail: null,
            isShowNoteForm: false,
            noteFormMode: 'create',
            commFormMode: 'create',
            noteFormInputs: {},
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
            username: null,
            isBookingSelected: false,
            warehouses: [],
            isShowNoteDetailModal: false,
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
        };

        this.djsConfig = {
            addRemoveLinks: true,
            autoProcessQueue: false,
            params: { filename: 'file' }
        };

        this.componentConfig = {
            iconFiletypes: ['.xlsx'],
            showFiletypeIcon: true,
            postUrl: HTTP_PROTOCOL + '://' + API_HOST + '/share/attachments/filename',
        };

        this.dropzone = null;
        this.handleOnSelectLineRow = this.handleOnSelectLineRow.bind(this);
        this.toggleDuplicateBookingOptionsModal = this.toggleDuplicateBookingOptionsModal.bind(this);
        this.toggleCreateCommModal = this.toggleCreateCommModal.bind(this);
        this.toggleUpdateCommModal = this.toggleUpdateCommModal.bind(this);
        this.toggleNoteDetailModal = this.toggleNoteDetailModal.bind(this);
        this.toggleSwitchClientModal = this.toggleSwitchClientModal.bind(this);
        this.toggleShowLineSlider = this.toggleShowLineSlider.bind(this);
        this.toggleShowLineTrackingSlider = this.toggleShowLineTrackingSlider.bind(this);
        this.toggleShowStatusHistorySlider = this.toggleShowStatusHistorySlider.bind(this);
    }

    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        saveBooking: PropTypes.func.isRequired,
        duplicateBooking: PropTypes.func.isRequired,
        createBookingLine: PropTypes.func.isRequired,
        duplicateBookingLine: PropTypes.func.isRequired,
        deleteBookingLine: PropTypes.func.isRequired,
        updateBookingLine: PropTypes.func.isRequired,
        createBookingLineDetail: PropTypes.func.isRequired,
        duplicateBookingLineDetail: PropTypes.func.isRequired,
        deleteBookingLineDetail: PropTypes.func.isRequired,
        updateBookingLineDetail: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        getBookingWithFilter: PropTypes.func.isRequired,
        getSuburbStrings: PropTypes.func.isRequired,
        getDeliverySuburbStrings: PropTypes.func.isRequired,
        getBookingLines: PropTypes.func.isRequired,
        getBookingLineDetails: PropTypes.func.isRequired,
        alliedBooking: PropTypes.func.isRequired,
        stBooking: PropTypes.func.isRequired,
        updateBooking: PropTypes.func.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
        getAttachmentHistory: PropTypes.func.isRequired,
        resetNeedUpdateLineAndLineDetail: PropTypes.func.isRequired,
        createComm: PropTypes.func.isRequired,
        getCommsWithBookingId: PropTypes.func.isRequired,
        updateComm: PropTypes.func.isRequired,
        setGetCommsFilter: PropTypes.func.isRequired,
        getNotes: PropTypes.func.isRequired,
        createNote: PropTypes.func.isRequired,
        updateNote: PropTypes.func.isRequired,
        getWarehouses: PropTypes.func.isRequired,
        getLatestBooking: PropTypes.func.isRequired,
        getDMEClients: PropTypes.func.isRequired,
        setClientPK: PropTypes.func.isRequired,
        cancelBook: PropTypes.func.isRequired,
        getBookingStatusHistory: PropTypes.func.isRequired,
        getPackageTypes: PropTypes.func.isRequired,
        getAllBookingStatus: PropTypes.func.isRequired,
        saveStatusHistory: PropTypes.func.isRequired,
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
            this.props.getBookingWithFilter(bookingId, 'id');
            this.props.getCommsWithBookingId(bookingId);
            this.setState({loading: true, curViewMode: 0});
        } else {
            this.props.getLatestBooking();
            this.setState({loading: true, curViewMode: 0});
            // this.props.getSuburbStrings('state', undefined);
            // this.props.getDeliverySuburbStrings('state', undefined);
        }

        this.props.getAllBookingStatus();
        this.props.getDMEClients();
        this.props.getWarehouses();
        this.props.getPackageTypes();
        Modal.setAppElement(this.el);
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { attachments, puSuburbs, puPostalCodes, puStates, bAllComboboxViewOnlyonBooking, deToSuburbs, deToPostalCodes, deToStates, redirect, booking ,bookingLines, bookingLineDetails, bBooking, nextBookingId, prevBookingId, needUpdateBookingLines, needUpdateBookingLineDetails, needUpdateLineAndLineDetail, comms, needUpdateComms, notes, needUpdateNotes, username, clientname, clientId, warehouses, dmeClients, clientPK, noBooking, packageTypes, statusHistories, allBookingStatus, needUpdateStatusHistories } = newProps;
        const currentRoute = this.props.location.pathname;

        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/');
        }

        if (username) {
            this.setState({username});
        }

        if (clientPK) {
            this.setState({clientPK});
        }

        if (dmeClients) {
            this.setState({dmeClients});
        }

        if (clientname) {
            this.setState({clientname});
        }

        if (clientId) {
            this.setState({clientId});
        }

        if (comms) {
            this.setState({comms});
        }

        if (notes) {
            this.setState({notes});
        }

        if (needUpdateComms) {
        //     this.props.getCommsWithBookingId(booking.id);
        }

        if (needUpdateNotes) {
        //     this.props.getNotes(selectedCommId);
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

        if (bookingLines) {
            const calcedbookingLines = this.calcBookingLine(bookingLines);
            this.setState({bookingLines: calcedbookingLines});
            const bookingLinesListProduct = calcedbookingLines.map((bookingLine) => {
                let result = {};
                result['pk_lines_id'] = bookingLine.pk_lines_id ? bookingLine.pk_lines_id : '';
                result['e_type_of_packaging'] = bookingLine.e_type_of_packaging ? bookingLine.e_type_of_packaging : '';
                result['e_item'] = bookingLine.e_item ? bookingLine.e_item : '';
                result['e_qty'] = bookingLine.e_qty ? bookingLine.e_qty : '';
                result['e_weightUOM'] = bookingLine.e_weightUOM ? bookingLine.e_weightUOM : '';
                result['e_weightPerEach'] = bookingLine.e_weightPerEach ? bookingLine.e_weightPerEach : '';
                result['e_Total_KG_weight'] = bookingLine.e_Total_KG_weight ? bookingLine.e_Total_KG_weight.toFixed(2) : '';
                result['e_dimUOM'] = bookingLine.e_dimUOM ? bookingLine.e_dimUOM : '';
                result['e_dimLength'] = bookingLine.e_dimLength ? bookingLine.e_dimLength : '';
                result['e_dimWidth'] = bookingLine.e_dimWidth ? bookingLine.e_dimWidth : '';
                result['e_dimHeight'] = bookingLine.e_dimHeight ? bookingLine.e_dimHeight : '';
                result['e_1_Total_dimCubicMeter'] = bookingLine.e_1_Total_dimCubicMeter ? bookingLine.e_1_Total_dimCubicMeter.toFixed(2) : '';
                result['total_2_cubic_mass_factor_calc'] = bookingLine.total_2_cubic_mass_factor_calc ? bookingLine.total_2_cubic_mass_factor_calc.toFixed(2) : 0;
                result['e_qty_awaiting_inventory'] = bookingLine.e_qty_awaiting_inventory ? bookingLine.e_qty_awaiting_inventory : 0;
                result['e_qty_collected'] = bookingLine.e_qty_collected ? bookingLine.e_qty_collected : 0;
                result['e_qty_scanned_depot'] = bookingLine.e_qty_scanned_depot ? bookingLine.e_qty_scanned_depot : 0;
                result['e_qty_delivered'] = bookingLine.e_qty_delivered ? bookingLine.e_qty_delivered : 0;
                result['e_qty_adjusted_delivered'] = bookingLine.e_qty_adjusted_delivered ? bookingLine.e_qty_adjusted_delivered : 0;
                result['e_qty_damaged'] = bookingLine.e_qty_damaged ? bookingLine.e_qty_damaged : 0;
                result['e_qty_returned'] = bookingLine.e_qty_returned ? bookingLine.e_qty_returned : 0;
                result['e_qty_shortages'] = bookingLine.e_qty_shortages ? bookingLine.e_qty_shortages : 0;
                return result;
            });
            this.setState({products: bookingLinesListProduct, bookingLinesListProduct, loadingBookingLine: false});
        }

        if (bookingLineDetails) {
            const tempBookings = bookingLineDetails;
            const bookingLineDetailsProduct = tempBookings.map((bookingLineDetail) => {
                let result = {};
                result['pk_id_lines_data'] = bookingLineDetail.pk_id_lines_data ? bookingLineDetail.pk_id_lines_data : '';
                result['modelNumber'] = bookingLineDetail.modelNumber ? bookingLineDetail.modelNumber : '';
                result['itemDescription'] = bookingLineDetail.itemDescription ? bookingLineDetail.itemDescription : '';
                result['quantity'] = bookingLineDetail.quantity ? bookingLineDetail.quantity : '';
                result['itemFaultDescription'] = bookingLineDetail.itemFaultDescription ? bookingLineDetail.itemFaultDescription : '';
                result['insuranceValueEach'] = bookingLineDetail.insuranceValueEach ? bookingLineDetail.insuranceValueEach : '';
                result['gap_ra'] = bookingLineDetail.gap_ra ? bookingLineDetail.gap_ra : '';
                result['clientRefNumber'] = bookingLineDetail.clientRefNumber ? bookingLineDetail.clientRefNumber : '';
                result['fk_id_booking_lines'] = bookingLineDetail.fk_id_booking_lines ? bookingLineDetail.fk_id_booking_lines : '';
                return result;
            });

            this.setState({bookingLineDetailsProduct, bookingLineDetails, loadingBookingLineDetail: false});
        }

        if (needUpdateLineAndLineDetail && booking && booking.pk_booking_id) {
            this.setState({loadingBookingLine: true});
            this.props.resetNeedUpdateLineAndLineDetail();
            this.props.getBookingLines(booking.pk_booking_id);
            this.props.getBookingLineDetails(booking.pk_booking_id);
        }

        if (needUpdateBookingLines && booking && booking.pk_booking_id) {
            this.setState({loadingBookingLine: true});
            this.props.getBookingLines(booking.pk_booking_id);
        }

        if (needUpdateBookingLineDetails && booking && booking.pk_booking_id) {
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

        if ((!noBooking && booking && !bAllComboboxViewOnlyonBooking && this.state.selectionChanged === 0 && parseInt(this.state.curViewMode) === 0) || 
            (!noBooking && booking && !bAllComboboxViewOnlyonBooking && this.state.loading && parseInt(this.state.curViewMode) === 0)) {
            if (booking.b_bookingID_Visual) {
                let formInputs = this.state.formInputs;

                if (booking.puCompany != null) formInputs['puCompany'] = booking.puCompany;
                else formInputs['puCompany'] = '';
                if (booking.pu_Address_Street_1 != null) formInputs['pu_Address_Street_1'] = booking.pu_Address_Street_1;
                else formInputs['pu_Address_Street_1'] = '';
                if (booking.pu_Address_street_2 != null) formInputs['pu_Address_street_2'] = booking.pu_Address_street_2;
                else formInputs['pu_Address_street_2'] = '';
                if (booking.pu_Address_PostalCode != null) formInputs['pu_Address_PostalCode'] = booking.pu_Address_PostalCode;
                else formInputs['pu_Address_PostalCode'] = '';
                if (booking.pu_Address_Suburb != null) formInputs['pu_Address_Suburb'] = booking.pu_Address_Suburb;
                else formInputs['pu_Address_Suburb'] = '';
                if (booking.pu_Address_Country != null) formInputs['pu_Address_Country'] = booking.pu_Address_Country;
                else formInputs['pu_Address_Country'] = '';
                if (booking.pu_Contact_F_L_Name != null) formInputs['pu_Contact_F_L_Name'] = booking.pu_Contact_F_L_Name;
                else formInputs['pu_Contact_F_L_Name'] = '';
                if (booking.pu_Phone_Main != null) formInputs['pu_Phone_Main'] = booking.pu_Phone_Main;
                else formInputs['pu_Phone_Main'] = '';
                if (booking.pu_Email != null) formInputs['pu_Email'] = booking.pu_Email;
                else formInputs['pu_Email'] = '';
                if (booking.de_To_Address_Street_1 != null) formInputs['de_To_Address_Street_1'] = booking.de_To_Address_Street_1;
                else formInputs['de_To_Address_Street_1'] = '';
                if (booking.de_To_Address_Street_2 != null) {formInputs['de_To_Address_Street_2'] = booking.de_To_Address_Street_2;}
                else formInputs['de_To_Address_Street_2'] = '';
                if (booking.de_To_Address_PostalCode != null) formInputs['de_To_Address_PostalCode'] = booking.de_To_Address_PostalCode;
                else formInputs['de_To_Address_PostalCode'] = '';
                if (booking.de_To_Address_Suburb != null) formInputs['de_To_Address_Suburb'] = booking.de_To_Address_Suburb;
                else formInputs['de_To_Address_Suburb'] = '';
                if (booking.de_To_Address_Country != null) formInputs['de_To_Address_Country'] = booking.de_To_Address_Country;
                else formInputs['de_To_Address_Country'] = '';
                if (booking.de_to_Contact_F_LName != null) formInputs['de_to_Contact_F_LName'] = booking.de_to_Contact_F_LName;
                else formInputs['de_to_Contact_F_LName'] = '';
                if (booking.de_to_Phone_Main != null) formInputs['de_to_Phone_Main'] = booking.de_to_Phone_Main;
                else formInputs['de_to_Phone_Main'] = '';
                if (booking.de_Email != null) formInputs['de_Email'] = booking.de_Email;
                else formInputs['de_Email'] = '';
                if (booking.deToCompanyName != null) formInputs['deToCompanyName'] = booking.deToCompanyName;
                else formInputs['deToCompanyName'] = '';
                if (booking.pu_Address_State != null) formInputs['pu_Address_State'] = booking.pu_Address_State;
                else formInputs['pu_Address_State'] = '';
                if (booking.de_To_Address_State != null) formInputs['de_To_Address_State'] = booking.de_To_Address_State;
                else formInputs['de_To_Address_State'] = '';
                if (booking.s_20_Actual_Pickup_TimeStamp != null) formInputs['s_20_Actual_Pickup_TimeStamp'] = booking.s_20_Actual_Pickup_TimeStamp;
                else formInputs['s_20_Actual_Pickup_TimeStamp'] = '';
                if (booking.s_21_Actual_Delivery_TimeStamp != null) formInputs['s_21_Actual_Delivery_TimeStamp'] = booking.s_21_Actual_Delivery_TimeStamp.de_Deliver_From_Date;
                else formInputs['s_21_Actual_Delivery_TimeStamp'] = '';
                if (booking.b_client_name != null) formInputs['b_client_name'] = booking.b_client_name;
                else formInputs['b_client_name'] = '';
                if (booking.b_client_warehouse_code != null) formInputs['b_client_warehouse_code'] = booking.b_client_warehouse_code;
                else formInputs['b_client_warehouse_code'] = '';
                if (booking.b_clientPU_Warehouse != null) formInputs['b_clientPU_Warehouse'] = booking.b_clientPU_Warehouse;
                else formInputs['b_clientPU_Warehouse'] = '';
                if (booking.booking_Created_For_Email != null) formInputs['booking_Created_For_Email'] = booking.booking_Created_For_Email;
                else formInputs['booking_Created_For_Email'] = '';
                if (booking.booking_Created_For != null) formInputs['booking_Created_For'] = booking.booking_Created_For;
                else formInputs['booking_Created_For'] = '';

                if (booking.vx_fp_pu_eta_time != null) formInputs['vx_fp_pu_eta_time'] = booking.vx_fp_pu_eta_time;
                else formInputs['vx_fp_pu_eta_time'] = '';
                if (booking.vx_fp_del_eta_time != null) formInputs['vx_fp_del_eta_time'] = booking.vx_fp_del_eta_time;
                else formInputs['vx_fp_del_eta_time'] = '';

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

                if (booking.pu_Address_Country != undefined && booking.pu_Address_State != undefined) {
                    this.setState({puTimeZone: this.getTime(booking.pu_Address_Country, booking.pu_Address_State)});
                }
                if (booking.de_To_Address_Country != undefined && booking.de_To_Address_State != undefined) {
                    this.setState({deTimeZone: this.getTime(booking.de_To_Address_Country, booking.de_To_Address_State)});
                }

                //For Additioan Services
                let tempAdditionalServices = this.state.AdditionalServices;
                if (booking.vx_freight_provider != null) tempAdditionalServices.vx_freight_provider = booking.vx_freight_provider;
                else tempAdditionalServices.vx_freight_provider = '';
                if (booking.vx_serviceName != null) tempAdditionalServices.vx_serviceName = booking.vx_serviceName;
                else tempAdditionalServices.vx_serviceName = '';
                if (booking.consignment_label_link != null) tempAdditionalServices.consignment_label_link = booking.consignment_label_link;
                else tempAdditionalServices.consignment_label_link = '';
                if (booking.s_02_Booking_Cutoff_Time != null) tempAdditionalServices.s_02_Booking_Cutoff_Time = booking.s_02_Booking_Cutoff_Time;
                else tempAdditionalServices.s_02_Booking_Cutoff_Time = '';
                if (booking.puPickUpAvailFrom_Date != null) tempAdditionalServices.puPickUpAvailFrom_Date = booking.puPickUpAvailFrom_Date;
                else tempAdditionalServices.puPickUpAvailFrom_Date = '';
                if (booking.z_CreatedTimestamp != null) tempAdditionalServices.z_CreatedTimestamp = booking.z_CreatedTimestamp;
                else tempAdditionalServices.z_CreatedTimestamp = '';
                tempAdditionalServices.Quoted = '';
                if (booking.b_dateBookedDate != null) tempAdditionalServices.b_dateBookedDate = booking.b_dateBookedDate;
                else tempAdditionalServices.b_dateBookedDate = '';
                tempAdditionalServices.Invoiced = '';

                let AdditionalServices = [];
                AdditionalServices.push(tempAdditionalServices);

                this.setState({
                    puPostalCode: {'value': booking.pu_Address_PostalCode ? booking.pu_Address_PostalCode : null, 'label': booking.pu_Address_PostalCode ? booking.pu_Address_PostalCode : null},
                    puSuburb: {'value': booking.pu_Address_Suburb ? booking.pu_Address_Suburb : null, 'label': booking.pu_Address_Suburb ? booking.pu_Address_Suburb : null},
                    puState: {'value': booking.pu_Address_State ? booking.pu_Address_State : null, 'label': booking.pu_Address_State ? booking.pu_Address_State : null},
                    deToPostalCode: {'value': booking.de_To_Address_PostalCode ? booking.de_To_Address_PostalCode : null, 'label': booking.de_To_Address_PostalCode ? booking.de_To_Address_PostalCode : null},
                    deToSuburb: {'value': booking.de_To_Address_Suburb ? booking.de_To_Address_Suburb : null, 'label': booking.de_To_Address_Suburb ? booking.de_To_Address_Suburb : null},
                    deToState: {'value': booking.de_To_Address_State ? booking.de_To_Address_State : null, 'label': booking.de_To_Address_State ? booking.de_To_Address_State : null},
                    curViewMode: booking.b_dateBookedDate && booking.b_dateBookedDate.length > 0 ? 0 : 2,
                });

                if ( (booking.b_dateBookedDate !== null) && (booking.b_dateBookedDate !== undefined)) {
                    this.setState({bAllComboboxViewOnlyonBooking: true});
                } else {
                    this.setState({bAllComboboxViewOnlyonBooking: false});
                }

                if (this.state.loading && booking.pk_booking_id) {
                    this.props.getBookingLines(booking.pk_booking_id);
                    this.props.getBookingLineDetails(booking.pk_booking_id);
                    this.props.getCommsWithBookingId(booking.id);
                    this.props.getBookingStatusHistory(booking.pk_booking_id);
                }

                this.setState({ AdditionalServices, formInputs, booking, nextBookingId, prevBookingId, loading: false, isBookingSelected: true });
            } else {
                this.setState({ formInputs: {}, loading: false });
                if (!_.isNull(this.state.typed))
                    alert('There is no such booking with that DME/CON number.');
            }
        }

        if (!bAllComboboxViewOnlyonBooking) {
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
            } else {
                this.props.getSuburbStrings('state', undefined);
                this.setState({loadingGeoPU: true});
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
            } else {
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
        }

        if (attachments && attachments.length > 0) {
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
    }

    getTime(country, city) {
        const timeZoneTable =
        {
            'Australia':
            {
                'ACT': 'Australia/Currie',
                'NT': 'Australia/Darwin',
                'SA': 'Australia/Adelaide',
                'WA': 'Australia/Perth',
                'NSW': 'Australia/Sydney',
                'QLD': 'Australia/Brisbane',
                'VIC': 'Australia/Melbourne',
                'TAS': 'Australia/Hobart',
            },
            'AU':
            {
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
        if (this.state.bAllComboboxViewOnlyonBooking === false) {
            let {formInputs, booking} = this.state;

            formInputs[e.target.name] = e.target.value;
            booking[e.target.name] = e.target.value;

            this.setState({ formInputs, booking, isBookingModified: true });
        }
    }

    getRadioValue(event) {
        console.log(event.target.value);
    }

    onClickPrev(e){
        e.preventDefault();
        const {prevBookingId} = this.state;

        if (prevBookingId && prevBookingId > -1) {
            this.props.getBookingWithFilter(prevBookingId, 'id');
        }

        this.setState({loading: true, curViewMode: 0});
    }

    onClickPrinter(booking) {
        const st_name = 'startrack';
        const allied_name = 'allied';

        if (booking.z_label_url && booking.z_label_url.length > 0) {
            if (booking.vx_freight_provider.toLowerCase() === st_name) {
                const win = window.open(booking.z_label_url);
                win.focus();
            } else if (booking.vx_freight_provider.toLowerCase() === allied_name) {
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

    onClickNext(e){
        e.preventDefault();
        const {nextBookingId} = this.state;

        if (nextBookingId && nextBookingId > -1) {
            this.props.getBookingWithFilter(nextBookingId, 'id');
        }

        this.setState({loading: true, curViewMode: 0});
    }

    calcBookingLine(bookingLines) {
        let qty = 0;
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
            return bookingLine;
        });

        this.setState({bookingTotals: [{id: 0, qty, total_kgs: total_kgs.toFixed(2), cubic_meter: cubic_meter.toFixed(2)}]});
        return newBookingLines;
    }

    onClickBook() {
        const {booking } = this.state;
        const st_name = 'startrack';
        const allied_name = 'allied';
        if (booking.id && (booking.id != undefined)) {
            this.setState({ loading: true, curViewMode: 0});
            if (booking.vx_freight_provider && booking.vx_freight_provider.toLowerCase() === st_name) {
                this.props.stBooking(booking.id);
            } else if (booking.vx_freight_provider && booking.vx_freight_provider.toLowerCase() === allied_name) {
                this.props.alliedBooking(booking.id);
            }
        } else {
            alert('Please Find any booking and then click this!');
        }
    }

    onKeyPress(e) {
        const {selected} = this.state;
        const typed = e.target.value;

        if (e.key === 'Enter') {
            e.preventDefault();

            if((selected == undefined) || (selected == '')){
                alert('id value is empty');
                return;
            }
            if((typed == undefined) || (typed == '')){
                alert('id value is empty');
                return;
            }
            this.props.getBookingWithFilter(typed, selected);
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
        if (this.state.bAllComboboxViewOnlyonBooking == false) {
            if (num === 0) {
                this.props.getSuburbStrings('postalcode', selectedOption.label);
                this.setState({puState: selectedOption, puPostalCode: null, puSuburb: null, selectionChanged: 1, loadingGeoPU: true});
            } else if (num === 1) {
                this.props.getDeliverySuburbStrings('postalcode', selectedOption.label);
                this.setState({deToState: selectedOption, deToPostalCode: null, deToSuburb: null, selectionChanged: 2, loadingGeoDeTo: true});
            }
        }
    };

    handleChangePostalCode = (num, selectedOption) => {
        if (this.state.bAllComboboxViewOnlyonBooking == false) {
            if (num === 0) {
                this.props.getSuburbStrings('suburb', selectedOption.label);
                this.setState({puPostalCode: selectedOption, puSuburb: null, selectionChanged: 1, loadingGeoPU: true});
            } else if (num === 1) {
                this.props.getDeliverySuburbStrings('suburb', selectedOption.label);
                this.setState({deToPostalCode: selectedOption, deToSuburb: null, selectionChanged: 2, loadingGeoDeTo: true});
            }
        }
    };

    handleChangeSuburb = (num, selectedOption) => {
        if (this.state.bAllComboboxViewOnlyonBooking == false) {
            if (num === 0) {
                this.setState({ puSuburb: selectedOption});    
            } else if (num === 1) {
                this.setState({ deToSuburb: selectedOption});
            }
        }
    };

    handleChangeWarehouse = (selectedOption) => {
        let formInputs = this.state.formInputs;
        formInputs['b_client_warehouse_code'] = selectedOption.value;
        formInputs['b_clientPU_Warehouse'] = this.getSelectedWarehouseInfoFromCode(selectedOption.value, 'name');
        this.setState({formInputs});
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

    handlePost(e) {
        e.preventDefault();
        const {booking} = this.state;
        if ( booking != null && booking.id != null) {
            this.dropzone.processQueue();
        } else {
            alert('There is no booking data.');
        }
    }

    displayNoOptionsMessage() {
        if (this.state.bAllComboboxViewOnlyonBooking == true) {
            return 'No Editable';
        }
    }

    handleFileSending(data, xhr, formData) {
        formData.append('warehouse_id', this.state.booking.id);
    }

    handleUploadSuccess(file) {
        let uploadedFileName = file.xhr.responseText.substring(file.xhr.responseText.indexOf('"'));
        uploadedFileName = uploadedFileName.replace(/"/g,'');
        this.interval = setInterval(() => this.myTimer(), 2000);

        this.setState({
            uploadedFileName,
            uploaded: true,
        });
    }

    handleUploadFinish() {
        this.props.getAttachmentHistory(this.state.booking.id);
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
            this.setState({switchInfo: false, dupLineAndLineDetail: false});
        }
    }

    onClickDelete(typeNum, row) {
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

        this.setState({[name]: value});
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
        window.location.assign('/comm?bookingid=' + this.state.booking.id);
    }

    onClickCreateComm() {
        this.toggleCreateCommModal();
        this.resetCommForm();
    }

    resetCommForm() {
        this.setState({commFormInputs: {
            assigned_to: 'emadeisky', 
            priority_of_log: 'Standard',
            dme_notes_type: 'Delivery',
            dme_action: 'No follow up required, noted for info purposes',
            additional_action_task: '',
            notes_type: 'Call',
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

        if (commFormMode === 'create') {
            const {booking} = this.state;
            commFormInputs['fk_booking_id'] = booking.pk_booking_id;

            this.props.createComm(commFormInputs);
            this.toggleCreateCommModal();
        } else if (commFormMode === 'update') {
            const {selectedCommId} = this.state;

            this.props.updateComm(selectedCommId, commFormInputs);
            this.toggleUpdateCommModal();
        }
    }

    onDateChange(type='comm', date) {
        if (type === 'comm') {
            let commFormInputs = this.state.commFormInputs;
            commFormInputs['due_by_date'] = moment(date).format('YYYY-MM-DD');
            this.setState({commFormInputs});
        } else if (type === 'note') {
            let noteFormInputs = this.state.noteFormInputs;
            noteFormInputs['note_date_updated'] = moment(date).format('YYYY-MM-DD');
            this.setState({noteFormInputs});
        }
    }

    onDatePlusOrMinus(type='comm', number) {
        console.log('number - ', number);

        if (type === 'comm') {
            let commFormInputs = this.state.commFormInputs;
            const date = moment(commFormInputs['due_by_date']).add(number, 'd').toDate();
            commFormInputs['due_by_date'] = date;
            this.setState({commFormInputs});
        } else if (type === 'note') {
            let noteFormInputs = this.state.noteFormInputs;
            const date = moment(noteFormInputs['note_date_updated']).add(number, 'd').toDate();
            noteFormInputs['note_date_updated'] = date;
            this.setState({noteFormInputs});
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

    onSubmitNote() {
        const {noteFormInputs, selectedNoteId, selectedCommId, notes, noteFormMode} = this.state;
        
        if (noteFormMode === 'create') {
            noteFormInputs['comm'] = selectedCommId;
            noteFormInputs['username'] = 'Stephen';
            noteFormInputs['dme_notes_no'] = (notes.length > 0) ? parseInt(notes[notes.length - 1]['dme_notes_no']) + 1 : 1;
            noteFormInputs['note_date_created'] = noteFormInputs['note_date_updated'];
            noteFormInputs['note_time_created'] = noteFormInputs['note_time_updated'];
            this.props.createNote(noteFormInputs);
        } else if (noteFormMode === 'update') {
            noteFormInputs['comm'] = selectedCommId;
            delete noteFormInputs.z_modifiedTimeStamp;
            this.props.updateNote(selectedNoteId, noteFormInputs);
        }

        this.setState({isShowNoteForm: false, noteFormInputs: {}});
    }

    onUpdateBtnClick(type, data, index=0) {
        console.log('Click update comm button');
        
        const {comms, notes, actionTaskOptions} = this.state;
        if (type === 'comm') {
            let comm = {};

            for (let i = 0; i < comms.length; i++) {
                if (comms[i].id === data.id) {
                    comm = comms[i];
                }
            }

            const commFormInputs = comm;
            commFormInputs['due_by_time'] = comm.due_by_time ? comm.due_by_time.substring(0, 5) : null;

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
        } else if (type === 'note') {
            let note = {};

            for (let i = 0; i < notes.length; i++) {
                if (notes[i].id === data.id) {
                    note = notes[i];
                }
            }

            const noteFormInputs = note;
            this.setState({selectedNoteNo: index, selectedNoteId: note.id, noteFormInputs});
            this.setState({isShowNoteForm: true, noteFormMode: 'update'});
        }
    }

    onCancelNoteForm() {
        this.setState({isShowNoteForm: false});
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
    
    onCreateNoteButton() {
        this.setState({isShowNoteForm: true, noteFormMode: 'create', noteFormInputs: {}});
    }

    clearDateOrTime(type, dateOrTime) {
        let noteFormInputs = this.state.noteFormInputs;
        let commFormInputs = this.state.commFormInputs;

        if (type === 'comm') {
            if (dateOrTime === 'date') {
                commFormInputs['due_by_date'] = null;
            } else if (dateOrTime === 'time') {
                commFormInputs['due_by_time'] = null;
            }

            this.setState({commFormInputs});
        } else if (type === 'note') {
            if (dateOrTime === 'date') {
                noteFormInputs['note_date_updated'] = null;
            } else if (dateOrTime === 'time') {
                noteFormInputs['note_time_updated'] = null;
            }

            this.setState({noteFormInputs});
        }
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

    onClickNoteDetailCell(note) {
        this.setState({selectedNoteDetail: note.dme_notes});
        this.toggleNoteDetailModal();
    }

    toggleNoteDetailModal() {
        this.setState(prevState => ({isShowNoteDetailModal: !prevState.isShowNoteDetailModal}));
    }

    toggleSwitchClientModal() {
        this.setState(prevState => ({isShowSwitchClientModal: !prevState.isShowSwitchClientModal}));
    }

    toggleShowLineSlider() {
        const { isBookingSelected } = this.state;

        if (isBookingSelected) {
            this.setState(prevState => ({isShowLineSlider: !prevState.isShowLineSlider}));
        } else {
            alert('Please select a booking.');
        }
    }

    toggleShowLineTrackingSlider() {
        this.setState(prevState => ({isShowLineTrackingSlider: !prevState.isShowLineTrackingSlider}));
    }

    toggleShowStatusHistorySlider() {
        const { isBookingSelected } = this.state;

        if (isBookingSelected) {
            this.setState(prevState => ({isShowStatusHistorySlider: !prevState.isShowStatusHistorySlider}));
        } else {
            alert('Please select a booking.');
        }
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
            this.props.cancelBook(booking.id);
        }
    }

    onClickGoToAllBookings(e) {
        e.preventDefault();
        const {isBookingModified} = this.state;

        if (isBookingModified) {
            alert('You can lose modified booking info. Please update it');
        } else {
            this.props.history.push('/allbookings');
        }
    }

    onChangeViewMode(e) {
        if (parseInt(e.target.value) === 1) {
            this.showCreateView();
        }

        this.setState({curViewMode: e.target.value, isBookingModified: false});
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

    onClickCreateBooking() {
        const {formInputs, username, clientname, clientId, dmeClients, clientPK, puState, puSuburb, puPostalCode, deToState, deToSuburb, deToPostalCode} = this.state;

        if (clientPK === 0 || username !== 'dme') {
            formInputs['z_CreatedByAccount'] = username;
            formInputs['b_client_name'] = clientname;
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

            formInputs['b_client_name'] = dmeClients[ind].company_name;
            formInputs['kf_client_id'] = dmeClients[ind].dme_account_num;
            formInputs['fk_client_warehouse'] = this.getSelectedWarehouseInfoFromCode(formInputs['b_client_warehouse_code'], 'id');
        }

        formInputs['pu_Address_State'] = puState ? puState.label : '';
        formInputs['pu_Address_Suburb'] = puSuburb ? puSuburb.label : '';
        formInputs['pu_Address_PostalCode'] = puPostalCode ? puPostalCode.label : '';
        formInputs['de_To_Address_State'] = deToState ? deToState.label : '';
        formInputs['de_To_Address_Suburb'] = deToSuburb ? deToSuburb.label : '';
        formInputs['de_To_Address_PostalCode'] = deToPostalCode ? deToPostalCode.label : '';
        formInputs['b_status'] = 'Entered';
        this.props.saveBooking(formInputs);
        this.setState({curViewMode: 0});
    }

    onClickUpdateBooking() {
        if (this.state.bAllComboboxViewOnlyonBooking == false) {
            let bookingToUpdate = this.state.booking;

            bookingToUpdate.pu_Address_State = this.state.puState.label;
            bookingToUpdate.pu_Address_PostalCode = this.state.puPostalCode.label;
            bookingToUpdate.pu_Address_Suburb = this.state.puSuburb.label;
            bookingToUpdate.de_To_Address_State = this.state.deToState.label;
            bookingToUpdate.de_To_Address_PostalCode = this.state.deToPostalCode.label;
            bookingToUpdate.de_To_Address_Suburb = this.state.deToSuburb.label;

            this.props.updateBooking(this.state.booking.id, bookingToUpdate);
            this.setState({loading: true, isBookingModified: false, curViewMode: 0});
        }
    }

    onClickConfirmBooking() {
        if (this.state.bAllComboboxViewOnlyonBooking == false) {
            let bookingToUpdate = this.state.booking;
            bookingToUpdate.z_manual_booking_set_to_confirm = moment();
            bookingToUpdate.b_status = 'Ready for booking';
            this.props.updateBooking(this.state.booking.id, bookingToUpdate);
        }
    }

    onClickOpenSlide(e) {
        e.preventDefault();
        this.toggleShowStatusHistorySlider();
    }

    OnSaveStatusHistory(statusHistory) {
        let newBooking = this.state.booking;
        newBooking.b_status = statusHistory['status_last'];
        this.props.updateBooking(this.state.booking.id, newBooking);
        this.props.saveStatusHistory(statusHistory);
    }

    onClickComms(e) {
        e.preventDefault();
        window.location.assign('/comm?bookingid=' + this.state.booking.id);
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

    render() {
        const {bAllComboboxViewOnlyonBooking, attachmentsHistory, booking, products, bookingTotals, AdditionalServices, bookingLineDetailsProduct, formInputs, commFormInputs, puState, puStates, puPostalCode, puPostalCodes, puSuburb, puSuburbs, deToState, deToStates, deToPostalCode, deToPostalCodes, deToSuburb, deToSuburbs, comms, isShowAdditionalActionTaskInput, isShowAssignedToInput, notes, isShowNoteForm, noteFormInputs, isShowCommModal, noteFormMode, isNotePaneOpen, commFormMode, actionTaskOptions, selectedNoteNo, username, warehouses, selectedNoteDetail, isShowSwitchClientModal, dmeClients, clientPK, isShowLineSlider, curViewMode, isBookingSelected, clientname, statusHistories, isShowStatusHistorySlider, allBookingStatus, isShowLineTrackingSlider} = this.state;

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

        const columnFreight = [
            {
                dataField: 'provider',
                text: 'Provider'
            }, {
                dataField: 'service',
                text: 'Service'
            }, {
                dataField: 'etd',
                text: 'ETD'
            }, {
                dataField: 'totalFeeEx',
                text: 'Total Fee Ex(GST)'
            }, {
                dataField: 'bookingCutoffTime',
                text: 'Booking Cutoff Time'
            },
        ];

        const datetimeFormatter = (cell) => {
            return (
                moment(cell).format('DD/MM/YYYY hh:mm:ss')
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

        const limitedHeightTitle = (cell, row) => {
            return (
                <div>
                    <div className="max-height-45 overflow-hidden" id={'comm-' + 'dme_com_title' + '-tooltip-' + row.id}>
                        {cell}
                    </div>
                    <CommTooltipItem comm={row} field={'dme_com_title'} />
                </div>
            );
        };

        const limitedHeightAction = (cell, row) => {
            return (
                <div>
                    <div className="max-height-45 overflow-hidden" id={'comm-' + 'dme_action' + '-tooltip-' + row.id}>
                        {cell}
                    </div>
                    <CommTooltipItem comm={row} field={'dme_action'} />
                </div>
            );
        };

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
                formatter: limitedHeightTitle,
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
                formatter: limitedHeightAction,
            }, {
                dataField: 'id',
                text: 'Update',
                style: {
                    width: '20px',
                },
                formatter: commUpdateCell,
            },
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
                dataField: 'consignment_label_link',
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

        const columnBookingCounts = [
            {
                dataField: 'qty',
                text: 'Total Pieces'
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
        const config = this.componentConfig;
        const djsConfig = this.djsConfig;
        const eventHandlers = {
            init: dz => this.dropzone = dz,
            sending: this.handleFileSending.bind(this),
            success: this.handleUploadSuccess.bind(this),
            queuecomplete: this.handleUploadFinish.bind(this),
        };

        const timeSelectOptions = [
            {value: '06:00', label: '06:00'},
            {value: '06:30', label: '06:30'},
            {value: '07:00', label: '07:00'},
            {value: '07:30', label: '07:30'},
            {value: '08:00', label: '08:00'},
            {value: '08:30', label: '08:30'},
            {value: '09:00', label: '09:00'},
            {value: '09:30', label: '09:30'},
            {value: '10:00', label: '10:00'},
            {value: '10:30', label: '10:30'},
            {value: '11:00', label: '11:00'},
            {value: '11:30', label: '11:30'},
            {value: '12:00', label: '12:00'},
            {value: '12:30', label: '12:30'},
            {value: '13:00', label: '13:00'},
            {value: '13:30', label: '13:30'},
            {value: '14:00', label: '14:00'},
            {value: '14:30', label: '14:30'},
            {value: '15:00', label: '15:00'},
            {value: '15:30', label: '15:30'},
            {value: '16:00', label: '16:00'},
            {value: '16:30', label: '16:30'},
            {value: '17:00', label: '17:00'},
            {value: '17:30', label: '17:30'},
            {value: '18:00', label: '18:00'},
            {value: '18:30', label: '18:30'},
            {value: '19:00', label: '19:00'},
            {value: '19:30', label: '19:30'},
            {value: '20:00', label: '20:00'},
            {value: '20:30', label: '20:30'},
            {value: '21:00', label: '21:00'},
            {value: '21:30', label: '21:30'},
            {value: '22:00', label: '22:00'},
            {value: '22:30', label: '22:30'},
            {value: '23:00', label: '23:00'},
            {value: '23:30', label: '23:30'},
            {value: '00:00', label: '00:00'},
            {value: '00:30', label: '00:30'},
            {value: '01:00', label: '01:00'},
            {value: '01:30', label: '01:30'},
            {value: '02:00', label: '02:00'},
            {value: '02:30', label: '02:30'},
            {value: '03:00', label: '03:00'},
            {value: '03:30', label: '03:30'},
            {value: '04:00', label: '04:00'},
            {value: '04:30', label: '04:30'},
            {value: '05:00', label: '05:00'},
            {value: '05:30', label: '05:30'},
        ];

        const due_by_time = {value: commFormInputs['due_by_time'], label: commFormInputs['due_by_time']};
        const note_time_updated = {value: noteFormInputs['note_time_updated'], label: noteFormInputs['note_time_updated']};

        const notesList = notes.map((note, index) => {
            return (
                <tr key={index}>
                    <td>{note.dme_notes_no}</td>
                    <td>{(note.note_date_updated && !_.isEmpty(note.note_date_updated)) ? moment(note.note_date_updated).format('DD MMM YYYY') : ''}</td>
                    <td>{(note.note_time_updated && !_.isEmpty(note.note_time_updated)) ? note.note_time_updated : ''}</td>
                    <td>{note.username}</td>
                    <td>{note.dme_notes_type}</td>
                    <td className='overflow-hidden' id={'note-detail-tooltip-' + note.id} onClick={() => this.onClickNoteDetailCell(note)}>
                        <EditorPreview data={note.dme_notes} />
                    </td>
                    <td className="update"><Button color="primary" onClick={() => this.onUpdateBtnClick('note', note, index)}>Update</Button></td>
                </tr>
            );
        });

        const actionTaskOptionsList = actionTaskOptions.map((actionTaskOption, key) => {
            return (<option key={key} value={actionTaskOption}>{actionTaskOption}</option>);
        });

        let warehouseCodeOptions = [];
        for (let i = 0; i < warehouses.length; i++) {
            warehouseCodeOptions.push({value: warehouses[i].client_warehouse_code, label: warehouses[i].client_warehouse_code});
        }

        const currentWarehouseCodeOption = {value: formInputs.b_client_warehouse_code ? formInputs.b_client_warehouse_code : null, label: formInputs.b_client_warehouse_code ? formInputs.b_client_warehouse_code : null};

        return (
            <div>
                <div id="headr" className="col-md-12">
                    <div className="col-md-7 col-sm-12 col-lg-8 col-xs-12 col-md-push-1">
                        <ul className="nav nav-tabs">
                            <li className="active"><Link to="/booking">Header</Link></li>
                            <li><a onClick={(e) => this.onClickGoToAllBookings(e)}>All Bookings</a></li>
                            <li className=""><Link to="/pods">PODs</Link></li>
                            <li><a href="/bookinglines" className="none">Booking Lines</a></li>
                            <li><a href="/bookinglinedetails" className="none">Booking Line Datas</a></li>
                        </ul>
                    </div>
                    <div id="icn" className="col-md-4 col-sm-12 col-lg-4 col-xs-12 text-right">
                        <a className="none"><i className="icon-plus" aria-hidden="true"></i></a>
                        <div className="popup">
                            <i className="icon-search3" aria-hidden="true"></i>
                        </div>
                        <div className="popup">
                            <i className="icon icon-th-list" aria-hidden="true"></i>
                        </div>
                        <a href=""><i className="icon-cog2" aria-hidden="true"></i></a>
                        <a href=""><i className="icon-calendar3" aria-hidden="true"></i></a>
                        <a href="">?</a>
                        <a onClick={(e) => this.onClickSwitchClientNavIcon(e)} className={username === 'dme' ? 'cur-pointer' : 'none'}><i className="fa fa-users" aria-hidden="true"></i></a>
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
                                        {
                                            (isBookingSelected && !bAllComboboxViewOnlyonBooking) &&
                                                <option value="2">Edit</option>
                                        }
                                        <option value="1">New Form</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-sm-6 pad-top-8">
                                <div className="col-sm-3" onChange={this.getRadioValue.bind(this)}>
                                    <input type="radio" value="dme" name="gender" checked={this.state.selected === 'dme'} onChange={(e) => this.setState({ selected: e.target.value })} /> DME #<br />
                                    <input type="radio" value="con" name="gender" checked={this.state.selected === 'con'} onChange={(e) => this.setState({ selected: e.target.value })}/> CON #
                                </div>
                                <div className="col-sm-6 form-group">
                                    <input className="form-control" type="text" onChange={this.onChangeText.bind(this)} onKeyPress={(e) => this.onKeyPress(e)} placeholder="Enter Number(Enter)" />
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
                    active={this.state.loading}
                    spinner
                    text='Loading...'
                >
                    <section className="booking">
                        <div className="container">
                            <div className="grid">
                                <div className="userclock">
                                    Sydney AU: <Clock format={'DD MMM YYYY h:mm:ss A'} disabled={true} ticking={true} timezone={'Australia/Sydney'} />
                                </div>
                                <div className="head">
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="text-white">DME ID: {isBookingSelected ? this.state.booking.b_bookingID_Visual : ''}</p>
                                        </div>
                                        <div className="col-sm-1">
                                            <p className="text-white text-center">
                                                <a href=""><i className="fas fa-file-alt text-white"></i></a>
                                            </p>
                                        </div>
                                        <div className="col-sm-3">
                                            <p className="text-white text-right none">AUS Mon 18:00 2018-02-04</p>
                                        </div>
                                        <div className="col-sm-5">
                                            <ul className="grid-head none">
                                                <li><button className="btn btn-light btn-theme"> Preview</button></li>
                                                <li><button className="btn btn-light btn-theme">Email</button></li>
                                                <li><button className="btn btn-light btn-theme">Print PDF</button></li>
                                                <li><button className="btn btn-light btn-theme">Undo</button></li>
                                            </ul>
                                            
                                            <a onClick={(e) => this.onClickOpenSlide(e)} className="open-slide"><i className="fa fa-columns" aria-hidden="true"></i></a>
                                            <label className="color-white float-right">
                                                <p>{isBookingSelected ? booking.b_status : '***'} - {isBookingSelected ? booking.b_status_API : '***'}</p>
                                                {
                                                    username === 'dme' ?
                                                        <p className={booking.z_lock_status ? 'lock-status status-active' : 'lock-status status-inactive'} onClick={() => this.onClickStatusLock(booking)}>
                                                            <i className="fa fa-lock"></i>
                                                        </p>
                                                        :
                                                        null
                                                }
                                            </label>
                                        </div>
                                    </div>
                                    <div className="clearfix"></div>
                                </div>

                                <div className="inner-text">
                                    <form action="">
                                        <div className="row col-sm-6">
                                            <div className="col-sm-4 form-group">
                                                {
                                                    (parseInt(curViewMode) === 0) ?
                                                        <p className="show-mode">{formInputs['b_client_name']}</p>
                                                        :
                                                        <input 
                                                            className="form-control height-40p" 
                                                            type="text" 
                                                            placeholder="BioPAK" 
                                                            name="b_client_name" 
                                                            value={(parseInt(curViewMode) === 1) ? clientname : formInputs['b_client_name']} 
                                                            disabled='disabled' />
                                                }
                                                {
                                                    (parseInt(curViewMode) === 0) ?
                                                        <p className="show-mode">{currentWarehouseCodeOption.value}</p>
                                                        :
                                                        <Select
                                                            value={currentWarehouseCodeOption}
                                                            onChange={(e) => this.handleChangeWarehouse(e)}
                                                            options={warehouseCodeOptions}
                                                            placeholder='select warehouse'
                                                            noOptionsMessage={() => this.displayNoOptionsMessage()}
                                                        />
                                                }
                                            </div>
                                            <div className='col-sm-4 form-group main-form-group'>
                                                {
                                                    (parseInt(curViewMode) === 0) ?
                                                        <p className="show-mode">{formInputs['b_clientPU_Warehouse']}</p>
                                                        :
                                                        <p className="show-mode disabled">{formInputs['b_clientPU_Warehouse']}</p>
                                                }
                                            </div>
                                            <div className="col-sm-4 form-group main-form-group">
                                                {
                                                    (parseInt(curViewMode) === 0) ?
                                                        <p className="show-mode">{formInputs['booking_Created_For']}</p>
                                                        :
                                                        <input className="form-control" type="text" placeholder="contact" name="booking_Created_For" value = {formInputs['booking_Created_For']} />
                                                }
                                                {
                                                    (parseInt(curViewMode) === 0) ?
                                                        <p className="show-mode">{formInputs['booking_Created_For_Email']}</p>
                                                        :
                                                        <input className="form-control" type="text" placeholder="contact" name="booking_Created_For" value = {formInputs['booking_Created_For']} />
                                                }
                                            </div>
                                        </div>
                                        <div className="col-sm-3 float-right">
                                            <button onClick={(e) => this.onClickPrev(e)} disabled={this.state.prevBookingId == 0}   className="btn btn-theme prev-btn">Prev</button>
                                            <button onClick={(e) => this.onClickNext(e)} disabled={this.state.nextBookingId == 0} className="btn btn-theme next-btn">Next</button>
                                            <button onClick={(e) => this.onClickComms(e)} disabled={!this.state.isBookingSelected} className="btn btn-primary btn-comms">comms</button>
                                        </div>
                                    </form>
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
                                                                            openMenuOnClick={bAllComboboxViewOnlyonBooking ? false : true}
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
                                                                            openMenuOnClick = {bAllComboboxViewOnlyonBooking ? false : true}
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
                                                                            openMenuOnClick = {bAllComboboxViewOnlyonBooking ? false : true}
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
                                                            <label className="" htmlFor="">Contact <a className="popup" href=""><i className="fas fa-file-alt"></i></a></label>
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
                                                    <div className="row mt-1 none">
                                                        <div className="col-sm-4">
                                                            <label className="" htmlFor="">Pickup Dates <a className="popup"><i className="fas fa-file-alt"></i></a></label>
                                                        </div>
                                                        <div className='col-sm-8'>
                                                            <div className="input-group pad-left-20px">
                                                                {formInputs['s_20_Actual_Pickup_TimeStamp'] ? moment(formInputs['s_20_Actual_Pickup_TimeStamp']).format('DD/MM/YYYY hh:mm:ss') : ''}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="head text-white panel-title">
                                                        PickUp Dates
                                                    </div>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-4">
                                                            <label className="" htmlFor="">ETA Pickup <a className="popup" href=""><i className="fas fa-file-alt"></i></a></label>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            <div className="input-group">
                                                                <input 
                                                                    type="text" 
                                                                    name="vx_fp_pu_eta_time" 
                                                                    className="form-control" 
                                                                    value = {formInputs['vx_fp_pu_eta_time'] ? moment(formInputs['vx_fp_pu_eta_time']).format('DD/MM/YYYY hh:mm:ss') : ''} 
                                                                    disabled='disabled' />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-4">
                                                            <label className="" htmlFor="">Actual Pickup <a className="popup" href=""><i className="fas fa-file-alt"></i></a></label>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            <div className="input-group">
                                                                <input 
                                                                    type="text" 
                                                                    name="s_20_Actual_Pickup_TimeStamp" 
                                                                    className="form-control" value = {formInputs['s_20_Actual_Pickup_TimeStamp'] ? moment(formInputs['s_20_Actual_Pickup_TimeStamp']).format('DD/MM/YYYY hh:mm:ss') : ''} 
                                                                    disabled='disabled' />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-4">
                                                            <label className="" htmlFor="">Pickup Instructions<a className="popup" href=""><i className="fas fa-file-alt"></i></a></label>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            {
                                                                (parseInt(curViewMode) === 0) ?
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
                                                    <div className="mt-1 additional-pickup-div">
                                                        <div className="col-sm-4">
                                                            <label className="" htmlFor="">Reference No</label>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            <input 
                                                                type="text" 
                                                                name="b_clientReference_RA_Numbers" 
                                                                className="form-control" 
                                                                value = {formInputs['b_clientReference_RA_Numbers'] ? formInputs['b_clientReference_RA_Numbers'] : ''} 
                                                                disabled='disabled'/>
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
                                                                            openMenuOnClick = {bAllComboboxViewOnlyonBooking ? false : true}
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
                                                                            openMenuOnClick = {bAllComboboxViewOnlyonBooking ? false : true}
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
                                                                            openMenuOnClick = {bAllComboboxViewOnlyonBooking ? false : true}
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
                                                            <label className="" htmlFor="">Contact <a className="popup" href=""><i className="fas fa-file-alt"></i></a></label>
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
                                                    <div className="head text-white panel-title">
                                                        Delivery Dates
                                                    </div>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-4">
                                                            <label className="" htmlFor="">ETA Delivery <a className="popup" href=""><i className="fas fa-file-alt"></i></a></label>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            <div className="input-group">
                                                                <input 
                                                                    type="text" 
                                                                    name="vx_fp_del_eta_time" 
                                                                    className="form-control" 
                                                                    value = {formInputs['vx_fp_del_eta_time'] ? moment(formInputs['vx_fp_del_eta_time']).format('DD/MM/YYYY hh:mm:ss') : ''} 
                                                                    disabled='disabled' />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-4">
                                                            <label className="" htmlFor="">Actual Delivery <a className="popup" href=""><i className="fas fa-file-alt"></i></a></label>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            <div className="input-group">
                                                                <input 
                                                                    type="text" 
                                                                    name="s_21_Actual_Delivery_TimeStamp" 
                                                                    className="form-control" 
                                                                    value = {formInputs['s_21_Actual_Delivery_TimeStamp'] ? moment(formInputs['s_21_Actual_Delivery_TimeStamp']).format('DD/MM/YYYY hh:mm:ss') : ''} 
                                                                    disabled='disabled' />
                                                            </div>

                                                        </div>
                                                    </div>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-4">
                                                            <label className="" htmlFor="">Delivery Instructions <a className="popup" href=""><i className="fas fa-file-alt"></i></a></label>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            {
                                                                (parseInt(curViewMode) === 0) ?
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
                                                </form>
                                            </div>
                                        </div>
                                        <div className="col-sm-4">
                                            <div className="pickup-detail">
                                                <div className="head">
                                                </div>
                                                <div className="buttons">
                                                    <div className="text-center mt-2 fixed-height form-view-btns">
                                                        <button className={(parseInt(curViewMode) === 1) ? 'btn btn-theme custom-theme' : 'btn btn-theme custom-theme disabled'} onClick={() => this.onClickCreateBooking()}>Create</button>
                                                        <button className={(parseInt(curViewMode) === 2) ? 'btn btn-theme custom-theme' : 'btn btn-theme custom-theme disabled'} onClick={() => this.onClickUpdateBooking()}>Update</button>
                                                    </div>
                                                    <div className="text-center mt-2 fixed-height">
                                                        <button className="btn btn-theme custom-theme"><i className="fas fa-stopwatch"></i> Freight & Time Calculations</button>
                                                    </div>
                                                    <div className="text-center mt-2 fixed-height">
                                                        <button 
                                                            className="btn btn-theme custom-theme" 
                                                            onClick={() => this.onClickConfirmBooking()}
                                                            disabled={!isBookingSelected || bAllComboboxViewOnlyonBooking}
                                                        >
                                                            <i className="fas fa-clipboard-check"></i>Confirm Booking
                                                        </button>
                                                    </div>
                                                    <div className="text-center mt-2 fixed-height">
                                                        <button className="btn btn-theme custom-theme"><i className="fas fa-undo-alt"></i> Amend Booking</button>
                                                    </div>
                                                    <div className="text-center mt-2 fixed-height">
                                                        <button className="btn btn-theme custom-theme" onClick={() => this.onClickCancelBook()}><i className="fas fa-backspace"></i> Cancel Request</button>
                                                    </div>
                                                    <div className="text-center mt-2 fixed-height">
                                                        <button className="btn btn-theme custom-theme" onClick={() => this.onClickDuplicate(2)}>Duplicate Booking</button>
                                                    </div>
                                                    <div className="text-center mt-2 fixed-height">
                                                        <button className="btn btn-theme custom-theme" onClick={() => this.onClickBook()}><i ></i> Book</button>
                                                    </div>
                                                    <div className="text-center mt-2 fixed-height">
                                                        <button className="btn btn-theme custom-theme" onClick={() => this.onClickPrinter(booking)}><i className="icon icon-printer"></i> Print</button>
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
                                                <li><a href="#tab01">Shipment Packages / Goods</a></li>
                                                <li><a href="#tab02">Additional Information</a></li>
                                                <li><a href="#tab03">Freight Options</a></li>
                                                <li><a href="#tab04">Communication Log</a></li>
                                                <li><a href="#tab05">Attachments</a></li>
                                            </ul>
                                        </div>
                                        <div className="tab-select-outer">
                                            <select id="tab-select">
                                                <option value="#tab01">Shipment Packages / Goods</option>
                                                <option value="#tab02">Additional Services & Options</option>
                                                <option value="#tab03">Freight Options</option>
                                                <option value="#tab04">Communication Log</option>
                                                <option value="#tab05">Attachments</option>
                                            </select>
                                        </div>
                                        <div id="tab01" className="tab-contents">
                                            <div className={bAllComboboxViewOnlyonBooking ? 'tab-inner not-editable' : 'tab-inner'}>
                                                <Button 
                                                    className="edit-lld-btn btn-primary" 
                                                    onClick={this.toggleShowLineSlider} 
                                                    disabled={!isBookingSelected || bAllComboboxViewOnlyonBooking}
                                                >
                                                    Edit
                                                </Button>
                                                <Button 
                                                    className="edit-lld-btn btn-primary" 
                                                    onClick={this.toggleShowLineTrackingSlider} 
                                                    disabled={!isBookingSelected}
                                                >
                                                    Edit Tracking
                                                </Button>
                                                <BootstrapTable
                                                    keyField="id"
                                                    data={ bookingTotals }
                                                    columns={ columnBookingCounts }
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
                                                        cellEdit={ cellEditFactory({ 
                                                            mode: 'click',
                                                            blurToSave: false,
                                                            afterSaveCell: (oldValue, newValue, row, column) => { this.onUpdateBookingLine(oldValue, newValue, row, column); }
                                                        })}
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
                                                        cellEdit={ cellEditFactory({ 
                                                            mode: 'click',
                                                            blurToSave: true,
                                                            afterSaveCell: (oldValue, newValue, row, column) => { this.onUpdateBookingLineDetail(oldValue, newValue, row, column); }
                                                        })}
                                                        bootstrap4={ true }
                                                    />
                                                </LoadingOverlay>
                                            </div>
                                        </div>
                                        <div id="tab02" className="tab-contents">
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
                                        <div id="tab03" className="tab-contents">
                                            <div className="tab-inner">
                                                <BootstrapTable
                                                    keyField="modelNumber"
                                                    data={ bookingLineDetailsProduct }
                                                    columns={ columnFreight }
                                                    cellEdit={ cellEditFactory({ mode: 'click',blurToSave: true }) }
                                                    bootstrap4={ true }
                                                />
                                            </div>
                                        </div>
                                        <div id="tab04" className="tab-contents">
                                            <button onClick={() => this.onClickGoToCommPage()} disabled={!booking.hasOwnProperty('id')} className="btn btn-theme btn-standard none" title="Go to all comms">
                                                <i className="icon icon-th-list"></i>
                                            </button>
                                            <button onClick={() => this.onClickCreateComm()} disabled={!booking.hasOwnProperty('id')} className="btn btn-theme btn-standard" title="Create a comm">
                                                <i className="icon icon-plus"></i>
                                            </button>
                                            <div className="tab-inner">
                                                <BootstrapTable
                                                    keyField="id"
                                                    data={ comms }
                                                    columns={ columnCommunication }
                                                    bootstrap4={ true }
                                                />
                                            </div>
                                        </div>
                                        <div id="tab05" className="tab-contents">
                                            <div className="col-12">
                                                <form onSubmit={(e) => this.handlePost(e)}>
                                                    <DropzoneComponent id="myDropzone" config={config} eventHandlers={eventHandlers} djsConfig={djsConfig} />
                                                    <button id="submit-upload" type="submit">upload</button>
                                                </form>
                                            </div>
                                            <div className="tab-inner">
                                                <BootstrapTable
                                                    keyField="modelNumber"
                                                    data={ attachmentsHistory }
                                                    columns={ columnAttachments }
                                                    cellEdit={ cellEditFactory({ mode: 'click',blurToSave: true }) }
                                                    bootstrap4={ true }
                                                />
                                            </div>
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
                                <option value="emadeisky">emadeisky</option>
                                <option value="nlimbauan">nlimbauan</option>
                                <option value="status query">status query</option>
                                <option value="edit…">edit…</option>
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
                        <div className="datetime date">
                            <p>Due By Date</p>
                            <div className="date-adjust" onClick={() => this.onDatePlusOrMinus('comm', -1)}><i className="fa fa-minus"></i></div>
                            <DatePicker
                                selected={commFormInputs['due_by_date']}
                                onChange={(e) => this.onDateChange('comm', e)}
                                dateFormat="dd MMM yyyy"
                            />
                            <div className="date-adjust" onClick={() => this.onDatePlusOrMinus('comm', 1)}><i className="fa fa-plus"></i></div>
                            <button className="button-clear" onClick={() => this.clearDateOrTime('comm', 'date')}><i className="fa fa-times-circle"></i></button>
                        </div>
                        <div className="datetime time">
                            <p>Due By Time</p>
                            <Select
                                value={due_by_time}
                                onChange={(e) => this.handleCommModalInputChange({target: {name: 'due_by_time', value: e.value, type: 'input'}})}
                                options={timeSelectOptions}
                                placeholder='Select time'
                            />
                            <button className="button-clear" onClick={() => this.clearDateOrTime('comm', 'time')}><i className="fa fa-times-circle"></i></button>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => this.onSubmitComm()}>{(commFormMode === 'create') ? 'Create' : 'Update'}</Button>{' '}
                        <Button color="secondary" onClick={this.toggleCreateCommModal}>Cancel</Button>
                    </ModalFooter>
                </ReactstrapModal>

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
                                                    <p>Date Entered</p>
                                                </th>
                                                <th className="" scope="col" nowrap>
                                                    <p>Time Entered</p>
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
                                                    <p>Update</p>
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
                                    <h2>{(noteFormMode === 'create') ? 'Create' : 'Update'} a note</h2>
                                    <label>
                                        <p>Note No</p>
                                        <input 
                                            className="form-control" 
                                            type="text" 
                                            disabled="disabled"
                                            name="dme_no" 
                                            value={(noteFormMode === 'create') ? notes.length + 1 : selectedNoteNo + 1} />
                                    </label>
                                    <br />
                                    <div className={(noteFormMode === 'update' && noteFormInputs['note_date_created'] !== noteFormInputs['note_date_updated']) ? 'datetime date orange-color' : 'datetime date' } >
                                        <p>Date</p>
                                        <div >
                                            <div className="date-adjust" onClick={() => this.onDatePlusOrMinus('note', -1)}><i className="fa fa-minus"></i></div>
                                            <DatePicker
                                                selected={noteFormInputs['note_date_updated']}
                                                onChange={(e) => this.onDateChange('note', e)}
                                                dateFormat="dd MMM yyyy"
                                            />
                                            <div className="date-adjust" onClick={() => this.onDatePlusOrMinus('note', 1)}><i className="fa fa-plus"></i></div>
                                            <button className="button-clear" onClick={() => this.clearDateOrTime('note', 'date')}><i className="fa fa-times-circle"></i></button>
                                        </div>
                                    </div>
                                    <div className={(noteFormMode === 'update' && noteFormInputs['note_time_created'] !== noteFormInputs['note_time_updated']) ? 'datetime time orange-color' : 'datetime time' }>
                                        <p>Time</p>
                                        <Select
                                            value={note_time_updated}
                                            onChange={(e) => this.handleModalInputChange('note', {target: {name: 'note_time_updated', value: e.value, type: 'input'}})}
                                            options={timeSelectOptions}
                                            placeholder='Select time'
                                        />
                                        <button className="button-clear" onClick={() => this.clearDateOrTime('note', 'time')}><i className="fa fa-times-circle"></i></button>
                                    </div>
                                    <label>
                                        <p>User</p>
                                        <input 
                                            className={(noteFormMode === 'update' && username !== noteFormInputs['username']) ? 'form-control orange-color' : 'form-control'}
                                            type="text" 
                                            placeholder="" 
                                            name="username" 
                                            value = {noteFormInputs['username']}
                                            onChange={(e) => this.handleModalInputChange('note', e)} />
                                    </label>
                                    <br />
                                    <label>
                                        <p>Note Type</p>
                                        <select
                                            required 
                                            name="dme_notes_type" 
                                            onChange={(e) => this.handleModalInputChange('note', e)}
                                            value = {noteFormInputs['dme_notes_type']} >
                                            <option value="Call">Call</option>
                                            <option value="Email">Email</option>
                                            <option value="SMS">SMS</option>
                                            <option value="Letter">Letter</option>
                                            <option value="Note">Note</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </label>
                                    <br />
                                    <label className="editor">
                                        <p>Note</p>
                                        <CKEditor
                                            data={noteFormInputs['dme_notes']}
                                            onChange={(e) => this.onEditorChange('note', 'note', e)} />
                                    </label>
                                    <br />
                                    <div className="button-group">
                                        <Button color="primary" onClick={() => this.onSubmitNote()}>
                                            {
                                                (noteFormMode === 'create') ? 'Create' : 'Update'
                                            }
                                        </Button>{' '}
                                        <Button color="secondary" onClick={() => this.onCancelNoteForm()}>Cancel</Button>
                                    </div>
                                </div>
                        }
                    </div>
                </SlidingPane>

                <ReactstrapModal isOpen={this.state.isShowNoteDetailModal} toggle={this.toggleNoteDetailModal} className="note-detail-modal">
                    <ModalHeader toggle={this.toggleNoteDetailModal}>Note Detail</ModalHeader>
                    <ModalBody>
                        <EditorPreview data={selectedNoteDetail} />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggleNoteDetailModal}>Cancel</Button>
                    </ModalFooter>
                </ReactstrapModal>

                <SwitchClientModal
                    isShowSwitchClientModal={isShowSwitchClientModal}
                    toggleSwitchClientModal={this.toggleSwitchClientModal}
                    onSwitchClient={(selectedClientId) => this.onSwitchClient(selectedClientId)}
                    clients={dmeClients}
                    selectedClientPK={clientPK}
                />

                <LineAndLineDetailSlider
                    isOpen={isShowLineSlider}
                    toggleShowLineSlider={this.toggleShowLineSlider}
                    lines={products}
                    lineDetails={bookingLineDetailsProduct}
                    onClickDuplicate={(typeNum, data) => this.onClickDuplicate(typeNum, data)}
                    onClickDelete={(typeNum, data) => this.onClickDelete(typeNum, data)}
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
                    toggleStatusHistorySlider={this.toggleShowStatusHistorySlider}
                    allBookingStatus={allBookingStatus}
                    username={username}
                    OnSaveStatusHistory={(statusHistory) => this.OnSaveStatusHistory(statusHistory)}
                />

                <LineTrackingSlider
                    isOpen={isShowLineTrackingSlider}
                    toggleShowLineTrackingSlider={this.toggleShowLineTrackingSlider}
                    lines={products}
                    booking={booking}
                    updateBookingLine={(bookingLine) => this.props.updateBookingLine(bookingLine)}
                    isBooked={bAllComboboxViewOnlyonBooking}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        booking: state.booking.booking,
        nextBookingId: state.booking.nextBookingId,
        prevBookingId: state.booking.prevBookingId,
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
        username: state.auth.username,
        clientname: state.auth.clientname,
        clientId: state.auth.clientId,
        warehouses: state.warehouse.warehouses,
        dmeClients: state.auth.dmeClients,
        clientPK: state.auth.clientPK,
        noBooking: state.booking.noBooking,
        packageTypes: state.extra.packageTypes,
        allBookingStatus: state.extra.allBookingStatus,
        statusHistories: state.extra.statusHistories,
        needUpdateStatusHistories: state.extra.needUpdateStatusHistories,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        saveBooking: (booking) => dispatch(saveBooking(booking)),
        duplicateBooking: (bookingId, switchInfo, dupLineAndLineDetail) => dispatch(duplicateBooking(bookingId, switchInfo, dupLineAndLineDetail)),
        resetNeedUpdateLineAndLineDetail: () => dispatch(resetNeedUpdateLineAndLineDetail()),
        getBookingWithFilter: (id, filter) => dispatch(getBookingWithFilter(id, filter)),
        getSuburbStrings: (type, name) => dispatch(getSuburbStrings(type, name)),
        getAttachmentHistory: (id) => dispatch(getAttachmentHistory(id)),
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
        alliedBooking: (bookingId) => dispatch(alliedBooking(bookingId)),
        stBooking: (bookingId) => dispatch(stBooking(bookingId)),
        updateBooking: (id, booking) => dispatch(updateBooking(id, booking)),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        createComm: (comm) => dispatch(createComm(comm)),
        getCommsWithBookingId: (id, sortField, columnFilters) => dispatch(getCommsWithBookingId(id, sortField, columnFilters)),
        updateComm: (id, updatedComm) => dispatch(updateComm(id, updatedComm)),
        setGetCommsFilter: (key, value) => dispatch(setGetCommsFilter(key, value)),
        getNotes: (commId) => dispatch(getNotes(commId)),
        createNote: (note) => dispatch(createNote(note)),
        updateNote: (id, updatedNote) => dispatch(updateNote(id, updatedNote)),
        getWarehouses: () => dispatch(getWarehouses()),
        getLatestBooking: () => dispatch(getLatestBooking()),
        getDMEClients: () => dispatch(getDMEClients()),
        setClientPK: (clientId) => dispatch(setClientPK(clientId)),
        cancelBook: (bookingId) => dispatch(cancelBook(bookingId)),
        getBookingStatusHistory: (bookingId) => dispatch(getBookingStatusHistory(bookingId)),
        getPackageTypes: () => dispatch(getPackageTypes()),
        getAllBookingStatus: () => dispatch(getAllBookingStatus()),
        saveStatusHistory: (statusHistory) => dispatch(saveStatusHistory(statusHistory)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BookingPage));

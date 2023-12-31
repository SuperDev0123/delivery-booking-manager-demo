import moment from 'moment-timezone';
import {
    DO_NOTHING,
    RESET_ATTACHMENTS,
    RESET_BOOKING,
    SET_ATTACHMENTS,
    FAILED_GET_ATTACHMENTS,
    SET_BOOKING_WITH_FILTER,
    SET_BOOKINGS,
    FAILED_GET_BOOKINGS,
    SET_BOOKING,
    FAILED_UPDATE_BOOKING,
    SET_MAPPEDBOOKINGS,
    SET_USER_DATE_FILTER_FIELD,
    FAILED_GET_USER_DATE_FILTER_FIELD,
    BOOK_SUCCESS,
    BOOK_FAILED,
    REBOOK_SUCCESS,
    REBOOK_FAILED,
    POD_SUCCESS,
    POD_FAILED,
    GET_LABEL_SUCCESS,
    SET_LOCAL_FILTER_ALL,
    SET_LOCAL_FILTER_SELECTEDATE,
    SET_LOCAL_FILTER_WAREHOUSEID,
    SET_LOCAL_FILTER_FPID,
    SET_LOCAL_FILTER_SORTFIELD,
    SET_LOCAL_FILTER_COLUMNFILTER,
    SET_LOCAL_FILTER_ACTIVE_TAB_IND,
    SET_LOCAL_FILTER_SIMPLESEARCHKEYWORD,
    SET_LOCAL_FILTER_CLIENTPK,
    SET_LOCAL_FILTER_DOWNLOADOPTION,
    SET_LOCAL_FILTER_DMESTATUS,
    SET_LOCAL_FILTER_PROJECTNAME,
    SET_LOCAL_FILTER_BOOKINGIDS,
    SET_FETCH_BOOKINGS_FLAG,
    SUCCESS_UPDATE_BOOKING,
    GET_LABEL_FAILED,
    SUCCESS_DUPLICATE_BOOKING,
    BOOK_CANCEL_SUCCESS,
    BOOK_CANCEL_FAILED,
    FAILED_CREATE_BOOKING,
    SUCCESS_CREATE_BOOKING,
    CHANGE_STATUS_SUCCESS,
    CHANGE_STATUS_FAILED,
    SUCCESS_CALC_COLLECTED,
    FAILED_CALC_COLLECTED,
    RESET_FLAG_LINES,
    SET_FETCH_GEO_FLAG,
    CLEAR_ERR_MSG,
    SUCCESS_TICK_MANUAL_BOOK,
    FAILED_TICK_MANUAL_BOOK,
    SUCCESS_MANUAL_BOOK,
    FAILED_MANUAL_BOOK,
    BOOK_EDIT_SUCCESS,
    BOOK_EDIT_FAILED,
    SUCCESS_CREATE_ORDER,
    FAILED_CREATE_ORDER,
    SUCCESS_GET_ORDER_SUMMARY,
    FAILED_GET_ORDER_SUMMARY,
    RESET_MANIFEST_REPORT,
    SUCCESS_GET_MANIFEST_REPORT,
    FAIELD_GET_MANIFEST_REPORT,
    GET_TRACK_FAILED,
    SUCCESS_FP_PRICING,
    FAILED_FP_PRICING,
    RESET_PRICING_INFOS,
    SUCCESS_GET_PRICING_INFOS,
    SET_ERROR_MSG,
    SET_LOCAL_FILTER_PAGEITEMCNT,
    SET_LOCAL_FILTER_PAGEINDEX,
    RESET_REFRESH_BOOKINGS_FLAG,
    SUCCESS_SEND_EMAIL,
    FAILED_SEND_EMAIL,
    RESET_AUTO_SELECTED,
    SUCCESS_AUTO_AUGMENT,
    FAILED_AUTO_AUGMENT,
    SUCCESS_REVERT_AUGMENT,
    FAILED_REVERT_AUGMENT,
    SUCCESS_PRICING_ANALYSIS,
    FAILED_PRICING_ANALYSIS,
    SUCCESS_AUGMENT_PU_DATE,
    FAILED_AUGMENT_PU_DATE,
    RESET_NO_BOOKING,
    SUCCESS_GET_CLIENT_PROCESS,
    FAILED_GET_CLIENT_PROCESS,
    SUCCESS_GET_LABELS_INFO,
    FAILED_GET_LABELS_INFO,
    RESET_SUMMARY_OF_BOOKINGS,
    SUCCESS_GET_SUMMARY_OF_BOOKINGS,
    FAILED_GET_SUMMARY_OF_BOOKINGS,
    SUCCESS_GET_DME_LABEL,
    FAILED_GET_DME_LABEL,
    SUCCESS_REPACK,
    FAILED_REPACK,
    SUCCESS_DME_CANCEL_BOOK,
    FAILED_DME_CANCEL_BOOK,
    SUCCESS_GET_STATUS_PAGE_URL,
    FAILED_GET_STATUS_PAGE_URL,
    RESET_STATUS_PAGE_URL,
} from '../constants/bookingConstants';

const defaultState = {
    booking: null,
    bookings: [],
    filteredBookingIds: [],
    filteredConsignments: [],
    bookingsCnt: 0,
    pod: {},
    userDateFilterField: '',
    mappedBookings: [],
    errorMessage: null,
    nextBookingId: null,
    prevBookingId: null,
    needUpdateBookings: false,
    startDate: moment().tz('Australia/Sydney').toDate(),
    endDate: moment().tz('Australia/Sydney').toDate(),
    warehouseId: 0,
    fpId: 0,
    pageItemCnt: 100,
    pageInd: 0,
    sortField: '-id',
    columnFilters: {},
    activeTabInd: 7,
    simpleSearchKeyword: '',
    downloadOption: 'label',
    multiFindField: null,
    multiFindValues: '',
    noBooking: null,
    needUpdateBookingLines: false,
    isTickedManualBook: null,
    needUpdateBooking: null,
    manifestReports: null,
    projectName: '',
    pricingInfos: [],
    pricingAnalyses: [],
    pricingInfosFlag: false,
    isAutoSelected: false,
    bookingIds: [],
    clientPK: 0,
    clientprocess: {},
    bookingLabels: null,
    manifestSummary: null,
    bookingsSummary: null,
    statusPageUrl: null,
};

export const BookingReducer = (state = defaultState, {
    payload,
    noBooking,
    attachments,
    type,
    errorMessage,
    bBooking,
    bookings,
    bookingIds,
    bookingsCnt,
    booking,
    mappedBookings,
    userDateFilterField,
    nextBookingId,
    prevBookingId,
    startDate,
    endDate,
    warehouseId,
    fpId,
    sortField,
    columnFilters,
    activeTabInd,
    simpleSearchKeyword,
    needUpdateBookings,
    downloadOption,
    clientPK,
    qtyTotal,
    cntComms,
    cntAttachments,
    cntAdditionalSurcharges,
    dmeStatus,
    projectName,
    multiFindField,
    multiFindValues,
    pageItemCnt,
    pageInd,
    pageCnt,
    filteredBookingIds,
    filteredConsignments,
    isAutoSelected,
}) => {
    switch (type) {
        case RESET_NO_BOOKING:
            return {
                ...state,
                noBooking: null,
            };
        case RESET_REFRESH_BOOKINGS_FLAG:
            return {
                ...state,
                needUpdateBookings: false,
                bookingsCnt: null,
            };
        case RESET_PRICING_INFOS:
            return {
                ...state,
                pricingInfos: null,
            };
        case RESET_MANIFEST_REPORT:
            return {
                ...state,
                manifestReports: null,
            };
        case RESET_ATTACHMENTS:
            return {
                ...state,
                attachments: [],
            };
        case RESET_FLAG_LINES:
            return {
                ...state,
                needUpdateBookingLines: false,
            };
        case RESET_BOOKING:
            return {
                ...state,
                booking: null,
            };
        case SET_ATTACHMENTS:
            return {
                ...state,
                attachments: attachments,
            };
        case FAILED_GET_ATTACHMENTS:
            return {
                ...state,
                errorMessage: errorMessage,
            };
        case RESET_AUTO_SELECTED:
            return {
                ...state,
                isAutoSelected: false
            };
        case RESET_SUMMARY_OF_BOOKINGS:
            if (payload === 'manifest')
                return {...state, manifestSummary: null};
            else
                return {...state, bookingsSummary: null};
        case SET_BOOKINGS:
            return {
                ...state,
                bookings: bookings,
                filteredBookingIds: filteredBookingIds,
                filteredConsignments: filteredConsignments,
                bookingsCnt: bookingsCnt,
                pageInd: pageInd,
                pageItemCnt: pageItemCnt,
                pageCnt: pageCnt,
                needUpdateBookings: false,
                needUpdateBookingLines: false,
            };
        case SET_MAPPEDBOOKINGS:
            return {
                ...state,
                mappedBookings: mappedBookings
            };
        case SET_BOOKING_WITH_FILTER:
            return {
                ...state,
                booking: booking,
                nextBookingId: nextBookingId,
                prevBookingId: prevBookingId,
                qtyTotal: qtyTotal,
                cntComms: cntComms,
                cntAttachments: cntAttachments,
                cntAdditionalSurcharges: cntAdditionalSurcharges,
                noBooking: noBooking,
                needUpdateBooking: false,
            };
        case SUCCESS_UPDATE_BOOKING:
            return {
                ...state,
                booking: booking,
                noBooking: false,
                needUpdateBookings: true,
            };
        case SUCCESS_TICK_MANUAL_BOOK:
        case SUCCESS_CREATE_BOOKING:
            return {
                ...state,
                booking: booking,
                noBooking: false,
                isManualBook: true,
            };
        case SUCCESS_DUPLICATE_BOOKING:
            return {
                ...state,
                booking: booking,
                needUpdateBooking: true,
            };
        case SUCCESS_REPACK:
            return {
                ...state,
                needUpdateBooking: true,
            };
        case FAILED_GET_BOOKINGS:
            return {
                ...state,
                errorMessage: errorMessage,
                bBooking: bBooking
            };
        case FAILED_CREATE_BOOKING:
            return {
                ...state,
                errorMessage: errorMessage,
                bBooking: bBooking
            };
        case SET_BOOKING:
            return {
                ...state,
                booking: booking,
                needUpdateBooking: false,
            };
        case FAILED_UPDATE_BOOKING:
            return {
                ...state,
                errorMessage: errorMessage
            };
        case SET_USER_DATE_FILTER_FIELD:
            return {
                ...state,
                userDateFilterField: userDateFilterField
            };
        case FAILED_GET_USER_DATE_FILTER_FIELD:
            return {
                ...state,
                errorMessage: errorMessage
            };

        case BOOK_SUCCESS:
            return {
                ...state,
                errorMessage: errorMessage,
                needUpdateBookings: true,
                needUpdateBooking: true,
                bookings: [],
            };

        case REBOOK_SUCCESS:
            return {
                ...state,
                errorMessage: errorMessage,
                needUpdateBookings: true,
                needUpdateBooking: true,
                bookings: [],
            };

        case POD_SUCCESS:
            return {
                ...state,
                errorMessage: errorMessage,
                pod: {},
            };

        case POD_FAILED:
            return {
                ...state,
                errorMessage: errorMessage,
                pod: {},
            };
        case BOOK_FAILED:
        case REBOOK_FAILED:
        case FAILED_CREATE_ORDER:
        case GET_LABEL_FAILED:          // FP Label
        case FAILED_GET_DME_LABEL:      // DME Label
            return {
                ...state,
                needUpdateBookings: true,
                errorMessage: errorMessage,
                bookings: [],
            };
        case SUCCESS_CREATE_ORDER:
        case GET_LABEL_SUCCESS:         // FP Label
        case SUCCESS_GET_DME_LABEL:     // DME Label
        case SUCCESS_DME_CANCEL_BOOK:   // DME CANCEL BOOK
            return {
                ...state,
                needUpdateBookings: true,
                needUpdateBooking: true,
                errorMessage: errorMessage,
                bookings: [],
            };
        case SET_LOCAL_FILTER_ALL:
            return {
                ...state,
                bookings: [],
                startDate: startDate,
                endDate: endDate,
                warehouseId: warehouseId,
                fpId: fpId,
                sortField: sortField,
                columnFilters: columnFilters,
                activeTabInd: activeTabInd,
                simpleSearchKeyword: simpleSearchKeyword,
                downloadOption: downloadOption,
                clientPK: clientPK,
                pageItemCnt: pageItemCnt,
                dmeStatus: dmeStatus,
                multiFindField: multiFindField,
                multiFindValues: multiFindValues,
                projectName: projectName,
                bookingIds: bookingIds,
                needUpdateBookings: true,
            };
        case SET_LOCAL_FILTER_SELECTEDATE:
            return {
                ...state,
                startDate: startDate,
                endDate: endDate,
                needUpdateBookings: true,
            };
        case SET_LOCAL_FILTER_WAREHOUSEID:
            return {
                ...state,
                warehouseId: warehouseId,
                needUpdateBookings: true,
            };
        case SET_LOCAL_FILTER_FPID:
            return {
                ...state,
                fpId: fpId,
                needUpdateBookings: true,
            };
        case SET_LOCAL_FILTER_SORTFIELD:
            return {
                ...state,
                sortField: sortField,
                needUpdateBookings: true,
            };
        case SET_LOCAL_FILTER_COLUMNFILTER:
            return {
                ...state,
                columnFilters: columnFilters,
                needUpdateBookings: true,
            };
        case SET_LOCAL_FILTER_ACTIVE_TAB_IND:
            return {
                ...state,
                activeTabInd: activeTabInd,
                needUpdateBookings: true,
            };
        case SET_LOCAL_FILTER_SIMPLESEARCHKEYWORD:
            return {
                ...state,
                simpleSearchKeyword: simpleSearchKeyword,
                needUpdateBookings: true,
            };
        case SET_LOCAL_FILTER_CLIENTPK:
            return {
                ...state,
                clientPK: clientPK,
                needUpdateBookings: true,
            };
        case SET_LOCAL_FILTER_DMESTATUS:
            return {
                ...state,
                dmeStatus: dmeStatus,
                needUpdateBookings: true,
            };
        case SET_LOCAL_FILTER_DOWNLOADOPTION:
            return {
                ...state,
                downloadOption: downloadOption,
                needUpdateBookings: true,
            };
        case SET_LOCAL_FILTER_PROJECTNAME:
            return {
                ...state,
                projectName: payload,
                needUpdateBookings: true,
            };
        case SET_LOCAL_FILTER_BOOKINGIDS:
            return {
                ...state,
                bookingIds: payload,
                needUpdateBookings: true,
            };
        case SET_LOCAL_FILTER_PAGEITEMCNT:
            return {
                ...state,
                pageItemCnt: pageItemCnt,
                needUpdateBookings: true,
                bookings: [],
            };
        case SET_LOCAL_FILTER_PAGEINDEX:
            return {
                ...state,
                pageInd: pageInd,
                needUpdateBookings: true,
                bookings: [],
            };
        case SET_FETCH_BOOKINGS_FLAG:
            return {
                ...state,
                needUpdateBookings: needUpdateBookings,
            };
        case CHANGE_STATUS_SUCCESS:
            return {
                ...state,
                needUpdateBookings: true,
                errorMessage: errorMessage,
            };
        case SUCCESS_CALC_COLLECTED:
            return {
                ...state,
                needUpdateBookings: true,
            };
        case SUCCESS_GET_MANIFEST_REPORT:
            return {
                ...state,
                manifestReports: payload['results'],
                report_fps: payload['report_fps'],
                report_clients: payload['report_clients'],
            };
        case BOOK_EDIT_SUCCESS:
        case BOOK_CANCEL_SUCCESS:
        case SUCCESS_GET_ORDER_SUMMARY:
            return {
                ...state,
                needUpdateBooking: true,
                errorMessage: errorMessage,
            };
        case SUCCESS_FP_PRICING:
        case SUCCESS_GET_PRICING_INFOS:
            return {
                ...state,
                pricingInfos: payload,
                pricingInfosFlag: true,
                errorMessage: errorMessage,
                isAutoSelected: isAutoSelected,
            };
        case SUCCESS_AUTO_AUGMENT:
            return {
                ...state,
                needUpdateBooking: true,
            };
        case SUCCESS_REVERT_AUGMENT:
            return {
                ...state,
                booking: payload
            };
        case SUCCESS_GET_CLIENT_PROCESS:
            return {
                ...state,
                clientprocess: payload.length > 0 ? payload[0] : {}
            };
        case FAILED_GET_CLIENT_PROCESS:
            return {
                ...state,
            };
        case FAILED_REVERT_AUGMENT:
            return {
                ...state,
            };
        case SUCCESS_AUGMENT_PU_DATE:
            return {
                ...state,
                booking: payload
            };
        case SET_FETCH_GEO_FLAG:
            return {
                ...state,
                needToFetchGeoInfo: payload,
            };
        case SUCCESS_MANUAL_BOOK:
            return {
                ...state,
                booking: booking,
            };
        case SUCCESS_PRICING_ANALYSIS:
            return {
                ...state,
                pricingAnalyses: payload,
            };
        case SUCCESS_GET_LABELS_INFO:
            return {
                ...state,
                bookingLabels: payload
            };
        case SUCCESS_GET_SUMMARY_OF_BOOKINGS:
            if (payload.from === 'manifest')
                return {...state, manifestSummary: payload.data};
            else
                return {...state, bookingsSummary: payload.data};
        case SUCCESS_GET_STATUS_PAGE_URL:
            return {
                ...state,
                statusPageUrl: payload.statusPageUrl
            };
        case FAILED_GET_STATUS_PAGE_URL:
            return {
                ...state,
                statusPageUrl: 'not_found'
            };
        case RESET_STATUS_PAGE_URL:
            return {
                ...state,
                statusPageUrl: ''
            };
        case FAILED_DME_CANCEL_BOOK:
        case FAILED_AUTO_AUGMENT:
        case FAILED_AUGMENT_PU_DATE:
        case FAILED_TICK_MANUAL_BOOK:
        case SET_ERROR_MSG:
        case CHANGE_STATUS_FAILED:
        case BOOK_CANCEL_FAILED:
        case BOOK_EDIT_FAILED:
        case FAILED_GET_ORDER_SUMMARY:
        case FAILED_CALC_COLLECTED:
        case FAILED_MANUAL_BOOK:
        case FAIELD_GET_MANIFEST_REPORT:
        case GET_TRACK_FAILED:
        case FAILED_FP_PRICING:
        case SUCCESS_SEND_EMAIL:
        case FAILED_SEND_EMAIL:
        case FAILED_PRICING_ANALYSIS:
        case FAILED_GET_LABELS_INFO:
        case FAILED_GET_SUMMARY_OF_BOOKINGS:
        case FAILED_REPACK:
            return {
                ...state,
                errorMessage: errorMessage,
            };
        case CLEAR_ERR_MSG:
            return {
                ...state,
                errorMessage: '',
            };
        case DO_NOTHING:
        default:
            return state;
    }
};

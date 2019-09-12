import { RESET_TICK_MANUAL_BOOK, RESET_ATTACHMENTS, RESET_BOOKING, SET_ATTACHMENTS, FAILED_GET_ATTACHMENTS,SET_POSTALCODE_DE, SET_SUBURB_DE, SET_STATE_DE, SET_BOOKING_WITH_FILTER, SET_SUBURB, SET_POSTALCODE, SET_STATE, SET_BOOKINGS, FAILED_GET_BOOKINGS, SET_BOOKING, FAILED_UPDATE_BOOKING, SET_MAPPEDBOOKINGS, SET_USER_DATE_FILTER_FIELD, FAILED_GET_USER_DATE_FILTER_FIELD, BOOK_SUCCESS, BOOK_FAILED,  GET_LABEL_SUCCESS, SET_LOCAL_FILTER_ALL, SET_LOCAL_FILTER_SELECTEDATE, SET_LOCAL_FILTER_WAREHOUSEID, SET_LOCAL_FILTER_SORTFIELD, SET_LOCAL_FILTER_COLUMNFILTER, SET_LOCAL_FILTER_PREFILTERIND, SET_LOCAL_FILTER_SIMPLESEARCHKEYWORD, SET_FETCH_BOOKINGS_FLAG, SUCCESS_UPDATE_BOOKING, GET_LABEL_FAILED, SUCCESS_DUPLICATE_BOOKING, BOOK_CANCEL_SUCCESS, BOOK_CANCEL_FAILED, SET_LOCAL_FILTER_CLIENTPK, FAILED_CREATE_BOOKING, SUCCESS_CREATE_BOOKING, CHANGE_STATUS_SUCCESS, CHANGE_STATUS_FAILED, SUCCESS_CALC_COLLECTED, FAILED_CALC_COLLECTED, RESET_FLAG_LINES, SET_LOCAL_FILTER_DOWNLOADOPTION, SET_FETCH_GEO_FLAG, CLEAR_ERR_MSG, SET_LOCAL_FILTER_DMESTATUS, SUCCESS_TICK_MANUAL_BOOK, FAILED_TICK_MANUAL_BOOK, SUCCESS_MANUAL_BOOK, FAILED_MANUAL_BOOK } from '../constants/bookingConstants';

const defaultState = {
    booking: null,
    bookings: [],
    bookingsCnt: 0,
    userDateFilterField: '',
    mappedBookings: [],
    errorMessage: null,
    nextBookingId: null,
    prevBookingId: null,
    needUpdateBookings: false,
    errorsToCorrect: 0,
    toManifest: 0,
    closed: 0,
    missingLabels: 0,
    toProcess: 0,
    startDate: '',
    endDate: '',
    warehouseId: 0,
    itemCountPerPage: 10,
    sortField: '-id',
    columnFilters: {},
    prefilterInd: 0,
    simpleSearchKeyword: '',
    downloadOption: 'label',
    multiFindField: null,
    multiFindValues: [],
    noBooking: null,
    needUpdateBookingLines: false,
    isTickedManualBook: null,
};

export const BookingReducer = (state = defaultState, { payload, noBooking, attachments, type, errorMessage, bBooking, bookings, bookingsCnt, booking, mappedBookings, userDateFilterField, nextBookingId, prevBookingId, toManifest, errorsToCorrect, toProcess, closed, missingLabels, startDate, endDate, warehouseId, sortField, columnFilters, prefilterInd, simpleSearchKeyword, needUpdateBookings, puStates, puPostalCodes, puSuburbs, deToStates, deToPostalCodes, deToSuburbs, downloadOption, clientPK, qtyTotal, cntComms, cntAttachments, dmeStatus, multiFindField, multiFindValues }) => {
    switch (type) {
        case RESET_TICK_MANUAL_BOOK:
            return {
                ...state,
                isTickedManualBook: null,
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
        case SET_BOOKINGS:
            return {
                ...state,
                bookings: bookings,
                bookingsCnt: bookingsCnt,
                needUpdateBookings: false,
                errorsToCorrect: errorsToCorrect,
                toManifest: toManifest,
                toProcess: toProcess,
                closed: closed,
                missingLabels: missingLabels,
                needUpdateBookingLines: false,
            };
        case SET_STATE:
            return {
                ...state,
                puStates: puStates
            };
        case SET_POSTALCODE:
            return {
                ...state,
                puPostalCodes: puPostalCodes
            };
        case SET_SUBURB:
            return {
                ...state,
                puSuburbs: puSuburbs
            };
        case SET_STATE_DE:
            return {
                ...state,
                deToStates: deToStates
            };
        case SET_POSTALCODE_DE:
            return {
                ...state,
                deToPostalCodes: deToPostalCodes
            };
        case SET_SUBURB_DE:
            return {
                ...state,
                deToSuburbs: deToSuburbs
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
                noBooking: noBooking,
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
                needUpdateBookingLines: true,
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
                booking: booking
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
                bookings: [],
            };
        case BOOK_FAILED:
            return {
                ...state,
                needUpdateBookings: true,
                bookings: [],
            };
        case GET_LABEL_SUCCESS:
            return {
                ...state,
                needUpdateBookings: true,
                bookings: [],
            };
        case GET_LABEL_FAILED:
            return {
                ...state,
                needUpdateBookings: true,
                bookings: [],
            };
        case SET_LOCAL_FILTER_ALL:
            return {
                ...state,
                startDate: startDate,
                endDate: endDate,
                warehouseId: warehouseId,
                sortField: sortField,
                columnFilters: columnFilters,
                prefilterInd: prefilterInd,
                simpleSearchKeyword: simpleSearchKeyword,
                downloadOption: downloadOption,
                clientPK: clientPK,
                bookings: [],
                dmeStatus: dmeStatus,
                multiFindField: multiFindField,
                multiFindValues: multiFindValues,
                needUpdateBookings: true,
            };
        case SET_LOCAL_FILTER_SELECTEDATE:
            return {
                ...state,
                startDate: startDate,
                endDate: endDate,
                needUpdateBookings: true,
                bookings: [],
            };
        case SET_LOCAL_FILTER_WAREHOUSEID:
            return {
                ...state,
                warehouseId: warehouseId,
                needUpdateBookings: true,
                bookings: [],
            };
        case SET_LOCAL_FILTER_SORTFIELD:
            return {
                ...state,
                sortField: sortField,
                needUpdateBookings: true,
                bookings: [],
            };
        case SET_LOCAL_FILTER_COLUMNFILTER:
            return {
                ...state,
                columnFilters: columnFilters,
                needUpdateBookings: true,
                bookings: [],
            };
        case SET_LOCAL_FILTER_PREFILTERIND:
            return {
                ...state,
                prefilterInd: prefilterInd,
                needUpdateBookings: true,
                bookings: [],
            };
        case SET_LOCAL_FILTER_SIMPLESEARCHKEYWORD:
            return {
                ...state,
                simpleSearchKeyword: simpleSearchKeyword,
                needUpdateBookings: true,
                bookings: [],
            };
        case SET_LOCAL_FILTER_CLIENTPK:
            return {
                ...state,
                clientPK: clientPK,
                needUpdateBookings: true,
                bookings: [],
            };
        case SET_LOCAL_FILTER_DMESTATUS:
            return {
                ...state,
                dmeStatus: dmeStatus,
                needUpdateBookings: true,
                bookings: [],
            };
        case SET_LOCAL_FILTER_DOWNLOADOPTION:
            return {
                ...state,
                downloadOption: downloadOption,
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
        case FAILED_TICK_MANUAL_BOOK:
            return {
                ...state,
                isTickedManualBook: false,
            };
        case CHANGE_STATUS_FAILED:
        case BOOK_CANCEL_FAILED:
        case BOOK_CANCEL_SUCCESS:
        case FAILED_CALC_COLLECTED:
        case FAILED_MANUAL_BOOK:
            return {
                ...state,
                errorMessage: errorMessage,
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
        case CLEAR_ERR_MSG:
            return {
                ...state,
                errorMessage: '',
            };
        default:
            return state;
    }
};

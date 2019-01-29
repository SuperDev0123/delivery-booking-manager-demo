import { SET_BOOKING_WITH_FILTER, SET_BOOKINGS, FAILED_GET_BOOKINGS, SET_BOOKING, FAILED_UPDATE_BOOKING, SET_MAPPEDBOOKINGS, SET_USER_DATE_FILTER_FIELD, FAILED_GET_USER_DATE_FILTER_FIELD, BOOK_SUCCESS, GET_LABEL_SUCCESS } from '../constants/bookingConstants';

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
};

export const BookingReducer = (state = defaultState, { type, errorMessage, bBooking, bookings, bookingsCnt, booking, mappedBookings, userDateFilterField, nextBookingId, prevBookingId, toManifest, errorsToCorrect, toProcess, closed, missingLabels }) => {
    switch (type) {
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
                prevBookingId: prevBookingId
            };
        case FAILED_GET_BOOKINGS:
            console.log('@booking ---' + bBooking);
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
                needUpdateBookings: true,
            };
        case GET_LABEL_SUCCESS:
            return {
                ...state,
                needUpdateBookings: true,
            };
        default:
            return state;
    }
};

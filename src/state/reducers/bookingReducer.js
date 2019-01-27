import { SET_BOOKING_WITH_FILTER, SET_BOOKINGS, FAILED_GET_BOOKINGS, SET_BOOKING, FAILED_UPDATE_BOOKING, SET_MAPPEDBOOKINGS, SET_USER_DATE_FILTER_FIELD, FAILED_GET_USER_DATE_FILTER_FIELD } from '../constants/bookingConstants';

const defaultState = {
    booking: null,
    bookings: [],
    bookingsCnt: 0,
    userDateFilterField: '',
    mappedBookings: [],
    errorMessage: null,
    nextBookingId: null,
    prevBookingId: null,
};

export const BookingReducer = (state = defaultState, { type, errorMessage, bookings, bookingsCnt, booking, mappedBookings, userDateFilterField, nextBookingId, prevBookingId }) => {
    switch (type) {
        case SET_BOOKINGS:
            return {
                ...state,
                bookings: bookings,
                bookingsCnt: bookingsCnt,
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
            };
        case FAILED_GET_BOOKINGS:
            return {
                ...state,
                errorMessage: errorMessage
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
        default:
            return state;
    }
};

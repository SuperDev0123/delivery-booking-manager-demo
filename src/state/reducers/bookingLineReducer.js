import { SET_BOOKINGLINES, FAILED_GET_BOOKINGLINES, SUCCESS_CREATE_BOOKING_LINE, SUCCESS_UPDATE_BOOKING_LINE, FAILED_CREATE_BOOKING_LINE, FAILED_UPDATE_BOOKING_LINE } from '../constants/bookingLineConstants';

const defaultState = {
    booking: null,
    bookings: [],
    errorMessage: null,
    needUpdateBookingLines: true,
};

export const BookingLineReducer = (state = defaultState, { type, errorMessage, bookingLines }) => {
    switch (type) {
        case SET_BOOKINGLINES:
            return {
                ...state,
                bookingLines: bookingLines,
                needUpdateBookingLines: false,
            };
        case FAILED_GET_BOOKINGLINES:
            return {
                ...state,
                errorMessage: errorMessage
            };
        case SUCCESS_CREATE_BOOKING_LINE:
            return {
                ...state,
                needUpdateBookingLines: true,
            };
        case FAILED_CREATE_BOOKING_LINE:
            return {
                ...state,
                errorMessage: errorMessage
            };
        case SUCCESS_UPDATE_BOOKING_LINE:
            return {
                ...state,
                needUpdateBookingLines: true,
            };
        case FAILED_UPDATE_BOOKING_LINE:
            return {
                ...state,
                errorMessage: errorMessage
            };
        default:
            return state;
    }
};

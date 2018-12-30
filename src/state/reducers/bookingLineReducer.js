import { SET_BOOKINGLINES, FAILED_GET_BOOKINGLINES } from '../constants/bookingLineConstants';

const defaultState = {
    booking: null,
    bookings: [],
    errorMessage: null,
};

export const BookingLineReducer = (state = defaultState, { type, errorMessage, bookingLines }) => {
    switch (type) {
        case SET_BOOKINGLINES:
            return {
                ...state,
                bookingLines: bookingLines
            };
        case FAILED_GET_BOOKINGLINES:
            return {
                ...state,
                errorMessage: errorMessage
            };
        default:
            return state;
    }
};

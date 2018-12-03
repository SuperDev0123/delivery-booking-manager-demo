import { SET_BOOKINGS, FAILED_GET_BOOKINGS } from '../constants/bookingConstants';

const defaultState = {
    bookings: [],
    errorMessage: null,
};

export const BookingReducer = (state = defaultState, { type, errorMessage, bookings }) => {
    switch (type) {
        case SET_BOOKINGS:
            return { 
                ...state, 
                bookings: bookings
            };
        case FAILED_GET_BOOKINGS:
            return { 
                ...state, 
                errorMessage: errorMessage 
            };
        default:
            return state;
    }
};

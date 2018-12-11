import { SET_BOOKINGS, FAILED_GET_BOOKINGS, SET_BOOKING, FAILED_UPDATE_BOOKING } from '../constants/bookingConstants';

const defaultState = {
    booking: null,
    bookings: [],
    errorMessage: null,
};

export const BookingReducer = (state = defaultState, { type, errorMessage, bookings, booking }) => {
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
        default:
            return state;
    }
};

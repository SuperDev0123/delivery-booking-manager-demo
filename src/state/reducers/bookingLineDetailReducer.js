import { SET_BOOKINGLINEDETAILS, FAILED_GET_BOOKINGLINEDETAILS } from '../constants/bookingLineDetailConstants';

const defaultState = {
    bookingLineDetail: null,
    bookingLineDetails: [],
    errorMessage: null,
};

export const BookingLineDetailReducer = (state = defaultState, { type, errorMessage, bookingLineDetails }) => {
    switch (type) {
        case SET_BOOKINGLINEDETAILS:
            return {
                ...state,
                bookingLineDetails: bookingLineDetails
            };
        case FAILED_GET_BOOKINGLINEDETAILS:
            return {
                ...state,
                errorMessage: errorMessage
            };
        default:
            return state;
    }
};

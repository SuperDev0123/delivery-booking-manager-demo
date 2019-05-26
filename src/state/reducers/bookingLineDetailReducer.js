import { SET_BOOKINGLINEDETAILS, FAILED_GET_BOOKINGLINEDETAILS, SUCCESS_CREATE_BOOKING_LINE_DETAIL, FAILED_CREATE_BOOKING_LINE_DETAIL, SUCCESS_UPDATE_BOOKING_LINE_DETAIL, FAILED_UPDATE_BOOKING_LINE_DETAIL, SUCCESS_DELETE_BOOKING_LINE_DETAIL, FAILED_DELETE_BOOKING_LINE_DETAIL, RESET_FLAG_LINEDETAILS } from '../constants/bookingLineDetailConstants';

const defaultState = {
    errorMessage: '',
    bookingLineDetails: null,
    needUpdateBookingLineDetails: false,
};

export const BookingLineDetailReducer = (state = defaultState, { type, errorMessage, bookingLineDetails }) => {
    switch (type) {
        case RESET_FLAG_LINEDETAILS:
            return {
                ...state,
                bookingLineDetails: null,
                needUpdateBookingLineDetails: false,
            };
        case SET_BOOKINGLINEDETAILS:
            return {
                ...state,
                bookingLineDetails: bookingLineDetails,
                needUpdateBookingLineDetails: false,
            };
        case FAILED_GET_BOOKINGLINEDETAILS:
            return {
                ...state,
                errorMessage: errorMessage
            };
        case SUCCESS_CREATE_BOOKING_LINE_DETAIL:
            return {
                ...state,
                needUpdateBookingLineDetails: true,
            };
        case FAILED_CREATE_BOOKING_LINE_DETAIL:
            return {
                ...state,   
                errorMessage: errorMessage
            };
        case SUCCESS_UPDATE_BOOKING_LINE_DETAIL:
            return {
                ...state,
                needUpdateBookingLineDetails: true,
            };
        case FAILED_UPDATE_BOOKING_LINE_DETAIL:
            return {
                ...state,
                errorMessage: errorMessage
            };
        case SUCCESS_DELETE_BOOKING_LINE_DETAIL:
            return {
                ...state,
                needUpdateBookingLineDetails: true,
            };
        case FAILED_DELETE_BOOKING_LINE_DETAIL:
            return {
                ...state,
                errorMessage: errorMessage
            };
        default:
            return state;
    }
};

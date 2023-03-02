import {
    SET_BOOKINGLINEDETAILS,
    FAILED_GET_BOOKINGLINEDETAILS,
    SUCCESS_CREATE_BOOKING_LINE_DETAIL,
    FAILED_CREATE_BOOKING_LINE_DETAIL,
    SUCCESS_UPDATE_BOOKING_LINE_DETAIL,
    FAILED_UPDATE_BOOKING_LINE_DETAIL,
    SUCCESS_DELETE_BOOKING_LINE_DETAIL,
    FAILED_DELETE_BOOKING_LINE_DETAIL,
    RESET_FLAG_LINEDETAILS,
    SUCCESS_MOVE_LINE_DETAILS,
    FAILED_MOVE_LINE_DETAILS,
} from '../constants/bookingLineDetailConstants';

const defaultState = {
    errorMessage: '',
    bookingLineDetails: null,
    needUpdateBookingLineDetails: false,
};

export const BookingLineDetailReducer = (state = defaultState, { type, errorMessage, bookingLineDetails, payload }) => {
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
        case FAILED_MOVE_LINE_DETAILS:
        case FAILED_GET_BOOKINGLINEDETAILS:
            return {
                ...state,
                errorMessage: errorMessage
            };
        case SUCCESS_CREATE_BOOKING_LINE_DETAIL:
            return {
                ...state,
                bookingLineDetails: [...state.bookingLineDetails, payload],
            };
        case SUCCESS_MOVE_LINE_DETAILS:
            return {
                ...state,
                needUpdateBookingLineDetails: true,
            };
        case FAILED_CREATE_BOOKING_LINE_DETAIL:
            return {
                ...state,   
                errorMessage: errorMessage
            };
        case SUCCESS_UPDATE_BOOKING_LINE_DETAIL: {
            const index = state.bookingLineDetails.findIndex(lineDetail => lineDetail.pk_id_lines_data === payload.pk_id_lines_data);
            const _bookingLineDetails = [...state.bookingLineDetails];
            _bookingLineDetails[index] = payload;

            return {
                ...state,
                needUpdateBookingLineDetails: true,
                bookingLineDetails: _bookingLineDetails,
            };
        }
        case FAILED_UPDATE_BOOKING_LINE_DETAIL:
            return {
                ...state,
                errorMessage: errorMessage
            };
        case SUCCESS_DELETE_BOOKING_LINE_DETAIL: {
            const index = state.bookingLineDetails.findIndex(lineDetail => lineDetail.pk_id_lines_data === payload.pk_id_lines_data);
            const _bookingLineDetails = [...state.bookingLineDetails];
            _bookingLineDetails.splice(index, 1);

            return {
                ...state,
                needUpdateBookingLineDetails: true,
                bookingLineDetails: _bookingLineDetails,
            };
        }
        case FAILED_DELETE_BOOKING_LINE_DETAIL:
            return {
                ...state,
                errorMessage: errorMessage
            };
        default:
            return state;
    }
};

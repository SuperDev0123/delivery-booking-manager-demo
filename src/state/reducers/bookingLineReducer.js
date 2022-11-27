import {
    SET_BOOKINGLINES,
    FAILED_GET_BOOKINGLINES,
    SUCCESS_CREATE_BOOKING_LINE,
    SUCCESS_UPDATE_BOOKING_LINE,
    FAILED_CREATE_BOOKING_LINE,
    FAILED_UPDATE_BOOKING_LINE,
    SUCCESS_DELETE_BOOKING_LINE,
    FAILED_DELETE_BOOKING_LINE,
    SUCCESS_CALC_COLLECTED_LINE,
    FAILED_CALC_COLLECTED_LINE,
    RESET_FLAG_LINES,
    SUCCESS_GET_BOOKING_LINES_CNT,
    FAILED_GET_BOOKING_LINES_CNT,
} from '../constants/bookingLineConstants';

const defaultState = {
    bookingLines: null,
    errorMessage: null,
    needUpdateBookingLines: true,
    selectedBookingLinesCnt: null,
};

export const BookingLineReducer = (state = defaultState, { type, errorMessage, bookingLines, payload }) => {
    switch (type) {
        case RESET_FLAG_LINES:
            return {
                ...state,
                bookingLines: null,
                needUpdateBookingLines: false,
            };
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
                bookingLines: [...state.bookingLines, payload],
            };
        case FAILED_CREATE_BOOKING_LINE:
            return {
                ...state,
                errorMessage: errorMessage
            };
        case SUCCESS_UPDATE_BOOKING_LINE: {
            const index = state.bookingLines.findIndex(line => line.pk_lines_id === payload.pk_lines_id);
            const _bookingLines = [...state.bookingLines];
            _bookingLines[index] = payload;

            return {
                ...state,
                needUpdateBookingLines: true,
                bookingLines: _bookingLines,
            };
        }
        case FAILED_UPDATE_BOOKING_LINE:
            return {
                ...state,
                errorMessage: errorMessage
            };
        case SUCCESS_DELETE_BOOKING_LINE: {
            console.log('@1 - ', state.bookingLines, payload);
            const index = state.bookingLines.findIndex(line => line.pk_lines_id === payload.pk_lines_id);
            const _bookingLines = [...state.bookingLines];
            _bookingLines.splice(index, 1);

            return {
                ...state,
                needUpdateBookingLines: true,
                bookingLines: _bookingLines,
            };
        }
        case FAILED_DELETE_BOOKING_LINE:
            return {
                ...state,
                errorMessage: errorMessage
            };
        case SUCCESS_CALC_COLLECTED_LINE:
            return {
                ...state,
                needUpdateBookingLines: true,
            };
        case FAILED_CALC_COLLECTED_LINE:
        case FAILED_GET_BOOKING_LINES_CNT:
            return {
                ...state,
                errorMessage: errorMessage
            };
        case SUCCESS_GET_BOOKING_LINES_CNT:
            return {
                ...state,
                selectedBookingLinesCnt: payload.count,
            };
        default:
            return state;
    }
};

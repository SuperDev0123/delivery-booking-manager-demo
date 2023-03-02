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

export function setBookingLines(bookingLines) {
    return {
        type: SET_BOOKINGLINES,
        bookingLines
    };
}

export function failedGetBookingLines(error) {
    return {
        type: FAILED_GET_BOOKINGLINES,
        errorMessage: 'Unable to fetch bookingLines. Error:' + error,
    };
}

export function successCreateBookingLine(bookingLine) {
    return {
        type: SUCCESS_CREATE_BOOKING_LINE,
        payload: bookingLine,
    };
}

export function failedCreateBookingLine(error) {
    return {
        type: FAILED_CREATE_BOOKING_LINE,
        errorMessage: 'Unable to create BookingLine. Error: ' + error,
    };
}

export function successUpdateBookingLine(bookingLine) {
    return {
        type: SUCCESS_UPDATE_BOOKING_LINE,
        payload: bookingLine,
    };
}

export function failedUpdateBookingLine(error) {
    return {
        type: FAILED_UPDATE_BOOKING_LINE,
        errorMessage: 'Unable to update BookingLine. Error: ' + error,
    };
}

export function successDeleteBookingLine(bookingLine) {
    return {
        type: SUCCESS_DELETE_BOOKING_LINE,
        payload: bookingLine,
    };
}

export function failedDeleteBookingLine(error) {
    return {
        type: FAILED_DELETE_BOOKING_LINE,
        errorMessage: 'Unable to delete BookingLine. Error: ' + error,
    };
}

export function successCalcCollected(data) {
    console.log('@501 - Success calc collected: ', data);
    return {
        type: SUCCESS_CALC_COLLECTED_LINE,
        errorMessage: 'Success calc collected',
    };
}

export function failedCalcCollected(error) {
    console.log('@501 - Failed calc collected: ', error);
    return {
        type: FAILED_CALC_COLLECTED_LINE,
        errorMessage: 'Failed calc collected',
    };
}

export function resetFlag() {
    return {
        type: RESET_FLAG_LINES,
    };
}

export function successGetBookingLinesCnt(data) {
    return {
        type: SUCCESS_GET_BOOKING_LINES_CNT,
        payload: data,
    };
}

export function failedGetBookingLinesCnt() {
    return {
        type: FAILED_GET_BOOKING_LINES_CNT,
        errorMessage: 'Failed to get booking lines count',
    };
}

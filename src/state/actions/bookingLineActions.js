import { SET_BOOKINGLINES, FAILED_GET_BOOKINGLINES } from '../constants/bookingLineConstants';

export function setBookingLines(bookingLines) {
    return {
        type: SET_BOOKINGLINES,
        bookingLines
    };
}

export function failedGetBookingLines(error) {
    console.log('Error: ', error);
    return {
        type: FAILED_GET_BOOKINGLINES,
        errorMessage: 'Unable to fetch bookingLines.'
    };
}

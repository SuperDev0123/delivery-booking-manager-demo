import { SET_BOOKINGLINEDETAILS, FAILED_GET_BOOKINGLINEDETAILS, SUCCESS_CREATE_BOOKING_LINE_DETAIL, FAILED_CREATE_BOOKING_LINE_DETAIL, SUCCESS_UPDATE_BOOKING_LINE_DETAIL, FAILED_UPDATE_BOOKING_LINE_DETAIL, SUCCESS_DELETE_BOOKING_LINE_DETAIL, FAILED_DELETE_BOOKING_LINE_DETAIL, RESET_FLAG_LINEDETAILS } from '../constants/bookingLineDetailConstants';

export function resetFlag() {
    return {
        type: RESET_FLAG_LINEDETAILS,
    };
}

export function setBookingLineDetails(bookingLineDetails) {
    return {
        type: SET_BOOKINGLINEDETAILS,
        bookingLineDetails: bookingLineDetails,
    };
}

export function failedGetBookingLineDetails(error) {
    console.log('Error: ', error);
    return {
        type: FAILED_GET_BOOKINGLINEDETAILS,
        errorMessage: 'Unable to fetch bookingLineDetails. Error:' + error,
    };
}

export function successCreateBookingLineDetail(bookingLine) {
    return {
        type: SUCCESS_CREATE_BOOKING_LINE_DETAIL,
        bookingLine,
    };
}

export function failedCreateBookingLineDetail(error) {
    return {
        type: FAILED_CREATE_BOOKING_LINE_DETAIL,
        errorMessage: 'Unable to create BookingLineDetail. Error: ' + error,
    };
}

export function successUpdateBookingLineDetail(bookingLine) {
    return {
        type: SUCCESS_UPDATE_BOOKING_LINE_DETAIL,
        bookingLine,
    };
}

export function failedUpdateBookingLineDetail(error) {
    return {
        type: FAILED_UPDATE_BOOKING_LINE_DETAIL,
        errorMessage: 'Unable to update BookingLineDetail. Error: ' + error,
    };
}

export function successDeleteBookingLineDetail(bookingLine) {
    return {
        type: SUCCESS_DELETE_BOOKING_LINE_DETAIL,
        bookingLine,
    };
}

export function failedDeleteBookingLineDetail(error) {
    return {
        type: FAILED_DELETE_BOOKING_LINE_DETAIL,
        errorMessage: 'Unable to delete BookingLineDetail. Error: ' + error,
    };
}

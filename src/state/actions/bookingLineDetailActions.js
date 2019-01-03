import { SET_BOOKINGLINEDETAILS, FAILED_GET_BOOKINGLINEDETAILS } from '../constants/bookingLineDetailConstants';

export function setBookingLineDetails(bookingLineDetails) {
    return {
        type: SET_BOOKINGLINEDETAILS,
        bookingLineDetails
    };
}

export function failedGetBookingLineDetails(error) {
    console.log('Error: ', error);
    return {
        type: FAILED_GET_BOOKINGLINEDETAILS,
        errorMessage: 'Unable to fetch bookingLineDetails.'
    };
}

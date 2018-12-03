import { SET_BOOKINGS, FAILED_GET_BOOKINGS } from '../constants/bookingConstants';

export function setBookings(bookings) {
    return {
        type: SET_BOOKINGS,
        bookings
    };
}

export function failedGetBookings(error) {
    console.log('Error: ', error);
    return {
        type: FAILED_GET_BOOKINGS,
        errorMessage: 'Unable to fetch bookings.'
    };
}
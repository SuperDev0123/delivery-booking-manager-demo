import { SET_BOOKINGS, FAILED_GET_BOOKINGS, SET_BOOKING, FAILED_UPDATE_BOOKING, SET_MAPPEDBOOKINGS } from '../constants/bookingConstants';

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

export function setMappedBok1ToBooking(mappedBookings) {
    return {
        type: SET_MAPPEDBOOKINGS,
        mappedBookings
    };
}

export function setBooking(booking) {
    return {
        type: SET_BOOKING,
        booking
    };
}

export function failedUpdateBooking(error) {
    console.log('Error: ', error);
    return {
        type: FAILED_UPDATE_BOOKING,
        errorMessage: 'Unable to update booking.'
    };
}

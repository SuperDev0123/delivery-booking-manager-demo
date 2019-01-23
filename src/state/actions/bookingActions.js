import { SET_BOOKINGS, FAILED_GET_BOOKINGS, SET_BOOKING, FAILED_UPDATE_BOOKING, SET_MAPPEDBOOKINGS, SET_USER_DATE_FILTER_FIELD, FAILED_GET_USER_DATE_FILTER_FIELD } from '../constants/bookingConstants';

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

export function setUserDateFilterField(userDateFilterField) {
    return {
        type: SET_USER_DATE_FILTER_FIELD,
        userDateFilterField
    };
}

export function failedGetUserDateFilterField(error) {
    console.log('Error: ', error);
    return {
        type: FAILED_GET_USER_DATE_FILTER_FIELD,
        errorMessage: 'Unable to get User`s date filter field.'
    };
}

export function successAlliedBooking(data) {
    if (!data[0].hasOwnProperty('Created Booking ID'))
        alert('Failed booking allied: ' + data[0]['Error']);
    else
        alert('Successfully booking allied: ' + data[0]['Created Booking ID']);

    return {
        type: FAILED_GET_USER_DATE_FILTER_FIELD,
        errorMessage: 'Unable to get User`s date filter field.'
    };
}

export function failedAlliedBooking(error) {
    alert('Failed booking allied: ' + error);
    return {
        type: FAILED_GET_USER_DATE_FILTER_FIELD,
        errorMessage: 'Unable to get User`s date filter field.'
    };
}

export function successStBooking(data) {
    if (!data[0].hasOwnProperty('Created Booking ID'))
        alert('Failed booking STARTRACK: ' + data[0]['Error']);
    else
        alert('Successfully booking STARTRACK: ' + data[0]['Created Booking ID']);

    return {
        type: FAILED_GET_USER_DATE_FILTER_FIELD,
        errorMessage: 'Unable to get User`s date filter field.'
    };
}

export function failedStBooking(error) {
    alert('Failed booking STARTRACK: ' + error);
    return {
        type: FAILED_GET_USER_DATE_FILTER_FIELD,
        errorMessage: 'Unable to get User`s date filter field.'
    };
}

export function successGetLabel(data) {
    if (!data[0].hasOwnProperty('Created label ID'))
        alert('Failed get label: ' + data[0]['Error']);
    else
        alert('Successfully get label: ' + data[0]['Created label ID']);

    return {
        type: FAILED_GET_USER_DATE_FILTER_FIELD,
        errorMessage: 'Unable to get User`s date filter field.'
    };
}

export function failedGetLabel(error) {
    alert('Failed get label: ' + error);
    return {
        type: FAILED_GET_USER_DATE_FILTER_FIELD,
        errorMessage: 'Unable to get User`s date filter field.'
    };
}

import { SET_POSTALCODE_DE, SET_SUBURB_DE, SET_STATE_DE, FAILED_GET_SUBURBS_DE, SET_BOOKING_WITH_FILTER, SET_SUBURB, SET_POSTALCODE, SET_STATE, FAILED_GET_SUBURBS, SET_BOOKINGS, FAILED_GET_BOOKINGS, SET_BOOKING, FAILED_UPDATE_BOOKING, SET_MAPPEDBOOKINGS, SET_USER_DATE_FILTER_FIELD, FAILED_GET_USER_DATE_FILTER_FIELD, BOOK_SUCCESS, BOOK_FAILED, GET_LABEL_SUCCESS, GET_LABEL_FAILED } from '../constants/bookingConstants';

import { getAlliedLabel, getSTLabel } from '../services/bookingService';

export function successGetBookings(data) {
    return {
        type: SET_BOOKINGS,
        bookings: data['bookings'],
        bookingsCnt: data['count'],
        toManifest: data['to_manifest'],
        toProcess: data['to_process'],
        closed: data['closed'],
        errorsToCorrect: data['errors_to_correct'],
        missingLabels: data['missing_labels'],
    };
}

export function successGetBooking(data) {
    return {
        type: SET_BOOKING_WITH_FILTER,
        booking: data['booking'],
        nextBookingId: data['nextid'],
        prevBookingId: data['previd'],
    };
}

export function successGetSuburbs(data) {
    if (data['type'] == 'state') {
        return {
            type: SET_STATE,
            stateStrings: data['suburbs'],
        };
    } else if ( data['type'] == 'postalcode' ) {
        return {
            type: SET_POSTALCODE,
            postalCode: data['suburbs'],
        };
    } else if ( data['type'] == 'suburb' ) {
        return {
            type: SET_SUBURB,
            suburbStrings: data['suburbs'],
        };
    }
}

export function failedGetSuburbs(error) {
    console.log('Error: ', error);
    return {
        type: FAILED_GET_SUBURBS,
        errorMessage: 'Unable to fetch suburbs.',
        bBooking: false
    };
}

export function successDeliveryGetSuburbs(data) {
    if (data['type'] == 'state') {
        return {
            type: SET_STATE_DE,
            deStateStrings: data['suburbs'],
        };
    } else if ( data['type'] == 'postalcode' ) {
        return {
            type: SET_POSTALCODE_DE,
            dePostalCode: data['suburbs'],
        };
    } else if ( data['type'] == 'suburb' ) {
        return {
            type: SET_SUBURB_DE,
            deSuburbStrings: data['suburbs'],
        };
    }
}

export function failedDeliveryGetSuburbs(error) {
    console.log('Error: ', error);
    return {
        type: FAILED_GET_SUBURBS_DE,
        errorMessage: 'Unable to fetch suburbs.',
        bBooking: false
    };
}

export function failedGetBookings(error) {
    console.log('Error: ', error);
    return {
        type: FAILED_GET_BOOKINGS,
        errorMessage: 'Unable to fetch bookings.',
        bBooking: false
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

export function successAlliedBook(data) {
    if (!data[0].hasOwnProperty('Created Booking ID')) {
        alert('Failed book allied: ' + data[0]['Error']);
    } else {
        alert('Successfully book allied: ' + data[0]['Created Booking ID']);
        getAlliedLabel(data[0]['Created Booking ID']);
    }

    return {
        type: BOOK_SUCCESS,
        errorMessage: 'Book success'
    };
}

export function failedAlliedBook(error) {
    alert('Failed book allied: ' + error);
    return {
        type: BOOK_FAILED,
        errorMessage: 'Book failed'
    };
}

export function successStBook(data) {
    if (!data[0].hasOwnProperty('Created Booking ID')) {
        alert('Failed book STARTRACK: ' + data[0]['Error']);
    } else {
        alert('Successfully book STARTRACK: ' + data[0]['Created Booking ID']);
        getSTLabel(data[0]['Created Booking ID']);
    }

    return {
        type: BOOK_SUCCESS,
        errorMessage: 'Book success'
    };
}

export function failedStBook(error) {
    alert('Failed book STARTRACK: ' + error);
    return {
        type: BOOK_FAILED,
        errorMessage: 'Book failed'
    };
}

export function successGetLabel(data) {
    if (data[0].hasOwnProperty('Created label url'))
        alert('Successfully get label: ' + data[0]['Created label url']);
    else if (data[0].hasOwnProperty('Created label ID'))
        alert('Successfully get label: ' + data[0]['Created label ID']);
    else
        alert('Failed get label: ' + data[0]['Error']);

    return {
        type: GET_LABEL_SUCCESS,
        errorMessage: 'GetLable success'
    };
}

export function failedGetLabel(error) {
    alert('Failed get label: ' + error);
    return {
        type: GET_LABEL_FAILED,
        errorMessage: 'GetLable failed'
    };
}

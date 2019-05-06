import { SET_ATTACHMENTS, FAILED_GET_ATTACHMENTS, SET_POSTALCODE_DE, SET_SUBURB_DE, SET_STATE_DE, FAILED_GET_SUBURBS_DE, SET_BOOKING_WITH_FILTER, SET_SUBURB, SET_POSTALCODE, SET_STATE, FAILED_GET_SUBURBS, SET_BOOKINGS, FAILED_GET_BOOKINGS, SET_BOOKING, FAILED_UPDATE_BOOKING, SET_MAPPEDBOOKINGS, SET_USER_DATE_FILTER_FIELD, FAILED_GET_USER_DATE_FILTER_FIELD, BOOK_SUCCESS, BOOK_FAILED, GET_LABEL_SUCCESS, GET_LABEL_FAILED, SET_LOCAL_FILTER_ALL, SET_LOCAL_FILTER_SELECTEDATE, SET_LOCAL_FILTER_WAREHOUSEID, SET_LOCAL_FILTER_SORTFIELD, SET_LOCAL_FILTER_COLUMNFILTER, SET_LOCAL_FILTER_PREFILTERIND, SET_LOCAL_FILTER_SIMPLESEARCHKEYWORD, SET_FETCH_BOOKINGS_FLAG, SUCCESS_UPDATE_BOOKING, RESET_UPDATE_LINE_AND_LINEDETAIL, SUCCESS_DUPLICATE_BOOKING, SET_LOCAL_FILTER_NEWPOD, BOOK_CANCEL_SUCCESS, BOOK_CANCEL_FAILED, SET_LOCAL_FILTER_CLIENTPK, FAILED_CREATE_BOOKING, SUCCESS_CREATE_BOOKING, GENERATE_XLS_SUCCESS, GENERATE_XLS_FAILED } from '../constants/bookingConstants';

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

export function setLocalFilter(key, value) {
    if (key === 'date') {
        return {
            type: SET_LOCAL_FILTER_SELECTEDATE,
            startDate: value.startDate,
            endDate: value.endDate,
        };
    } else if (key === 'warehouseId') {
        return {
            type: SET_LOCAL_FILTER_WAREHOUSEID,
            warehouseId: value,
        };
    } else if (key === 'sortField') {
        return {
            type: SET_LOCAL_FILTER_SORTFIELD,
            sortField: value,
        };
    } else if (key === 'columnFilters') {
        return {
            type: SET_LOCAL_FILTER_COLUMNFILTER,
            columnFilters: value,
        };
    } else if (key === 'prefilterInd') {
        return {
            type: SET_LOCAL_FILTER_PREFILTERIND,
            prefilterInd: value,
        };
    } else if (key === 'simpleSearchKeyword') {
        return {
            type: SET_LOCAL_FILTER_SIMPLESEARCHKEYWORD,
            simpleSearchKeyword: value,
        };
    } else if (key === 'newPod') {
        return {
            type: SET_LOCAL_FILTER_NEWPOD,
            newPod: value,
        };
    } else if (key === 'clientPK') {
        return {
            type: SET_LOCAL_FILTER_CLIENTPK,
            clientPK: value,
        };
    }
}

export function setAllLocalFilter(startDate, endDate, clientPK, warehouseId, itemCountPerPage, sortField, columnFilters, prefilterInd, simpleSearchKeyword, newPod) {
    return {
        type: SET_LOCAL_FILTER_ALL,
        startDate: startDate,
        endDate: endDate,
        warehouseId: warehouseId,
        sortField: sortField,
        itemCountPerPage: itemCountPerPage,
        columnFilters: columnFilters,
        prefilterInd: prefilterInd,
        simpleSearchKeyword: simpleSearchKeyword,
        newPod: newPod,
        clientPK: clientPK,
    };
}

export function setNeedUpdateBookingsFlag(boolFlag) {
    return {
        type: SET_FETCH_BOOKINGS_FLAG,
        needUpdateBookings: boolFlag,
    };
}

export function successGetBooking(data) {
    if (!data['booking']['id']) {
        return {
            type: SET_BOOKING_WITH_FILTER,
            noBooking: true,
        };
    }

    return {
        type: SET_BOOKING_WITH_FILTER,
        booking: data['booking'],
        nextBookingId: data['nextid'],
        prevBookingId: data['previd'],
        noBooking: false,
    };
}

export function successCreateBooking(data) {
    return {
        type: SUCCESS_CREATE_BOOKING,
        booking: data,
        noBooking: false,
    };
}

export function successUpdateBooking(data) {
    return {
        type: SUCCESS_UPDATE_BOOKING,
        booking: data,
        noBooking: false,
    };
}

export function successDuplicateBooking(data) {
    return {
        type: SUCCESS_DUPLICATE_BOOKING,
        booking: data,
    };
}

export function setNeedUpdateLineAndLineDetail() {
    return {
        type: RESET_UPDATE_LINE_AND_LINEDETAIL,
    };
}

export function successGetSuburbs(data) {
    if (data['type'] == 'state') {
        return {
            type: SET_STATE,
            puStates: data['suburbs'],
        };
    } else if ( data['type'] == 'postalcode' ) {
        return {
            type: SET_POSTALCODE,
            puPostalCodes: data['suburbs'],
        };
    } else if ( data['type'] == 'suburb' ) {
        return {
            type: SET_SUBURB,
            puSuburbs: data['suburbs'],
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

export function successGetAttachments(data) {
    return {
        type: SET_ATTACHMENTS,
        attachments: data['history'],
    };
}

export function failedGetAttachments(error) {
    console.log('Error: ', error);
    return {
        type: FAILED_GET_ATTACHMENTS,
        errorMessage: 'Unable to get attachments.',
    };
}

export function successDeliveryGetSuburbs(data) {
    if (data['type'] == 'state') {
        return {
            type: SET_STATE_DE,
            deToStates: data['suburbs'],
        };
    } else if ( data['type'] == 'postalcode' ) {
        return {
            type: SET_POSTALCODE_DE,
            deToPostalCodes: data['suburbs'],
        };
    } else if ( data['type'] == 'suburb' ) {
        return {
            type: SET_SUBURB_DE,
            deToSuburbs: data['suburbs'],
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

export function failedCreateBookings(error) {
    console.log('Error: ', error);
    return {
        type: FAILED_CREATE_BOOKING,
        errorMessage: 'Unable to create booking.',
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
    console.log('Failed book allied: ' + error);
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
    console.log('Failed book STARTRACK: ' + error);
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

export function successCancelBook(data) {
    alert('Successfully cancel book: ' + data[0]['message']);

    return {
        type: BOOK_CANCEL_SUCCESS,
        errorMessage: data[0]['message'],
    };
}

export function failedCancelBook(error) {
    alert('Failed cancel book : ' + error);

    return {
        type: BOOK_CANCEL_FAILED,
        errorMessage: 'Cancel Book failed'
    };
}

export function successGenerateXLS(data) {
    console.log('@500 - Success generate xml: ', data);
    return {
        type: GENERATE_XLS_SUCCESS,
        errorMessage: 'Success generate xml',
    };
}

export function failedGenerateXLS(error) {
    console.log('@500 - Failed generate xml: ', error);
    return {
        type: GENERATE_XLS_FAILED,
        errorMessage: 'Failed generate xml'
    };
}

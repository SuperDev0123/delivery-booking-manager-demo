import {
    SUCCESS_GET_NUM_BOOKINGS,
    FAILED_GET_NUM_BOOKINGS,
    SUCCESS_GET_NUM_BOOKINGS_PER_STATUS,
    FAILED_GET_NUM_BOOKINGS_PER_STATUS
} from '../constants/chartConstants';

export function successGetNumBookingsPerFp(data) {
    return {
        type: SUCCESS_GET_NUM_BOOKINGS,
        payload: data.results,
    };
}

export function failedGetNumBookingsPerFp(error) {
    return {
        type: FAILED_GET_NUM_BOOKINGS,
        payload: 'Unable to get num bookings per fp records. Error:' + error,
    };
}

export function successGetNumBookingsPerStatus(data) {
    return {
        type: SUCCESS_GET_NUM_BOOKINGS_PER_STATUS,
        payload: data.results,
    };
}

export function failedGetNumBookingsPerStatus(error) {
    return {
        type: FAILED_GET_NUM_BOOKINGS_PER_STATUS,
        payload: 'Unable to get num bookings per status. Error:' + error,
    };
}

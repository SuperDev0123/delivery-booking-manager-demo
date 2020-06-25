import {
    SUCCESS_GET_NUM_BOOKINGS,
    FAILED_GET_NUM_BOOKINGS,
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
        payload: 'Unable to get files records. Error:' + error,
    };
}

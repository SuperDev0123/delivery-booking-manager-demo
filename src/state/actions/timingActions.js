import {
    SUCCESS_GET_TIMINGS,
    FAILED_GET_TIMINGS,
} from '../constants/timingConstants';

export function successGetTimings(data) {
    return {
        type: SUCCESS_GET_TIMINGS,
        payload: data,
    };
}

export function failedGetTimings(error) {
    return {
        type: FAILED_GET_TIMINGS,
        payload: 'Unable to get files records. Error:' + error,
    };
}

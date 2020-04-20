import {
    SUCCESS_GET_COSTS,
    FAILED_GET_COSTS,
} from '../constants/costConstants';

export function successGetCosts(data) {
    return {
        type: SUCCESS_GET_COSTS,
        payload: data,
    };
}

export function failedGetCosts(error) {
    return {
        type: FAILED_GET_COSTS,
        payload: 'Unable to get files records. Error:' + error,
    };
}

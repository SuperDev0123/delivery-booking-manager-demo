import {
    SUCCESS_GET_FP_COSTS,
    FAILED_GET_FP_COSTS,
    SUCCESS_GET_COST_OPTIONS,
    FAILED_GET_COST_OPTIONS,
    SUCCESS_GET_COST_OPTION_MAPS,
    FAILED_GET_COST_OPTION_MAPS,
    SUCCESS_GET_BOOKING_COST_OPTIONS,
    FAILED_GET_BOOKING_COST_OPTIONS,
} from '../constants/costConstants';

export function successGetFPCosts(data) {
    return {
        type: SUCCESS_GET_FP_COSTS,
        payload: data,
    };
}

export function failedGetFPCosts(error) {
    return {
        type: FAILED_GET_FP_COSTS,
        payload: 'Unable to get FP costs. Error:' + error,
    };
}

export function successGetCostOptions(data) {
    return {
        type: SUCCESS_GET_COST_OPTIONS,
        payload: data,
    };
}

export function failedGetCostOptions(error) {
    return {
        type: FAILED_GET_COST_OPTIONS,
        payload: 'Unable to get cost options. Error:' + error,
    };
}

export function successGetCostOptionMaps(data) {
    return {
        type: SUCCESS_GET_COST_OPTION_MAPS,
        payload: data,
    };
}

export function failedGetCostOptionMaps(error) {
    return {
        type: FAILED_GET_COST_OPTION_MAPS,
        payload: 'Unable to get cost option maps. Error:' + error,
    };
}

export function successGetBookingCostOptions(data) {
    return {
        type: SUCCESS_GET_BOOKING_COST_OPTIONS,
        payload: data,
    };
}

export function failedGetBookingCostOptions(error) {
    return {
        type: FAILED_GET_BOOKING_COST_OPTIONS,
        payload: 'Unable to get cost options. Error:' + error,
    };
}

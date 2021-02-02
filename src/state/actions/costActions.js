import {
    SUCCESS_GET_FP_COSTS,
    FAILED_GET_FP_COSTS,
    SUCCESS_GET_COST_OPTIONS,
    FAILED_GET_COST_OPTIONS,
    SUCCESS_GET_COST_OPTION_MAPS,
    FAILED_GET_COST_OPTION_MAPS,
    SUCCESS_GET_BOOKING_COST_OPTIONS,
    FAILED_GET_BOOKING_COST_OPTIONS,
    SUCCESS_CREATE_BOOKING_COST_OPTION,
    FAILED_CREATE_BOOKING_COST_OPTION,
    SUCCESS_UPDATE_BOOKING_COST_OPTION,
    FAILED_UPDATE_BOOKING_COST_OPTION,
    SUCCESS_DELETE_BOOKING_COST_OPTION,
    FAILED_DELETE_BOOKING_COST_OPTION,
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

export function successCreateBookingCostOption(data) {
    return {
        type: SUCCESS_CREATE_BOOKING_COST_OPTION,
        payload: data,
    };
}

export function failedCreateBookingCostOption(error) {
    return {
        type: FAILED_CREATE_BOOKING_COST_OPTION,
        payload: 'Unable to create cost options. Error:' + error,
    };
}

export function successUpdateBookingCostOption(data) {
    return {
        type: SUCCESS_UPDATE_BOOKING_COST_OPTION,
        payload: data,
    };
}

export function failedUpdateBookingCostOption(error) {
    return {
        type: FAILED_UPDATE_BOOKING_COST_OPTION,
        payload: 'Unable to update cost options. Error:' + error,
    };
}

export function successDeleteBookingCostOption(data) {
    return {
        type: SUCCESS_DELETE_BOOKING_COST_OPTION,
        payload: data,
    };
}

export function failedDeleteBookingCostOption(error) {
    return {
        type: FAILED_DELETE_BOOKING_COST_OPTION,
        payload: 'Unable to delete cost options. Error:' + error,
    };
}

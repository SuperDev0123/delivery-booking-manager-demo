import {
    SUCCESS_GET_SURCHARGES,
    FAILED_GET_SURCHARGES,
    SUCCESS_CREATE_SURCHARGE,
    FAILED_CREATE_SURCHARGE,
    SUCCESS_UPDATE_SURCHARGE,
    FAILED_UPDATE_SURCHARGE,
    SUCCESS_DELETE_SURCHARGE,
    FAILED_DELETE_SURCHARGE,
} from '../constants/costConstants';

export function successGetSurcharges(data) {
    return {
        type: SUCCESS_GET_SURCHARGES,
        payload: data,
    };
}

export function failedGetSurcharges(error) {
    return {
        type: FAILED_GET_SURCHARGES,
        payload: 'Unable to get Surcharges. Error:' + error,
    };
}

export function successCreateSurcharge(data) {
    return {
        type: SUCCESS_CREATE_SURCHARGE,
        payload: data,
    };
}

export function failedCreateSurcharge(error) {
    return {
        type: FAILED_CREATE_SURCHARGE,
        payload: 'Unable to create cost options. Error:' + error,
    };
}

export function successUpdateSurcharge(data) {
    return {
        type: SUCCESS_UPDATE_SURCHARGE,
        payload: data,
    };
}

export function failedUpdateSurcharge(error) {
    return {
        type: FAILED_UPDATE_SURCHARGE,
        payload: 'Unable to update cost options. Error:' + error,
    };
}

export function successDeleteSurcharge(data) {
    return {
        type: SUCCESS_DELETE_SURCHARGE,
        payload: data,
    };
}

export function failedDeleteSurcharge(error) {
    return {
        type: FAILED_DELETE_SURCHARGE,
        payload: 'Unable to delete cost options. Error:' + error,
    };
}

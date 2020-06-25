import {
    SUCCESS_GET_ALLCLIENTRAS,
    FAILED_GET_ALLCLIENTRAS,
    SUCCESS_GET_CLIENTRAS,
    FAILED_GET_CLIENTRAS,
    SUCCESS_CREATE_CLIENTRAS,
    FAILED_CREATE_CLIENTRAS,
    SUCCESS_UPDATE_CLIENTRAS,
    FAILED_UPDATE_CLIENTRAS,
    SUCCESS_DELETE_CLIENTRAS,
    FAILED_DELETE_CLIENTRAS,
} from '../constants/clientRasConstants';

export function successGetClientRas(data) {
    console.log('successGetClientRas', data.result);
    return {
        type: SUCCESS_GET_CLIENTRAS,
        payload: data.result,
    };
}

export function failedGetClientRas(error) {
    return {
        type: FAILED_GET_CLIENTRAS,
        errorMessage: 'Error: ' + JSON.stringify(error.response.data),
    };
}

export function successAllGetClientRas(data) {
    console.log('successAllGetClientRas', data);
    return {
        type: SUCCESS_GET_ALLCLIENTRAS,
        payload: data,
    };
}

export function failedAllGetClientRas(error) {
    return {
        type: FAILED_GET_ALLCLIENTRAS,
        errorMessage: 'Error: ' + JSON.stringify(error.response.data),
    };
}

export function successCreateClientRas(data) {
    return {
        type: SUCCESS_CREATE_CLIENTRAS,
        payload: data,
    };
}

export function failedCreateClientRas(error) {
    return {
        type: FAILED_CREATE_CLIENTRAS,
        errorMessage: 'Error: ' + JSON.stringify(error.response.data),
    };
}

export function successUpdateClientRas(data) {
    return {
        type: SUCCESS_UPDATE_CLIENTRAS,
        payload: data,
    };
}

export function failedUpdateClientRas(error) {
    return {
        type: FAILED_UPDATE_CLIENTRAS,
        errorMessage: 'Error: ' + JSON.stringify(error.response.data),
    };
}

export function successDeleteClientRas(data) {
    return {
        type: SUCCESS_DELETE_CLIENTRAS,
        payload: data,
    };
}

export function failedDeleteClientRas(error) {
    return {
        type: FAILED_DELETE_CLIENTRAS,
        errorMessage: 'Error: ' + JSON.stringify(error.response.data),
    };
}


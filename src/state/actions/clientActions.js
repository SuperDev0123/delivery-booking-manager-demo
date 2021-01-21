import {
    SUCCESS_GET_ALL_CLIENTS,
    FAILED_GET_ALL_CLIENTS,
    SUCCESS_CREATE_CLIENT,
    FAILED_CREATE_CLIENT,
    SUCCESS_UPDATE_CLIENT,
    FAILED_UPDATE_CLIENT,
    SUCCESS_GET_CLIENT,
    FAILED_GET_CLIENT,
} from '../constants/clientConstants';

export function successGetAllClients(data) {
    return {
        type: SUCCESS_GET_ALL_CLIENTS,
        payload: data,
    };
}

export function failedGetAllClients(error) {
    return {
        type: FAILED_GET_ALL_CLIENTS,
        errorMessage: 'Error: ' + JSON.stringify(error.response.data),
    };
}

export function successUpdateClient() {
    return {
        type: SUCCESS_UPDATE_CLIENT,
        errorMessage: 'Successfully updated client',
    };
}

export function failedUpdateClient(error) {
    return {
        type: FAILED_UPDATE_CLIENT,
        errorMessage: 'Unable to update client. Error:' + error,
    };
}

export function successCreateClient() {
    return {
        type: SUCCESS_CREATE_CLIENT
    };
}

export function failedCreateClient() {
    return {
        type: FAILED_CREATE_CLIENT,
        errorMessage: 'Failed to create client',
    };
}

export function successGetClient(data) {
    return {
        type: SUCCESS_GET_CLIENT,
        payload: data
    };
}

export function failedGetClient() {
    return {
        type: FAILED_GET_CLIENT,
        errorMessage: 'Failed to get client',
    };
}
import {
    SUCCESS_GET_ALL_CLIENTS,
    FAILED_GET_ALL_CLIENTS,
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

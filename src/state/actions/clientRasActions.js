import {
    SUCCESS_GET_CLIENTRAS,
    FAILED_GET_CLIENTRAS,
} from '../constants/clientRasConstants';

export function successGetClientRas(data) {
    console.log('successGetClientRas', data);
    return {
        type: SUCCESS_GET_CLIENTRAS,
        payload: data,
    };
}

export function failedGetClientRas(error) {
    return {
        type: FAILED_GET_CLIENTRAS,
        payload: 'Unable to get client ras. Error:' + error,
    };
}

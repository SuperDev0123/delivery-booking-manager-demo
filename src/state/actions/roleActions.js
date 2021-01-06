import {
    SUCCESS_GET_ALL_ROLES,
    FAILED_GET_ALL_ROLES,
} from '../constants/roleConstants';

export function successGetAllRoles(data) {
    return {
        type: SUCCESS_GET_ALL_ROLES,
        payload: data,
    };
}

export function failedGetAllRoles(error) {
    return {
        type: FAILED_GET_ALL_ROLES,
        errorMessage: 'Error: ' + JSON.stringify(error.response.data),
    };
}

import {
    SUCCESS_GET_FILES,
    FAILED_GET_FILES,
    RESET_GET_FILES,
} from '../constants/fileConstants';

export function successGetFiles(data) {
    return {
        type: SUCCESS_GET_FILES,
        payload: data,
    };
}

export function failedGetFiles(error) {
    return {
        type: FAILED_GET_FILES,
        payload: 'Unable to get files records. Error:' + error,
    };
}

export function resetGetFiles() {
    return {
        type: RESET_GET_FILES,
    };
}
import {
    SUCCESS_GET_BOK_1_HEADERS,
    FAILED_GET_BOK_1_HEADERS,
    SUCCESS_GET_BOK_2_LINES,
    FAILED_GET_BOK_2_LINES,
    SUCCESS_GET_BOK_3_LINES_DATA,
    FAILED_GET_BOK_3_LINES_DATA,
} from '../constants/bokConstants';

export function successGetBok1Headers(data) {
    return {
        type: SUCCESS_GET_BOK_1_HEADERS,
        payload: data,
    };
}

export function failedGetBok1Headers(error) {
    return {
        type: FAILED_GET_BOK_1_HEADERS,
        payload: 'Unable to get Bok_1 records. Error:' + error,
    };
}

export function successGetBok2Lines(data) {
    return {
        type: SUCCESS_GET_BOK_2_LINES,
        payload: data,
    };
}

export function failedGetBok2Lines(error) {
    return {
        type: FAILED_GET_BOK_2_LINES,
        payload: 'Unable to get BOk_2 records. Error:' + error,
    };
}

export function successGetBok3LinesData(data) {
    return {
        type: SUCCESS_GET_BOK_3_LINES_DATA,
        payload: data,
    };
}

export function failedGetBok3LinesData(error) {
    return {
        type: FAILED_GET_BOK_3_LINES_DATA,
        payload: 'Unable to get BOk_3 records. Error:' + error,
    };
}

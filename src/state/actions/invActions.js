import {
    SUCCESS_GET_BOK_1_HEADERS,
    FAILED_GET_BOK_1_HEADERS,
    SUCCESS_GET_BOK_2_LINES,
    FAILED_GET_BOK_2_LINES,
    SUCCESS_GET_BOK_3_LINES_DATA,
    FAILED_GET_BOK_3_LINES_DATA,
} from '../constants/invConstants';

export function successGetBok1Headers(data) {
    return {
        type: SUCCESS_GET_BOK_1_HEADERS,
        BOK_1_headers: data.result,
    };
}

export function failedGetBok1Headers(error) {
    return {
        type: FAILED_GET_BOK_1_HEADERS,
        errorMessage: 'Unable to get packageTypes. Error:' + error,
    };
}

export function successGetBok2Lines(data) {
    return {
        type: SUCCESS_GET_BOK_2_LINES,
        BOK_2_lines: data.result,
    };
}

export function failedGetBok2Lines(error) {
    return {
        type: FAILED_GET_BOK_2_LINES,
        errorMessage: 'Unable to get all booking status. Error:' + error,  
    };
}

export function successGetBok3LinesData(data) {
    return {
        type: SUCCESS_GET_BOK_3_LINES_DATA,
        BOK_3_lines_data: data.result,
    };
}

export function failedGetBok3LinesData(error) {

    return {
        type: FAILED_GET_BOK_3_LINES_DATA,
        errorMessage: 'Get booking history status failed. Error: '+ error,
    };
}

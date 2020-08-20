import {
    SUCCESS_GET_BOK_1_HEADERS,
    FAILED_GET_BOK_1_HEADERS,
    SUCCESS_GET_BOK_2_LINES,
    FAILED_GET_BOK_2_LINES,
    SUCCESS_GET_BOK_3_LINES_DATA,
    FAILED_GET_BOK_3_LINES_DATA,
    SUCCESS_GET_BOK_WITH_PRICINGS,
    FAILED_GET_BOK_WITH_PRICINGS,
    SUCCESS_SELECT_PRICING,
    FAILED_SELECT_PRICING,
    RESET_NEED_TO_UPDATE_PRICINGS,
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

export function successGetBokWithPricings(data) {
    return {
        type: SUCCESS_GET_BOK_WITH_PRICINGS,
        payload: data.data,
    };
}

export function failedGetBokWithPricings(error) {
    return {
        type: FAILED_GET_BOK_WITH_PRICINGS,
        payload: 'Unable to get information. Error: ' + error.response.data.message,
    };
}

export function successSelectPricing() {
    return {
        type: SUCCESS_SELECT_PRICING,
    };
}

export function failedSelectPricing(error) {
    return {
        type: FAILED_SELECT_PRICING,
        payload: 'Unable to select pricing. Error: ' + error.response.data.message,
    };
}

export function resetNeedToUpdatePricings() {
    return {
        type: RESET_NEED_TO_UPDATE_PRICINGS,
    };
}

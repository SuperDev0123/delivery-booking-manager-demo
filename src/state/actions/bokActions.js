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
    SUCCESS_GET_DE_STATUS,
    FAILED_GET_DE_STATUS,
    SUCCESS_BOOK_FREIGHT,
    FAILED_BOOK_FREIGHT,
    SUCCESS_CANCEL_FREIGHT,
    FAILED_CANCEL_FREIGHT,
    SUCCESS_UPDATE_BOK_1,
    FAILED_UPDATE_BOK_1,
    SUCCESS_AUTO_REPACK,
    FAILED_AUTO_REPACK,
    SUCCESS_SEND_EMAIL,
    FAILED_SEND_EMAIL,
    SUCCESS_UPDATE_ITEM_PRODUCT,
    FAILED_UPDATE_ITEM_PRODUCT,
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

export function successGetDeliveryStatus(data) {
    return {
        type: SUCCESS_GET_DE_STATUS,
        payload: data,
    };
}

export function failedGetDeliveryStatus() {
    return {
        type: FAILED_GET_DE_STATUS,
        // payload: 'Unable to get delivery status. ' + error.response.data.message,
        payload: 'Currently not available.',
    };
}

export function successBookFreight() {
    return {
        type: SUCCESS_BOOK_FREIGHT,
    };
}

export function failedBookFreight(error) {
    return {
        type: FAILED_BOOK_FREIGHT,
        payload: 'Unable to BOOK freight. ' + error.response.data.message,
    };
}

export function successCancelFreight() {
    return {
        type: SUCCESS_CANCEL_FREIGHT,
    };
}

export function failedCancelFreight(error) {
    return {
        type: FAILED_CANCEL_FREIGHT,
        payload: 'Unable to CANCEL freight. ' + error.response.data.message,
    };
}

export function successUpdateBok_1() {
    return {
        type: SUCCESS_UPDATE_BOK_1,
    };
}

export function failedUpdateBok_1(error) {
    return {
        type: FAILED_UPDATE_BOK_1,
        payload: 'Unable to Update Bok_1. ' + error.response.data.message,
    };
}

export function successAutoRepack() {
    return {
        type: SUCCESS_AUTO_REPACK,
    };
}

export function failedAutoRepack(error) {
    return {
        type: FAILED_AUTO_REPACK,
        payload: 'Unable to auto repack this BOK. ' + error.response.data.message,
    };
}

export function successSendEmail() {
    return {
        type: SUCCESS_SEND_EMAIL,
    };
}

export function failedSendEmail(error) {
    return {
        type: FAILED_SEND_EMAIL,
        payload: 'Unable to send email. ' + error.response.data.message,
    };
}

export function successUpdateItemProduct() {
    return {
        type: SUCCESS_UPDATE_ITEM_PRODUCT,
    };
}

export function failedUpdateItemProduct(error) {
    return {
        type: FAILED_UPDATE_ITEM_PRODUCT,
        payload: 'Unable to update item product. ' + error.response.data.message,
    };
}

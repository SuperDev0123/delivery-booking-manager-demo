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
} from '../constants/bokConstants';

const defaultState = {
    BOK_1_headers: [],
    BOK_2_lines: [],
    BOK_3_lines_data: [],
    BOK_with_pricings: null,
    needToUpdatePricings: null,
    errorMessage: '',
    deliveryStep: null,
    deliveryStatus: null,
};

export const BokReducer = (state = defaultState, { type, payload }) => {
    switch (type) {
        case RESET_NEED_TO_UPDATE_PRICINGS:
            return {
                ...state,
                needToUpdatePricings: false,
            };
        case SUCCESS_GET_BOK_1_HEADERS:
            return {
                ...state,
                BOK_1_headers: payload,
            };
        case SUCCESS_GET_BOK_2_LINES:
            return {
                ...state,
                BOK_2_lines: payload,
            };
        case SUCCESS_GET_BOK_3_LINES_DATA:
            return {
                ...state,
                BOK_3_lines_data: payload,
            };
        case SUCCESS_GET_BOK_WITH_PRICINGS:
            return {
                ...state,
                BOK_with_pricings: payload,
            };
        case SUCCESS_SELECT_PRICING:
            return {
                ...state,
                needToUpdatePricings: true,
            };
        case SUCCESS_GET_DE_STATUS:
            return {
                ...state,
                deliveryStatus: payload.status,
                deliveryStep: payload.step,
            };
        case FAILED_SELECT_PRICING:
        case FAILED_GET_BOK_1_HEADERS:
        case FAILED_GET_BOK_2_LINES:
        case FAILED_GET_BOK_3_LINES_DATA:
        case FAILED_GET_BOK_WITH_PRICINGS:
        case FAILED_GET_DE_STATUS:
            return {
                ...state,
                errorMessage: payload,
                needToUpdatePricings: false,
            };
        default:
            return state;
    }
};

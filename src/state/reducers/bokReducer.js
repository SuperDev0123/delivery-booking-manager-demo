import {
    SUCCESS_GET_BOK_1_HEADERS,
    FAILED_GET_BOK_1_HEADERS,
    SUCCESS_GET_BOK_2_LINES,
    FAILED_GET_BOK_2_LINES,
    SUCCESS_GET_BOK_3_LINES_DATA,
    FAILED_GET_BOK_3_LINES_DATA,
    SUCCESS_GET_BOK_WITH_PRICINGS,
    FAILED_GET_BOK_WITH_PRICINGS,
} from '../constants/bokConstants';

const defaultState = {
    BOK_1_headers: [],
    BOK_2_lines: [],
    BOK_3_lines_data: [],
    BOK_with_pricings: null,
    errorMessage: '',
};

export const BokReducer = (state = defaultState, { type, payload }) => {
    switch (type) {
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
        case FAILED_GET_BOK_1_HEADERS:
        case FAILED_GET_BOK_2_LINES:
        case FAILED_GET_BOK_3_LINES_DATA:
        case FAILED_GET_BOK_WITH_PRICINGS:
            return {
                ...state,
                errorMessage: payload,
            };
        default:
            return state;
    }
};

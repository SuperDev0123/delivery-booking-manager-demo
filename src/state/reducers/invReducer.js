import {
    SUCCESS_GET_BOK_1_HEADERS,
    FAILED_GET_BOK_1_HEADERS,
    SUCCESS_GET_BOK_2_LINES,
    FAILED_GET_BOK_2_LINES,
    SUCCESS_GET_BOK_3_LINES_DATA,
    FAILED_GET_BOK_3_LINES_DATA,
} from '../constants/invConstants';

const defaultState = {
    BOK_1_headers: [],
    BOK_2_lines: [],
    BOK_3_lines_data: [],
};

export const InvReducer = (state = defaultState, {
    type,
    BOK_1_headers,
    BOK_2_lines,
    BOK_3_lines_data
}) => {
    switch (type) {
        case SUCCESS_GET_BOK_1_HEADERS:
            return {
                ...state,
                BOK_1_headers: BOK_1_headers,
            };
        case FAILED_GET_BOK_1_HEADERS:
        case SUCCESS_GET_BOK_2_LINES:
            return {
                ...state,
                BOK_2_lines: BOK_2_lines,
            };
        case FAILED_GET_BOK_2_LINES:
        case SUCCESS_GET_BOK_3_LINES_DATA:
            return {
                ...state,
                BOK_3_lines_data: BOK_3_lines_data,
            };
        case FAILED_GET_BOK_3_LINES_DATA:
        default:
            return state;
    }
};

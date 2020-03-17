import {
    SUCCESS_GET_FILES,
    FAILED_GET_FILES,
} from '../constants/fileConstants';

const defaultState = {
    files: [],
    errorMessage: '',
};

export const FileReducer = (state = defaultState, { type, payload }) => {
    switch (type) {
        case SUCCESS_GET_FILES:
            return {
                ...state,
                files: payload,
            };
        case FAILED_GET_FILES:
            return {
                ...state,
                errorMessage: payload,
            };
        default:
            return state;
    }
};

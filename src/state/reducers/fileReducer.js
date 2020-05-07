import {
    SUCCESS_GET_FILES,
    FAILED_GET_FILES,
    RESET_GET_FILES,
} from '../constants/fileConstants';

const defaultState = {
    files: [],
    loadingFiles: false,
    errorMessage: '',
};

export const FileReducer = (state = defaultState, { type, payload }) => {
    switch (type) {
        case RESET_GET_FILES:
            return {
                ...state,
                loadingFiles: true,
            };
        case SUCCESS_GET_FILES:
            return {
                ...state,
                files: payload,
                loadingFiles: false,
            };
        case FAILED_GET_FILES:
            return {
                ...state,
                loadingFiles: false,
                errorMessage: payload,
            };
        default:
            return state;
    }
};

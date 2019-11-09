import {
    RESET_REPORTS,
    SUCCESS_GET_REPORTS,
    FAILED_GET_REPORTS
} from '../constants/reportConstants';

const defaultState = {
    reports: [],
    errorMessage: null,
};

export const ReportReducer = (state = defaultState, { type, errorMessage, reports }) => {
    switch (type) {
        case RESET_REPORTS:
            return {
                state,
                reports: [],
                errorMessage: null
            };
        case SUCCESS_GET_REPORTS:
            return { 
                ...state, 
                reports: reports
            };
        case FAILED_GET_REPORTS:
            return { 
                ...state, 
                errorMessage: errorMessage 
            };
        default:
            return state;
    }
};

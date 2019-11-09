import {
    RESET_REPORTS,
    SUCCESS_GET_REPORTS,
    FAILED_GET_REPORTS,
} from '../constants/reportConstants';

export function resetReports() {
    return {
        type: RESET_REPORTS,
    };
}

export function successGetReports(data) {
    return {
        type: SUCCESS_GET_REPORTS,
        reports: data,
    };
}

export function failedGetReports(error) {
    return {
        type: FAILED_GET_REPORTS,
        errorMessage: 'Unable to get reports. Error:' + error,
    };
}

import {
    SUCCESS_GET_PACKAGETYPES,
    FAILED_GET_PACKAGETYPES,
    SUCCESS_GET_ALL_BOOKING_STATUS,
    FAILED_GET_ALL_BOOKING_STATUS,
    SUCCESS_SAVE_STATUS_STATUS,
    FAILED_SAVE_STATUS_STATUS,
    SUCCESS_GET_BOOKING_STATUS_HISTORY,
    FAILED_GET_BOOKING_STATUS_HISTORY,
    SUCCESS_GET_FPS,
    FAILED_GET_FPS,
    SUCCESS_GET_STATUS_ACTIONS,
    SUCCESS_GET_STATUS_DETAILS,
    FAILED_GET_STATUS_ACTIONS,
    FAILED_GET_STATUS_DETAILS,
    SUCCESS_CREATE_STATUS_DETAIL,
    SUCCESS_CREATE_STATUS_ACTION,
    FAILED_CREATE_STATUS_DETAIL,
    FAILED_CREATE_STATUS_ACTION,
    SUCCESS_GET_API_BCLS,
    FAILED_GET_API_BCLS,
    RESET_FLAG_STATUSHISTORY,
    RESET_FLAG_APIBCL,
    RESET_STATUS_INFO_FLAG,
    SET_STATUS_INFO_FILTER,
    SUCCESS_GET_STATUS_INFO,
    FAILED_GET_STATUS_INFO,
    RESET_PROJECT_NAMES,
    SUCCESS_GET_PROJECT_NAMES,
    FAILED_GET_PROJECT_NAMES,
    RESET_STORE_BOOKING_LOGS,
    SUCCESS_GET_EMAIL_LOGS,
    FAILED_GET_EMAIL_LOGS,
    RESET_EMAIL_LOGS,
    SUCCESS_GET_BOOKING_SET, // BookingSet
    FAILED_GET_BOOKING_SET, // *
    SUCCESS_CREATE_BOOKING_SET, // *
    FAILED_CREATE_BOOKING_SET, // *
    SUCCESS_UPDATE_BOOKING_SET, // *
    FAILED_UPDATE_BOOKING_SET, // *
    SUCCESS_DELETE_BOOKING_SET, // *
    FAILED_DELETE_BOOKING_SET, // *
    RESET_BOOKING_SET_FLAGS, // BookingSet
    SUCCESS_STATUSHISTORY_SAVE_PU_INFO,
    FAILED_STATUSHISTORY_SAVE_PU_INFO,
} from '../constants/extraConstants';

export function successGetPackageTypes(data) {
    return {
        type: SUCCESS_GET_PACKAGETYPES,
        packageTypes: data.packageTypes,
    };
}

export function failedGetComms(error) {
    return {
        type: FAILED_GET_PACKAGETYPES,
        errorMessage: 'Unable to get packageTypes. Error:' + error,
    };
}

export function successGetAllBookingStatus(data) {
    return {
        type: SUCCESS_GET_ALL_BOOKING_STATUS,
        allBookingStatus: data.all_booking_status,
    };
}

export function failedGetAllBookingStatus(error) {
    return {
        type: FAILED_GET_ALL_BOOKING_STATUS,
        errorMessage: 'Unable to get all booking status. Error:' + error,
    };
}

export function successGetBookingStatusHistory(data) {
    return {
        type: SUCCESS_GET_BOOKING_STATUS_HISTORY,
        statusHistories: data.history,
    };
}

export function failedGetBookingStatusHistory(error) {
    console.log('Failed get booking history status : ' + error);

    return {
        type: FAILED_GET_BOOKING_STATUS_HISTORY,
        errorMessage: 'Get booking history status failed',
    };
}

export function successSaveStatusHistory(data) {
    return {
        type: SUCCESS_SAVE_STATUS_STATUS,
        statusHistory: data,
    };
}

export function failedSaveStatusHistory(error) {
    return {
        type: FAILED_SAVE_STATUS_STATUS,
        errorMessage: 'Unable to save status history. Error:' + error,
    };
}

export function successGetAllFPs(data) {
    return {
        type: SUCCESS_GET_FPS,
        allFPs: data.results,
    };
}

export function failedGetAllFPs(error) {
    return {
        type: FAILED_GET_FPS,
        errorMessage: 'Unable to get all FPs. Error:' + error,
    };
}

export function successStatusActions(data) {
    return {
        type: SUCCESS_GET_STATUS_ACTIONS,
        statusActions: data.results,
    };
}

export function failedStatusActions(error) {
    return {
        type: FAILED_GET_STATUS_ACTIONS,
        errorMessage: 'Unable to get status actions. Error:' + error,
    };
}

export function successGetStatusDetails(data) {
    return {
        type: SUCCESS_GET_STATUS_DETAILS,
        statusDetails: data.results,
    };
}

export function failedStatusDetails(error) {
    return {
        type: FAILED_GET_STATUS_DETAILS,
        errorMessage: 'Unable to get status details. Error:' + error,
    };
}

export function successCreateStatusDetail(data) {
    console.log('#510 - ', data);
    return {
        type: SUCCESS_CREATE_STATUS_DETAIL,
    };
}

export function failedCreateStatusDetail(error) {
    return {
        type: FAILED_CREATE_STATUS_DETAIL,
        errorMessage: 'Unable to create status detail. Error:' + error,
    };
}

export function successCreateStatusAction(data) {
    console.log('#512 - ', data);
    return {
        type: SUCCESS_CREATE_STATUS_ACTION,
    };
}

export function failedCreateStatusAction(error) {
    return {
        type: FAILED_CREATE_STATUS_ACTION,
        errorMessage: 'Unable to create status action. Error:' + error,
    };
}

export function successGetApiBCLs(data) {
    return {
        type: SUCCESS_GET_API_BCLS,
        apiBCLs: data.results,
    };
}

export function failedGetApiBCLs(error) {
    return {
        type: FAILED_GET_API_BCLS,
        errorMessage: 'Unable to get api_bcl. Error:' + error,
    };
}

export function resetFlagStatusHistory() {
    return {
        type: RESET_FLAG_STATUSHISTORY,
    };
}

export function resetFlagApiBCLs() {
    return {
        type: RESET_FLAG_APIBCL,
    };
}

export function setStatusInfoFilterAction(startDate, endDate, clientPK) {
    return {
        type: SET_STATUS_INFO_FILTER,
        startDate: startDate,
        endDate: endDate,
        clientPK: clientPK,
    };
}

export function resetStatusInfoFlag() {
    return {
        type: RESET_STATUS_INFO_FLAG,
    };
}

export function successGetStatusInfo(data) {
    return {
        type: SUCCESS_GET_STATUS_INFO,
        statusInfo: data.results,
    };
}

export function failedGetStatusInfo(error) {
    return {
        type: FAILED_GET_STATUS_INFO,
        errorMessage: 'Unable to get status info. Error:' + error,
    };
}

export function resetProjectNames() {
    return {
        type: RESET_PROJECT_NAMES,
    };
}

export function successGetProjectNames(data) {
    return {
        type: SUCCESS_GET_PROJECT_NAMES,
        payload: data.results,
    };
}

export function failedGetProjectNames(error) {
    return {
        type: FAILED_GET_PROJECT_NAMES,
        errorMessage: 'Unable to get project names. Error:' + error,
    };
}

export function resetStoreBookingLogs() {
    return {
        type: RESET_STORE_BOOKING_LOGS,
    };
}

export function successGetEmailLogs(data) {
    return {
        type: SUCCESS_GET_EMAIL_LOGS,
        payload: data.results,
    };
}

export function failedGetEmailLogs(error) {
    return {
        type: FAILED_GET_EMAIL_LOGS,
        errorMessage: 'Unable to get Email Logs. Error:' + error,
    };
}

export function resetEmailLogs() {
    return {
        type: RESET_EMAIL_LOGS,
    };
}

<<<<<<< HEAD
export function successGetBookingSet(data) {
    return {
        type: SUCCESS_GET_BOOKING_SET,
        payload: data,
    };
}

export function failedGetBookingSet(error) {
    return {
        type: FAILED_GET_BOOKING_SET,
        errorMessage: 'Unable to get bookingset. Error:' + error,
    };
}

export function successCreateBookingSet(data) {
    return {
        type: SUCCESS_CREATE_BOOKING_SET,
        payload: data,
    };
}

export function failedCreateBookingSet(error) {
    return {
        type: FAILED_CREATE_BOOKING_SET,
        errorMessage: 'Unable to create bookingset. Error:' + error,
    };
}

export function successUpdateBookingSet(data) {
    return {
        type: SUCCESS_UPDATE_BOOKING_SET,
        payload: data,
    };
}

export function failedUpdateBookingSet(error) {
    return {
        type: FAILED_UPDATE_BOOKING_SET,
        errorMessage: 'Unable to update bookingset. Error:' + error,
    };
}

export function successDeleteBookingSet(data) {
    return {
        type: SUCCESS_DELETE_BOOKING_SET,
        payload: data,
    };
}

export function failedDeleteBookingSet(error) {
    return {
        type: FAILED_DELETE_BOOKING_SET,
        errorMessage: 'Unable to delete bookingset. Error:' + error,
    };
}

export function resetBookingSetFlagsAction() {
    return {
        type: RESET_BOOKING_SET_FLAGS,
    };
}
=======
export function successSaveStatusHistoryPuInfo() {
    return {
        type: SUCCESS_STATUSHISTORY_SAVE_PU_INFO,
    };
}

export function failedSaveStatusHistoryPuInfo() {
    return {
        type: FAILED_STATUSHISTORY_SAVE_PU_INFO,
    };
}
>>>>>>> feat/get-off-fm

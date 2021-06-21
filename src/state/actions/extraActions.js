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
    SUCCESS_GET_BOOKING_SETS,   // BookingSet
    FAILED_GET_BOOKING_SETS,    // *
    SUCCESS_CREATE_BOOKING_SET, // *
    FAILED_CREATE_BOOKING_SET,  // *
    SUCCESS_UPDATE_BOOKING_SET, // *
    FAILED_UPDATE_BOOKING_SET,  // *
    SUCCESS_DELETE_BOOKING_SET, // *
    FAILED_DELETE_BOOKING_SET,  // *
    RESET_BOOKING_SET_FLAGS,    // BookingSet
    SUCCESS_STATUSHISTORY_SAVE_PU_INFO,
    FAILED_STATUSHISTORY_SAVE_PU_INFO,
    SUCCESS_UPDATE_CLIENT_EMPLOYEE,
    FAILED_UPDATE_CLIENT_EMPLOYEE,
    SUCCESS_GET_ZOHO_TICKETS,
    FAILED_GET_ZOHO_TICKETS,
    RESET_ZOHO_TICKETS,
    SUCCESS_GET_CLIENT_PRODUCTS,
    FAILED_GET_CLIENT_PRODUCTS,
    SUCCESS_DELETE_CLIENT_PRODUCTS,
    FAILED_DELETE_CLIENT_PRODUCTS,
    SUCCESS_CREATE_CLIENT_PRODUCTS,
    FAILED_CREATE_CLIENT_PRODUCTS,
    SUCCESS_UPDATE_CLIENT_PRODUCT,
    FAILED_UPDATE_CLIENT_PRODUCT,
    SUCCESS_GET_ALL_ERRORS,
    FAILED_GET_ALL_ERRORS,
    SUCCESS_GET_CLIENT_EMPLOYEES,
    FAILED_GET_CLIENT_EMPLOYEES,
    SUCCESS_CREATE_CLIENT_EMPLOYEE,
    FAILED_CREATE_CLIENT_EMPLOYEE,
    SUCCESS_GET_CLIENT_EMPLOYEE,
    FAILED_GET_CLIENT_EMPLOYEE,
    SUCCESS_GET_PALLETS,
    FAILED_GET_PALLETS,
    SUCCESS_CREATE_PALLET,
    FAILED_CREATE_PALLET,
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
        statusHistories: data.results,
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

export function successGetBookingSets(data) {
    return {
        type: SUCCESS_GET_BOOKING_SETS,
        payload: data,
    };
}

export function failedGetBookingSets(error) {
    return {
        type: FAILED_GET_BOOKING_SETS,
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

export function successSaveStatusHistoryPuInfo(data) {
    return {
        payload: data.result,
        type: SUCCESS_STATUSHISTORY_SAVE_PU_INFO,
    };
}

export function failedSaveStatusHistoryPuInfo() {
    return {
        type: FAILED_STATUSHISTORY_SAVE_PU_INFO,
    };
}

export function successUpdateClientEmployee(data) {
    return {
        type: SUCCESS_UPDATE_CLIENT_EMPLOYEE,
        errorMessage: 'Successfully updated ClientEmployee',
        payload: data
    };
}

export function failedUpdateClientEmployee(error) {
    return {
        type: FAILED_UPDATE_CLIENT_EMPLOYEE,
        errorMessage: 'Unable to update ClientEmployee. Error:' + error,
    };
}

export function successGetAllClientEmployees(data) {
    return {
        type: SUCCESS_GET_CLIENT_EMPLOYEES,
        payload: data,
    };
}

export function failedGetAllClientEmployees(error) {
    return {
        type: FAILED_GET_CLIENT_EMPLOYEES,
        errorMessage: 'Unable to get all ClientEmployees. Error:' + error,
    };
}

export function successGetZohoTickets(data) {
    return {
        type: SUCCESS_GET_ZOHO_TICKETS,
        payload: data,
        errorMessage: 'Successfully get zoho tickets',
    };
}

export function failedGetZohoTickets(error) {
    return {
        type: FAILED_GET_ZOHO_TICKETS,
        errorMessage: 'Unable to get zoho tickets. Error:' + error,
    };
}

export function resetZohoTickets() {
    return {
        type: RESET_ZOHO_TICKETS,
    };
}

export function successGetDMEClientProducts(data) {
    return {
        type: SUCCESS_GET_CLIENT_PRODUCTS,
        payload: data,
        errorMessage: 'Successfully get client products',
    };
}

export function failedGetDMEClientProducts(error) {
    return {
        type: FAILED_GET_CLIENT_PRODUCTS,
        errorMessage: 'Unable to get client products. Error:' + error,
    };
}

export function successDeleteClientProduct(id, data) {
    data.id = id;
    return {
        type: SUCCESS_DELETE_CLIENT_PRODUCTS,
        payload: data,
    };
}

export function failedDeleteClientProduct() {
    return {
        type: FAILED_DELETE_CLIENT_PRODUCTS,
        errorMessage: 'Failed to delete client product',
    };
}

export function successCreateClientProduct(data) {
    return {
        type: SUCCESS_CREATE_CLIENT_PRODUCTS,
        payload: data
    };
}

export function failedCreateClientProduct() {
    return {
        type: FAILED_CREATE_CLIENT_PRODUCTS,
        errorMessage: 'Failed to create client product',
    };
}

export function successUpdateClientProduct(data) {
    return {
        type: SUCCESS_UPDATE_CLIENT_PRODUCT,
        payload: data
    };
}

export function failedUpdateClientProduct() {
    return {
        type: FAILED_UPDATE_CLIENT_PRODUCT,
        errorMessage: 'Failed to create client product',
    };
}

export function successGetAllErrors(data) {
    return {
        type: SUCCESS_GET_ALL_ERRORS,
        payload: data,
    };
}

export function failedGetAllErrors() {
    return {
        type: FAILED_GET_ALL_ERRORS,
        errorMessage: 'Failed to fetch all errors',
    };
}

export function successCreateClientEmployee(data) {
    return {
        type: SUCCESS_CREATE_CLIENT_EMPLOYEE,
        payload: data
    };
}

export function failedCreateClientEmployee() {
    return {
        type: FAILED_CREATE_CLIENT_EMPLOYEE,
        errorMessage: 'Failed to create client employee',
    };
}

export function successGetClientEmployee(data) {
    return {
        type: SUCCESS_GET_CLIENT_EMPLOYEE,
        payload: data
    };
}

export function failedGetClientEmployee() {
    return {
        type: FAILED_GET_CLIENT_EMPLOYEE,
        errorMessage: 'Failed to get client employee',
    };
}

export function successGetPallets(data) {
    return {
        type: SUCCESS_GET_PALLETS,
        payload: data
    };
}

export function failedGetPallets() {
    return {
        type: FAILED_GET_PALLETS,
        errorMessage: 'Failed to get pallets',
    };
}

export function successCreatePallet(data) {
    return {
        type: SUCCESS_CREATE_PALLET,
        payload: data
    };
}

export function failedCreatePallet() {
    return {
        type: FAILED_CREATE_PALLET,
        errorMessage: 'Failed to create a pallet',
    };
}

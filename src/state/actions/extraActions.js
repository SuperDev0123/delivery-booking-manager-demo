import { SUCCESS_GET_PACKAGETYPES, FAILED_GET_PACKAGETYPES, SUCCESS_GET_ALL_BOOKING_STATUS, FAILED_GET_ALL_BOOKING_STATUS, SUCCESS_SAVE_STATUS_STATUS, FAILED_SAVE_STATUS_STATUS, SUCCESS_GET_BOOKING_STATUS_HISTORY, FAILED_GET_BOOKING_STATUS_HISTORY } from '../constants/extraConstants';

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

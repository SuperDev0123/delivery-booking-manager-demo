import { SUCCESS_GET_PACKAGETYPES, FAILED_GET_PACKAGETYPES, SUCCESS_GET_ALL_BOOKING_STATUS, FAILED_GET_ALL_BOOKING_STATUS } from '../constants/extraConstants';

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

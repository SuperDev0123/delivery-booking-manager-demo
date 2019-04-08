import { SUCCESS_GET_PACKAGETYPES, FAILED_GET_PACKAGETYPES } from '../constants/extraConstants';

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

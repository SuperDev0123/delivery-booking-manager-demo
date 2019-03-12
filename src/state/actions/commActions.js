import { SET_COMMS, FAILED_GET_COMMS, SUCCESS_UPDATE_COMM, FAILED_UPDATE_COMM, SET_LOCAL_FILTER_SORTFIELD, SET_LOCAL_FILTER_COLUMNFILTER } from '../constants/commConstants';

export function setComms(data) {
    return {
        type: SET_COMMS,
        comms: data.comms,
    };
}

export function failedGetComms(error) {
    return {
        type: FAILED_GET_COMMS,
        errorMessage: 'Unable to get Comms. Error:' + error,
    };
}

export function onSuccessUpdateComm(data) {
    return {
        type: SUCCESS_UPDATE_COMM,
        comm: data,
    };
}

export function failedUpdateComm(error) {
    return {
        type: FAILED_UPDATE_COMM,
        errorMessage: 'Unable to get Comms. Error:' + error,
    };
}

export function setLocalFilter(key, value) {
    if (key === 'sortField') {
        return {
            type: SET_LOCAL_FILTER_SORTFIELD,
            sortField: value,
        };
    } else if (key === 'columnFilters') {
        return {
            type: SET_LOCAL_FILTER_COLUMNFILTER,
            columnFilters: value,
        };
    }
}
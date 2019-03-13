import { SET_COMMS, FAILED_GET_COMMS, SUCCESS_UPDATE_COMM, FAILED_UPDATE_COMM, SET_LOCAL_FILTER_SORTFIELD, SET_LOCAL_FILTER_COLUMNFILTER, SUCCESS_GET_NOTES, FAILED_GET_NOTES, SUCCESS_CREATE_NOTE, FAILED_CREATE_NOTE, SUCCESS_UPDATE_NOTE, FAILED_UPDATE_NOTE } from '../constants/commConstants';

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

export function successUpdateComm(data) {
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

export function successGetNotes(data) {
    return {
        type: SUCCESS_GET_NOTES,
        notes: data.notes,
    };
}

export function failedGetNotes(error) {
    return {
        type: FAILED_GET_NOTES,
        errorMessage: 'Unable to get Notes. Error:' + error,
    };
}

export function successCreateNote(data) {
    return {
        type: SUCCESS_CREATE_NOTE,
        comm: data,
    };
}

export function failedCreateNote(error) {
    return {
        type: FAILED_CREATE_NOTE,
        errorMessage: 'Unable to create Note. Error:' + error,
    };
}

export function successUpdateNote(data) {
    return {
        type: SUCCESS_UPDATE_NOTE,
        note: data,
    };
}

export function failedUpdateNote(error) {
    return {
        type: FAILED_UPDATE_NOTE,
        errorMessage: 'Unable to update Note. Error:' + error,
    };
}

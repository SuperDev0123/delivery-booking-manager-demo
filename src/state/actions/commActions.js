import { SET_COMMS, FAILED_GET_COMMS, SUCCESS_UPDATE_COMM, FAILED_UPDATE_COMM, SET_LOCAL_FILTER_SORT_FIELD, SET_LOCAL_FILTER_SORT_TYPE, SET_LOCAL_FILTER_COLUMNFILTER, SUCCESS_GET_NOTES, FAILED_GET_NOTES, SUCCESS_CREATE_NOTE, FAILED_CREATE_NOTE, SUCCESS_UPDATE_NOTE, FAILED_UPDATE_NOTE, SET_ALL_LOCAL_FILTER, SET_NEEDUPDATECOMMS, SUCCESS_GET_AVAILABLE_CREATORS, FAILED_GET_AVAILABLE_CREATORS, SUCCESS_DELETE_NOTE, FAILED_DELETE_NOTE } from '../constants/commConstants';

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
            type: SET_LOCAL_FILTER_SORT_FIELD,
            sortField: value,
        };
    } else if (key === 'sortType') {
        return {
            type: SET_LOCAL_FILTER_SORT_TYPE,
            sortType: value,
        };
    } else if (key === 'columnFilters') {
        return {
            type: SET_LOCAL_FILTER_COLUMNFILTER,
            columnFilters: value,
        };
    }
}

export function setAllLocalFilter(bookingId, sortField, sortType, columnFilters, simpleSearchKeyword) {
    return {
        type: SET_ALL_LOCAL_FILTER,
        bookingId,
        sortField,
        sortType,
        columnFilters,
        simpleSearchKeyword,
    };
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

export function setNeedUpdateCommsFlag(boolFlag) {
    return {
        type: SET_NEEDUPDATECOMMS,
        needUpdateComms: boolFlag,
    };
}

export function successGetAvailableCreators(data) {
    return {
        type: SUCCESS_GET_AVAILABLE_CREATORS,
        availableCreators: data.creators,
    };
}

export function failedGetAvailableCreators(error) {
    return {
        type: FAILED_GET_AVAILABLE_CREATORS,
        errorMessage: error,
    };
}

export function successDeleteNote(data) {

    return {
        type: SUCCESS_DELETE_NOTE,
        errorMessage: data.status,
    };
}

export function failedDeleteNote(error) {
    return {
        type: FAILED_DELETE_NOTE,
        errorMessage: error,
    };
}

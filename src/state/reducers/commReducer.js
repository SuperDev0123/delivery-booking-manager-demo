import { SET_COMMS, FAILED_GET_COMMS, SUCCESS_UPDATE_COMM, FAILED_UPDATE_COMM, SET_LOCAL_FILTER_SORT_FIELD, SET_LOCAL_FILTER_SORT_TYPE, SET_LOCAL_FILTER_COLUMNFILTER, SUCCESS_GET_NOTES, FAILED_GET_NOTES, SUCCESS_CREATE_NOTE, FAILED_CREATE_NOTE, SUCCESS_UPDATE_NOTE, FAILED_UPDATE_NOTE, SET_ALL_LOCAL_FILTER } from '../constants/commConstants';

const defaultState = {
    comms: [],
    notes: [],
    comm: null,
    note: null,
    errorMessage: null,
    needUpdateComms: false,
    needUpdateNotes: false,
    sortCommsField: 'id',
    sortBookingsField: '',
};

export const CommReducer = (state = defaultState, { type, errorMessage, comms, comm, bookingId, sortField, sortType, columnFilters, notes, note }) => {
    switch (type) {
        case SET_COMMS:
            return { 
                ...state, 
                comms: comms,
                needUpdateComms: false,
            };
        case FAILED_GET_COMMS:
            return { 
                ...state, 
                errorMessage: errorMessage 
            };
        case SUCCESS_UPDATE_COMM:
            return { 
                ...state, 
                comm: comm,
                needUpdateComms: true,
            };
        case FAILED_UPDATE_COMM:
            return { 
                ...state, 
                errorMessage: errorMessage 
            };
        case SET_LOCAL_FILTER_SORT_FIELD:
            return {
                ...state,
                sortField: sortField,
                needUpdateComms: true,
            };
        case SET_LOCAL_FILTER_SORT_TYPE:
            return {
                ...state,
                sortType: sortType,
                needUpdateComms: true,
            };
        case SET_ALL_LOCAL_FILTER:
            return {
                ...state,
                bookingId,
                sortField,
                sortType,
                columnFilters,
                needUpdateComms: true,
            };
        case SET_LOCAL_FILTER_COLUMNFILTER:
            return {
                ...state,
                columnFilters: columnFilters,
                needUpdateComms: true,
            };
        case SUCCESS_GET_NOTES:
            return {
                ...state,
                notes: notes,
                needUpdateNotes: false,
            };
        case FAILED_GET_NOTES:
            return { 
                ...state, 
                errorMessage: errorMessage 
            };
        case SUCCESS_CREATE_NOTE:
            return { 
                ...state, 
                note: note,
                needUpdateNotes: true,
            };
        case FAILED_CREATE_NOTE:
            return { 
                ...state, 
                errorMessage: errorMessage 
            };
        case SUCCESS_UPDATE_NOTE:
            return { 
                ...state, 
                note: note,
                needUpdateNotes: true,
            };
        case FAILED_UPDATE_NOTE:
            return { 
                ...state, 
                errorMessage: errorMessage 
            };
        default:
            return state;
    }
};

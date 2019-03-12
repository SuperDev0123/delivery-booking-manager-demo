import { SET_COMMS, FAILED_GET_COMMS, SUCCESS_UPDATE_COMM, FAILED_UPDATE_COMM, SET_LOCAL_FILTER_SORTFIELD, SET_LOCAL_FILTER_COLUMNFILTER } from '../constants/commConstants';

const defaultState = {
    comms: [],
    comm: null,
    errorMessage: null,
    needUpdateComms: false,
};

export const CommReducer = (state = defaultState, { type, errorMessage, comms, comm, sortField, columnFilters }) => {
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
        case SET_LOCAL_FILTER_SORTFIELD:
            return {
                ...state,
                sortField: sortField,
                needUpdateComms: true,
            };
        case SET_LOCAL_FILTER_COLUMNFILTER:
            return {
                ...state,
                columnFilters: columnFilters,
                needUpdateComms: true,
            };
        default:
            return state;
    }
};

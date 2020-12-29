import {
    SUCCESS_GET_ALL_CLIENTS,
    FAILED_GET_ALL_CLIENTS,
    SUCCESS_CREATE_CLIENT,
    FAILED_CREATE_CLIENT,
    SUCCESS_UPDATE_CLIENT,
    FAILED_UPDATE_CLIENT,
    SUCCESS_GET_CLIENT,
    FAILED_GET_CLIENT,
} from '../constants/clientConstants';

const defaultState = {
    clients: [],
    client: {},
    errorMessage: '',
};

export const ClientReducer = (state = defaultState, { type, payload, errorMessage }) => {
    switch (type) {        
        case SUCCESS_GET_ALL_CLIENTS:
            return {
                ...state,
                clients: payload,
                errorMessage: null,
            };
        case SUCCESS_GET_CLIENT:
            return {
                ...state,
                client: payload,
                errorMessage: null,
            };
        case SUCCESS_CREATE_CLIENT:
        case FAILED_CREATE_CLIENT:
        case SUCCESS_UPDATE_CLIENT:
        case FAILED_UPDATE_CLIENT:
        case FAILED_GET_CLIENT:
        case FAILED_GET_ALL_CLIENTS:
            return {
                ...state,
                errorMessage: errorMessage
            };
        default:
            return state;
    }
};

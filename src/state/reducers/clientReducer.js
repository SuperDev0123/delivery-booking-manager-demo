import {
    SUCCESS_GET_ALL_CLIENTS,
    FAILED_GET_ALL_CLIENTS,
} from '../constants/clientConstants';

const defaultState = {
    clients: [],
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
        case FAILED_GET_ALL_CLIENTS:
            return {
                ...state,
                errorMessage: errorMessage
            };
        default:
            return state;
    }
};

import {
    SUCCESS_GET_CLIENTRAS,
    FAILED_GET_CLIENTRAS,
} from '../constants/clientRasConstants';

const defaultState = {
    clientRases: [],
    errorMessage: '',
};

export const ClientRasReducer = (state = defaultState, { type, payload }) => {
    switch (type) {        
        case SUCCESS_GET_CLIENTRAS:
            console.log('clientRases', payload);
            return {
                ...state,
                clientRases: payload,
            };
        case FAILED_GET_CLIENTRAS:
            return {
                ...state,
                errorMessage: payload,
            };
        default:
            return state;
    }
};

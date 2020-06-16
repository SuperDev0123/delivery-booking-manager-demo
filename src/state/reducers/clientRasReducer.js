import {
    SUCCESS_GET_ALLCLIENTRAS,
    FAILED_GET_ALLCLIENTRAS,
    SUCCESS_GET_CLIENTRAS,
    FAILED_GET_CLIENTRAS,
    SUCCESS_CREATE_CLIENTRAS,
    FAILED_CREATE_CLIENTRAS,
    SUCCESS_UPDATE_CLIENTRAS,
    FAILED_UPDATE_CLIENTRAS,
    SUCCESS_DELETE_CLIENTRAS,
    FAILED_DELETE_CLIENTRAS,
} from '../constants/clientRasConstants';

const defaultState = {
    clientRases: [],
    clientRasDetails: {},
    needUpdateClientRas: false,
    errorMessage: '',
};

export const ClientRasReducer = (state = defaultState, { type, payload, errorMessage }) => {
    switch (type) {        
        case SUCCESS_GET_ALLCLIENTRAS:
            return {
                ...state,
                clientRases: payload,
                needUpdateClientRas: false,
                errorMessage: null,
            };
        case SUCCESS_GET_CLIENTRAS:
            return {
                ...state,
                clientRasDetails: payload,
                errorMessage: null,
            };
        case SUCCESS_CREATE_CLIENTRAS:
            return {
                ...state,
                needUpdateClientRas: true,
                errorMessage: null,
            };
        case SUCCESS_UPDATE_CLIENTRAS:
            return {
                ...state,
                needUpdateClientRas: true,
                errorMessage: null,
            };
        case SUCCESS_DELETE_CLIENTRAS:
            return {
                ...state,
                needUpdateClientRas: true,
                errorMessage: null,
            };
        case FAILED_GET_ALLCLIENTRAS:
        case FAILED_GET_CLIENTRAS:
        case FAILED_CREATE_CLIENTRAS:
        case FAILED_UPDATE_CLIENTRAS:
        case FAILED_DELETE_CLIENTRAS:
            return {
                ...state,
                errorMessage: errorMessage
            };
        default:
            return state;
    }
};

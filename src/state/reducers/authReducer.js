import {
    SET_TOKEN,
    FAILED_GET_TOKEN,
    SET_USER,
    FAILED_GET_USER,
    FAILED_VERIFY_TOKEN,
    RESET_REDIRECT_STATE,
    SET_DME_CLIENTS,
    FAILED_GET_DME_CLIENTS,
    SET_CLIENT_PK,
    SUCCESS_RESET_PASSWORD,
    FAILED_RESET_PASSWORD,
    SUCCESS_RESET_PASSWORD_CONFIRM,
    FAILED_RESET_PASSWORD_CONFIRM,
    LOGOUT
} from '../constants/authConstants';

const defaultState = {
    token: '',
    successMessage: null,
    errorMessage: null,
    username: '',
    clientname: null,
    clientId: null,
    isLoggedIn: false,
    redirect: false,
    dmeClients: [],
    clientPK: null,
};

export const AuthReducer = (state = defaultState, {
    type,
    token,
    successMessage,
    errorMessage,
    username,
    clientname,
    clientId,
    isLoggedIn,
    dmeClients,
    clientPK
}) => {
    switch (type) {
        case LOGOUT:
            return {
                ...state,
                token: null,
                errorMessage: null,
                redirect: false,
                isLoggedIn: false,
                username: null,
                clientname: null,
                dmeClients: [],
                clientPK: null,
            };
        case SET_TOKEN:
            return {
                ...state,
                token: token,
                isLoggedIn: true,
                redirect : false,
            };
        case FAILED_GET_TOKEN:
        case FAILED_VERIFY_TOKEN:
            return {
                ...state,
                errorMessage: errorMessage,
                redirect : true,
            };
        case SUCCESS_RESET_PASSWORD:
        case SUCCESS_RESET_PASSWORD_CONFIRM:
            return {
                ...state,
                successMessage: successMessage,
                errorMessage: null
            };
        case FAILED_RESET_PASSWORD:
        case FAILED_RESET_PASSWORD_CONFIRM:
            return {
                ...state,
                errorMessage: errorMessage,
                successMessage: null
            };
        case SET_USER:
            return {
                ...state,
                username: username,
                clientname: clientname,
                clientId: clientId,
                clientPK: clientPK,
                isLoggedIn: isLoggedIn,
                redirect : false,
            };
        case FAILED_GET_USER:
            return {
                ...state,
                errorMessage: errorMessage,
                isLoggedIn: isLoggedIn,
                redirect : true,
            };
        case RESET_REDIRECT_STATE:
            return {
                ...state,
                redirect: false,
            };
        case SET_DME_CLIENTS:
            return {
                ...state,
                dmeClients: dmeClients,
                redirect : false,
            };
        case FAILED_GET_DME_CLIENTS:
            return {
                ...state,
                errorMessage: errorMessage,
                redirect : false,
            };
        case SET_CLIENT_PK:
            return {
                ...state,
                clientPK: clientPK,
            };
        default:
            return state;
    }
};

import { SET_TOKEN, FAILED_GET_TOKEN, SET_USER, FAILED_GET_USER, FAILED_VERIFY_TOKEN, RESET_REDIRECT_STATE, SET_DME_CLIENTS, FAILED_GET_DME_CLIENTS, SET_CLIENT_PK  } from '../constants/authConstants';

const defaultState = {
    token: '',
    errorMessage: null,
    username: null,
    clientname: null,
    clientId: null,
    isLoggedIn: 'false',
    redirect: false,
    dmeClients: [],
    clientPK: null,
};

export const AuthReducer = (state = defaultState, { type, token, errorMessage, username, clientname, clientId, isLoggedIn, dmeClients, clientPK }) => {
    switch (type) {
        case SET_TOKEN:
            return {
                ...state,
                token: token,
                redirect : false,
            };
        case FAILED_GET_TOKEN:
            return {
                ...state,
                errorMessage: errorMessage,
                redirect : true,
            };
        case FAILED_VERIFY_TOKEN:
            return {
                ...state,
                errorMessage: errorMessage,
                redirect : true,
            };
        case SET_USER:
            return {
                ...state,
                username: username,
                clientname: clientname,
                clientId: clientId,
                isLoggedIn: isLoggedIn,
                redirect : false,
            };
        case FAILED_GET_USER:
            return {
                ...state,
                errorMessage: errorMessage,
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

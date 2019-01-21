import { SET_TOKEN, FAILED_GET_TOKEN, SET_USER, FAILED_GET_USER, FAILED_VERIFY_TOKEN } from '../constants/authConstants';

const defaultState = {
    token: '',
    errorMessage: null,
    username: null,
    clientname: null,
    isLoggedIn: 'false',
    redirect: false
};

export const AuthReducer = (state = defaultState, { type, token, errorMessage, username, clientname, isLoggedIn }) => {
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
                isLoggedIn: isLoggedIn,
                redirect : false,
            };
        case FAILED_GET_USER:
            return {
                ...state,
                errorMessage: errorMessage,
                redirect : true,
            };
        default:
            return state;
    }
};

import { SET_TOKEN, FAILED_GET_TOKEN, SET_USER, FAILED_GET_USER } from '../constants/authConstants';

const defaultState = {
    token: '',
    errorMessage: null,
    username: null,
    isLoggedIn: 'false',
};

export const AuthReducer = (state = defaultState, { type, token, errorMessage, username, isLoggedIn }) => {
    switch (type) {
        case SET_TOKEN:
            return { 
                ...state, 
                token: token 
            };
        case FAILED_GET_TOKEN:
            return { 
                ...state, 
                errorMessage: errorMessage 
            };
        case SET_USER:
            return { 
                ...state, 
                username: username,
                isLoggedIn: isLoggedIn 
            };
        case FAILED_GET_USER:
            return { 
                ...state, 
                errorMessage: errorMessage 
            };
        default:
            return state;
    }
};

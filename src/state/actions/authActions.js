import { SET_TOKEN, FAILED_GET_TOKEN, SET_USER, FAILED_GET_USER } from '../constants/authConstants';

export function setToken(token) {
    return {
        type: SET_TOKEN,
        token
    };
}

export function failedGetToken(error) {
    console.log('Error: ', error);
    return {
        type: FAILED_GET_TOKEN,
        errorMessage: 'Unable to log in with provided credentials.'
    };
}

export function setUser(username) {
    return {
        type: SET_USER,
        username
    };
}

export function failedGetUser(error) {
    console.log('Error: ', error);
    return {
        type: FAILED_GET_USER,
        errorMessage: 'Unable to get user with this token.'
    };
}
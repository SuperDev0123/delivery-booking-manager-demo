import { SET_TOKEN, FAILED_GET_TOKEN, SET_USER, FAILED_GET_USER } from '../constants/authConstants';

export function setToken(token) {
    localStorage.setItem('token', token);
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
    localStorage.setItem('isLoggedIn', 'true');
    return {
        type: SET_USER,
        username,
        isLoggedIn: 'true'
    };
}

export function failedGetUser(error) {
    console.log('Error: ', error);
    return {
        type: FAILED_GET_USER,
        errorMessage: 'Unable to get user with this token.'
    };
}
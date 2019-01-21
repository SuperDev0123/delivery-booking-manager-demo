import { SET_TOKEN, FAILED_GET_TOKEN, FAILED_VERIFY_TOKEN, SET_USER, FAILED_GET_USER } from '../constants/authConstants';

export function setToken(token) {
    console.log('Token set: ', token);
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

export function detectTokenExpiration(data) {
    if (data.hasOwnProperty('token')) {
        console.log('verifyToken response: ', data);
        return {
            type: SET_TOKEN,
            errorMessage: data.token
        };
    } else {
        console.log('Token expired');
        localStorage.setItem('isLoggedIn', 'false');
        localStorage.setItem('token', '');

        return {
            type: FAILED_VERIFY_TOKEN,
            errorMessage: 'Failed to verify token.'
        };
    }
}

export function failedVerifiyToken(error) {
    console.log('Error: ', error);
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.setItem('token', '');

    return {
        type: FAILED_VERIFY_TOKEN,
        errorMessage: 'Failed to verify token.'
    };
}

export function setUser(username, clientname) {
    localStorage.setItem('isLoggedIn', 'true');
    return {
        type: SET_USER,
        username,
        clientname,
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

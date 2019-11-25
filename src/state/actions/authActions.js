import { SET_TOKEN, FAILED_GET_TOKEN, FAILED_VERIFY_TOKEN, SET_USER, FAILED_GET_USER, RESET_REDIRECT_STATE, SET_DME_CLIENTS, FAILED_GET_DME_CLIENTS, SET_CLIENT_PK, SUCCESS_RESET_PASSWORD, FAILED_RESET_PASSWORD, SUCCESS_RESET_PASSWORD_CONFIRM, FAILED_RESET_PASSWORD_CONFIRM } from '../constants/authConstants';

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

export function successResetPassword(error) {
    console.log('Error: ', error);
    return {
        type: SUCCESS_RESET_PASSWORD,
        successMessage: 'An email with reset password link sent successfully. Please follow the link to reset password.',
        errorMessage: null
    };
}

export function failedResetPassword(error) {
    console.log('Error: ', error);
    return {
        type: FAILED_RESET_PASSWORD,
        errorMessage: 'There is no active user associated with this e-mail address or the password can not be changed',
        successMessage: null
    };
}

export function successResetPasswordConfirm(error) {
    console.log('Error: ', error);
    return {
        type: SUCCESS_RESET_PASSWORD_CONFIRM,
        successMessage: 'Password changed successfully. You can now login with new password',
        errorMessage: null
    };
}

export function failedResetPasswordConfirm(error) {
    console.log('Error: ', error);
    return {
        type: FAILED_RESET_PASSWORD_CONFIRM,
        errorMessage: 'Password link expired. Please request new one.',
        successMessage: null
    };
}

export function setUser(username, clientname, clientId) {
    localStorage.setItem('isLoggedIn', 'true');
    return {
        type: SET_USER,
        username,
        clientname,
        clientId,
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

export function resetRedirectState() {
    return {
        type: RESET_REDIRECT_STATE,
    };
}

export function setDMEClients(data) {
    return {
        type: SET_DME_CLIENTS,
        dmeClients: data.dme_clients,
    };
}

export function failedGetDMEClients(error) {
    console.log('Error: ', error);
    return {
        type: FAILED_GET_DME_CLIENTS,
        errorMessage: 'Unable to get dme clients.'
    };
}

export function setCurrentClientPK(clientPK) {
    return {
        type: SET_CLIENT_PK,
        clientPK: clientPK,
    };
}

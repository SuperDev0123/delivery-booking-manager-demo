import axios from 'axios';

import {
    setToken,
    failedGetToken,
    setUser,
    failedGetUser,
    detectTokenExpiration,
    failedVerifiyToken,
    resetRedirectState,
    setDMEClients,
    failedGetDMEClients,
    setCurrentClientPK,
    successResetPassword,
    failedResetPassword,
    successResetPasswordConfirm,
    failedResetPasswordConfirm,
    logoutUser,
    resetErrorMessage,
} from '../actions/authActions';
import { API_HOST, HTTP_PROTOCOL } from '../../config';

export const getToken = (username, password) => {
    return dispatch =>
        axios.post(`${HTTP_PROTOCOL}://${API_HOST}/api-token-auth/` , {
            username: username,
            password: password
        })
            .then(({ data: { token } }) => dispatch(setToken(token)))
            .catch((error) => dispatch(failedGetToken(error)) );
};

export const verifyToken = () => {
    const token = localStorage.getItem('token');

    return dispatch =>
        axios.post(`${HTTP_PROTOCOL}://${API_HOST}/api-token-verify/` , {
            token: token,
        })
            .then(({ data }) => dispatch(detectTokenExpiration(data)) )
            .catch((error) => dispatch(failedVerifiyToken(error)) );
};

export const resetPassword = (email, path) => {

    return dispatch =>
        axios.post(`${HTTP_PROTOCOL}://${API_HOST}/password_reset/reset_password/` , {
            email: email,
            path: path
        })
            .then(({ data }) => dispatch(successResetPassword(data)) )
            .catch((error) => dispatch(failedResetPassword(error)) );
};

export const resetPasswordConfirm = (token, email, password) => {
    const options = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            //'Authorization': 'JWT ' + token
        },
        url: `${HTTP_PROTOCOL}://${API_HOST}/password_reset/confirm/`,
        data: {password: password, token: token}
    };
    /*const options = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            //'Authorization': 'JWT ' + token
        },
        url: `${HTTP_PROTOCOL}://${API_HOST}/password_reset/?token=`+token,
        data: {password: password, token: token}
    };*/
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successResetPasswordConfirm(data)) )
            .catch((error) => dispatch(failedResetPasswordConfirm(error)) );
};

export const getUser = (token) => {
    const options = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'JWT ' + token
        },
        url: `${HTTP_PROTOCOL}://${API_HOST}/users/username/`,
    };
    return dispatch =>
        axios(options)
            .then(({ data: { username, clientname, clientId, clientPK } }) => dispatch(setUser(username, clientname, clientId, clientPK)))
            .catch((error) => dispatch(failedGetUser(error)) );
};

export const getDMEClients = () => {
    const token = localStorage.getItem('token');

    const options = {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'JWT ' + token
        },
        url: `${HTTP_PROTOCOL}://${API_HOST}/users/get_clients/`,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(setDMEClients(data)))
            .catch((error) => dispatch(failedGetDMEClients(error)) );
};

export const cleanRedirectState = () => {
    return dispatch => dispatch(resetRedirectState());
};

export const setClientPK = (clientPK) => {
    return dispatch => dispatch(setCurrentClientPK(clientPK));
};

export const logout = () => {
    console.log('@999 - logout');
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.setItem('token', '');
    localStorage.setItem('zohotoken', '');
    return dispatch => dispatch(logoutUser());
};

export const resetErrorMsg = () => {
    return dispatch => dispatch(resetErrorMessage());
};
import axios from 'axios';

import { setToken, failedGetToken, setUser, failedGetUser, detectTokenExpiration, failedVerifiyToken, resetRedirectState, setDMEClients, failedGetDMEClients, setCurrentClientPK } from '../actions/authActions';
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
            .then(({ data: { username, clientname, clientId } }) => dispatch(setUser(username, clientname, clientId)))
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

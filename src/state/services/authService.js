import axios from 'axios';

import { setToken, failedGetToken, setUser, failedGetUser } from '../actions/authActions';
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

export const getUser = (token) => {
    const options = {
        method: 'post',
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': 'JWT ' + token 
        },
        url: `${HTTP_PROTOCOL}://${API_HOST}/auth/user/`,
    };
    return dispatch =>
        axios(options)
            .then(({ data: { username } }) => dispatch(setUser(username)))
            .catch((error) => dispatch(failedGetUser(error)) );
};
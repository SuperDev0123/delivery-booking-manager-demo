import axios from 'axios';

import { successGetAllUsers, failedGetAllUsers, successGetUser, failedGetUser, successCreateUser, failedCreateUser, successUpdateUser, failedUpdateUser, successDeleteUser, failedDeleteUser, setLocalFilter, setNeedUpdateUsersFlag } from '../actions/userActions';
import { API_HOST, HTTP_PROTOCOL } from '../../config';

export const getAllUsers = (clientPK=0) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/users/get_all/`,
        params: {
            clientPK: clientPK
        }
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => {dispatch(successGetAllUsers(data));})
            .catch((error) => dispatch(failedGetAllUsers(error)));
};

export const getUserDetails = (id) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/users/` + id + '/get/',
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => {dispatch(successGetUser(data));})
            .catch((error) => dispatch(failedGetUser(error)));
};

export const createUserDetails = (data) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/users/add/`,
        data: data
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successCreateUser(data)))
            .catch((error) => dispatch(failedCreateUser(error)));
};

export const updateUserDetails = (data) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'put',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/users/` + data.id + '/edit/',
        data: data
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successUpdateUser(data)))
            .catch((error) => dispatch(failedUpdateUser(error)));
};


export const deleteUserDetails = (data) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'delete',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/users/`+data.id+'/delete/',
        data: data
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successDeleteUser(data)))
            .catch((error) => dispatch(failedDeleteUser(error)));
};

export const setNeedUpdateUsersState = (boolFlag) => {
    return dispatch => dispatch(setNeedUpdateUsersFlag(boolFlag));
};

export const setGetUsersFilter = (key, value) => {
    return dispatch => dispatch(setLocalFilter(key, value));
};


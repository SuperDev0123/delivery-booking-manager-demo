import axios from 'axios';

import { successGetAllAugmentAddress, failedGetAllAugmentAddress, successGetAugmentAddress, failedGetAugmentAddress, successCreateAugmentAddress, failedCreateAugmentAddress, successDeleteAugmentAddress, failedDeleteAugmentAddress, successUpdateAugmentAddress, failedUpdateAugmentAddress } from '../actions/augmentActions';
import { API_HOST, HTTP_PROTOCOL } from '../../config';

export const getAllAugmentAddress = () => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/augmentaddress/`,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => {dispatch(successGetAllAugmentAddress(data));})
            .catch((error) => dispatch(failedGetAllAugmentAddress(error)));
};

export const getAugmentAddress = (id) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/augmentaddress/` + id + '/get/',
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => {dispatch(successGetAugmentAddress(data));})
            .catch((error) => dispatch(failedGetAugmentAddress(error)));
};

export const createAugmentAddress = (data) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/augmentaddress/add/`,
        data: data
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successCreateAugmentAddress(data)))
            .catch((error) => dispatch(failedCreateAugmentAddress(error)));
};

export const updateAugmentAddress = (data) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'put',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/augmentaddress/` + data.id + '/edit/',
        data: data
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successUpdateAugmentAddress(data)))
            .catch((error) => dispatch(failedUpdateAugmentAddress(error)));
};

export const deleteAugmentAddress = (data) => {
    const {id} = data;
    const token = localStorage.getItem('token');
    const options = {
        method: 'delete',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/augmentaddress/`+id+'/delete/',
        data: data
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successDeleteAugmentAddress(id, data)))
            .catch((error) => dispatch(failedDeleteAugmentAddress(error)));
};

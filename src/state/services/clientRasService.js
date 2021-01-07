import axios from 'axios';

import {
    successAllGetClientRas,
    failedAllGetClientRas,
    successGetClientRas,
    failedGetClientRas,
    successCreateClientRas,
    failedCreateClientRas,
    successUpdateClientRas,
    failedUpdateClientRas,
    successDeleteClientRas,
    failedDeleteClientRas,
} from '../actions/clientRasActions';
import { API_HOST, HTTP_PROTOCOL } from '../../config';

export const getAllClientRas = () => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/clientras/`,
    };
    
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successAllGetClientRas(data)))
            .catch((error) => dispatch(failedAllGetClientRas(error)));
};

export const getClientRas = (id) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/clientras/${id}/`,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => {dispatch(successGetClientRas(data));})
            .catch((error) => dispatch(failedGetClientRas(error)));
};

export const createClientRas = (data) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/clientras/`,
        data: data
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successCreateClientRas(data)))
            .catch((error) => dispatch(failedCreateClientRas(error)));
};

export const updateClientRas = (data) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'put',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/clientras/${data.id}/`,
        data: data
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successUpdateClientRas(data)))
            .catch((error) => dispatch(failedUpdateClientRas(error)));
};

export const deleteClientRas = (data) => {
    const {id} = data;
    const token = localStorage.getItem('token');
    const options = {
        method: 'delete',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/clientras/${id}/`,
        data: data
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successDeleteClientRas(id, data)))
            .catch((error) => dispatch(failedDeleteClientRas(error)));
};

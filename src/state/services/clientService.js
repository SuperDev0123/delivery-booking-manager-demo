import axios from 'axios';

import {
    successGetAllClients,
    failedGetAllClients,
    successCreateClient,
    failedCreateClient,
    successGetClient,
    failedGetClient,
    successUpdateClient,
    failedUpdateClient,

} from '../actions/clientActions';
import { API_HOST, HTTP_PROTOCOL } from '../../config';

export const getAllClients = () => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/clients/`,
    };
    
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetAllClients(data)))
            .catch((error) => dispatch(failedGetAllClients(error)));
};

export const updateClient = (client) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'put',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/clients/${client.pk_id_dme_client}/`,
        data: client,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successUpdateClient(data)))
            .catch((error) => dispatch(failedUpdateClient(error)));
};

export const createClient = (client) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/clients/add/`,
        data: client
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successCreateClient(data)))
            .catch((error) => dispatch(failedCreateClient(error)));
};


export const getClient = (id) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/clients/` + id + '/get/',
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetClient(data)))
            .catch((error) => dispatch(failedGetClient(error)));
};
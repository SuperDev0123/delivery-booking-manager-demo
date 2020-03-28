import axios from 'axios';

import { successGetAllSqlQueries, failedGetAllSqlQueries, successGetSqlQueryDetails, failedGetSqlQueryDetails, successCreateSqlQueryDetails, failedCreateSqlQueryDetails, successUpdateSqlQueryDetails, failedUpdateSqlQueryDetails, successDeleteSqlQueryDetails, failedDeleteSqlQueryDetails, successValidateSqlQueryDetails, failedValidateSqlQueryDetails, successRunUpdateSqlQueryDetails, failedRunUpdateSqlQueryDetails } from '../actions/sqlQueryActions';
import { API_HOST, HTTP_PROTOCOL } from '../../config';

export const getAllSqlQueries = () => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/sqlqueries/get_all/`,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => {dispatch(successGetAllSqlQueries(data));})
            .catch((error) => dispatch(failedGetAllSqlQueries(error)));
};

export const getSqlQueryDetails = (id) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/sqlqueries/` + id + '/get/',
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => {dispatch(successGetSqlQueryDetails(data));})
            .catch((error) => dispatch(failedGetSqlQueryDetails(error)));
};

export const createSqlQueryDetails = (data) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/sqlqueries/add/`,
        data: data
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successCreateSqlQueryDetails(data)))
            .catch((error) => dispatch(failedCreateSqlQueryDetails(error)));
};

export const updateSqlQueryDetails = (data) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'put',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/sqlqueries/` + data.id + '/edit/',
        data: data
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successUpdateSqlQueryDetails(data)))
            .catch((error) => dispatch(failedUpdateSqlQueryDetails(error)));
};

export const deleteSqlQueryDetails = (data) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'delete',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/sqlqueries/`+data.id+'/delete/',
        data: data
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successDeleteSqlQueryDetails(data)))
            .catch((error) => dispatch(failedDeleteSqlQueryDetails(error)));
};

export const validateSqlQueryDetails = (data) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/sqlqueries/validate/`,
        data: data
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successValidateSqlQueryDetails(data)))
            .catch((error) => dispatch(failedValidateSqlQueryDetails(error)));
};

export const runUpdateSqlQueryDetails = (data) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/sqlqueries/update_query/`,
        data: data
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successRunUpdateSqlQueryDetails(data)))
            .catch((error) => dispatch(failedRunUpdateSqlQueryDetails(error)));
};



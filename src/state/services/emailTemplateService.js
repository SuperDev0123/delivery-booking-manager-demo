import axios from 'axios';

import { successGetAllEmailTemplates, failedGetAllEmailTemplates, successGetEmailTemplateDetails, failedGetEmailTemplateDetails, successCreateEmailTemplateDetails, failedCreateEmailTemplateDetails, successUpdateEmailTemplateDetails, failedUpdateEmailTemplateDetails, successDeleteEmailTemplateDetails, failedDeleteEmailTemplateDetails } from '../actions/emailTemplateActions';
import { API_HOST, HTTP_PROTOCOL } from '../../config';

export const getAllEmailTemplates = () => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/emailtemplates/get_all/`,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => {dispatch(successGetAllEmailTemplates(data));})
            .catch((error) => dispatch(failedGetAllEmailTemplates(error)));
};

export const getEmailTemplateDetails = (id) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/emailtemplates/` + id + '/get/',
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => {dispatch(successGetEmailTemplateDetails(data));})
            .catch((error) => dispatch(failedGetEmailTemplateDetails(error)));
};

export const createEmailTemplateDetails = (data) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/emailtemplates/add/`,
        data: data
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successCreateEmailTemplateDetails(data)))
            .catch((error) => dispatch(failedCreateEmailTemplateDetails(error)));
};

export const updateEmailTemplateDetails = (data) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'put',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/emailtemplates/` + data.id + '/edit/',
        data: data
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successUpdateEmailTemplateDetails(data)))
            .catch((error) => dispatch(failedUpdateEmailTemplateDetails(error)));
};

export const deleteEmailTemplateDetails = (data) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'delete',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/emailtemplates/`+data.id+'/delete/',
        data: data
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successDeleteEmailTemplateDetails(data)))
            .catch((error) => dispatch(failedDeleteEmailTemplateDetails(error)));
};



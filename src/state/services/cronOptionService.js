import axios from 'axios';

import { successGetAllCronOptions, failedGetAllCronOptions, successUpdateCronOption, failedUpdateCronOption } from '../actions/cronOptionActions';
import { API_HOST, HTTP_PROTOCOL } from '../../config';

export const getallCronOptions = () => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/options/get_all/`,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => {dispatch(successGetAllCronOptions(data));})
            .catch((error) => dispatch(failedGetAllCronOptions(error)));
};

export const updateCronOptionDetails = (data) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'put',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/options/`+data.id+'/edit/',
        data: data
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => {dispatch(successUpdateCronOption(data));})
            .catch((error) => dispatch(failedUpdateCronOption(error)));
};



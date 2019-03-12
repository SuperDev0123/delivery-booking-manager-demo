import axios from 'axios';

import { setComms, failedGetComms, onSuccessUpdateComm, failedUpdateComm, setLocalFilter } from '../actions/commActions';
import { API_HOST, HTTP_PROTOCOL } from '../../config';

export const getCommsWithBookingId = (bookingId, sortField='-id', columnFilters={}) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/comms/get_comms/`,
        params: {
            bookingId: bookingId,
            sortField: sortField,
            columnFilters: columnFilters,
        }
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(setComms(data)))
            .catch((error) => dispatch(failedGetComms(error)));
};

export const createComm = (comm) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/comms/create_comm/`,
        data: comm
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(onSuccessUpdateComm(data)))
            .catch((error) => dispatch(failedUpdateComm(error)));
};

export const updateComm = (id, updatedComm) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'put',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/comms/` + id + '/update_comm/',
        data: updatedComm
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(onSuccessUpdateComm(data)))
            .catch((error) => dispatch(failedUpdateComm(error)));
};

export const setGetCommsFilter = (key, value) => {
    return dispatch => dispatch(setLocalFilter(key, value));
};
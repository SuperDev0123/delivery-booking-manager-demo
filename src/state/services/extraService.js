import axios from 'axios';

import { successGetPackageTypes, failedGetPackageTypes, successGetAllBookingStatus, failedGetAllBookingStatus, successSaveStatusHistory, failedSaveStatusHistory, successGetBookingStatusHistory, failedGetBookingStatusHistory, successGetAllFPs, failedGetAllFPs, successStatusActions, failedStatusActions, successGetStatusDetails, failedStatusDetails, successCreateStatusDetail, successCreateStatusAction, failedCreateStatusDetail, failedCreateStatusAction } from '../actions/extraActions';
import { API_HOST, HTTP_PROTOCOL } from '../../config';

export const getPackageTypes = () => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/packagetype/get_packagetypes/`,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetPackageTypes(data)))
            .catch((error) => dispatch(failedGetPackageTypes(error)));
};

export const getAllBookingStatus = () => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/bookingstatus/get_all_booking_status/`,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetAllBookingStatus(data)))
            .catch((error) => dispatch(failedGetAllBookingStatus(error)));
};

export const getBookingStatusHistory = (pk_booking_id) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/statushistory/get_all?pk_booking_id=` + pk_booking_id,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetBookingStatusHistory(data)))
            .catch((error) => dispatch(failedGetBookingStatusHistory(error)));
};

export const createStatusHistory = (statusHistory) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/statushistory/save_status_history/`,
        data: statusHistory,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successSaveStatusHistory(data)))
            .catch((error) => dispatch(failedSaveStatusHistory(error)));
};

export const updateStatusHistory = (statusHistory) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'put',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/statushistory/` + statusHistory.id + '/update_status_history/',
        data: statusHistory,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successSaveStatusHistory(data)))
            .catch((error) => dispatch(failedSaveStatusHistory(error)));
};

export const getAllFPs = () => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/fp/get_all/`,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetAllFPs(data)))
            .catch((error) => dispatch(failedGetAllFPs(error)));
};

export const getStatusActions = () => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/status/get_status_actions/`,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successStatusActions(data)))
            .catch((error) => dispatch(failedStatusActions(error)));
};

export const getStatusDetails = () => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/status/get_status_details/`,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetStatusDetails(data)))
            .catch((error) => dispatch(failedStatusDetails(error)));
};

export const createStatusDetail = (newStatusDetail) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/status/create_status_detail/`,
        data: {'newStatusDetail': newStatusDetail},
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successCreateStatusDetail(data)))
            .catch((error) => dispatch(failedCreateStatusDetail(error)));
};

export const createStatusAction = (newStatusAction) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/status/create_status_action/`,
        data: {'newStatusAction': newStatusAction},
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successCreateStatusAction(data)))
            .catch((error) => dispatch(failedCreateStatusAction(error)));
};

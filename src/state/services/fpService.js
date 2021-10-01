import axios from 'axios';

import { successGetAllFPs, failedGetAllFPs, successGetFP, failedGetFP, successCreateFp, failedCreateFp, successUpdateFp, failedUpdateFp, successDeleteFp, failedDeleteFp, successGetFPCarriers, failedGetFPCarriers, successGetFPZones, failedGetFPZones, setLocalFilter, setNeedUpdateZonesFlag, successCreateFpCarrier, failedCreateFpCarrier, successUpdateFpCarrier, failedUpdateFpCarrier, successDeleteFpCarrier, failedDeleteFpCarrier, successCreateFpZone, failedCreateFpZone, successUpdateFpZone, failedUpdateFpZone, successGetFpStatuses, failedGetFpStatuses, successCreateFpStatus, failedCreateFpStatus, successUpdateFpStatus, failedUpdateFpStatus, successDeleteFpStatus, failedDeleteFpStatus } from '../actions/fpActions';
import { API_HOST, HTTP_PROTOCOL } from '../../config';

export const getAllFPs = () => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/fp/get_all/`,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => {dispatch(successGetAllFPs(data));})
            .catch((error) => dispatch(failedGetAllFPs(error)));
};

export const getFPDetails = (fp_id) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/fp/` + fp_id + '/get/',
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => {dispatch(successGetFP(data));})
            .catch((error) => dispatch(failedGetFP(error)));
};

export const createFpDetail = (fpDetail) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/fp/add/`,
        data: fpDetail
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successCreateFp(data)))
            .catch((error) => dispatch(failedCreateFp(error)));
};

export const updateFpDetail = (fpDetail) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'put',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/fp/` + fpDetail.id + '/edit/',
        data: fpDetail
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successUpdateFp(data)))
            .catch((error) => dispatch(failedUpdateFp(error)));
};


export const deleteFpDetail = (fpDetail) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'delete',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/fp/`+fpDetail.id+'/delete/',
        data: fpDetail
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successDeleteFp(data)))
            .catch((error) => dispatch(failedDeleteFp(error)));
};

export const getFPCarriers = (fp_id) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/fp/get_carriers/`,
        params: {
            fp_id: parseInt(fp_id)
        }
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => {dispatch(successGetFPCarriers(data));})
            .catch((error) => dispatch(failedGetFPCarriers(error)));
};

export const createFpCarrier = (carrierDetail) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/fp/add_carrier/`,
        data: carrierDetail
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successCreateFpCarrier(data)))
            .catch((error) => dispatch(failedCreateFpCarrier(error)));
};

export const updateFpCarrier = (data) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'put',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/fp/` + data.id + '/edit_carrier/',
        data: data
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successUpdateFpCarrier(data)))
            .catch((error) => dispatch(failedUpdateFpCarrier(error)));
};


export const deleteFpCarrier = (data) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'delete',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/fp/`+data.id+'/delete_carrier/',
        data: data
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successDeleteFpCarrier(data)))
            .catch((error) => dispatch(failedDeleteFpCarrier(error)));
};

export const getFPZones = (fp_id, pageItemCnt=10, pageInd=0) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/fp/get_zones/`,
        params: {
            fp_id: parseInt(fp_id),
            pageItemCnt: parseInt(pageItemCnt),
            pageInd: parseInt(pageInd),
        }
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => {dispatch(successGetFPZones(data));})
            .catch((error) => dispatch(failedGetFPZones(error)));
};

export const createFpZone = (zoneDetail) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/fp/add_zone/`,
        data: zoneDetail
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successCreateFpZone(data)))
            .catch((error) => dispatch(failedCreateFpZone(error)));
};

export const updateFpZone = (data) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'put',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/fp/` + data.id + '/edit_zone/',
        data: data
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successUpdateFpZone(data)))
            .catch((error) => dispatch(failedUpdateFpZone(error)));
};


export const deleteFpZone = (data) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'delete',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/fp/`+data.id+'/delete_zone/',
        data: data
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successDeleteFpCarrier(data)))
            .catch((error) => dispatch(failedDeleteFpCarrier(error)));
};

export const setGetZonesFilter = (key, value) => {
    return dispatch => dispatch(setLocalFilter(key, value));
};

export const setNeedUpdateZonesState = (boolFlag) => {
    return dispatch => dispatch(setNeedUpdateZonesFlag(boolFlag));
};

export const getFpStatuses = (fp_name) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/fp_statuses/get_fp_statuses/?fp_name=${fp_name}`,
    };
    return dispatch => 
        axios(options)
            .then(({data}) => {
                dispatch(successGetFpStatuses(data));
            })
            .catch((error) => {
                dispatch(failedGetFpStatuses(error));
            });
};

export const createFpStatus = (data) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        data,
        url: `${HTTP_PROTOCOL}://${API_HOST}/fp_statuses/`,
    };
    return dispatch => 
        axios(options)
            .then(({data}) => dispatch(successCreateFpStatus(data)))
            .catch((error) => dispatch(failedCreateFpStatus(error)));
};

export const updateFpStatus = (param) => {
    const token = localStorage.getItem('token');
    const { id, data } = param;
    const options = {
        method: 'put',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        data,
        url: `${HTTP_PROTOCOL}://${API_HOST}/fp_statuses/${id}/`,
    };
    return dispatch => 
        axios(options)
            .then(({data}) => dispatch(successUpdateFpStatus(data)))
            .catch((error) => dispatch(failedUpdateFpStatus(error)));
};

export const deleteFpStatus = (id) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'delete',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/fp_statuses/${id}/`,
    };
    return dispatch => 
        axios(options)
            .then(() => dispatch(successDeleteFpStatus(id)))
            .catch((error) => dispatch(failedDeleteFpStatus(error)));
};

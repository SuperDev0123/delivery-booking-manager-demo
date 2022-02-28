import axios from 'axios';

import { API_HOST, HTTP_PROTOCOL } from '../../config';
import {
    successGetSurcharges,
    failedGetSurcharges,
    successCreateSurcharge,
    failedCreateSurcharge,
    successUpdateSurcharge,
    failedUpdateSurcharge,
    successDeleteSurcharge,
    failedDeleteSurcharge,
} from '../actions/costActions';


export const getSurcharges = (bookingId) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/surcharge/?bookingId=${bookingId}`,
    };
    
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetSurcharges(data)))
            .catch((error) => dispatch(failedGetSurcharges(error)));
};

export const createSurcharge = (surcharge) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/surcharge/`,
        data: surcharge,
    };
    
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successCreateSurcharge(data)))
            .catch((error) => dispatch(failedCreateSurcharge(error)));
};

export const updateSurcharge = (surcharge) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/surcharge/${surcharge.id}/?bookingId=${surcharge.booking}`,
        data: surcharge,
    };
    
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successUpdateSurcharge(data)))
            .catch((error) => dispatch(failedUpdateSurcharge(error)));
};

export const deleteSurcharge = (surcharge) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/surcharge/${surcharge.id}/?bookingId=${surcharge.booking}`,
        data: surcharge,
    };
    
    return dispatch =>
        axios(options)
            .then(() => dispatch(successDeleteSurcharge(surcharge)))
            .catch((error) => dispatch(failedDeleteSurcharge(error)));
};

import axios from 'axios';

import {
    successGetFPCosts,
    failedGetFPCosts,
    successGetCostOptions,
    failedGetCostOptions,
    successGetCostOptionMaps,
    failedGetCostOptionMaps,
    successGetBookingCostOptions,
    failedGetBookingCostOptions,
} from '../actions/costActions';
import { API_HOST, HTTP_PROTOCOL } from '../../config';

export const getFPCosts = () => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/fp-cost/`,
    };
    
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetFPCosts(data)))
            .catch((error) => dispatch(failedGetFPCosts(error)));
};

export const getCostOptions = () => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/cost-option/`,
    };
    
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetCostOptions(data)))
            .catch((error) => dispatch(failedGetCostOptions(error)));
};

export const getCostOptionMaps = (fpName='') => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/cost-option-map/?fpName=${fpName}`,
    };
    
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetCostOptionMaps(data)))
            .catch((error) => dispatch(failedGetCostOptionMaps(error)));
};

export const getBookingCostOptions = (bookingId='') => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/booking-cost-option/?bookingId=${bookingId}`,
    };
    
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetBookingCostOptions(data)))
            .catch((error) => dispatch(failedGetBookingCostOptions(error)));
};

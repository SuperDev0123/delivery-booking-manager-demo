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
    successCreateBookingCostOption,
    failedCreateBookingCostOption,
    successUpdateBookingCostOption,
    failedUpdateBookingCostOption,
    successDeleteBookingCostOption,
    failedDeleteBookingCostOption,
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

export const createBookingCostOption = (bookingCostOption) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/booking-cost-option/`,
        data: bookingCostOption,
    };
    
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successCreateBookingCostOption(data)))
            .catch((error) => dispatch(failedCreateBookingCostOption(error)));
};

export const updateBookingCostOption = (bookingCostOption) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/booking-cost-option/${bookingCostOption.id}/?bookingId=${bookingCostOption.booking}`,
        data: bookingCostOption,
    };
    
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successUpdateBookingCostOption(data)))
            .catch((error) => dispatch(failedUpdateBookingCostOption(error)));
};

export const deleteBookingCostOption = (bookingCostOption) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/booking-cost-option/${bookingCostOption.id}/?bookingId=${bookingCostOption.booking}`,
        data: bookingCostOption,
    };
    
    return dispatch =>
        axios(options)
            .then(() => dispatch(successDeleteBookingCostOption(bookingCostOption)))
            .catch((error) => dispatch(failedDeleteBookingCostOption(error)));
};

import axios from 'axios';

import {
    successGetNumBookingsPerFp,
    failedGetNumBookingsPerFp,
    successGetNumBookingsPerStatus,
    failedGetNumBookingsPerStatus,
    successGetNumActiveBookingsPerClient,
    failedGetNumActiveBookingsPerClient,
    successGetDailyBooked,
    failedGetDailyBooked,
} from '../actions/chartActions';
import { API_HOST, HTTP_PROTOCOL } from '../../config';

export const getDailyBooked = ({startDate, endDate, currentFPOption, currentClientnameOption}) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/charts/get_daily_booked/?startDate=${startDate}&endDate=${endDate}&fp=${currentFPOption}&client=${currentClientnameOption}`  ,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetDailyBooked(data)))
            .catch((error) => dispatch(failedGetDailyBooked(error)));
};

export const getNumBookingsPerFp = ({startDate, endDate}) => {
    console.log('startDate', startDate);
    console.log('endDate', endDate);
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/charts/get_num_bookings_per_fp/?startDate=${startDate}&endDate=${endDate}`  ,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetNumBookingsPerFp(data)))
            .catch((error) => dispatch(failedGetNumBookingsPerFp(error)));
};


export const getNumBookingsPerClient = ({startDate, endDate}) => {
    console.log('startDate', startDate);
    console.log('endDate', endDate);
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/charts/get_num_bookings_per_client/?startDate=${startDate}&endDate=${endDate}`  ,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetNumBookingsPerFp(data)))
            .catch((error) => dispatch(failedGetNumBookingsPerFp(error)));
};


export const getNumBookingsPerStatus = ({startDate, endDate, client_name}) => {
    console.log('startDate', startDate);
    console.log('endDate', endDate);
    console.log('client_name', client_name);
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/charts/get_num_bookings_per_status/?startDate=${startDate}&endDate=${endDate}&client_name=${client_name}`  ,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetNumBookingsPerStatus(data)))
            .catch((error) => dispatch(failedGetNumBookingsPerStatus(error)));
};

export const getNumActiveBookingsPerClient = () => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/charts/get_num_active_bookings_per_client/`  ,
    };

    return dispatch => 
        axios(options)
            .then(({ data }) => dispatch(successGetNumActiveBookingsPerClient(data)))
            .catch((error) => dispatch(failedGetNumActiveBookingsPerClient(error)));
};

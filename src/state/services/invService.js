import axios from 'axios';

import {
    successGetBok1Headers,
    failedGetBok1Headers,
    successGetBok2Lines,
    failedGetBok2Lines,
    successGetBok3LinesData,
    failedGetBok3LinesData
} from '../actions/invActions';
import { API_HOST, HTTP_PROTOCOL } from '../../config';

export const getBookings = () => {
    //const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        //headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/dme_api_inv/get_bookings/`,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetBok1Headers(data)))
            .catch((error) => dispatch(failedGetBok1Headers(error)));
};

export const getBookingLines = () => {
    //const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        //headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/dme_api_inv/get_booking_lines/`,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetBok2Lines(data)))
            .catch((error) => dispatch(failedGetBok2Lines(error)));
};

export const getBookingLinesData = () => {
    //const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        //headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/dme_api_inv/get_booking_lines_data/`,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetBok3LinesData(data)))
            .catch((error) => dispatch(failedGetBok3LinesData(error)));
};

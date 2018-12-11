import axios from 'axios';

import { setBookings, failedGetBookings, setBooking, failedUpdateBooking } from '../actions/bookingActions';
import { API_HOST, HTTP_PROTOCOL } from '../../config';

export const getBookings = () => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/bookings/`,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(setBookings(data)))
            .catch((error) => dispatch(failedGetBookings(error)));
};

export const simpleSearch = (keyword) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/bookings/?searchType=` + '1&keyword=' + keyword,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(setBookings(data)))
            .catch((error) => dispatch(failedGetBookings(error)));
};

export const updateBooking = (id, updateBooking) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'put',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/bookings/` + id + '/',
        data: updateBooking
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(setBooking(data)))
            .catch((error) => dispatch(failedUpdateBooking(error)));
};
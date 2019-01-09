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

export const saveBooking = (booking) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/booking/`,
        data: booking
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(setBooking(data)))
            .catch((error) => dispatch(failedUpdateBooking(error)));
};

export const allTrigger = () => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/trigger_all/`
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(console.log('@1 - After all_trigger', data)))
            .catch((error) => dispatch(console.log('@2 - Failed all_trigger', error)));
};

export const mapBok1ToBookings = () => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/bok_1_to_bookings/`
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(console.log('@1 - After bok_1_to_bookings', data)))
            .catch((error) => dispatch(console.log('@2 - Failed bok_1_to_bookings', error)));
};

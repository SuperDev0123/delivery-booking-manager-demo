import axios from 'axios';

import { successFetchBookings, failedGetBookings, setBooking, failedUpdateBooking, setMappedBok1ToBooking, setUserDateFilterField, failedGetUserDateFilterField, successAlliedBooking, failedAlliedBooking, successStBooking, failedStBooking, successGetLabel, failedGetLabel } from '../actions/bookingActions';
import { API_HOST, HTTP_PROTOCOL } from '../../config';

export const getBookings = (selectedDate, warehouseId=0, itemCountPerPage=10, sortField='id') => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/bookings/get_bookings/`,
        params: {
            date: selectedDate,
            warehouseId: warehouseId,
            itemCountPerPage: itemCountPerPage,
            sortField: sortField,
        }
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successFetchBookings(data)))
            .catch((error) => dispatch(failedGetBookings(error)));
};

// export const simpleSearch = (keyword) => {
//     const token = localStorage.getItem('token');
//     const options = {
//         method: 'get',
//         headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
//         url: `${HTTP_PROTOCOL}://${API_HOST}/bookings/?searchType=` + '1&keyword=' + keyword,
//     };
//     return dispatch =>
//         axios(options)
//             .then(({ data }) => dispatch(setBookings(data)))
//             .catch((error) => dispatch(failedGetBookings(error)));
// };

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

export const alliedBooking = (bookingId) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        data: {'booking_id': bookingId},
        url: `${HTTP_PROTOCOL}://${API_HOST}/booking_allied/`
    };
    return dispatch =>
        axios(options)
            .then(({data}) => dispatch(successAlliedBooking(data)))
            .catch((error) => dispatch(failedAlliedBooking(error)));
};

export const stBooking = (bookingId) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        data: {'booking_id': bookingId},
        url: `${HTTP_PROTOCOL}://${API_HOST}/booking_st/`
    };
    return dispatch =>
        axios(options)
            .then(({data}) => dispatch(successStBooking(data)))
            .catch((error) => dispatch(failedStBooking(error)));
};

export const getAlliedLabel = (bookingId) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        data: {'booking_id': bookingId},
        url: `${HTTP_PROTOCOL}://${API_HOST}/get_label_allied/`
    };
    return dispatch =>
        axios(options)
            .then(({data}) => dispatch(successGetLabel(data)))
            .catch((error) => dispatch(failedGetLabel(error)));
};

export const getSTLabel = (bookingId) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        data: {'booking_id': bookingId},
        url: `${HTTP_PROTOCOL}://${API_HOST}/get_label_st/`
    };
    return dispatch =>
        axios(options)
            .then(({data}) => dispatch(successGetLabel(data)))
            .catch((error) => dispatch(failedGetLabel(error)));
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
            .then(({ data }) => dispatch(setMappedBok1ToBooking(data.mapped_bookings)))
            .catch((error) => dispatch(failedUpdateBooking(error)));
};

export const getUserDateFilterField = () => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/users/get_user_date_filter_field/`
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(setUserDateFilterField(data.user_date_filter_field)))
            .catch((error) => dispatch(failedGetUserDateFilterField(error)));
};

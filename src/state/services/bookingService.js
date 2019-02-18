import axios from 'axios';

import { successGetAttachments, failedGetAttachments, successGetBookings, failedGetBookings, successGetSuburbs, failedGetSuburbs, successDeliveryGetSuburbs, failedDeliveryGetSuburbs, successGetBooking, failedUpdateBooking, setMappedBok1ToBooking, setUserDateFilterField, failedGetUserDateFilterField, successAlliedBook, failedAlliedBook, successStBook, failedStBook, successGetLabel, failedGetLabel } from '../actions/bookingActions';
import { API_HOST, HTTP_PROTOCOL } from '../../config';

export const getBookings = (selectedDate, warehouseId=0, itemCountPerPage=10, sortField='-id', columnFilters={}, prefilterInd=0, simpleSearchKeyword='') => {
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
            columnFilters: columnFilters,
            prefilterInd: prefilterInd,
            simpleSearchKeyword: simpleSearchKeyword,
        }
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetBookings(data)))
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
            .then(({ data }) => dispatch(successGetBookings(data)))
            .catch((error) => dispatch(failedGetBookings(error)));
};

export const getBookingWithFilter = (id, filter) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/booking/get_booking/?id=` + id + '&filter=' + filter,
    };
    console.log('@options--', options, id, filter);
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetBooking(data)))
            .catch((error) => dispatch(failedGetBookings(error)));
};

export const getSuburbStrings = (type, name) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/suburb/?type=` + type + '&name=' + name,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetSuburbs(data)))
            .catch((error) => dispatch(failedGetSuburbs(error)));
};

export const getAttachmentHistory = (id) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/attachments/?id=` + id,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetAttachments(data)))
            .catch((error) => dispatch(failedGetAttachments(error)));
};

export const getDeliverySuburbStrings = (type, name) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/suburb/?type=` + type + '&name=' + name,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successDeliveryGetSuburbs(data)))
            .catch((error) => dispatch(failedDeliveryGetSuburbs(error)));
};

export const updateBooking = (id, updateBooking) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'put',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/bookings/` + id + '/update_booking/',
        data: updateBooking
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetBooking(data)))
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
            .then(({ data }) => dispatch(successGetBooking(data)))
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
            .then(({data}) => dispatch(successAlliedBook(data)))
            .catch((error) => dispatch(failedAlliedBook(error)));
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
            .then(({data}) => dispatch(successStBook(data)))
            .catch((error) => dispatch(failedStBook(error)));
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

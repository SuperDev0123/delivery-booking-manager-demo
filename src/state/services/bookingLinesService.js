import axios from 'axios';

import { setBookingLines, failedGetBookingLines, successCreateBookingLine, successUpdateBookingLine, failedCreateBookingLine, failedUpdateBookingLine, successDeleteBookingLine, failedDeleteBookingLine, successCalcCollected, failedCalcCollected } from '../actions/bookingLineActions';
import { API_HOST, HTTP_PROTOCOL } from '../../config';

export const getBookingLines = (pk_booking_id) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/bookinglines/get_booking_lines/?pk_booking_id=` + pk_booking_id,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(setBookingLines(data.booking_lines)))
            .catch((error) => dispatch(failedGetBookingLines(error)));
};

export const createBookingLine = (bookingLine) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/bookinglines/create_booking_line/`,
        data: bookingLine
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successCreateBookingLine(data)))
            .catch((error) => dispatch(failedCreateBookingLine(error)));
};

export const duplicateBookingLine = (bookingLine) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/bookinglines/duplicate_booking_line/`,
        data: bookingLine
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successCreateBookingLine(data)))
            .catch((error) => dispatch(failedCreateBookingLine(error)));
};

export const updateBookingLine = (bookingLine) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'put',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/bookinglines/` + bookingLine.pk_lines_id + '/update_booking_line/',
        data: bookingLine
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successUpdateBookingLine(data)))
            .catch((error) => dispatch(failedUpdateBookingLine(error)));
};

export const deleteBookingLine = (bookingLine) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'delete',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/bookinglines/` + bookingLine.pk_lines_id + '/delete_booking_line/',
        data: bookingLine
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successDeleteBookingLine(data)))
            .catch((error) => dispatch(failedDeleteBookingLine(error)));
};

export const calcCollected = (ids, type) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/bookinglines/calc_collected/`,
        data: {'ids': ids, 'type': type},
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successCalcCollected(data)))
            .catch((error) => dispatch(failedCalcCollected(error)));
};

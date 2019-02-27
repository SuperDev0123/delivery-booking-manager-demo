import axios from 'axios';

import { setBookingLineDetails, failedGetBookingLineDetails, successCreateBookingLineDetail, failedCreateBookingLineDetail, successUpdateBookingLineDetail, failedUpdateBookingLineDetail, successDeleteBookingLineDetail, failedDeleteBookingLineDetail } from '../actions/bookingLineDetailActions';
import { API_HOST, HTTP_PROTOCOL } from '../../config';

export const getBookingLineDetails = (pk_booking_id) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/bookinglinedetails/get_booking_line_details/?pk_booking_id=` + pk_booking_id,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(setBookingLineDetails(data.booking_line_details)))
            .catch((error) => dispatch(failedGetBookingLineDetails(error)));
};

export const createBookingLineDetail = (bookingLineDetail) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/bookinglinedetails/create_booking_line_detail/`,
        data: bookingLineDetail
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successCreateBookingLineDetail(data)))
            .catch((error) => dispatch(failedCreateBookingLineDetail(error)));
};


export const updateBookingLineDetail = (bookingLineDetail) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'put',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/bookinglinedetails/` + bookingLineDetail.pk_id_lines_data + '/update_booking_line_detail/',
        data: bookingLineDetail
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successUpdateBookingLineDetail(data)))
            .catch((error) => dispatch(failedUpdateBookingLineDetail(error)));
};

export const deleteBookingLineDetail = (bookingLineDetail) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'delete',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/bookinglinedetails/` + bookingLineDetail.pk_id_lines_data + '/delete_booking_line_detail/',
        data: bookingLineDetail
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successDeleteBookingLineDetail(data)))
            .catch((error) => dispatch(failedDeleteBookingLineDetail(error)));
};

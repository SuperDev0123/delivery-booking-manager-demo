import axios from 'axios';

import { setBookings, failedGetBookings } from '../actions/bookingActions';
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
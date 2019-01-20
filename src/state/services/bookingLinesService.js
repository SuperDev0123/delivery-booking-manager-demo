import axios from 'axios';

import { setBookingLines, failedGetBookingLines } from '../actions/bookingLineActions';
import { API_HOST, HTTP_PROTOCOL } from '../../config';

export const getBookingLines = (pk_booking_id) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/bookinglines/?pk_booking_id=` + pk_booking_id,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(setBookingLines(data.booking_lines)))
            .catch((error) => dispatch(failedGetBookingLines(error)));
};

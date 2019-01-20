import axios from 'axios';

import { setBookingLineDetails, failedGetBookingLineDetails } from '../actions/bookingLineDetailActions';
import { API_HOST, HTTP_PROTOCOL } from '../../config';

export const getBookingLineDetails = (pk_booking_id) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/bookinglinedetails/?pk_booking_id=` + pk_booking_id,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(setBookingLineDetails(data.booking_line_details)))
            .catch((error) => dispatch(failedGetBookingLineDetails(error)));
};

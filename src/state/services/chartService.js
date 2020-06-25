import axios from 'axios';

import {
    successGetNumBookingsPerFp,
    failedGetNumBookingsPerFp,
} from '../actions/chartActions';
import { API_HOST, HTTP_PROTOCOL } from '../../config';

export const getNumBookingsPerFp = ({startDate, endDate}) => {
    console.log('startDate', startDate);
    console.log('endDate', endDate);
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/charts/get_num_bookings_per_fp/?startDate=${startDate}&endDate=${endDate}`  ,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetNumBookingsPerFp(data)))
            .catch((error) => dispatch(failedGetNumBookingsPerFp(error)));
};

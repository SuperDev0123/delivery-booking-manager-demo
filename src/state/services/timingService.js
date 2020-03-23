import axios from 'axios';

import {
    successGetTimings,
    failedGetTimings,
} from '../actions/timingActions';
import { API_HOST, HTTP_PROTOCOL } from '../../config';

export const getAllTimings = () => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/timings/get_all`,
    };
    
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetTimings(data)))
            .catch((error) => dispatch(failedGetTimings(error)));
};

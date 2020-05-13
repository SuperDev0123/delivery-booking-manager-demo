import axios from 'axios';

import {
    successGetAvailabilities,
    failedGetAvailabilities,
} from '../actions/availabilityActions';
import { API_HOST, HTTP_PROTOCOL } from '../../config';

export const getAvailabilities = () => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/availabilities/`,
    };
    
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetAvailabilities(data)))
            .catch((error) => dispatch(failedGetAvailabilities(error)));
};

import axios from 'axios';

import {
    successGetCosts,
    failedGetCosts,
} from '../actions/costActions';
import { API_HOST, HTTP_PROTOCOL } from '../../config';

export const getAllCosts = () => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/costs/get_all`,
    };
    
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetCosts(data)))
            .catch((error) => dispatch(failedGetCosts(error)));
};

import axios from 'axios';

import {
    successGetAllRoles,
    failedGetAllRoles,
} from '../actions/roleActions';
import { API_HOST, HTTP_PROTOCOL } from '../../config';

export const getAllRoles = () => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/roles/`,
    };
    
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetAllRoles(data)))
            .catch((error) => dispatch(failedGetAllRoles(error)));
};
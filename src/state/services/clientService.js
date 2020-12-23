import axios from 'axios';

import {
    successGetAllClients,
    failedGetAllClients,
} from '../actions/clientActions';
import { API_HOST, HTTP_PROTOCOL } from '../../config';

export const getAllClients = () => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/clients/`,
    };
    
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetAllClients(data)))
            .catch((error) => dispatch(failedGetAllClients(error)));
};
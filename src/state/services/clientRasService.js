import axios from 'axios';

import {
    successGetClientRas,
    failedGetClientRas,
} from '../actions/clientRasActions';
import { API_HOST, HTTP_PROTOCOL } from '../../config';

export const getClientRas = () => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/clientras/`,
    };
    
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetClientRas(data)))
            .catch((error) => dispatch(failedGetClientRas(error)));
};

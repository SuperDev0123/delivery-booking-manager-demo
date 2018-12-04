import axios from 'axios';

import { setWarehouses, failedGetWarehouses } from '../actions/warehouseActions';
import { API_HOST, HTTP_PROTOCOL } from '../../config';

export const getWarehouses = () => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/warehouses/`,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(setWarehouses(data)))
            .catch((error) => dispatch(failedGetWarehouses(error)));
};
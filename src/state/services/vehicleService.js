import axios from 'axios';

import {
    successGetVehicles,
    failedGetVehicles,
} from '../actions/vehicleActions';
import { API_HOST, HTTP_PROTOCOL } from '../../config';

export const getVehicles = () => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/vehicles/`,
    };
    
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetVehicles(data)))
            .catch((error) => dispatch(failedGetVehicles(error)));
};

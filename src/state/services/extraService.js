import axios from 'axios';

import { successGetPackageTypes, failedGetPackageTypes } from '../actions/extraActions';
import { API_HOST, HTTP_PROTOCOL } from '../../config';

export const getPackageTypes = () => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/packagetype/get_packagetypes/`,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetPackageTypes(data)))
            .catch((error) => dispatch(failedGetPackageTypes(error)));
};

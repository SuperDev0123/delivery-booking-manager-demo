import axios from 'axios';

import { 
    resetReports,
    successGetReports,
    failedGetReports,
} from '../actions/reportActions';
import { API_HOST, HTTP_PROTOCOL } from '../../config';

export const getReports = () => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/reports/`,
    };

    return dispatch => {
        resetReports();
        axios(options)
            .then(({ data }) => dispatch(successGetReports(data)))
            .catch((error) => dispatch(failedGetReports(error)));
    };
};

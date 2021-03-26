import axios from 'axios';

import {
    successGetFiles,
    failedGetFiles,
    resetGetFiles,
} from '../actions/fileActions';
import { API_HOST, HTTP_PROTOCOL } from '../../config';

export const getFiles = (fileType) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/files/?fileType=${fileType}`,
    };
    return dispatch => {
        dispatch(resetGetFiles());
        axios(options)
            .then(({ data }) => dispatch(successGetFiles(data)))
            .catch((error) => dispatch(failedGetFiles(error)));
    };
};

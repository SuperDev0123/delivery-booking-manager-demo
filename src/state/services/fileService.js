import axios from 'axios';

import {
    successGetFiles,
    failedGetFiles,
} from '../actions/fileActions';
import { API_HOST, HTTP_PROTOCOL } from '../../config';

export const getFiles = () => {
    const options = {
        method: 'get',
        url: `${HTTP_PROTOCOL}://${API_HOST}/files/`,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetFiles(data)))
            .catch((error) => dispatch(failedGetFiles(error)));
};
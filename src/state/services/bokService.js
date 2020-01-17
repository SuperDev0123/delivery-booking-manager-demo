import axios from 'axios';

import {
    successGetBok1Headers,
    failedGetBok1Headers,
    successGetBok2Lines,
    failedGetBok2Lines,
    successGetBok3LinesData,
    failedGetBok3LinesData
} from '../actions/bokActions';
import { API_HOST, HTTP_PROTOCOL } from '../../config';

export const getBookings = () => {
    const options = {
        method: 'get',
        url: `${HTTP_PROTOCOL}://${API_HOST}/bok_1_headers/`,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetBok1Headers(data)))
            .catch((error) => dispatch(failedGetBok1Headers(error)));
};

export const getBookingLines = () => {
    const options = {
        method: 'get',
        url: `${HTTP_PROTOCOL}://${API_HOST}/bok_2_lines/`,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetBok2Lines(data)))
            .catch((error) => dispatch(failedGetBok2Lines(error)));
};

export const getBookingLinesData = () => {
    const options = {
        method: 'get',
        url: `${HTTP_PROTOCOL}://${API_HOST}/bok_3_lines_data/`,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetBok3LinesData(data)))
            .catch((error) => dispatch(failedGetBok3LinesData(error)));
};

import axios from 'axios';

import {
    successGetBok1Headers,
    failedGetBok1Headers,
    successGetBok2Lines,
    failedGetBok2Lines,
    successGetBok3LinesData,
    failedGetBok3LinesData,
    successGetBokWithPricings,
    failedGetBokWithPricings,
    successSelectPricing,
    failedSelectPricing,
    resetNeedToUpdatePricings,
    successGetDeliveryStatus,
    failedGetDeliveryStatus,
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

export const getBokWithPricings = (identifier) => {
    const options = {
        method: 'get',
        url: `${HTTP_PROTOCOL}://${API_HOST}/bok_1_headers/get_boks_with_pricings/?identifier=${identifier}`,
    };
    return dispatch => {
        dispatch(resetNeedToUpdatePricings());
        axios(options)
            .then(({ data }) => dispatch(successGetBokWithPricings(data)))
            .catch((error) => dispatch(failedGetBokWithPricings(error)));
    };
};

export const onSelectPricing = (costId, identifier) => {
    const options = {
        method: 'post',
        url: `${HTTP_PROTOCOL}://${API_HOST}/bok_1_headers/select_pricing/`,
        data: {'costId': costId, 'identifier': identifier},
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successSelectPricing(data)))
            .catch((error) => dispatch(failedSelectPricing(error)));
};

export const getDeliveryStatus = (identifier) => {
    const options = {
        method: 'get',
        url: `${HTTP_PROTOCOL}://${API_HOST}/get_delivery_status/?identifier=${identifier}`,
    };
    return dispatch => {
        // dispatch(resetNeedToUpdatePricings());
        axios(options)
            .then(({ data }) => dispatch(successGetDeliveryStatus(data)))
            .catch((error) => dispatch(failedGetDeliveryStatus(error)));
    };
};

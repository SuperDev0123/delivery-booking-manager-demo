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
    successBookFreight,
    failedBookFreight,
    successCancelFreight,
    failedCancelFreight,
    successUpdateBok_1,
    failedUpdateBok_1,
    successAutoRepack,
    failedAutoRepack,
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

export const bookFreight = (identifier) => {
    const options = {
        method: 'patch',
        url: `${HTTP_PROTOCOL}://${API_HOST}/bok_1_headers/book/?identifier=${identifier}`,
    };
    return dispatch => {
        // dispatch(resetNeedToUpdatePricings());
        axios(options)
            .then(() => dispatch(successBookFreight()))
            .catch((error) => dispatch(failedBookFreight(error)));
    };
};

export const cancelFreight = (identifier) => {
    const options = {
        method: 'delete',
        url: `${HTTP_PROTOCOL}://${API_HOST}/bok_1_headers/cancel/?identifier=${identifier}`,
    };
    return dispatch => {
        // dispatch(resetNeedToUpdatePricings());
        axios(options)
            .then(() => dispatch(successCancelFreight()))
            .catch((error) => dispatch(failedCancelFreight(error)));
    };
};

export const updateBok_1 = (bok_1) => {
    // const token = localStorage.getItem('token');
    // headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
    const options = {
        method: 'put', 
        url: `${HTTP_PROTOCOL}://${API_HOST}/bok_1_headers/update_freight_options/`,
        data: bok_1
    };
    return dispatch => {
        axios(options)
            .then(() => dispatch(successUpdateBok_1()))
            .catch((error) => dispatch(failedUpdateBok_1(error)));
    };
};

export const autoRepack = (identifier, repackStatus, palletId) => {
    const options = {
        method: 'post',
        url: `${HTTP_PROTOCOL}://${API_HOST}/boks/auto_repack/`,
        data: {'status': repackStatus, 'identifier': identifier, 'palletId': palletId},
    };
    return dispatch => {
        axios(options)
            .then(() => dispatch(successAutoRepack()))
            .catch((error) => dispatch(failedAutoRepack(error)));
    };
};

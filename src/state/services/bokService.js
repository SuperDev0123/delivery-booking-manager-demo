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
    successSendEmail,
    failedSendEmail,
    successAddBokLine,
    failedAddBokLine,
    successUpdateBokLine,
    failedUpdateBokLine,
    successDeleteBokLine,
    failedDeleteBokLine,
    successRepack,
    failedRepack,
    setNeedToUpdatePricingsFlag,
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

export const selectPricing = (costId, identifier, isLocking) => {
    const options = {
        method: 'post',
        url: `${HTTP_PROTOCOL}://${API_HOST}/bok_1_headers/select_pricing/`,
        data: {'costId': costId, 'identifier': identifier, isLocking},
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

export const sendEmail = (identifier) => {
    const options = {
        method: 'get',
        url: `${HTTP_PROTOCOL}://${API_HOST}/bok_1_headers/send_email/?identifier=${identifier}`,
    };
    return dispatch => {
        axios(options)
            .then(() => dispatch(successSendEmail()))
            .catch((error) => dispatch(failedSendEmail(error)));
    };
};

export const onAddBokLine = (line) => {
    const options = {
        method: 'post',
        url: `${HTTP_PROTOCOL}://${API_HOST}/bok_1_headers/add_bok_line/`,
        data: {line}
    };
    return dispatch => {
        axios(options)
            .then(() => dispatch(successAddBokLine()))
            .catch((error) => dispatch(failedAddBokLine(error)));
    };
};

export const onUpdateBokLine = (line_id, line) => {
    const options = {
        method: 'put',
        url: `${HTTP_PROTOCOL}://${API_HOST}/bok_1_headers/update_bok_line/`,
        data: {line_id, line}
    };
    return dispatch => {
        axios(options)
            .then(() => dispatch(successUpdateBokLine()))
            .catch((error) => dispatch(failedUpdateBokLine(error)));
    };
};

export const onDeleteBokLine = (line_id) => {
    const options = {
        method: 'delete',
        url: `${HTTP_PROTOCOL}://${API_HOST}/bok_1_headers/delete_bok_line/`,
        data: {line_id}
    };
    return dispatch => {
        axios(options)
            .then(() => dispatch(successDeleteBokLine()))
            .catch((error) => dispatch(failedDeleteBokLine(error)));
    };
};

export const repack = (pk_auto_id, repackStatus, palletId) => {
    const options = {
        method: 'post',
        url: `${HTTP_PROTOCOL}://${API_HOST}/bok_1_headers/${pk_auto_id}/repack/`,
        data: {repackStatus, palletId}
    };
    return dispatch => {
        dispatch(resetNeedToUpdatePricings());
        axios(options)
            .then(() => dispatch(successRepack()))
            .catch((error) => dispatch(failedRepack(error)));
    };
};

export const setNeedToUpdatePricings = () => {
    return dispatch => dispatch(setNeedToUpdatePricingsFlag());
};

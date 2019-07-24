import axios from 'axios';

import { resetBooking, successGetAttachments, failedGetAttachments, successGetBookings, failedGetBookings, successGetSuburbs, failedGetSuburbs, successDeliveryGetSuburbs, failedDeliveryGetSuburbs, successGetBooking, failedUpdateBooking, setMappedBok1ToBooking, setUserDateFilterField, failedGetUserDateFilterField, successAlliedBook, failedAlliedBook, successStBook, failedStBook, successGetLabel, failedGetLabel, setAllLocalFilter, setLocalFilter, setNeedUpdateBookingsFlag, successUpdateBooking, successDuplicateBooking, successCancelBook, failedCancelBook, successCreateBooking, failedCreateBooking, successGenerateXLS, failedGenerateXLS, successChangeBookingsStatus, failedChangeBookingsStatus, successCalcCollected, failedCalcCollected, setFetchGeoInfoFlagAction, clearErrorMessageAction } from '../actions/bookingActions';
import { API_HOST, HTTP_PROTOCOL } from '../../config';

export const getBookings = (startDate, endDate, clientPK=0, warehouseId=0, itemCountPerPage=10, sortField='-id', columnFilters={}, prefilterInd=0, simpleSearchKeyword='', downloadOption='label') => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/bookings/get_bookings/`,
        params: {
            startDate: startDate,
            endDate: endDate,
            clientPK: clientPK,
            warehouseId: warehouseId,
            itemCountPerPage: itemCountPerPage,
            sortField: sortField,
            columnFilters: columnFilters,
            prefilterInd: prefilterInd,
            simpleSearchKeyword: simpleSearchKeyword,
            downloadOption: downloadOption,
        }
    };
    return dispatch => {
        axios(options)
            .then(({ data }) => dispatch(successGetBookings(data)))
            .catch((error) => dispatch(failedGetBookings(error)));
    };
};

export const queryManifest = (vx_freight_provider, puPickUpAvailFrom_Date) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/bookings/get_bookings_4_manifest/`,
        params: {
            vx_freight_provider: vx_freight_provider,
            puPickUpAvailFrom_Date: puPickUpAvailFrom_Date,
        }
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetBookings(data)))
            .catch((error) => dispatch(failedGetBookings(error)));
};

export const setGetBookingsFilter = (key, value) => {
    return dispatch => dispatch(setLocalFilter(key, value));
};

export const setAllGetBookingsFilter = (startDate, endDate, clientPK=0, warehouseId=0, itemCountPerPage=10, sortField='-id', columnFilters={}, prefilterInd=0, simpleSearchKeyword='', downloadOption='label') => {
    return dispatch => dispatch(setAllLocalFilter(startDate, endDate, clientPK, warehouseId, itemCountPerPage, sortField, columnFilters, prefilterInd, simpleSearchKeyword, downloadOption));
};

export const setNeedUpdateBookingsState = (boolFlag) => {
    return dispatch => dispatch(setNeedUpdateBookingsFlag(boolFlag));
};

export const simpleSearch = (keyword) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/bookings/?searchType=` + '1&keyword=' + keyword,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetBookings(data)))
            .catch((error) => dispatch(failedGetBookings(error)));
};

export const getBooking = (id=null, filter=null) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/booking/get_booking/?id=` + id + '&filter=' + filter,
    };

    return dispatch => {
        dispatch(resetBooking());
        axios(options)
            .then(({ data }) => dispatch(successGetBooking(data)))
            .catch((error) => dispatch(failedGetBookings(error)));
    };
};

export const getSuburbStrings = (type, name) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/suburb/?type=` + type + '&name=' + name,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetSuburbs(data)))
            .catch((error) => dispatch(failedGetSuburbs(error)));
};

export const getAttachmentHistory = (id) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/attachments/?id=` + id,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetAttachments(data)))
            .catch((error) => dispatch(failedGetAttachments(error)));
};

export const getDeliverySuburbStrings = (type, name) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/suburb/?type=` + type + '&name=' + name,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successDeliveryGetSuburbs(data)))
            .catch((error) => dispatch(failedDeliveryGetSuburbs(error)));
};

export const updateBooking = (id, updateBooking) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'put',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/bookings/` + id + '/update_booking/',
        data: updateBooking
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successUpdateBooking(data)))
            .catch((error) => dispatch(failedUpdateBooking(error)));
};

export const saveBooking = (booking) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/booking/create_booking/`,
        data: booking
    };
    return dispatch => {
        dispatch(clearErrorMessage());
        dispatch(resetBooking());
        axios(options)
            .then(({ data }) => dispatch(successCreateBooking(data)))
            .catch((error) => dispatch(failedCreateBooking(error)));
    };
};

export const allTrigger = () => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/trigger_all/`
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(console.log('@1 - After all_trigger', data)))
            .catch((error) => dispatch(console.log('@2 - Failed all_trigger', error)));
};

export const alliedBooking = (bookingId) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        data: {'booking_id': bookingId},
        url: `${HTTP_PROTOCOL}://${API_HOST}/booking_allied/`
    };
    return dispatch =>
        axios(options)
            .then(({data}) => dispatch(successAlliedBook(data)))
            .catch((error) => dispatch(failedAlliedBook(error)));
};

export const stBooking = (bookingId) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        data: {'booking_id': bookingId},
        url: `${HTTP_PROTOCOL}://${API_HOST}/booking_st/`
    };
    return dispatch =>
        axios(options)
            .then(({data}) => dispatch(successStBook(data)))
            .catch((error) => dispatch(failedStBook(error)));
};

export const getAlliedLabel = (bookingId) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        data: {'booking_id': bookingId},
        url: `${HTTP_PROTOCOL}://${API_HOST}/get_label_allied/`
    };
    return dispatch =>
        axios(options)
            .then(({data}) => dispatch(successGetLabel(data)))
            .catch((error) => dispatch(failedGetLabel(error)));
};

export const getSTLabel = (bookingId) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        data: {'booking_id': bookingId},
        url: `${HTTP_PROTOCOL}://${API_HOST}/get_label_st/`
    };
    return dispatch =>
        axios(options)
            .then(({data}) => dispatch(successGetLabel(data)))
            .catch((error) => dispatch(failedGetLabel(error)));
};

export const mapBok1ToBookings = () => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/bok_1_to_bookings/`
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(setMappedBok1ToBooking(data.mapped_bookings)))
            .catch((error) => dispatch(failedUpdateBooking(error)));
};

export const getUserDateFilterField = () => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/users/get_user_date_filter_field/`
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(setUserDateFilterField(data.user_date_filter_field)))
            .catch((error) => dispatch(failedGetUserDateFilterField(error)));
};

export const stOrder = () => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/st_create_order/`
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(console.log('@1 - After ST order', data)))
            .catch((error) => dispatch(console.log('@2 - Failed ST order', error)));
};

export const getExcel = () => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/excel/`
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(console.log('@1 - After getExcel', data)))
            .catch((error) => dispatch(console.log('@2 - Failed getExcel', error)));
};

export const cancelBook = (bookingId) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        data: {'booking_id': bookingId},
        url: `${HTTP_PROTOCOL}://${API_HOST}/cancel_booking/`
    };
    return dispatch =>
        axios(options)
            .then(({data}) => dispatch(successCancelBook(data)))
            .catch((error) => dispatch(failedCancelBook(error)));
};

export const duplicateBooking = (bookingId, switchInfo, dupLineAndLineDetail) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/booking/duplicate_booking/?bookingId=` + bookingId + '&switchInfo=' + switchInfo + '&dupLineAndLineDetail=' + dupLineAndLineDetail,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successDuplicateBooking(data)))
            .catch((error) => dispatch(console.log('@2 - Failed duplicateBooking', error)));
};

export const generateXLS = (startDate, endDate, emailAddr, vx_freight_provider, report_type, showFieldName) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/bookings/generate_xls/`,
        params: {
            'startDate': startDate, 
            'endDate': endDate, 
            'emailAddr': emailAddr, 
            'vx_freight_provider': vx_freight_provider,
            'report_type': report_type,
            'showFieldName': showFieldName,
        },
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGenerateXLS(data)))
            .catch(( error ) => dispatch(failedGenerateXLS(error)));
};

export const changeBookingsStatus = (status, bookingIds) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'put',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/bookings/change_bookings_status/`,
        data: {status, bookingIds},
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successChangeBookingsStatus(data)))
            .catch((error) => dispatch(failedChangeBookingsStatus(error)));
};

export const calcCollected = (bookingIds, type) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/bookings/calc_collected/`,
        data: {'bookignIds': bookingIds, 'type': type},
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successCalcCollected(data)))
            .catch((error) => dispatch(failedCalcCollected(error)));
};

export const setFetchGeoInfoFlag = (boolFlag) => {
    return dispatch => dispatch(setFetchGeoInfoFlagAction(boolFlag));
};

export const clearErrorMessage = () => {
    return dispatch => dispatch(clearErrorMessageAction());
};

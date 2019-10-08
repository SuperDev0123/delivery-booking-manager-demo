import axios from 'axios';

import {
    resetTickManualBook,
    resetAttachments,
    resetBooking,
    successGetAttachments,
    failedGetAttachments,
    successGetBookings,
    failedGetBookings,
    successGetSuburbs,
    failedGetSuburbs,
    successDeliveryGetSuburbs,
    failedDeliveryGetSuburbs,
    successGetBooking,
    failedUpdateBooking,
    setMappedBok1ToBooking,
    setUserDateFilterField,
    failedGetUserDateFilterField,
    successAlliedBook,
    failedAlliedBook,
    successStBook,
    failedStBook,
    successGetLabel,
    failedGetLabel,
    setAllLocalFilter,
    setLocalFilter,
    setNeedUpdateBookingsFlag,
    successUpdateBooking,
    successDuplicateBooking,
    successCancelBook,
    failedCancelBook,
    successCreateBooking,
    failedCreateBooking,
    successGenerateXLS,
    failedGenerateXLS,
    successChangeBookingsStatus,
    failedChangeBookingsStatus,
    successCalcCollected,
    failedCalcCollected,
    setFetchGeoInfoFlagAction,
    clearErrorMessageAction,
    successTickManualBook,
    failedTickManualBook,
    successManualBook,
    failedManualBook,
    successEditBook,
    failedEditBook,
    successCreateOrder,
    failedCreateOrder,
    successGetOrderSummary,
    failedGetOrderSummary,
    resetManifestReport,
    successGetManifestReport,
    failedGetManifestReport,
} from '../actions/bookingActions';
import { API_HOST, HTTP_PROTOCOL } from '../../config';

export const getBookings = (
    startDate,
    endDate,
    clientPK=0,
    warehouseId=0,
    itemCountPerPage=10,
    sortField='-id',
    columnFilters={},
    prefilterInd=0,
    simpleSearchKeyword='',
    downloadOption='label',
    dmeStatus='',
    multiFindField=null,
    multiFindValues='',
) => {
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
            dmeStatus: dmeStatus,
            multiFindField: multiFindField,
            multiFindValues: multiFindValues,
        }
    };
    return dispatch => {
        axios(options)
            .then(({ data }) => dispatch(successGetBookings(data)))
            .catch((error) => dispatch(failedGetBookings(error)));
    };
};

export const setGetBookingsFilter = (key, value) => {
    return dispatch => dispatch(setLocalFilter(key, value));
};

export const setAllGetBookingsFilter = (
    startDate,
    endDate,
    clientPK=0,
    warehouseId=0,
    itemCountPerPage=10,
    sortField='-id',
    columnFilters={},
    prefilterInd=0,
    simpleSearchKeyword='',
    downloadOption='label',
    dmeStatus='',
    multiFindField=null,
    multiFindValues='',
) => {
    return dispatch => dispatch(setAllLocalFilter(
        startDate,
        endDate,
        clientPK,
        warehouseId,
        itemCountPerPage,
        sortField,
        columnFilters,
        prefilterInd,
        simpleSearchKeyword,
        downloadOption,
        dmeStatus,
        multiFindField,
        multiFindValues,
    ));
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

/*
 * Service function which retrieve a Booking
 * if `filter` === null, it will retrieve latest Booking for current User.
 */
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

export const manualBook = (id) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/booking/manual_book/`,
        data: {'id': id},
    };

    return dispatch => {
        dispatch(resetBooking());
        axios(options)
            .then(({ data }) => dispatch(successManualBook(data)))
            .catch((error) => dispatch(failedManualBook(error)));
    };
};

export const tickManualBook = (id) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/booking/tick_manual_book/`,
        data: {'id': id},
    };

    return dispatch => {
        dispatch(resetTickManualBook());
        axios(options)
            .then(({ data }) => dispatch(successTickManualBook(data)))
            .catch((error) => dispatch(failedTickManualBook(error)));
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

export const getAttachmentHistory = (fk_booking_id) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/attachments/?fk_booking_id=` + fk_booking_id,
    };
    return dispatch => {
        dispatch(resetAttachments());
        axios(options)
            .then(({ data }) => dispatch(successGetAttachments(data)))
            .catch((error) => dispatch(failedGetAttachments(error)));
    };
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
        url: `${HTTP_PROTOCOL}://${API_HOST}/startrack/book/`
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

export const stLabel = (bookingId) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        data: {'bookingId': bookingId},
        url: `${HTTP_PROTOCOL}://${API_HOST}/startrack/get-label/`
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

export const stOrder = (bookingIds) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/startrack/create-order/`,
        data: {bookingIds}
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successCreateOrder(data)))
            .catch((error) => dispatch(failedCreateOrder(error)));
};

export const stOrderSummary = (bookingIds) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/startrack/get-order-summary/`,
        data: {bookingIds}
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetOrderSummary(data)))
            .catch((error) => dispatch(failedGetOrderSummary(error)));
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

export const stCancelBook = (bookingId) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        data: {'booking_id': bookingId},
        url: `${HTTP_PROTOCOL}://${API_HOST}/startrack/cancel-book/`
    };
    return dispatch =>
        axios(options)
            .then(({data}) => dispatch(successCancelBook(data)))
            .catch((error) => dispatch(failedCancelBook(error)));
};

export const stEditBook = (bookingId) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        data: {'booking_id': bookingId},
        url: `${HTTP_PROTOCOL}://${API_HOST}/startrack/edit-book/`
    };
    return dispatch =>
        axios(options)
            .then(({data}) => dispatch(successEditBook(data)))
            .catch((error) => dispatch(failedEditBook(error)));
};

export const duplicateBooking = (bookingId, switchInfo, dupLineAndLineDetail) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/booking/duplicate_booking/?bookingId=` + bookingId + '&switchInfo=' + switchInfo + '&dupLineAndLineDetail=' + dupLineAndLineDetail,
    };
    return dispatch => {
        dispatch(resetBooking());
        axios(options)
            .then(({ data }) => dispatch(successDuplicateBooking(data)))
            .catch((error) => dispatch(console.log('@2 - Failed duplicateBooking', error)));
    };
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

export const changeBookingsFlagStatus = (flagStatus, bookingIds) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'put',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/bookings/change_bookings_status/`,
        data: {status: flagStatus, bookingIds},
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

export const getManifestReport = () => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/bookings/get_manifest_report/`,
    };

    return dispatch => {
        dispatch(resetManifestReport());
        axios(options)
            .then(({ data }) => dispatch(successGetManifestReport(data)))
            .catch((error) => dispatch(failedGetManifestReport(error)));
    };
};

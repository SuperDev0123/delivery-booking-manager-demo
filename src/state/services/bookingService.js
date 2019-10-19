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
    successFPBook, // FP Actions Begin
    failedFPBook, // "
    successFPPod,
    failedFPPod,
    successFPEditBook, // "
    failedFPEditBook, // "
    successFPGetLabel, // "
    failedFPGetLabel, // "
    successFPCancelBook, // "
    failedFPCancelBook, // "
    successFPCreateOrder, // "
    failedFPCreateOrder, // "
    successFPGetOrderSummary, // "
    failedFPGetOrderSummary,  // "
    successFPPricing, // "
    failedFPPricing, // FP Actions End
    setAllLocalFilter,
    setLocalFilter,
    setNeedUpdateBookingsFlag,
    successUpdateBooking,
    successDuplicateBooking,
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
    resetManifestReport,
    successGetManifestReport,
    failedGetManifestReport,
    resetPricingInfosFlagAction,
    resetPricingInfosAction,
    successGetPricingInfos,
    setErrorMessageAction,
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

// FP services
export const fpBook = (bookingId, vx_freight_provider) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        data: {'booking_id': bookingId},
        url: `${HTTP_PROTOCOL}://${API_HOST}/fp-api/${vx_freight_provider}/book/`
    };
    return dispatch =>
        axios(options)
            .then(({data}) => dispatch(successFPBook(data)))
            .catch((error) => dispatch(failedFPBook(error)));
};

export const fpEditBook = (bookingId, vx_freight_provider) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        data: {'booking_id': bookingId},
        url: `${HTTP_PROTOCOL}://${API_HOST}/fp-api/${vx_freight_provider}/edit-book/`
    };
    return dispatch =>
        axios(options)
            .then(({data}) => dispatch(successFPEditBook(data)))
            .catch((error) => dispatch(failedFPEditBook(error)));
};

export const fpCancelBook = (bookingId, vx_freight_provider) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        data: {'booking_id': bookingId},
        url: `${HTTP_PROTOCOL}://${API_HOST}/fp-api/${vx_freight_provider}/cancel-book/`
    };
    return dispatch =>
        axios(options)
            .then(({data}) => dispatch(successFPCancelBook(data)))
            .catch((error) => dispatch(failedFPCancelBook(error)));
};

export const fpLabel = (bookingId, vx_freight_provider) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        data: {'bookingId': bookingId},
        url: `${HTTP_PROTOCOL}://${API_HOST}/fp-api/${vx_freight_provider}/get-label/`
    };

    return dispatch =>
        axios(options)
            .then(({data}) => dispatch(successFPGetLabel(data)))
            .catch((error) => dispatch(failedFPGetLabel(error)));
};

export const fpOrder = (bookingIds, vx_freight_provider) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/fp-api/${vx_freight_provider}/create-order/`,
        data: {bookingIds}
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successFPCreateOrder(data)))
            .catch((error) => dispatch(failedFPCreateOrder(error)));
};

export const fpOrderSummary = (bookingIds, vx_freight_provider) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/fp-api/${vx_freight_provider}/get-order-summary/`,
        data: {bookingIds}
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successFPGetOrderSummary(data)))
            .catch((error) => dispatch(failedFPGetOrderSummary(error)));
};

export const fpPod = (bookingId, vx_freight_provider) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        data: {'booking_id': bookingId},
        url: `${HTTP_PROTOCOL}://${API_HOST}/fp-api/${vx_freight_provider}/pod/`
    };
    return dispatch =>
        axios(options)
            .then(({data}) => dispatch(successFPPod(data)))
            .catch((error) => dispatch(failedFPPod(error)));
};

export const fpPricing = (bookingId) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        data: {'booking_id': bookingId},
        url: `${HTTP_PROTOCOL}://${API_HOST}/fp-api/pricing/`
    };
    return dispatch => {
        dispatch(resetPricingInfos());
        axios(options)
            .then(({data}) => dispatch(successFPPricing(data)))
            .catch((error) => dispatch(failedFPPricing(error)));
    };
};

export const resetPricingInfosFlag = () => {
    return dispatch => {
        dispatch(resetPricingInfosFlagAction());
    };
};

export const resetPricingInfos = () => {
    return dispatch => {
        dispatch(resetPricingInfosAction());
    };
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

export const getPricingInfos = (fk_booking_id) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/pricing/get_pricings/`,
        params: {'fk_booking_id': fk_booking_id},
    };
    return dispatch => {
        dispatch(resetPricingInfosAction());
        axios(options)
            .then(({ data }) => dispatch(successGetPricingInfos(data)))
            .catch((error) => dispatch(setErrorMessageAction(error)));
    };
};

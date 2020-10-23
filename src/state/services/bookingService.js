import axios from 'axios';

import {
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
    successFPRebook,
    failedFPRebook,
    successFPPod,
    failedFPPod,
    successFPEditBook, // "
    failedFPEditBook, // "
    successFPGetLabel, // "
    failedFPGetLabel, // "
    successFPReprintLabel, // "
    failedFPReprintLabel, // "
    successFPCancelBook, // "
    failedFPCancelBook, // "
    successFPCreateOrder, // "
    failedFPCreateOrder, // "
    successFPGetOrderSummary, // "
    failedFPGetOrderSummary, // ""
    successFPTracking, // "
    failedFPTracking, // "
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
    resetRefeshBookingsFlag,
    successSendEmail,
    failedSendEmail,
    resetAutoSelectedAction,
    successCheckAugmented,
    failedCheckAugmented,
    successAutoAugment,
    failedAutoAugment,
    successRevertAugment,
    failedRevertAugment,
    successPricingAnalysis,
    failedPricingAnalysis,
    successAugmentPuDate,
    failedAugmentPuDate,
    resetNoBookingAction,
    successGetClientProcessMgr,
    failedGetClientProcessMgr
} from '../actions/bookingActions';
import { API_HOST, HTTP_PROTOCOL } from '../../config';

export const getBookings = (
    startDate,
    endDate,
    clientPK=0,
    warehouseId=0,
    pageItemCnt=100,
    pageInd=0,
    sortField='-id',
    columnFilters={},
    activeTabInd=0,
    simpleSearchKeyword='',
    downloadOption='label',
    dmeStatus='',
    multiFindField=null,
    multiFindValues='',
    projectName=null,
    bookingIds=null,
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
            pageItemCnt: parseInt(pageItemCnt),
            pageInd: parseInt(pageInd),
            sortField: sortField,
            columnFilters: columnFilters,
            activeTabInd: activeTabInd,
            simpleSearchKeyword: simpleSearchKeyword,
            downloadOption: downloadOption,
            dmeStatus: dmeStatus,
            multiFindField: multiFindField,
            multiFindValues: multiFindValues,
            projectName: projectName,
            bookingIds: bookingIds,
        }
    };
    return dispatch => {
        dispatch(resetRefeshBookingsFlag());
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
    pageItemCnt=100,
    pageInd=0,
    sortField='-id',
    columnFilters={},
    activeTabInd=0,
    simpleSearchKeyword='',
    downloadOption='label',
    dmeStatus='',
    multiFindField=null,
    multiFindValues='',
    projectName=null,
    bookingIds=null,
) => {
    return dispatch => dispatch(setAllLocalFilter(
        startDate,
        endDate,
        clientPK,
        warehouseId,
        pageItemCnt,
        pageInd,
        sortField,
        columnFilters,
        activeTabInd,
        simpleSearchKeyword,
        downloadOption,
        dmeStatus,
        multiFindField,
        multiFindValues,
        projectName,
        bookingIds,
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

export const checkAugmentedBooking = (bookingId) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/booking/check_augmented/?bookingId=` + bookingId,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successCheckAugmented(data)))
            .catch((error) => dispatch(failedCheckAugmented(error)));
};

export const autoAugmentBooking = (bookingId) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/booking/auto_augment/`,
        data: {'bookingId': bookingId}
    };
    return dispatch => {
        axios(options)
            .then(({ data }) => dispatch(successAutoAugment(data)))
            .catch((error) => dispatch(failedAutoAugment(error)));
    };
};

export const revertAugmentBooking = (bookingId) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/booking/revert_augment/`,
        data: {'bookingId': bookingId}
    };
    return dispatch => {
        axios(options)
            .then(({ data }) => dispatch(successRevertAugment(data)))
            .catch((error) => dispatch(failedRevertAugment(error)));
    };
};

export const getClientProcessMgr = (bookingId) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/clientprocess/?bookingId=`+ bookingId
    };
    return dispatch => {
        axios(options)
            .then(({ data }) => dispatch(successGetClientProcessMgr(data)))
            .catch((error) => dispatch(failedGetClientProcessMgr(error)));
    };
};

export const getPricingAnalysis = (bookingIds) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/bookings/pricing_analysis/`,
        data: {'bookingIds': bookingIds}
    };

    return dispatch => {
        axios(options)
            .then(({ data }) => dispatch(successPricingAnalysis(data)))
            .catch((error) => dispatch(failedPricingAnalysis(error)));
    };
};

export const augmentPuDate = (bookingId) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/booking/set_pu_date_augment/`,
        data: {'bookingId': bookingId}
    };

    return dispatch => {
        axios(options)
            .then(({ data }) => dispatch(successAugmentPuDate(data)))
            .catch((error) => dispatch(failedAugmentPuDate(error)));
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

export const fpRebook = (bookingId, vx_freight_provider) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        data: {'booking_id': bookingId},
        url: `${HTTP_PROTOCOL}://${API_HOST}/fp-api/${vx_freight_provider}/rebook/`
    };
    return dispatch =>
        axios(options)
            .then(({data}) => dispatch(successFPRebook(data)))
            .catch((error) => dispatch(failedFPRebook(error)));
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
        data: {'booking_id': bookingId},
        url: `${HTTP_PROTOCOL}://${API_HOST}/fp-api/${vx_freight_provider}/get-label/`
    };

    return dispatch =>
        axios(options)
            .then(({data}) => dispatch(successFPGetLabel(data)))
            .catch((error) => dispatch(failedFPGetLabel(error)));
};

export const fpReprint = (bookingId, vx_freight_provider) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        data: {'booking_id': bookingId},
        url: `${HTTP_PROTOCOL}://${API_HOST}/fp-api/${vx_freight_provider}/reprint/`
    };

    return dispatch =>
        axios(options)
            .then(({data}) => dispatch(successFPReprintLabel(data)))
            .catch((error) => dispatch(failedFPReprintLabel(error)));
};

export const fpTracking = (bookingId, vx_freight_provider) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        data: {'booking_id': bookingId},
        url: `${HTTP_PROTOCOL}://${API_HOST}/fp-api/${vx_freight_provider}/tracking/`
    };

    return dispatch =>
        axios(options)
            .then(({data}) => dispatch(successFPTracking(data)))
            .catch((error) => dispatch(failedFPTracking(error)));
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

export const resetAutoSelected = () => {
    return dispatch => {
        dispatch(resetAutoSelectedAction());
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

export const generateXLS = (startDate, endDate, emailAddr, vx_freight_provider, report_type, showFieldName, useSelected, selectedBookingIds, pk_id_dme_client) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/bookings/generate_xls/`,
        data: {
            startDate, endDate, emailAddr, vx_freight_provider, report_type, showFieldName, useSelected, selectedBookingIds, pk_id_dme_client
        },
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGenerateXLS(data)))
            .catch(( error ) => dispatch(failedGenerateXLS(error)));
};

export const changeBookingsStatus = (status, bookingIds, optionalValue=null) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'put',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/bookings/change_bookings_status/`,
        data: {status, bookingIds, optionalValue},
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

export const sendEmail = (bookingId, templateName) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/bookings/send_email/`,
        params: {bookingId, templateName},
    };
    return dispatch => {
        axios(options)
            .then(({ data }) => dispatch(successSendEmail(data)))
            .catch((error) => dispatch(failedSendEmail(error)));
    };
};

export const resetNoBooking = () => {
    return dispatch => dispatch(resetNoBookingAction());
};

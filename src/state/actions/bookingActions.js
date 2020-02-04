import {
    RESET_TICK_MANUAL_BOOK,
    RESET_ATTACHMENTS,
    RESET_BOOKING,
    SET_ATTACHMENTS,
    FAILED_GET_ATTACHMENTS,
    SET_POSTALCODE_DE,
    SET_SUBURB_DE,
    SET_STATE_DE,
    FAILED_GET_SUBURBS_DE,
    SET_BOOKING_WITH_FILTER,
    SET_SUBURB,
    SET_POSTALCODE,
    SET_STATE,
    FAILED_GET_SUBURBS,
    SET_BOOKINGS,
    FAILED_GET_BOOKINGS,
    SET_BOOKING,
    FAILED_UPDATE_BOOKING,
    SET_MAPPEDBOOKINGS,
    SET_USER_DATE_FILTER_FIELD,
    FAILED_GET_USER_DATE_FILTER_FIELD,
    BOOK_SUCCESS,
    BOOK_FAILED,
    POD_SUCCESS,
    POD_FAILED,
    GET_LABEL_SUCCESS,
    GET_LABEL_FAILED,
    SET_LOCAL_FILTER_ALL, // Filter start
    SET_LOCAL_FILTER_SELECTEDATE,
    SET_LOCAL_FILTER_WAREHOUSEID,
    SET_LOCAL_FILTER_SORTFIELD,
    SET_LOCAL_FILTER_COLUMNFILTER,
    SET_LOCAL_FILTER_ACTIVE_TAB_IND,
    SET_LOCAL_FILTER_SIMPLESEARCHKEYWORD,
    SET_LOCAL_FILTER_PROJECTNAME, // Filter end
    SET_FETCH_BOOKINGS_FLAG,
    SUCCESS_UPDATE_BOOKING,
    SUCCESS_DUPLICATE_BOOKING,
    BOOK_CANCEL_SUCCESS,
    BOOK_CANCEL_FAILED,
    SET_LOCAL_FILTER_CLIENTPK,
    FAILED_CREATE_BOOKING,
    SUCCESS_CREATE_BOOKING,
    GENERATE_XLS_SUCCESS,
    GENERATE_XLS_FAILED,
    CHANGE_STATUS_SUCCESS,
    CHANGE_STATUS_FAILED,
    SUCCESS_CALC_COLLECTED,
    FAILED_CALC_COLLECTED,
    SET_LOCAL_FILTER_DOWNLOADOPTION,
    SET_FETCH_GEO_FLAG,
    CLEAR_ERR_MSG,
    SET_LOCAL_FILTER_DMESTATUS,
    SUCCESS_TICK_MANUAL_BOOK,
    FAILED_TICK_MANUAL_BOOK,
    SUCCESS_MANUAL_BOOK,
    FAILED_MANUAL_BOOK,
    BOOK_EDIT_SUCCESS,
    BOOK_EDIT_FAILED,
    SUCCESS_CREATE_ORDER,
    FAILED_CREATE_ORDER,
    SUCCESS_GET_ORDER_SUMMARY,
    FAILED_GET_ORDER_SUMMARY,
    RESET_MANIFEST_REPORT,
    SUCCESS_GET_MANIFEST_REPORT,
    FAIELD_GET_MANIFEST_REPORT,
    GET_TRACK_FAILED,
    DO_NOTHING,
    SUCCESS_FP_PRICING,
    FAILED_FP_PRICING,
    RESET_PRICING_INFOS,
    RESET_PRICING_INFOS_FLAG,
    SUCCESS_GET_PRICING_INFOS,
    SET_ERROR_MSG,
    SET_LOCAL_FILTER_PAGEITEMCNT,
    SET_LOCAL_FILTER_PAGEINDEX,
    RESET_REFRESH_BOOKINGS_FLAG,
    SUCCESS_SEND_EMAIL,
    FAILED_SEND_EMAIL,
    RESET_AUTO_SELECTED,
} from '../constants/bookingConstants';

export function successGetBookings(data) {
    return {
        type: SET_BOOKINGS,
        bookings: data['bookings'],
        filteredBookingIds: data['filtered_booking_ids'],
        bookingsCnt: data['count'],
        pageCnt: data['page_cnt'],
        pageInd: data['page_ind'],
        pageItemCnt: data['page_item_cnt'],
        toManifest: data['to_manifest'],
        toProcess: data['to_process'],
        closed: data['closed'],
        errorsToCorrect: data['errors_to_correct'],
        missingLabels: data['missing_labels'],
    };
}

export function resetRefeshBookingsFlag() {
    return {
        type: RESET_REFRESH_BOOKINGS_FLAG,
    };
}

export function setLocalFilter(key, value) {
    if (key === 'date') {
        return {
            type: SET_LOCAL_FILTER_SELECTEDATE,
            startDate: value.startDate,
            endDate: value.endDate,
        };
    } else if (key === 'warehouseId') {
        return {
            type: SET_LOCAL_FILTER_WAREHOUSEID,
            warehouseId: value,
        };
    } else if (key === 'sortField') {
        return {
            type: SET_LOCAL_FILTER_SORTFIELD,
            sortField: value,
        };
    } else if (key === 'columnFilters') {
        return {
            type: SET_LOCAL_FILTER_COLUMNFILTER,
            columnFilters: value,
        };
    } else if (key === 'activeTabInd') {
        return {
            type: SET_LOCAL_FILTER_ACTIVE_TAB_IND,
            activeTabInd: value,
        };
    } else if (key === 'simpleSearchKeyword') {
        return {
            type: SET_LOCAL_FILTER_SIMPLESEARCHKEYWORD,
            simpleSearchKeyword: value,
        };
    } else if (key === 'clientPK') {
        return {
            type: SET_LOCAL_FILTER_CLIENTPK,
            clientPK: value,
        };
    } else if (key === 'downloadOption') {
        return {
            type: SET_LOCAL_FILTER_DOWNLOADOPTION,
            downloadOption: value,
        };
    } else if (key === 'pageItemCnt') {
        return {
            type: SET_LOCAL_FILTER_PAGEITEMCNT,
            pageItemCnt: value,
        };
    } else if (key === 'pageInd') {
        return {
            type: SET_LOCAL_FILTER_PAGEINDEX,
            pageInd: value,
        };
    } else if (key === 'dmeStatus') {
        return {
            type: SET_LOCAL_FILTER_DMESTATUS,
            dmeStatus: value,
        };
    } else if (key === 'projectName') {
        return {
            type: SET_LOCAL_FILTER_PROJECTNAME,
            payload: value,
        };
    }
}

export function setAllLocalFilter(
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
    projectName
) {
    return {
        type: SET_LOCAL_FILTER_ALL,
        startDate: startDate,
        endDate: endDate,
        warehouseId: warehouseId,
        sortField: sortField,
        pageItemCnt: pageItemCnt,
        pageInd: pageInd,
        columnFilters: columnFilters,
        activeTabInd: activeTabInd,
        simpleSearchKeyword: simpleSearchKeyword,
        downloadOption: downloadOption,
        clientPK: clientPK,
        dmeStatus: dmeStatus,
        multiFindField: multiFindField,
        multiFindValues: multiFindValues,
        projectName: projectName,
    };
}

export function setNeedUpdateBookingsFlag(boolFlag) {
    return {
        type: SET_FETCH_BOOKINGS_FLAG,
        needUpdateBookings: boolFlag,
    };
}

export function resetBooking() {
    return {
        type: RESET_BOOKING,
    };
}

export function resetAttachments() {
    return {
        type: RESET_ATTACHMENTS,
    };
}

export function successGetBooking(data) {
    if (!data['booking']['id']) {
        return {
            type: SET_BOOKING_WITH_FILTER,
            noBooking: true,
        };
    }

    return {
        type: SET_BOOKING_WITH_FILTER,
        booking: data['booking'],
        nextBookingId: data['nextid'],
        prevBookingId: data['previd'],
        qtyTotal: data['e_qty_total'],
        cntComms: data['cnt_comms'],
        cntAttachments: data['cnt_attachments'],
        noBooking: false,
    };
}

export function successCreateBooking(data) {
    return {
        type: SUCCESS_CREATE_BOOKING,
        booking: data,
        noBooking: false,
    };
}

export function successUpdateBooking(data) {
    return {
        type: SUCCESS_UPDATE_BOOKING,
        booking: data,
        noBooking: false,
    };
}

export function successDuplicateBooking(data) {
    return {
        type: SUCCESS_DUPLICATE_BOOKING,
        booking: data,
    };
}

export function successGetSuburbs(data) {
    if (data['type'] == 'state') {
        return {
            type: SET_STATE,
            puStates: data['suburbs'],
        };
    } else if ( data['type'] == 'postalcode' ) {
        return {
            type: SET_POSTALCODE,
            puPostalCodes: data['suburbs'],
        };
    } else if ( data['type'] == 'suburb' ) {
        return {
            type: SET_SUBURB,
            puSuburbs: data['suburbs'],
        };
    }
}

export function failedGetSuburbs(error) {
    console.log('Error: ', error);
    return {
        type: FAILED_GET_SUBURBS,
        errorMessage: 'Unable to fetch suburbs.',
        bBooking: false
    };
}

export function successGetAttachments(data) {
    return {
        type: SET_ATTACHMENTS,
        attachments: data['history'],
    };
}

export function failedGetAttachments(error) {
    console.log('Error: ', error);
    return {
        type: FAILED_GET_ATTACHMENTS,
        errorMessage: 'Unable to get attachments.',
    };
}

export function successDeliveryGetSuburbs(data) {
    if (data['type'] == 'state') {
        return {
            type: SET_STATE_DE,
            deToStates: data['suburbs'],
        };
    } else if ( data['type'] == 'postalcode' ) {
        return {
            type: SET_POSTALCODE_DE,
            deToPostalCodes: data['suburbs'],
        };
    } else if ( data['type'] == 'suburb' ) {
        return {
            type: SET_SUBURB_DE,
            deToSuburbs: data['suburbs'],
        };
    }
}

export function failedDeliveryGetSuburbs(error) {
    console.log('Error: ', error);
    return {
        type: FAILED_GET_SUBURBS_DE,
        errorMessage: 'Unable to fetch suburbs.',
        bBooking: false
    };
}

export function failedGetBookings(error) {
    console.log('Error: ', error);
    return {
        type: FAILED_GET_BOOKINGS,
        errorMessage: 'Unable to fetch bookings.',
        bBooking: false
    };
}

export function failedCreateBooking(error) {
    return {
        type: FAILED_CREATE_BOOKING,
        errorMessage: 'Unable to create booking, error: ' + error,
        bBooking: false
    };
}

export function setMappedBok1ToBooking(mappedBookings) {
    return {
        type: SET_MAPPEDBOOKINGS,
        mappedBookings
    };
}

export function setBooking(booking) {
    return {
        type: SET_BOOKING,
        booking
    };
}

export function failedUpdateBooking(error) {
    console.log('Error: ', error);
    return {
        type: FAILED_UPDATE_BOOKING,
        errorMessage: 'Unable to update booking.' + JSON.stringify(error.response.data),
    };
}

export function setUserDateFilterField(userDateFilterField) {
    return {
        type: SET_USER_DATE_FILTER_FIELD,
        userDateFilterField
    };
}

export function failedGetUserDateFilterField(error) {
    console.log('Error: ', error);
    return {
        type: FAILED_GET_USER_DATE_FILTER_FIELD,
        errorMessage: 'Unable to get User`s date filter field.'
    };
}

// FP Actions
export function successFPBook(data) {
    alert(data.message);

    return {
        type: BOOK_SUCCESS,
        errorMessage: data.message
    };
}

export function successFPPod(data) {
    alert(`${data.message}`);

    return {
        type: POD_SUCCESS,
        errorMessage: data.message
    };
}

export function failedFPPod(error) {
    alert(`Failed POD: ${error.response.data.message}`);

    return {
        type: POD_FAILED,
        errorMessage: error.response.data.message
    };
}

export function failedFPBook(error) {
    alert(`Failed Book: ${error.response.data.message}`);

    return {
        type: BOOK_FAILED,
        errorMessage: error.response.data.message
    };
}

export function successFPEditBook(data) {
    alert(data['message']);

    return {
        type: BOOK_EDIT_SUCCESS,
        errorMessage: data['message'],
    };
}

export function failedFPEditBook(error) {
    alert(error.response.data.message);

    return {
        type: BOOK_EDIT_FAILED,
        errorMessage: 'Failed to edit book'
    };
}

export function successFPGetLabel(data) {
    alert(`Success get Label: ${data.message}`);

    return {
        type: GET_LABEL_SUCCESS,
        errorMessage: data.message
    };
}

export function failedFPGetLabel(error) {
    alert(`Failed get Label: ${error.response.data.message}`);

    return {
        type: GET_LABEL_FAILED,
        errorMessage: error.response.data.message
    };
}

export function successFPReprintLabel(data) {
    alert(`Success reprint Label: ${data.message}`);

    return {
        type: GET_LABEL_SUCCESS,
        errorMessage: data.message
    };
}

export function failedFPReprintLabel(error) {
    alert(`Failed reprint Label: ${error.response.data.message}`);

    return {
        type: GET_LABEL_FAILED,
        errorMessage: error.response.data.message
    };
}

export function successFPTracking(data) {
    alert(`Success track status: ${data.message}`);

    return {
        type: DO_NOTHING,
        errorMessage: data.message
    };
}

export function failedFPTracking(error) {
    alert(`Failed track status: ${error.response.data.message}`);

    return {
        type: GET_TRACK_FAILED,
        errorMessage: error.response.data.message
    };
}

export function successFPCancelBook(data) {
    alert(data['message']);

    return {
        type: BOOK_CANCEL_SUCCESS,
        errorMessage: data['message'],
    };
}

export function failedFPCancelBook(error) {
    alert(error.response.data.message);

    return {
        type: BOOK_CANCEL_FAILED,
        errorMessage: 'Failed to Cancel Book'
    };
}

export function successFPCreateOrder(data) {
    alert(data['message'] + ', Now trying to get OrderSummary');

    return {
        type: SUCCESS_CREATE_ORDER,
        errorMessage: data['message'],
    };
}

export function failedFPCreatedOrder(error) {
    alert(error.response.data.message);

    return {
        type: FAILED_CREATE_ORDER,
        errorMessage: 'Failed to create order'
    };
}

export function successFPGetOrderSummary(data) {
    alert(data['message']);

    return {
        type: SUCCESS_GET_ORDER_SUMMARY,
        errorMessage: data['message'],
    };
}

export function failedFPGetOrderSummary(error) {
    alert(error.response.data.message);

    return {
        type: FAILED_GET_ORDER_SUMMARY,
        errorMessage: 'Failed to get order summary'
    };
}

export function successFPPricing(data) {
    return {
        type: SUCCESS_FP_PRICING,
        payload: data['results'],
        errorMessage: data['message'],
        isAutoSelected: data['isAutoSelected'],
    };
}

export function failedFPPricing(error) {
    alert(error.response.data.message);

    return {
        type: FAILED_FP_PRICING,
        errorMessage: 'Failed to FC(Freight Calculation)'
    };
}

export function successGenerateXLS(data) {
    console.log('@500 - Success generate xml: ', data);
    return {
        type: GENERATE_XLS_SUCCESS,
        errorMessage: 'Success generate xml',
    };
}

export function failedGenerateXLS(error) {
    console.log('@500 - Failed generate xml: ', error);
    return {
        type: GENERATE_XLS_FAILED,
        errorMessage: 'Failed generate xml'
    };
}

export function successChangeBookingsStatus() {
    return {
        type: CHANGE_STATUS_SUCCESS,
        errorMessage: 'Success change bookings status',
    };
}

export function failedChangeBookingsStatus(error) {
    console.log('@501 - Failed change bookings status: ', error);
    return {
        type: CHANGE_STATUS_FAILED,
        errorMessage: 'Failed change bookings status',
    };
}

export function successCalcCollected(data) {
    console.log('@501 - Success calc collected: ', data);
    return {
        type: SUCCESS_CALC_COLLECTED,
        errorMessage: 'Success calc collected',
    };
}

export function failedCalcCollected(error) {
    console.log('@501 - Failed calc collected: ', error);
    return {
        type: FAILED_CALC_COLLECTED,
        errorMessage: 'Failed calc collected',
    };
}

export function setFetchGeoInfoFlagAction(boolFlag) {
    return {
        type: SET_FETCH_GEO_FLAG,
        payload: boolFlag,
    };
}

export function clearErrorMessageAction() {
    return {
        type: CLEAR_ERR_MSG,
    };
}

export function successTickManualBook(data) {
    return {
        type: SUCCESS_TICK_MANUAL_BOOK,
        booking: data,
        noBooking: false,
    };
}

export function failedTickManualBook() {
    return {
        type: FAILED_TICK_MANUAL_BOOK,
    };
}

export function resetTickManualBook() {
    return {
        type: RESET_TICK_MANUAL_BOOK,
    };
}

export function failedManualBook() {
    return {
        type: FAILED_MANUAL_BOOK,
    };
}

export function successManualBook(data) {
    return {
        type: SUCCESS_MANUAL_BOOK,
        booking: data,
    };
}

export function resetManifestReport() {
    return {
        type: RESET_MANIFEST_REPORT,
    };
}

export function successGetManifestReport(data) {
    return {
        type: SUCCESS_GET_MANIFEST_REPORT,
        payload: data,
    };
}

export function failedGetManifestReport(error) {
    return {
        type: FAIELD_GET_MANIFEST_REPORT,
        errorMessage: error.response.data.message,
    };
}

export function resetPricingInfosFlagAction() {
    return {
        type: RESET_PRICING_INFOS_FLAG,
    };
}

export function resetPricingInfosAction() {
    return {
        type: RESET_PRICING_INFOS,
    };
}

export function successGetPricingInfos(data) {
    return {
        type: SUCCESS_GET_PRICING_INFOS,
        payload: data,
        isAutoSelected: data['isAutoSelected'],
    };
}

export function setErrorMessageAction(error) {
    return {
        type: SET_ERROR_MSG,
        errorMessage: error.response.data.message,
    };
}

export function successSendEmail() {
    return {
        type: SUCCESS_SEND_EMAIL,
        errorMessage: 'Sent Email Successfully',
    };
}

export function failedSendEmail(error) {
    return {
        type: FAILED_SEND_EMAIL,
        errorMessage: error.response.data.message,
    };
}

export function resetAutoSelectedAction() {
    return {
        type: RESET_AUTO_SELECTED,
    };
}

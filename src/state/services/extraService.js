import axios from 'axios';

import {
    resetStatusInfoFlag,
    resetFlagApiBCLs,
    resetFlagStatusHistory,
    successGetPackageTypes,
    failedGetPackageTypes,
    successGetAllBookingStatus,
    failedGetAllBookingStatus,
    successSaveStatusHistory,
    failedSaveStatusHistory,
    successGetBookingStatusHistory,
    failedGetBookingStatusHistory,
    successGetAllFPs,
    failedGetAllFPs,
    successStatusActions,
    failedStatusActions,
    successGetStatusDetails,
    failedStatusDetails,
    successCreateStatusDetail,
    successCreateStatusAction,
    failedCreateStatusDetail,
    failedCreateStatusAction,
    successGetApiBCLs,
    failedGetApiBCLs,
    setStatusInfoFilterAction,
    successGetStatusInfo,
    failedGetStatusInfo,
    resetProjectNames,
    successGetProjectNames,
    failedGetProjectNames,
    resetEmailLogs,
    successGetEmailLogs,
    failedGetEmailLogs,
    successGetBookingSets, // BookingSet
    failedGetBookingSets, // *
    successCreateBookingSet, // *
    failedCreateBookingSet, // *
    successUpdateBookingSet, // *
    failedUpdateBookingSet, // *
    successDeleteBookingSet, // *
    failedDeleteBookingSet, // *
    resetBookingSetFlagsAction, // BookingSet
    successSaveStatusHistoryPuInfo,
    failedSaveStatusHistoryPuInfo,
    successUpdateClientEmployee,
    failedUpdateClientEmployee,
    successGetZohoTickets,
    failedGetZohoTickets,
    resetZohoTickets,
    successGetDMEClientProducts,
    failedGetDMEClientProducts,
    successDeleteClientProduct,
    failedDeleteClientProduct,
} from '../actions/extraActions';
import { API_HOST, HTTP_PROTOCOL } from '../../config';

export const getPackageTypes = () => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/packagetype/get_packagetypes/`,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetPackageTypes(data)))
            .catch((error) => dispatch(failedGetPackageTypes(error)));
};

export const getAllBookingStatus = () => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/bookingstatus/get_all_booking_status/`,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetAllBookingStatus(data)))
            .catch((error) => dispatch(failedGetAllBookingStatus(error)));
};

export const getBookingStatusHistory = (pk_booking_id) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/statushistory/get_all?pk_booking_id=` + pk_booking_id,
    };
    return dispatch => {
        dispatch(resetFlagStatusHistory());
        axios(options)
            .then(({ data }) => dispatch(successGetBookingStatusHistory(data)))
            .catch((error) => dispatch(failedGetBookingStatusHistory(error)));
    };
};

export const createStatusHistory = (statusHistory) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/statushistory/save_status_history/`,
        data: statusHistory,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successSaveStatusHistory(data)))
            .catch((error) => dispatch(failedSaveStatusHistory(error)));
};

export const updateStatusHistory = (statusHistory) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'put',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/statushistory/` + statusHistory.id + '/update_status_history/',
        data: statusHistory,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successSaveStatusHistory(data)))
            .catch((error) => dispatch(failedSaveStatusHistory(error)));
};

export const getAllFPs = () => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/fp/get_all/`,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetAllFPs(data)))
            .catch((error) => dispatch(failedGetAllFPs(error)));
};

export const getStatusActions = () => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/status/get_status_actions/`,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successStatusActions(data)))
            .catch((error) => dispatch(failedStatusActions(error)));
};

export const getStatusDetails = () => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/status/get_status_details/`,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetStatusDetails(data)))
            .catch((error) => dispatch(failedStatusDetails(error)));
};

export const createStatusDetail = (newStatusDetail) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/status/create_status_detail/`,
        data: {'newStatusDetail': newStatusDetail},
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successCreateStatusDetail(data)))
            .catch((error) => dispatch(failedCreateStatusDetail(error)));
};

export const createStatusAction = (newStatusAction) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/status/create_status_action/`,
        data: {'newStatusAction': newStatusAction},
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successCreateStatusAction(data)))
            .catch((error) => dispatch(failedCreateStatusAction(error)));
};

export const getApiBCLs = (bookingId) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/api_bcl/get_api_bcls/`,
        params: {'bookingId': bookingId},
    };
    return dispatch => {
        dispatch(resetFlagApiBCLs());
        axios(options)
            .then(({ data }) => dispatch(successGetApiBCLs(data)))
            .catch((error) => dispatch(failedGetApiBCLs(error)));
    };
};

export const setStatusInfoFilter = (startDate, endDate, clientPK=0) => {
    return dispatch => dispatch(setStatusInfoFilterAction(startDate, endDate, clientPK));
};

export const getStatusInfo = (startDate, endDate, clientPK=0) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/bookings/get_status_info/`,
        params: {'startDate': startDate, 'endDate': endDate, 'clientPK': clientPK},
    };
    return dispatch => {
        dispatch(resetStatusInfoFlag());
        axios(options)
            .then(({ data }) => dispatch(successGetStatusInfo(data)))
            .catch((error) => dispatch(failedGetStatusInfo(error)));
    };
};

export const getAllProjectNames = () => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/bookings/get_project_names/`,
    };
    return dispatch => {
        dispatch(resetProjectNames());
        axios(options)
            .then(({ data }) => dispatch(successGetProjectNames(data)))
            .catch((error) => dispatch(failedGetProjectNames(error)));
    };
};

export const getEmailLogs = (bookingId) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/booking/get_email_logs/?bookingId=${bookingId}`,
    };
    return dispatch => {
        dispatch(resetEmailLogs());
        axios(options)
            .then(({ data }) => dispatch(successGetEmailLogs(data)))
            .catch((error) => dispatch(failedGetEmailLogs(error)));
    };
};

export const getBookingSets = () => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/bookingsets/`,
    };
    return dispatch => {
        axios(options)
            .then(({ data }) => dispatch(successGetBookingSets(data)))
            .catch((error) => dispatch(failedGetBookingSets(error)));
    };
};

export const createBookingSet = (bookingIds, name, note, auto_select_type) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/bookingsets/`,
        data: {
            bookingIds, name, note, auto_select_type
        }
    };
    return dispatch => {
        axios(options)
            .then(({ data }) => dispatch(successCreateBookingSet(data)))
            .catch((error) => dispatch(failedCreateBookingSet(error)));
    };
};

export const updateBookingSet = (id, bookingSet) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'put',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/bookingsets/${id}/`,
        data: bookingSet
    };
    return dispatch => {
        axios(options)
            .then(({ data }) => dispatch(successUpdateBookingSet(data)))
            .catch((error) => dispatch(failedUpdateBookingSet(error)));
    };
};

export const deleteBookingSet = (id) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'delete',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/bookingsets/${id}/`,
    };
    return dispatch => {
        axios(options)
            .then(({ data }) => dispatch(successDeleteBookingSet(data)))
            .catch((error) => dispatch(failedDeleteBookingSet(error)));
    };
};

export const resetBookingSetFlags = () => {
    return dispatch => dispatch(resetBookingSetFlagsAction());
};

export const saveStatusHistoryPuInfo = (bookingId) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/statushistory/create_with_pu_dates/`,
        data: {'bookingId': bookingId},
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successSaveStatusHistoryPuInfo(data)))
            .catch((error) => dispatch(failedSaveStatusHistoryPuInfo(error)));
};

export const updateClientEmployee = (clientEmployee) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'put',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/clientemployee/${clientEmployee.pk_id_client_emp}/`,
        data: clientEmployee,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successUpdateClientEmployee(data)))
            .catch((error) => dispatch(failedUpdateClientEmployee(error)));
};


export const getZohoTickets = (dmeid) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/get_all_zoho_tickets/?dmeid=${dmeid}`,
    };
    return dispatch => {
        dispatch(resetZohoTickets());
        axios(options)
            .then(({ data }) => dispatch(successGetZohoTickets(data.tickets)))
            .catch((error) => dispatch(failedGetZohoTickets(error)));
    };
};

export const getDMEClientProducts = (client_id) => {
    const token = localStorage.getItem('token');

    const options = {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'JWT ' + token
        },
        url: `${HTTP_PROTOCOL}://${API_HOST}/clientproducts/get/?client_id=${client_id}`,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetDMEClientProducts(data)))
            .catch((error) => dispatch(failedGetDMEClientProducts(error)) );
};


export const deleteClientProduct = (id) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'delete',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/clientproducts/${id}/delete`,
    };
    return dispatch => {
        axios(options)
            .then(({ data }) => dispatch(successDeleteClientProduct(id, data)))
            .catch((error) => dispatch(failedDeleteClientProduct(error)));
    };
};
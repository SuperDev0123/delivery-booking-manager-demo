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
    successCreateClientProduct,
    failedCreateClientProduct,
    successUpdateClientProduct,
    failedUpdateClientProduct,
    successGetAllErrors,
    failedGetAllErrors,
    successGetAllClientEmployees,
    failedGetAllClientEmployees,
    successCreateClientEmployee,
    failedCreateClientEmployee,
    successGetClientEmployee,
    failedGetClientEmployee,
    successGetPallets,  // Pallet start
    failedGetPallets,   // "
    successCreatePallet,// "
    failedCreatePallet, // Pallet end
} from '../actions/extraActions';
import { API_HOST, HTTP_PROTOCOL } from '../../config';

export const getPackageTypes = () => {
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
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

export const createBookingSet = (bookingIds, name, note, auto_select_type, lineHaulDate) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/bookingsets/`,
        data: {
            bookingIds, name, note, auto_select_type, line_haul_date: lineHaulDate
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

export const getAllClientEmployees = () => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/clientemployee/`,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetAllClientEmployees(data)))
            .catch((error) => dispatch(failedGetAllClientEmployees(error)));
};

export const getEmployeesByClient = (client_id) => {
    console.log('getEmployeesByClient', client_id);
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/clientemployee/get_client_employees?client_id=${client_id}`,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetAllClientEmployees(data)))
            .catch((error) => dispatch(failedGetAllClientEmployees(error)));
};


export const createClientEmployee = (clientEmployee) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/clientemployee/`,
        data: clientEmployee
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successCreateClientEmployee(data)))
            .catch((error) => dispatch(failedCreateClientEmployee(error)));
};


export const getClientEmployee = (id) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/clientemployee/${id}/`,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetClientEmployee(data)))
            .catch((error) => dispatch(failedGetClientEmployee(error)));
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
        url: `${HTTP_PROTOCOL}://${API_HOST}/clientproducts/`,
        params: {
            'clientId': client_id
        }
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
        url: `${HTTP_PROTOCOL}://${API_HOST}/clientproducts/${id}/`,
    };
    return dispatch => {
        axios(options)
            .then(({ data }) => dispatch(successDeleteClientProduct(id, data)))
            .catch((error) => dispatch(failedDeleteClientProduct(error)));
    };
};

export const createClientProduct = (clientProduct) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/clientproducts/`,
        data: clientProduct,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successCreateClientProduct(data)))
            .catch((error) => dispatch(failedCreateClientProduct(error)));
};

export const updateClientProduct = (clientProduct) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'put',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/clientproducts/${clientProduct.id}/`,
        data: clientProduct,
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successUpdateClientProduct(data)))
            .catch((error) => dispatch(failedUpdateClientProduct(error)));
};


export const getAllErrors = (pk_booking_id) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/errors/?pk_booking_id=${pk_booking_id}`,
    };

    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetAllErrors(data)))
            .catch((error) => dispatch(failedGetAllErrors(error)));
};

export const getPallets = () => {
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
        url: `${HTTP_PROTOCOL}://${API_HOST}/pallet/`,
    };

    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetPallets(data)))
            .catch((error) => dispatch(failedGetPallets(error)));
};

export const createPallet = (pallet) => {
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        url: `${HTTP_PROTOCOL}://${API_HOST}/pallet/`,
        data: pallet
    };

    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successCreatePallet(data)))
            .catch((error) => dispatch(failedCreatePallet(error)));
};

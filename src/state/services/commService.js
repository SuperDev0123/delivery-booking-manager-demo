import axios from 'axios';

import { setComms, failedGetComms, successUpdateComm, failedUpdateComm, setLocalFilter, successGetNotes, failedGetNotes, successCreateNote, failedCreateNote, successUpdateNote, failedUpdateNote } from '../actions/commActions';
import { API_HOST, HTTP_PROTOCOL } from '../../config';

export const getCommsWithBookingId = (bookingId, sortField='-id', columnFilters={}) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/comm/get_comms/`,
        params: {
            bookingId: bookingId,
            sortField: sortField,
            columnFilters: columnFilters,
        }
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(setComms(data)))
            .catch((error) => dispatch(failedGetComms(error)));
};

export const createComm = (comm) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/comm/create_comm/`,
        data: comm
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successUpdateComm(data)))
            .catch((error) => dispatch(failedUpdateComm(error)));
};

export const updateComm = (id, updatedComm) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'put',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/comm/` + id + '/update_comm/',
        data: updatedComm
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successUpdateComm(data)))
            .catch((error) => dispatch(failedUpdateComm(error)));
};

export const setGetCommsFilter = (key, value) => {
    return dispatch => dispatch(setLocalFilter(key, value));
};

export const getNotes = (commId) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/note/get_notes/`,
        params: {
            commId: commId,
        }
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetNotes(data)))
            .catch((error) => dispatch(failedGetNotes(error)));
};

export const createNote = (note) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/note/create_note/`,
        data: note
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successCreateNote(data)))
            .catch((error) => dispatch(failedCreateNote(error)));
};

export const updateNote = (id, updatedNote) => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'put',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/note/` + id + '/update_note/',
        data: updatedNote
    };
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successUpdateNote(data)))
            .catch((error) => dispatch(failedUpdateNote(error)));
};

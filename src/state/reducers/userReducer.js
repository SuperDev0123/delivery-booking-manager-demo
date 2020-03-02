import {
    SUCCESS_GET_USERS,
    FAILED_GET_USERS,
    SUCCESS_GET_USER,     
    FAILED_GET_USER,
    SUCCESS_CREATE_USER,
    FAILED_CREATE_USER,
    SUCCESS_UPDATE_USER,
    FAILED_UPDATE_USER,
    SUCCESS_DELETE_USER,
    FAILED_DELETE_USER,
    SET_FETCH_USERS_FLAG,
    SET_LOCAL_FILTER_CLIENTPK
} from '../constants/userConstants';

const defaultState = {
    allUsers: [],
    userDetails: {},
};

export const UserReducer = (state = defaultState, {
    payload,
    type,
    allUsers,
    userDetails,
    clientPK,
    needUpdateUsers
}) => {
    switch (type) {
        case SUCCESS_GET_USERS:
            return {
                ...state,
                allUsers: allUsers,
                needUpdateUsers: false,
            };
        case FAILED_GET_USERS:
        case SUCCESS_GET_USER:
            return {
                ...state,
                userDetails: userDetails
            };
        case FAILED_GET_USER:
        case SUCCESS_CREATE_USER:
            return {
                ...state,
                needUpdateUserDetails: true
            };
        case FAILED_CREATE_USER:
        case SUCCESS_UPDATE_USER:
            return {
                ...state,
                needUpdateUserDetails: true
            };
        case FAILED_UPDATE_USER:
        case SUCCESS_DELETE_USER:
            return {
                ...state,
                needUpdateUserDetails: true
            };
        case FAILED_DELETE_USER:
        case SET_FETCH_USERS_FLAG:
            return {
                ...state,
                needUpdateUsers: needUpdateUsers,
            };
        case SET_LOCAL_FILTER_CLIENTPK:
            return {
                ...state,
                clientPK: clientPK,
                needUpdateUsers: true,
                users: [],
            };
        default:
            return state;
    }
};

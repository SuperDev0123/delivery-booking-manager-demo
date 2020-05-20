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
    SET_LOCAL_FILTER_CLIENTPK,
    SUCCESS_GET_CREATED_FOR_INFOS,
    FAILED_GET_CREATED_FOR_INFOS
} from '../constants/userConstants';

const defaultState = {
    allUsers: [],
    userDetails: {},
    createdForInfos: [],
    errorMessage: null
};

export const UserReducer = (state = defaultState, {
    payload,
    type,
    allUsers,
    userDetails,
    clientPK,
    needUpdateUsers,
    errorMessage
}) => {
    switch (type) {
        case SUCCESS_GET_USERS:
            return {
                ...state,
                allUsers: allUsers,
                needUpdateUsers: false,
            };
        case SUCCESS_GET_USER:
            return {
                ...state,
                userDetails: userDetails
            };
        case SUCCESS_CREATE_USER:
            return {
                ...state,
                needUpdateUserDetails: true
            };
        case SUCCESS_UPDATE_USER:
            for (let user of allUsers) {
                if (user.id === userDetails.results.id) {
                    user.is_active = userDetails.results.is_active;
                }
            }

            return {
                ...state,
                allUsers,
                needUpdateUserDetails: true,
                needUpdateUsers: true,
            };
        case SUCCESS_DELETE_USER:
            return {
                ...state,
                needUpdateUserDetails: true
            };
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
        case SUCCESS_GET_CREATED_FOR_INFOS:
            return {
                ...state,
                createdForInfos: payload
            };
        case FAILED_GET_USERS:
        case FAILED_GET_USER:
        case FAILED_CREATE_USER:
        case FAILED_UPDATE_USER:
        case FAILED_DELETE_USER:
        case FAILED_GET_CREATED_FOR_INFOS:
            return {
                ...state,
                errorMessage: errorMessage,
            };
        default:
            return state;
    }
};

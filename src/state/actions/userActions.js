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
    SET_LOCAL_FILTER_CLIENTPK,
    SET_FETCH_USERS_FLAG
} from '../constants/userConstants';

export function successGetAllUsers(data) {
    return {
        type: SUCCESS_GET_USERS,
        allUsers: data.results,
    };
}

export function failedGetAllUsers(error) {
    return {
        type: FAILED_GET_USERS,
        errorMessage: 'Unable to get all Users. Error:' + error,
    };
}

export function successGetUser(data) {
    return {
        type: SUCCESS_GET_USER,
        userDetails: data.results[0],
    };
}

export function failedGetUser(error) {
    return {
        type: FAILED_GET_USER,
        errorMessage: 'Unable to get User. Error:' + error,
    };
}

export function successCreateUser(data) {
    return {
        type: SUCCESS_CREATE_USER,
        userDetails: data
    };
}

export function failedCreateUser(error) {
    return {
        type: FAILED_CREATE_USER,
        errorMessage: 'Unable to create user, error: ' + error,
    };
}

export function successUpdateUser(data) {
    return {
        type: SUCCESS_UPDATE_USER,
        userDetails: data
    };
}

export function failedUpdateUser(error) {
    return {
        type: FAILED_UPDATE_USER,
        errorMessage: 'Unable to create user, error: ' + error
    };
}

export function successDeleteUser(data) {
    return {
        type: SUCCESS_DELETE_USER,
        userDetails: data
    };
}

export function failedDeleteUser(error) {
    return {
        type: FAILED_DELETE_USER,
        errorMessage: 'Unable to create user, error: ' + error
    };
}

export function setLocalFilter(key, value) {
    if (key === 'clientPK') {
        return {
            type: SET_LOCAL_FILTER_CLIENTPK,
            clientPK: value,
        };
    }
}

export function setNeedUpdateUsersFlag(boolFlag) {
    return {
        type: SET_FETCH_USERS_FLAG,
        needUpdateUsers: boolFlag,
    };
}


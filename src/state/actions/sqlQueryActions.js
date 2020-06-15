import { 
    SUCCESS_GET_ALL_SQL_QUERIES,
    FAILED_GET_ALL_SQL_QUERIES,
    SUCCESS_GET_SQL_QUERY,     
    FAILED_GET_SQL_QUERY,
    SUCCESS_CREATE_SQL_QUERY,
    FAILED_CREATE_SQL_QUERY,
    SUCCESS_UPDATE_SQL_QUERY,
    FAILED_UPDATE_SQL_QUERY,
    SUCCESS_DELETE_SQL_QUERY,
    FAILED_DELETE_SQL_QUERY,
    SUCCESS_VALIDATE_SQL_QUERY,
    FAILED_VALIDATE_SQL_QUERY,
    SUCCESS_RERUNVALIDATE_SQL_QUERY,
    FAILED_RERUNVALIDATE_SQL_QUERY
} from '../constants/sqlQueryConstants';

export function successGetAllSqlQueries(data) {
    return {
        type: SUCCESS_GET_ALL_SQL_QUERIES,
        payload: data.results,
        needUpdateSqlQueries: false
    };
}

export function failedGetAllSqlQueries(error) {
    return {
        type: FAILED_GET_ALL_SQL_QUERIES,
        errorMessage: 'Error:' + error.response.data.message,
    };
}

export function successGetSqlQueryDetails(data) {
    return {
        type: SUCCESS_GET_SQL_QUERY,
        payload: data.result,
    };
}

export function failedGetSqlQueryDetails(error) {
    return {
        type: FAILED_GET_SQL_QUERY,
        errorMessage: 'Error:' + error.response.data,
    };
}

export function successCreateSqlQueryDetails(data) {
    return {
        type: SUCCESS_CREATE_SQL_QUERY,
        payload: data,
        needUpdateSqlQueries: true
    };
}

export function failedCreateSqlQueryDetails(error) {
    return {
        type: FAILED_CREATE_SQL_QUERY,
        errorMessage: 'Error: ' + JSON.stringify(error.response.data),
    };
}

export function successUpdateSqlQueryDetails(data) {
    return {
        type: SUCCESS_UPDATE_SQL_QUERY,
        payload: data.result
    };
}

export function failedUpdateSqlQueryDetails(error) {
    return {
        type: FAILED_UPDATE_SQL_QUERY,
        errorMessage: 'Error: ' + JSON.stringify(error.response.data),
    };
}

export function successDeleteSqlQueryDetails() {
    return {
        type: SUCCESS_DELETE_SQL_QUERY,
    };
}

export function failedDeleteSqlQueryDetails(error) {
    return {
        type: FAILED_DELETE_SQL_QUERY,
        errorMessage: 'Error: ' + JSON.stringify(error.response.data),
    };
}

export function successValidateSqlQueryDetails(data) {
    return {
        type: SUCCESS_VALIDATE_SQL_QUERY,
        queryResult: data.results,
        queryTables: data.tables,
        validSqlQueryDetails: (data.results) ? true : false
    };
}

export function failedValidateSqlQueryDetails(error) {
    return {
        type: FAILED_VALIDATE_SQL_QUERY,
        errorMessage: 'Error: ' + JSON.stringify(error.response.data),
    };
}

export function successRunUpdateSqlQueryDetails(data) {
    return {
        type: SUCCESS_RERUNVALIDATE_SQL_QUERY,
        payload: (data.results) ? true : false
    };
}

export function failedRunUpdateSqlQueryDetails(error) {
    return {
        type: FAILED_RERUNVALIDATE_SQL_QUERY,
        errorMessage: 'Error: ' + error,
    };
}

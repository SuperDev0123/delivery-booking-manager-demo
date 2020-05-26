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
        allSqlQueries: data.results,
        needUpdateSqlQueries: false
    };
}

export function failedGetAllSqlQueries(error) {
    return {
        type: FAILED_GET_ALL_SQL_QUERIES,
        errorMessage: 'Unable to get all email templates. Error:' + error,
    };
}

export function successGetSqlQueryDetails(data) {
    return {
        type: SUCCESS_GET_SQL_QUERY,
        sqlQueryDetails: data.results[0],
    };
}

export function failedGetSqlQueryDetails(error) {
    return {
        type: FAILED_GET_SQL_QUERY,
        errorMessage: 'Unable to get FP. Error:' + error,
    };
}

export function successCreateSqlQueryDetails(data) {
    return {
        type: SUCCESS_CREATE_SQL_QUERY,
        sqlQueryDetails: data,
        needUpdateSqlQueries: true
    };
}

export function failedCreateSqlQueryDetails(error) {
    return {
        type: FAILED_CREATE_SQL_QUERY,
        errorMessage: 'Unable to create fp, error: ' + error,
    };
}

export function successUpdateSqlQueryDetails(data) {
    return {
        type: SUCCESS_UPDATE_SQL_QUERY,
        sqlQueryDetails: data
    };
}

export function failedUpdateSqlQueryDetails(error) {
    return {
        type: FAILED_UPDATE_SQL_QUERY,
        errorMessage: 'Unable to create fp, error: ' + error
    };
}

export function successDeleteSqlQueryDetails(data) {
    return {
        type: SUCCESS_DELETE_SQL_QUERY,
        sqlQueryDetails: data
    };
}

export function failedDeleteSqlQueryDetails(error) {
    return {
        type: FAILED_DELETE_SQL_QUERY,
        errorMessage: 'Unable to create fp, error: ' + error
    };
}

export function successValidateSqlQueryDetails(data) {
    return {
        type: SUCCESS_VALIDATE_SQL_QUERY,
        queryResult: data.results,
        queryTables: data.tables,
        validSqlQueryDetails: (data.results)?true:false
    };
}

export function failedValidateSqlQueryDetails(error) {
    console.log('failedValidateSqlQueryDetails', error.response.data.message);
    return {
        type: FAILED_VALIDATE_SQL_QUERY,
        errorMessage: 'Unable to validate sql query, error: ' +  error.response.data.message,
    };
}

export function successRunUpdateSqlQueryDetails(data) {
    return {
        type: SUCCESS_RERUNVALIDATE_SQL_QUERY,
        rerunValidateSqlQueryDetails: (data.results)?true:false
    };
}

export function failedRunUpdateSqlQueryDetails(error) {
    return {
        type: FAILED_RERUNVALIDATE_SQL_QUERY,
        errorMessage: 'Unable to validate sql query, error: ' + error,
    };
}

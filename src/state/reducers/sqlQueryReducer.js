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

const defaultState = {
    allSqlQueries: [],
    sqlQueryDetails: {},
    needUpdateSqlQueries: false,
    errorMessage: ''
};

export const SqlQueryReducer = (state = defaultState, {
    type,
    payload,
    validSqlQueryDetails,
    queryResult,
    queryTables,
    errorMessage
}) => {
    switch (type) {
        case SUCCESS_GET_ALL_SQL_QUERIES:
            return {
                ...state,
                allSqlQueries: payload,
                needUpdateSqlQueries: false,
                errorMessage: null,
            };
        case SUCCESS_GET_SQL_QUERY:
            return {
                ...state,
                sqlQueryDetails: payload,
                errorMessage: null,
            };
        case SUCCESS_CREATE_SQL_QUERY:
            return {
                ...state,
                needUpdateSqlQueries: true,
                errorMessage: null,
            };
        case SUCCESS_UPDATE_SQL_QUERY:
            return {
                ...state,
                needUpdateSqlQueries: true,
                errorMessage: null,
            };
        case SUCCESS_DELETE_SQL_QUERY:
            return {
                ...state,
                needUpdateSqlQueries: true,
                errorMessage: null,
            };
        case SUCCESS_VALIDATE_SQL_QUERY:
            return {
                ...state,
                validSqlQueryDetails: validSqlQueryDetails,
                queryResult: queryResult,
                queryTables: queryTables,
                errorMessage: null,
            };
        case SUCCESS_RERUNVALIDATE_SQL_QUERY:
            return {
                ...state,
                rerunValidateSqlQueryDetails: payload,
            };
        case FAILED_RERUNVALIDATE_SQL_QUERY:
        case FAILED_GET_ALL_SQL_QUERIES:
        case FAILED_VALIDATE_SQL_QUERY:
        case FAILED_DELETE_SQL_QUERY:
        case FAILED_UPDATE_SQL_QUERY:
        case FAILED_CREATE_SQL_QUERY:
        case FAILED_GET_SQL_QUERY:
            return {
                ...state,
                errorMessage: errorMessage
            };
        default:
            return state;
    }
};

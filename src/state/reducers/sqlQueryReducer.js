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
    errorMessage: ''
};

export const SqlQueryReducer = (state = defaultState, {
    type,
    allSqlQueries,
    sqlQueryDetails,
    validSqlQueryDetails,
    queryResult,
    queryTables,
    rerunValidateSqlQueryDetails,
    errorMessage
}) => {
    switch (type) {
        case SUCCESS_GET_ALL_SQL_QUERIES:
            return {
                ...state,
                allSqlQueries: allSqlQueries,
                needUpdateSqlQueries: false
            };
        case FAILED_GET_ALL_SQL_QUERIES:
        case SUCCESS_GET_SQL_QUERY:
            return {
                ...state,
                sqlQueryDetails: sqlQueryDetails,
                errorMessage: errorMessage
            };
        case FAILED_GET_SQL_QUERY:
        case SUCCESS_CREATE_SQL_QUERY:
            return {
                ...state,
                needUpdateSqlQueries: true,
                errorMessage: errorMessage
            };
        case FAILED_CREATE_SQL_QUERY:
        case SUCCESS_UPDATE_SQL_QUERY:
            return {
                ...state,
                needUpdateSqlQueryDetails: true,
                errorMessage: errorMessage
            };
        case FAILED_UPDATE_SQL_QUERY:
        case SUCCESS_DELETE_SQL_QUERY:
            return {
                ...state,
                needUpdateSqlQueryDetails: true,
                errorMessage: errorMessage
            };
        case FAILED_DELETE_SQL_QUERY:
        case SUCCESS_VALIDATE_SQL_QUERY:
            return {
                ...state,
                validSqlQueryDetails: validSqlQueryDetails,
                queryResult: queryResult,
                queryTables: queryTables,
                errorMessage: errorMessage
            };
        case FAILED_VALIDATE_SQL_QUERY:
        case SUCCESS_RERUNVALIDATE_SQL_QUERY:
            return {
                ...state,
                rerunValidateSqlQueryDetails: rerunValidateSqlQueryDetails,
                errorMessage: errorMessage
            };
        case FAILED_RERUNVALIDATE_SQL_QUERY:
        default:
            return state;
    }
};

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
    sqlQueryDetails: {}
};

export const SqlQueryReducer = (state = defaultState, {
    payload,
    type,
    allSqlQueries,
    sqlQueryDetails,
    needUpdateSqlQueries,
    validSqlQueryDetails,
    queryResult,
    queryTables,
    rerunValidateSqlQueryDetails
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
                sqlQueryDetails: sqlQueryDetails
            };
        case FAILED_GET_SQL_QUERY:
        case SUCCESS_CREATE_SQL_QUERY:
            return {
                ...state,
                needUpdateSqlQueries: true,
            };
        case FAILED_CREATE_SQL_QUERY:
        case SUCCESS_UPDATE_SQL_QUERY:
            return {
                ...state,
                needUpdateSqlQueryDetails: true
            };
        case FAILED_UPDATE_SQL_QUERY:
        case SUCCESS_DELETE_SQL_QUERY:
            return {
                ...state,
                needUpdateSqlQueryDetails: true
            };
        case FAILED_DELETE_SQL_QUERY:
        case SUCCESS_VALIDATE_SQL_QUERY:
            return {
                ...state,
                validSqlQueryDetails: validSqlQueryDetails,
                queryResult: queryResult,
                queryTables: queryTables
            };
        case FAILED_VALIDATE_SQL_QUERY:
        case SUCCESS_RERUNVALIDATE_SQL_QUERY:
            return {
                ...state,
                rerunValidateSqlQueryDetails: rerunValidateSqlQueryDetails
            };
        case FAILED_RERUNVALIDATE_SQL_QUERY:
        default:
            return state;
    }
};

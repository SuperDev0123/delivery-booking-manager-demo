import { SUCCESS_GET_PACKAGETYPES, FAILED_GET_PACKAGETYPES, SUCCESS_GET_ALL_BOOKING_STATUS, FAILED_GET_ALL_BOOKING_STATUS, SUCCESS_SAVE_STATUS_STATUS, FAILED_SAVE_STATUS_STATUS, SUCCESS_GET_BOOKING_STATUS_HISTORY, FAILED_GET_BOOKING_STATUS_HISTORY, SUCCESS_GET_FPS, FAILED_GET_FPS, SUCCESS_GET_STATUS_ACTIONS, SUCCESS_GET_STATUS_DETAILS, FAILED_GET_STATUS_ACTIONS, FAILED_GET_STATUS_DETAILS, SUCCESS_CREATE_STATUS_DETAIL, SUCCESS_CREATE_STATUS_ACTION, FAILED_CREATE_STATUS_DETAIL, FAILED_CREATE_STATUS_ACTION, SUCCESS_GET_API_BCLS, FAILED_GET_API_BCLS } from '../constants/extraConstants';

const defaultState = {
    packageTypes: [],
    allBookingStatus: [],
    statusHistories: null,
    needUpdateStatusHistories: false,
    needUpdateStatusActions: false,
    needUpdateStatusDetails: false,
};

export const ExtraReducer = (state = defaultState, { type, packageTypes, allBookingStatus, statusHistory, statusHistories, errorMessage, allFPs, statusActions, statusDetails, apiBCLs }) => {
    switch (type) {
        case SUCCESS_GET_PACKAGETYPES:
            return {
                ...state,
                packageTypes: packageTypes,
            };
        case SUCCESS_GET_ALL_BOOKING_STATUS:
            return {
                ...state,
                allBookingStatus: allBookingStatus,
            };
        case SUCCESS_GET_BOOKING_STATUS_HISTORY:
            return {
                ...state,
                statusHistories: statusHistories,
                needUpdateStatusHistories: false,
            };
        case SUCCESS_SAVE_STATUS_STATUS:
            return {
                ...state,
                statusHistory: statusHistory,
                needUpdateStatusHistories: true,
            };
        case SUCCESS_GET_FPS:
            return {
                ...state,
                allFPs: allFPs,
            };
        case SUCCESS_GET_STATUS_ACTIONS:
            return {
                ...state,
                statusActions: statusActions,
                needUpdateStatusActions: false,
            };
        case SUCCESS_GET_STATUS_DETAILS:
            return {
                ...state,
                statusDetails: statusDetails,
                needUpdateStatusDetails: false,
            };
        case SUCCESS_CREATE_STATUS_DETAIL:
            return {
                ...state,
                needUpdateStatusDetails: true,
            };
        case SUCCESS_CREATE_STATUS_ACTION:
            return {
                ...state,
                needUpdateStatusActions: true,
            };
        case SUCCESS_GET_API_BCLS:
            return {
                ...state,
                apiBCLs: apiBCLs,
            };
        case FAILED_CREATE_STATUS_ACTION:
        case FAILED_CREATE_STATUS_DETAIL:
        case FAILED_GET_STATUS_DETAILS:
        case FAILED_GET_STATUS_ACTIONS:
        case FAILED_GET_FPS:
        case FAILED_SAVE_STATUS_STATUS:
        case FAILED_GET_BOOKING_STATUS_HISTORY:
        case FAILED_GET_PACKAGETYPES:
        case FAILED_GET_ALL_BOOKING_STATUS:
        case FAILED_GET_API_BCLS:
            return {
                ...state,
                errorMessage: errorMessage,
            };
        default:
            return state;
    }
};

import { SUCCESS_GET_PACKAGETYPES, FAILED_GET_PACKAGETYPES, SUCCESS_GET_ALL_BOOKING_STATUS, FAILED_GET_ALL_BOOKING_STATUS, SUCCESS_SAVE_STATUS_STATUS, FAILED_SAVE_STATUS_STATUS, SUCCESS_GET_BOOKING_STATUS_HISTORY, FAILED_GET_BOOKING_STATUS_HISTORY, SUCCESS_GET_FPS, FAILED_GET_FPS, SUCCESS_GET_STATUS_ACTIONS, SUCCESS_GET_STATUS_DETAILS, FAILED_GET_STATUS_ACTIONS, FAILED_GET_STATUS_DETAILS, SUCCESS_CREATE_STATUS_DETAIL, SUCCESS_CREATE_STATUS_ACTION, FAILED_CREATE_STATUS_DETAIL, FAILED_CREATE_STATUS_ACTION } from '../constants/extraConstants';

const defaultState = {
    packageTypes: [],
    allBookingStatus: [],
    statusHistories: null,
    needUpdateStatusHistories: false,
    needUpdateStatusActions: false,
    needUpdateStatusDetails: false,
};

export const ExtraReducer = (state = defaultState, { type, packageTypes, allBookingStatus, statusHistory, statusHistories, errorMessage, allFPs, statusActions, statusDetails }) => {
    switch (type) {
        case SUCCESS_GET_PACKAGETYPES:
            return {
                ...state,
                packageTypes: packageTypes,
            };
        case FAILED_GET_PACKAGETYPES:
            return {
                ...state,
                errorMessage: errorMessage,
            };
        case SUCCESS_GET_ALL_BOOKING_STATUS:
            return {
                ...state,
                allBookingStatus: allBookingStatus,
            };
        case FAILED_GET_ALL_BOOKING_STATUS:
            return {
                ...state,
                errorMessage: errorMessage,
            };
        case SUCCESS_GET_BOOKING_STATUS_HISTORY:
            return {
                ...state,
                statusHistories: statusHistories,
                needUpdateStatusHistories: false,
            };
        case FAILED_GET_BOOKING_STATUS_HISTORY:
            return {
                ...state,
                errorMessage: errorMessage,
            };
        case SUCCESS_SAVE_STATUS_STATUS:
            return {
                ...state,
                statusHistory: statusHistory,
                needUpdateStatusHistories: true,
            };
        case FAILED_SAVE_STATUS_STATUS:
            return {
                ...state,
                errorMessage: errorMessage,
            };
        case SUCCESS_GET_FPS:
            return {
                ...state,
                allFPs: allFPs,
            };
        case FAILED_GET_FPS:
            return {
                ...state,
                errorMessage: errorMessage,
            };
        case SUCCESS_GET_STATUS_ACTIONS:
            return {
                ...state,
                statusActions: statusActions,
                needUpdateStatusActions: false,
            };
        case FAILED_GET_STATUS_ACTIONS:
            return {
                ...state,
                errorMessage: errorMessage,
            };
        case SUCCESS_GET_STATUS_DETAILS:
            return {
                ...state,
                statusDetails: statusDetails,
                needUpdateStatusDetails: false,
            };
        case FAILED_GET_STATUS_DETAILS:
            return {
                ...state,
                errorMessage: errorMessage,
            };
        case SUCCESS_CREATE_STATUS_DETAIL:
            return {
                ...state,
                needUpdateStatusDetails: true,
            };
        case FAILED_CREATE_STATUS_DETAIL:
            return {
                ...state,
                errorMessage: errorMessage,
            };
        case SUCCESS_CREATE_STATUS_ACTION:
            return {
                ...state,
                needUpdateStatusActions: true,
            };
        case FAILED_CREATE_STATUS_ACTION:
            return {
                ...state,
                errorMessage: errorMessage,
            };
        default:
            return state;
    }
};

import { SUCCESS_GET_PACKAGETYPES, FAILED_GET_PACKAGETYPES, SUCCESS_GET_ALL_BOOKING_STATUS, FAILED_GET_ALL_BOOKING_STATUS, SUCCESS_SAVE_STATUS_STATUS, FAILED_SAVE_STATUS_STATUS, SUCCESS_GET_BOOKING_STATUS_HISTORY, FAILED_GET_BOOKING_STATUS_HISTORY } from '../constants/extraConstants';

const defaultState = {
    packageTypes: [],
    allBookingStatus: [],
    statusHistories: null,
    needUpdateStatusHistories: false,
};

export const ExtraReducer = (state = defaultState, { type, packageTypes, allBookingStatus, statusHistory, statusHistories, errorMessage }) => {
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
        default:
            return state;
    }
};

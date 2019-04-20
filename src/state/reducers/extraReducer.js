import { SUCCESS_GET_PACKAGETYPES, FAILED_GET_PACKAGETYPES, SUCCESS_GET_ALL_BOOKING_STATUS, FAILED_GET_ALL_BOOKING_STATUS } from '../constants/extraConstants';

const defaultState = {
    packageTypes: [],
    allBookingStatus: [],
};

export const ExtraReducer = (state = defaultState, { type, packageTypes, allBookingStatus, errorMessage }) => {
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
        default:
            return state;
    }
};

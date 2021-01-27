import {
    SUCCESS_GET_FP_COSTS,
    FAILED_GET_FP_COSTS,
    SUCCESS_GET_COST_OPTIONS,
    FAILED_GET_COST_OPTIONS,
    SUCCESS_GET_COST_OPTION_MAPS,
    FAILED_GET_COST_OPTION_MAPS,
    SUCCESS_GET_BOOKING_COST_OPTIONS,
    FAILED_GET_BOOKING_COST_OPTIONS,
} from '../constants/costConstants';

const defaultState = {
    allFPCosts: [],
    costOptions: [],
    costOptionMaps: [],
    bookingCostOptions: [],
    errorMessage: '',
};

export const CostReducer = (state = defaultState, { type, payload }) => {
    switch (type) {
        case SUCCESS_GET_FP_COSTS:
            return {
                ...state,
                allFPCosts: payload,
            };
        case SUCCESS_GET_COST_OPTIONS:
            return {
                ...state,
                costOptions: payload,
            };
        case SUCCESS_GET_COST_OPTION_MAPS:
            return {
                ...state,
                costOptionMaps: payload,
            };
        case SUCCESS_GET_BOOKING_COST_OPTIONS:
            return {
                ...state,
                bookingCostOptions: payload,
            };
        case FAILED_GET_FP_COSTS:
        case FAILED_GET_COST_OPTIONS:
        case FAILED_GET_COST_OPTION_MAPS:
        case FAILED_GET_BOOKING_COST_OPTIONS:
            return {
                ...state,
                errorMessage: payload,
            };
        default:
            return state;
    }
};

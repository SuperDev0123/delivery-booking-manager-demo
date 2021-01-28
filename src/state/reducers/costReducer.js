import {
    SUCCESS_GET_FP_COSTS,
    FAILED_GET_FP_COSTS,
    SUCCESS_GET_COST_OPTIONS,
    FAILED_GET_COST_OPTIONS,
    SUCCESS_GET_COST_OPTION_MAPS,
    FAILED_GET_COST_OPTION_MAPS,
    SUCCESS_GET_BOOKING_COST_OPTIONS,
    FAILED_GET_BOOKING_COST_OPTIONS,
    SUCCESS_CREATE_BOOKING_COST_OPTION,
    FAILED_CREATE_BOOKING_COST_OPTION,
    SUCCESS_UPDATE_BOOKING_COST_OPTION,
    FAILED_UPDATE_BOOKING_COST_OPTION,    
    SUCCESS_DELETE_BOOKING_COST_OPTION,
    FAILED_DELETE_BOOKING_COST_OPTION,
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
        case SUCCESS_CREATE_BOOKING_COST_OPTION:
            return {
                ...state,
                bookingCostOptions: [...state.bookingCostOptions, payload],
            };
        case SUCCESS_UPDATE_BOOKING_COST_OPTION: {
            const index = state.bookingCostOptions.findIndex(bookingCostOption => bookingCostOption.id === payload.id);
            const _bookingCostOptions = [...state.bookingCostOptions];
            _bookingCostOptions[index] = payload;

            return {
                ...state,
                bookingCostOptions: _bookingCostOptions,
            };
        }
        case SUCCESS_DELETE_BOOKING_COST_OPTION: {
            const index = state.bookingCostOptions.findIndex(bookingCostOption => bookingCostOption.id === payload.id);
            const _bookingCostOptions = [...state.bookingCostOptions];
            _bookingCostOptions.splice(index, 1);

            return {
                ...state,
                bookingCostOptions: _bookingCostOptions,
            };
        }
        case FAILED_GET_FP_COSTS:
        case FAILED_GET_COST_OPTIONS:
        case FAILED_GET_COST_OPTION_MAPS:
        case FAILED_GET_BOOKING_COST_OPTIONS:
        case FAILED_CREATE_BOOKING_COST_OPTION:
        case FAILED_UPDATE_BOOKING_COST_OPTION:
        case FAILED_DELETE_BOOKING_COST_OPTION:
            return {
                ...state,
                errorMessage: payload,
            };
        default:
            return state;
    }
};

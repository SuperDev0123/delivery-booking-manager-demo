import {
    SUCCESS_GET_COSTS,
    FAILED_GET_COSTS,
} from '../constants/costConstants';

const defaultState = {
    allCosts: [],
    errorMessage: '',
};

export const CostReducer = (state = defaultState, { type, payload }) => {
    switch (type) {
        case SUCCESS_GET_COSTS:
            return {
                ...state,
                allCosts: payload,
            };
        case FAILED_GET_COSTS:
            return {
                ...state,
                errorMessage: payload,
            };
        default:
            return state;
    }
};

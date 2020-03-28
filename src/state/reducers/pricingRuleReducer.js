import {
    SUCCESS_GET_PRICING_RULES,
    FAILED_GET_PRICING_RULES,
} from '../constants/pricingRuleConstants';

const defaultState = {
    allPricingRules: [],
    errorMessage: '',
};

export const PricingRuleReducer = (state = defaultState, { type, payload }) => {
    switch (type) {
        case SUCCESS_GET_PRICING_RULES:
            return {
                ...state,
                allPricingRules: payload,
            };
        case FAILED_GET_PRICING_RULES:
            return {
                ...state,
                errorMessage: payload,
            };
        default:
            return state;
    }
};

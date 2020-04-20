import {
    SUCCESS_GET_PRICING_RULES,
    FAILED_GET_PRICING_RULES,
} from '../constants/pricingRuleConstants';

export function successGetPricingRules(data) {
    return {
        type: SUCCESS_GET_PRICING_RULES,
        payload: data,
    };
}

export function failedGetPricingRules(error) {
    return {
        type: FAILED_GET_PRICING_RULES,
        payload: 'Unable to get files records. Error:' + error,
    };
}

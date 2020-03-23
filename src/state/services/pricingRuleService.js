import axios from 'axios';

import {
    successGetPricingRules,
    failedGetPricingRules,
} from '../actions/pricingRuleActions';
import { API_HOST, HTTP_PROTOCOL } from '../../config';

export const getAllPricingRules = () => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
        url: `${HTTP_PROTOCOL}://${API_HOST}/pricing_rules/get_all`,
    };
    
    return dispatch =>
        axios(options)
            .then(({ data }) => dispatch(successGetPricingRules(data)))
            .catch((error) => dispatch(failedGetPricingRules(error)));
};

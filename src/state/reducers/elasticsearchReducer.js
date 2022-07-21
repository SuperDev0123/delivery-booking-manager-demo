import { 
    GET_ADDRESSES_WITH_PREFIX_SUCCESS,
    GET_ADDRESSES_WITH_PREFIX_FAILED,
} from '../constants/elasticsearchConstants';

const defaultState = {
    puAddresses: [],
    deToAddresses: [],
    errorMessage: '',
};

export const ElasticsearchReducer = (state = defaultState, { type, payload }) => {
    switch (type) {
        case GET_ADDRESSES_WITH_PREFIX_SUCCESS:
            if (payload.src === 'puAddress') {
                return {
                    ...state,
                    puAddresses: payload.addresses.filter((address) => (address._source.postal_code < 1000 || address._source.postal_code >= 2000)),
                };
            } else if (payload.src === 'deToAddress') {
                return {
                    ...state,
                    deToAddresses: payload.addresses.filter((address) => (address._source.postal_code < 1000 || address._source.postal_code >= 2000)),
                };
            } 
            break;
        case GET_ADDRESSES_WITH_PREFIX_FAILED:
            return {
                ...state,
                errorMessage: payload,
            };
        default:
            return state;
    }
};
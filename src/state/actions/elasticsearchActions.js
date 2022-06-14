import { 
    GET_ADDRESSES_WITH_PREFIX_SUCCESS,
    GET_ADDRESSES_WITH_PREFIX_FAILED,
} from '../constants/elasticsearchConstants';

export function successGetAddressesWithPrefix(src, data) {
    return {
        type: GET_ADDRESSES_WITH_PREFIX_SUCCESS,
        payload: {
            addresses: data,
            src: src
        }
    };
}

export function failedGetAddressesWithPrefix(error) {
    return {
        type: GET_ADDRESSES_WITH_PREFIX_FAILED,
        payload: 'Unable to get addresses with prefix. Error:' + error,
    };
}

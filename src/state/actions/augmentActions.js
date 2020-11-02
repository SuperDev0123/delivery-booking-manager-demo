import { 
    SUCCESS_GET_ALL_AUGMENT_ADDRESS,
    FAILED_GET_ALL_AUGMENT_ADDRESS,
    SUCCESS_GET_AUGMENT_ADDRESS,     
    FAILED_GET_AUGMENT_ADDRESS,
    SUCCESS_CREATE_AUGMENT_ADDRESS,
    FAILED_CREATE_AUGMENT_ADDRESS,
    SUCCESS_UPDATE_AUGMENT_ADDRESS,
    FAILED_UPDATE_AUGMENT_ADDRESS,
    SUCCESS_DELETE_AUGMENT_ADDRESS,
    FAILED_DELETE_AUGMENT_ADDRESS,
} from '../constants/augmentConstants';

export function successGetAllAugmentAddress(data) {
    return {
        type: SUCCESS_GET_ALL_AUGMENT_ADDRESS,
        allAugmentAddress: data.results,
    };
}

export function failedGetAllAugmentAddress(error) {
    return {
        type: FAILED_GET_ALL_AUGMENT_ADDRESS,
        errorMessage: 'Unable to get all augment address rules. Error:' + error,
    };
}

export function successGetAugmentAddress(data) {
    return {
        type: SUCCESS_GET_AUGMENT_ADDRESS,
        augmentAddress: data.result,
    };
}

export function failedGetAugmentAddress(error) {
    return {
        type: FAILED_GET_AUGMENT_ADDRESS,
        errorMessage: 'Unable to get augment address rule. Error:' + error,
    };
}

export function successCreateAugmentAddress(data) {
    return {
        type: SUCCESS_CREATE_AUGMENT_ADDRESS,
        augmentAddress: data.results[0],
    };
}

export function failedCreateAugmentAddress(error) {
    return {
        type: FAILED_CREATE_AUGMENT_ADDRESS,
        errorMessage: 'Unable to create augment address rule, Error: ' + error,
    };
}

export function successUpdateAugmentAddress(data) {
    return {
        type: SUCCESS_UPDATE_AUGMENT_ADDRESS,
        augmentAddress: data
    };
}

export function failedUpdateAugmentAddress(error) {
    return {
        type: FAILED_UPDATE_AUGMENT_ADDRESS,
        errorMessage: 'Unable to create augment address rule, Error: ' + error
    };
}

export function successDeleteAugmentAddress(data) {
    return {
        type: SUCCESS_DELETE_AUGMENT_ADDRESS,
        augmentAddress: data
    };
}

export function failedDeleteAugmentAddress(error) {
    return {
        type: FAILED_DELETE_AUGMENT_ADDRESS,
        errorMessage: 'Unable to delete augment address rule, Error: ' + error
    };
}

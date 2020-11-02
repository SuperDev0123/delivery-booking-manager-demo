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

const defaultState = {
    successMessage: null,
    errorMessage: null,
    allAugmentAddress: [],
    augmentAddress: null,
    origin_word: '',
    augmented_word: '',
};

export const AugmentAddressReducer = (state = defaultState, {
    type,
    successMessage,
    errorMessage,
    allAugmentAddress,
    augmentAddress,
}) => {
    switch (type) {
        case SUCCESS_GET_ALL_AUGMENT_ADDRESS:
            return {
                ...state,
                successMessage: successMessage,
                allAugmentAddress: allAugmentAddress,
                errorMessage: null,
            };
        case SUCCESS_GET_AUGMENT_ADDRESS:
            return {
                ...state,
                augmentAddress: augmentAddress,
                errorMessage: null,
            };
        case SUCCESS_CREATE_AUGMENT_ADDRESS:
            return {
                ...state,
                augmentAddress: augmentAddress,
                errorMessage: null,
            };
        case SUCCESS_UPDATE_AUGMENT_ADDRESS:
            return {
                ...state,
                augmentAddress: augmentAddress,
                errorMessage: null,
            };
        case SUCCESS_DELETE_AUGMENT_ADDRESS:
            return {
                ...state,
                errorMessage: null,
            };
        case FAILED_GET_ALL_AUGMENT_ADDRESS:
        case FAILED_GET_AUGMENT_ADDRESS:
        case FAILED_CREATE_AUGMENT_ADDRESS:
        case FAILED_UPDATE_AUGMENT_ADDRESS:
        case FAILED_DELETE_AUGMENT_ADDRESS:
            return {
                ...state,
                errorMessage: errorMessage
            };
        default:
            return state;
    }
};

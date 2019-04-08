import { SUCCESS_GET_PACKAGETYPES, FAILED_GET_PACKAGETYPES } from '../constants/extraConstants';

const defaultState = {
    packageTypes: []
};

export const ExtraReducer = (state = defaultState, { type, packageTypes, errorMessage }) => {
    switch (type) {
        case SUCCESS_GET_PACKAGETYPES:
            return {
                ...state,
                packageTypes: packageTypes,
            };
        case FAILED_GET_PACKAGETYPES:
            return {
                ...state,
                errorMessage: errorMessage,
            };
        default:
            return state;
    }
};

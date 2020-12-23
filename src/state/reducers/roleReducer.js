import {
    SUCCESS_GET_ALL_ROLES,
    FAILED_GET_ALL_ROLES,
} from '../constants/roleConstants';

const defaultState = {
    roles: [],
    errorMessage: '',
};

export const RoleReducer = (state = defaultState, { type, payload, errorMessage }) => {
    switch (type) {        
        case SUCCESS_GET_ALL_ROLES:
            return {
                ...state,
                roles: payload,
                errorMessage: null,
            };
        case FAILED_GET_ALL_ROLES:
            return {
                ...state,
                errorMessage: errorMessage
            };
        default:
            return state;
    }
};

import {
    SUCCESS_GET_AVAILABILITIES,
    FAILED_GET_AVAILABILITIES,
} from '../constants/availabilityConstants';

const defaultState = {
    allAvailabilities: [],
    errorMessage: '',
};

export const AvailabilityReducer = (state = defaultState, { type, payload }) => {
    switch (type) {
        case SUCCESS_GET_AVAILABILITIES:
            return {
                ...state,
                allAvailabilities: payload,
            };
        case FAILED_GET_AVAILABILITIES:
            return {
                ...state,
                errorMessage: payload,
            };
        default:
            return state;
    }
};

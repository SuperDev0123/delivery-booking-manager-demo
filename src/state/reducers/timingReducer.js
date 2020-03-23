import {
    SUCCESS_GET_TIMINGS,
    FAILED_GET_TIMINGS,
} from '../constants/timingConstants';

const defaultState = {
    allTimings: [],
    errorMessage: '',
};

export const TimingReducer = (state = defaultState, { type, payload }) => {
    switch (type) {
        case SUCCESS_GET_TIMINGS:
            return {
                ...state,
                allTimings: payload,
            };
        case FAILED_GET_TIMINGS:
            return {
                ...state,
                errorMessage: payload,
            };
        default:
            return state;
    }
};

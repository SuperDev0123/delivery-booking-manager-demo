import {
    SUCCESS_GET_NUM_BOOKINGS,
    FAILED_GET_NUM_BOOKINGS,
} from '../constants/chartConstants';

const defaultState = {
    num_bookings_fp: [],
    errorMessage: '',
};

export const ChartReducer = (state = defaultState, { type, payload }) => {
    switch (type) {
        
        case SUCCESS_GET_NUM_BOOKINGS:
            console.log('SUCCESS_GET_NUM_BOOKINGS', payload);
            return {
                ...state,
                num_bookings_fp: payload,
            };
        case FAILED_GET_NUM_BOOKINGS:
            return {
                ...state,
                errorMessage: payload,
            };
        default:
            return state;
    }
};
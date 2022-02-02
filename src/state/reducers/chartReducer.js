import {
    SUCCESS_GET_NUM_BOOKINGS,
    FAILED_GET_NUM_BOOKINGS,
    SUCCESS_GET_NUM_BOOKINGS_PER_STATUS,
    FAILED_GET_NUM_BOOKINGS_PER_STATUS,
    SUCCESS_GET_NUM_ACTIVE_BOOKINGS_PER_CLIENT,
    FAILED_GET_NUM_ACTIVE_BOOKINGS_PER_CLIENT,
} from '../constants/chartConstants';

const defaultState = {
    num_bookings_fp: [],
    num_bookings_status:[],
    errorMessage: '',
};

export const ChartReducer = (state = defaultState, { type, payload }) => {
    switch (type) {
        
        case SUCCESS_GET_NUM_BOOKINGS:
            // console.log('SUCCESS_GET_NUM_BOOKINGS', payload);
            return {
                ...state,
                num_bookings_fp: payload,
            };
        case FAILED_GET_NUM_BOOKINGS:
            return {
                ...state,
                errorMessage: payload,
            };
        case SUCCESS_GET_NUM_BOOKINGS_PER_STATUS:
            // console.log('SUCCESS_GET_NUM_BOOKINGS_PER_STATUS', payload);
            return {
                ...state,
                num_bookings_status: payload,
            };
        case FAILED_GET_NUM_BOOKINGS_PER_STATUS:
            return {
                ...state,
                errorMessage: payload,
            };
        case SUCCESS_GET_NUM_ACTIVE_BOOKINGS_PER_CLIENT:
            // console.log('SUCCESS_GET_NUM_ACTIVE_BOOKINGS_PER_CLIENT', payload);
            return {
                ...state,
                num_active_bookings_per_client: payload,
            };
        case FAILED_GET_NUM_ACTIVE_BOOKINGS_PER_CLIENT:
            return {
                ...state,
                errorMessage: payload,
            };
        default:
            return state;
    }
};
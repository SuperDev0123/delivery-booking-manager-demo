import {
    SUCCESS_GET_VEHICLES,
    FAILED_GET_VEHICLES,
} from '../constants/vehicleConstants';

const defaultState = {
    vehicles: [],
    errorMessage: '',
};

export const VehicleReducer = (state = defaultState, { type, payload }) => {
    switch (type) {
        case SUCCESS_GET_VEHICLES:
            return {
                ...state,
                vehicles: payload,
            };
        case FAILED_GET_VEHICLES:
            return {
                ...state,
                errorMessage: payload,
            };
        default:
            return state;
    }
};

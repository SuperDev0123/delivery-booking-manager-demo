import {
    SUCCESS_GET_VEHICLES,
    FAILED_GET_VEHICLES,
} from '../constants/vehicleConstants';

const defaultState = {
    allVehicles: [],
    errorMessage: '',
};

export const VehicleReducer = (state = defaultState, { type, payload }) => {
    switch (type) {
        case SUCCESS_GET_VEHICLES:
            return {
                ...state,
                allVehicles: payload,
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

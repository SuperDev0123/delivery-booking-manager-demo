import {
    SUCCESS_GET_VEHICLES,
    FAILED_GET_VEHICLES,
} from '../constants/vehicleConstants';

export function successGetVehicles(data) {
    return {
        type: SUCCESS_GET_VEHICLES,
        payload: data.results,
    };
}

export function failedGetVehicles(error) {
    return {
        type: FAILED_GET_VEHICLES,
        payload: 'Unable to get files records. Error:' + error,
    };
}

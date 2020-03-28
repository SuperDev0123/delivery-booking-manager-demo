import {
    SUCCESS_GET_AVAILABILITIES,
    FAILED_GET_AVAILABILITIES,
} from '../constants/availabilityConstants';

export function successGetAvailabilities(data) {
    return {
        type: SUCCESS_GET_AVAILABILITIES,
        payload: data.results,
    };
}

export function failedGetAvailabilities(error) {
    return {
        type: FAILED_GET_AVAILABILITIES,
        payload: 'Unable to get files records. Error:' + error,
    };
}

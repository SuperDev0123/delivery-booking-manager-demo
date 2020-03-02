import { 
    SUCCESS_GET_ALL_CRON_OPTIONS,
    FAILED_GET_ALL_CRON_OPTIONS,
    SUCCESS_UPDATE_CRON_OPTION,
    FAILED_UPDATE_CRON_OPTION
} from '../constants/cronOptionConstants';

export function successGetAllCronOptions(data) {
    return {
        type: SUCCESS_GET_ALL_CRON_OPTIONS,
        allCronOptions: data.results,
        needUpdateCronOptions: false
    };
}

export function failedGetAllCronOptions(error) {
    return {
        type: FAILED_GET_ALL_CRON_OPTIONS,
        errorMessage: 'Unable to get all FPs. Error:' + error,
    };
}

export function successUpdateCronOption() {
    return {
        type: SUCCESS_UPDATE_CRON_OPTION,
        needUpdateCronOptions: true,
    };
}

export function failedUpdateCronOption(error) {
    return {
        type: FAILED_UPDATE_CRON_OPTION,
        errorMessage: 'Unable to get all FPs. Error:' + error,
    };
}

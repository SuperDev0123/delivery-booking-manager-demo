import {
    SUCCESS_GET_ALL_CRON_OPTIONS,
    FAILED_GET_ALL_CRON_OPTIONS,
    SUCCESS_UPDATE_CRON_OPTION,
    FAILED_UPDATE_CRON_OPTION
} from '../constants/cronOptionConstants';

const defaultState = {
    allCronOptions: [],
    needUpdateCronOptions: false
};

export const CronOptionReducer = (state = defaultState, {
    type,
    allCronOptions
}) => {
    switch (type) {
        case SUCCESS_GET_ALL_CRON_OPTIONS:
            return {
                ...state,
                allCronOptions: allCronOptions,
                needUpdateCronOptions: false
            };
        case FAILED_GET_ALL_CRON_OPTIONS:
        case SUCCESS_UPDATE_CRON_OPTION:
            return {
                ...state,
                needUpdateCronOptions: true
            };
        case FAILED_UPDATE_CRON_OPTION:
        default:
            return state;
    }
};

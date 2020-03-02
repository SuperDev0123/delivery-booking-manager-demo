import {
    SUCCESS_GET_ALL_EMAIL_TEMPLATES,
    FAILED_GET_ALL_EMAIL_TEMPLATES,
    SUCCESS_GET_EMAIL_TEMPLATE,     
    FAILED_GET_EMAIL_TEMPLATE,
    SUCCESS_CREATE_EMAIL_TEMPLATE,
    FAILED_CREATE_EMAIL_TEMPLATE,
    SUCCESS_UPDATE_EMAIL_TEMPLATE,
    FAILED_UPDATE_EMAIL_TEMPLATE,
    SUCCESS_DELETE_EMAIL_TEMPLATE,
    FAILED_DELETE_EMAIL_TEMPLATE
} from '../constants/emailTemplateConstants';

const defaultState = {
    allEmailTemplates: [],
    emailTemplateDetails: {}
};

export const EmailTemplateReducer = (state = defaultState, {
    payload,
    type,
    allEmailTemplates,
    emailTemplateDetails
}) => {
    switch (type) {
        case SUCCESS_GET_ALL_EMAIL_TEMPLATES:
            return {
                ...state,
                allEmailTemplates: allEmailTemplates
            };
        case FAILED_GET_ALL_EMAIL_TEMPLATES:
        case SUCCESS_GET_EMAIL_TEMPLATE:
            return {
                ...state,
                emailTemplateDetails: emailTemplateDetails
            };
        case FAILED_GET_EMAIL_TEMPLATE:
        case SUCCESS_CREATE_EMAIL_TEMPLATE:
            return {
                ...state,
                needUpdateFpDetails: true
            };
        case FAILED_CREATE_EMAIL_TEMPLATE:
        case SUCCESS_UPDATE_EMAIL_TEMPLATE:
            return {
                ...state,
                needUpdateFpDetails: true
            };
        case FAILED_UPDATE_EMAIL_TEMPLATE:
        case SUCCESS_DELETE_EMAIL_TEMPLATE:
            return {
                ...state,
                needUpdateFpDetails: true
            };
        case FAILED_DELETE_EMAIL_TEMPLATE:
        default:
            return state;
    }
};

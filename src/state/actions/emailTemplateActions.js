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

export function successGetAllEmailTemplates(data) {
    return {
        type: SUCCESS_GET_ALL_EMAIL_TEMPLATES,
        allEmailTemplates: data.results,
    };
}

export function failedGetAllEmailTemplates(error) {
    return {
        type: FAILED_GET_ALL_EMAIL_TEMPLATES,
        errorMessage: 'Unable to get all email templates. Error:' + error,
    };
}

export function successGetEmailTemplateDetails(data) {
    return {
        type: SUCCESS_GET_EMAIL_TEMPLATE,
        emailTemplateDetails: data.results[0],
    };
}

export function failedGetEmailTemplateDetails(error) {
    return {
        type: FAILED_GET_EMAIL_TEMPLATE,
        errorMessage: 'Unable to get FP. Error:' + error,
    };
}

export function successCreateEmailTemplateDetails(data) {
    return {
        type: SUCCESS_CREATE_EMAIL_TEMPLATE,
        emailTemplateDetails: data
    };
}

export function failedCreateEmailTemplateDetails(error) {
    return {
        type: FAILED_CREATE_EMAIL_TEMPLATE,
        errorMessage: 'Unable to create fp, error: ' + error,
    };
}

export function successUpdateEmailTemplateDetails(data) {
    return {
        type: SUCCESS_UPDATE_EMAIL_TEMPLATE,
        emailTemplateDetails: data
    };
}

export function failedUpdateEmailTemplateDetails(error) {
    return {
        type: FAILED_UPDATE_EMAIL_TEMPLATE,
        errorMessage: 'Unable to create fp, error: ' + error
    };
}

export function successDeleteEmailTemplateDetails(data) {
    return {
        type: SUCCESS_DELETE_EMAIL_TEMPLATE,
        emailTemplateDetails: data
    };
}

export function failedDeleteEmailTemplateDetails(error) {
    return {
        type: FAILED_DELETE_EMAIL_TEMPLATE,
        errorMessage: 'Unable to create fp, error: ' + error
    };
}

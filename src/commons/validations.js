import _ from 'lodash';
import moment from 'moment';

const validateEmail = (email) => {
    let lastAtPos = email.lastIndexOf('@');
    let lastDotPos = email.lastIndexOf('.');
    let formIsValid = true;

    if (!(lastAtPos < lastDotPos && lastAtPos > 0 && email.indexOf('@@') == -1 && lastDotPos > 2 && (email.length - lastDotPos) > 2)) {
        formIsValid = false;
    }

    return formIsValid;
};

const isFormValid = (formName, formFields) => {
    if (formName === 'booking') {
        if (_.isEmpty(formFields['b_client_name']) || _.isNull(formFields['b_client_name'])) {
            return 'Please select client name.';
        } 
        if (formFields['b_client_name'].length > 35) {
            return 'Client name is too long. Need to be shorter than 36 characters';
        } 
        if (!_.isEmpty(formFields['puCompany']) && formFields['puCompany'].length > 40) {
            return 'PickUp Entity is too long. Need to be shorter than 40 characters';
        } 
        if (!_.isEmpty(formFields['deToCompanyName']) && formFields['deToCompanyName'].length > 40) {
            return 'Delivery Entity is too long. Need to be shorter than 40 characters';
        } 
        if (!_.isEmpty(formFields['pu_Address_Street_1']) && formFields['pu_Address_Street_1'].length > 40) {
            return 'PU Street 1 is too long. Need to be shorter than 40 characters';
        } 
        if (!_.isEmpty(formFields['pu_Address_street_2']) && formFields['pu_Address_street_2'].length > 40) {
            return 'PU Street 2 is too long. Need to be shorter than 40 characters';
        } 
        if (!_.isEmpty(formFields['de_To_Address_Street_1']) && formFields['de_To_Address_Street_1'].length > 40) {
            return 'DE Street 1 is too long. Need to be shorter than 40 characters';
        } 
        if (!_.isEmpty(formFields['de_To_Address_Street_2']) && formFields['de_To_Address_Street_2'].length > 40) {
            return 'DE Street 2 is too long. Need to be shorter than 40 characters';
        } 
        if (!_.isEmpty(formFields['pu_Contact_F_L_Name']) && formFields['pu_Contact_F_L_Name'].length > 50) {
            return 'PU Contact is too long. Need to be shorter than 50 characters';
        } 
        if (!_.isEmpty(formFields['de_to_Contact_F_LName']) && formFields['de_to_Contact_F_LName'].length > 50) {
            return 'DE Contact is too long. Need to be shorter than 50 characters';
        }
        if (!_.isEmpty(formFields['pu_Phone_Main']) && formFields['pu_Phone_Main'].length > 25) {
            return 'PU Contact is too long. Need to be shorter than 25 characters';
        } 
        if (!_.isEmpty(formFields['de_to_Phone_Main']) && formFields['de_to_Phone_Main'].length > 25) {
            return 'DE Contact is too long. Need to be shorter than 25 characters';
        }
        if (!_.isEmpty(formFields['pu_Email']) && formFields['pu_Email'].length > 35) {
            return 'PU Email is too long. Need to be shorter than 35 characters';
        } 
        if (!_.isEmpty(formFields['de_Email']) && formFields['de_Email'].length > 35) {
            return 'DE Email is too long. Need to be shorter than 35 characters';
        }
        if (!_.isEmpty(formFields['pu_Email']) && !validateEmail(formFields['pu_Email'])) {
            return 'PU Email is not correct';
        } 
        if (!_.isEmpty(formFields['de_Email']) && !validateEmail(formFields['de_Email'])) {
            return 'DE Email is not correct';
        }
        if ((!_.isNull(formFields['vx_fp_pu_eta_time']) && moment(formFields['vx_fp_pu_eta_time'], 'YYYY-MM-DD hh:nn-ss').isValid() === false) ||
        (_.isUndefined(formFields['vx_fp_pu_eta_time']))) {
            return 'PU ETA is not valid, please input correct timestamp';
        } 
        if ((!_.isNull(formFields['vx_fp_del_eta_time']) && moment(formFields['vx_fp_del_eta_time'], 'YYYY-MM-DD hh:nn-ss').isValid() === false) ||
        (_.isUndefined(formFields['vx_fp_del_eta_time']))) {
            return 'PU ETA is not valid, please input correct timestamp';
        }
        if ((!_.isNull(formFields['s_20_Actual_Pickup_TimeStamp']) 
            && moment(formFields['s_20_Actual_Pickup_TimeStamp'], 'YYYY-MM-DD hh:nn-ss').isValid() === false) 
            || (_.isUndefined(formFields['s_20_Actual_Pickup_TimeStamp']))) {
            return 'PU Actual timestamp is not valid, please input correct timestamp';
        } 
        if ((!_.isNull(formFields['vx_fp_del_eta_time']) 
            && moment(formFields['vx_fp_del_eta_time'], 'YYYY-MM-DD hh:nn-ss').isValid() === false) 
            || (_.isUndefined(formFields['vx_fp_del_eta_time']))) {
            return 'DE Actual timestamp is not valid, please input correct timestamp';
        }
        if (!_.isEmpty(formFields['pu_pickup_instructions_address']) && formFields['pu_pickup_instructions_address'].length > 100) {
            return 'PU Instruction is too long. Need to be shorter than 100 characters';
        } 
        if (!_.isEmpty(formFields['de_to_PickUp_Instructions_Address']) && formFields['de_to_PickUp_Instructions_Address'].length > 100) {
            return 'DE Instruction is too long. Need to be shorter than 100 characters';
        }
    }

    return 'valid';
};

module.exports = {
    isFormValid,
    validateEmail,
};
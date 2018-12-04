import { SET_WAREHOUSES, FAILED_GET_WAREHOUSES } from '../constants/warehouseConstants';

export function setWarehouses(warehouses) {
    return {
        type: SET_WAREHOUSES,
        warehouses
    };
}

export function failedGetWarehouses(error) {
    console.log('Error: ', error);
    return {
        type: FAILED_GET_WAREHOUSES,
        errorMessage: 'Unable to fetch warehouses.'
    };
}
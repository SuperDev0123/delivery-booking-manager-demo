import { SET_WAREHOUSES, FAILED_GET_WAREHOUSES } from '../constants/warehouseConstants';

const defaultState = {
    warehouses: [],
    errorMessage: null,
};

export const WarehouseReducer = (state = defaultState, { type, errorMessage, warehouses }) => {
    switch (type) {
        case SET_WAREHOUSES:
            return { 
                ...state, 
                warehouses: warehouses
            };
        case FAILED_GET_WAREHOUSES:
            return { 
                ...state, 
                errorMessage: errorMessage 
            };
        default:
            return state;
    }
};

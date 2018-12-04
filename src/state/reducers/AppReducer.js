import { combineReducers } from 'redux';

import { AuthReducer } from './authReducer';
import { BookingReducer } from './bookingReducer';
import { WarehouseReducer } from './warehouseReducer';

export const AppReducer = combineReducers({
    auth: AuthReducer,
    booking: BookingReducer,
    warehouse: WarehouseReducer,
});
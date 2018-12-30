import { combineReducers } from 'redux';

import { AuthReducer } from './authReducer';
import { BookingReducer } from './bookingReducer';
import { BookingLineReducer } from './bookingLineReducer';
import { WarehouseReducer } from './warehouseReducer';

export const AppReducer = combineReducers({
    auth: AuthReducer,
    booking: BookingReducer,
    bookingLine: BookingLineReducer,
    warehouse: WarehouseReducer,
});

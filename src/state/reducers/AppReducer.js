import { combineReducers } from 'redux';

import { AuthReducer } from './authReducer';
import { BookingReducer } from './bookingReducer';
import { BookingLineReducer } from './bookingLineReducer';
import { BookingLineDetailReducer } from './bookingLineDetailReducer';
import { WarehouseReducer } from './warehouseReducer';
import { CommReducer } from './commReducer';
import { ExtraReducer } from './extraReducer';

export const AppReducer = combineReducers({
    auth: AuthReducer,
    booking: BookingReducer,
    bookingLine: BookingLineReducer,
    bookingLineDetail: BookingLineDetailReducer,
    warehouse: WarehouseReducer,
    comm: CommReducer,
    extra: ExtraReducer,
});

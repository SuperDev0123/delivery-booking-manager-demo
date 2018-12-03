import { combineReducers } from 'redux';

import { AuthReducer } from './authReducer';
import { BookingReducer } from './bookingReducer';

export const AppReducer = combineReducers({
    auth: AuthReducer,
    booking: BookingReducer,
});
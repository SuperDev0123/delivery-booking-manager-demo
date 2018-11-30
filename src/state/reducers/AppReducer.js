import { combineReducers } from 'redux';

import { FetchZipCodesReducer } from './FetchZipCodesReducer';
import { AuthReducer } from './authReducer';

export const AppReducer = combineReducers({
    zipCodes: FetchZipCodesReducer,
    auth: AuthReducer
});
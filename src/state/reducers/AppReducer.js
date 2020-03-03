import { combineReducers } from 'redux';

import { AuthReducer } from './authReducer';
import { BookingReducer } from './bookingReducer';
import { BookingLineReducer } from './bookingLineReducer';
import { BookingLineDetailReducer } from './bookingLineDetailReducer';
import { WarehouseReducer } from './warehouseReducer';
import { CommReducer } from './commReducer';
import { ReportReducer } from './reportReducer';
import { ExtraReducer } from './extraReducer';
import { BokReducer } from './bokReducer';
import { FpReducer } from './fpReducer';
import { SqlQueryReducer } from './sqlQueryReducer';
import { EmailTemplateReducer } from './emailTemplateReducer';
import { UserReducer } from './userReducer';
import { CronOptionReducer } from './cronOptionReducer';


export const AppReducer = combineReducers({
    auth: AuthReducer,
    booking: BookingReducer,
    bookingLine: BookingLineReducer,
    bookingLineDetail: BookingLineDetailReducer,
    warehouse: WarehouseReducer,
    comm: CommReducer,
    report: ReportReducer,
    extra: ExtraReducer,
    bok: BokReducer,
    fp: FpReducer,
    sqlQuery: SqlQueryReducer,
    emailTemplate: EmailTemplateReducer,
    user: UserReducer,
    cronOption: CronOptionReducer
});

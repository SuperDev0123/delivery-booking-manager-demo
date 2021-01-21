import { combineReducers } from 'redux';

import { AuthReducer } from './authReducer';
import { BookingReducer } from './bookingReducer';
import { BookingLineReducer } from './bookingLineReducer';
import { BookingLineDetailReducer } from './bookingLineDetailReducer';
import { WarehouseReducer } from './warehouseReducer';
import { ReportReducer } from './reportReducer';
import { ExtraReducer } from './extraReducer';
import { BokReducer } from './bokReducer';
import { FileReducer } from './fileReducer';
import { FpReducer } from './fpReducer';
import { SqlQueryReducer } from './sqlQueryReducer';
import { EmailTemplateReducer } from './emailTemplateReducer';
import { UserReducer } from './userReducer';
import { CronOptionReducer } from './cronOptionReducer';
import { VehicleReducer } from './vehicleReducer';
import { TimingReducer } from './timingReducer';
import { AvailabilityReducer } from './availabilityReducer';
import { CostReducer } from './costReducer';
import { PricingRuleReducer } from './pricingRuleReducer';
import { UrlAdminReducer } from './urlAdminReducer';
import { ChartReducer } from './chartReducer';
import { ClientRasReducer } from './clientRasReducer';
import { AugmentAddressReducer } from './augmentAddressReducer';
import { ClientReducer } from './clientReducer';
import { RoleReducer } from './roleReducer';

export const AppReducer = combineReducers({
    auth: AuthReducer,
    booking: BookingReducer,
    bookingLine: BookingLineReducer,
    bookingLineDetail: BookingLineDetailReducer,
    warehouse: WarehouseReducer,
    report: ReportReducer,
    extra: ExtraReducer,
    bok: BokReducer,
    files: FileReducer,
    fp: FpReducer,
    sqlQuery: SqlQueryReducer,
    emailTemplate: EmailTemplateReducer,
    user: UserReducer,
    cronOption: CronOptionReducer,
    vehicle: VehicleReducer,
    timing: TimingReducer,
    availability: AvailabilityReducer,
    cost: CostReducer,
    pricingRule: PricingRuleReducer,
    url: UrlAdminReducer,
    chart: ChartReducer,
    clientRas: ClientRasReducer,
    augment: AugmentAddressReducer,
    client: ClientReducer,
    role: RoleReducer,
});

import React, { Fragment } from 'react';
import { BrowserRouter, Route, Switch,Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';

// Routes
import { PrivateRoute } from '../shared/PrivateRoute/PrivateRoute';
import { AdminPrivateRoute } from '../shared/AdminPrivateRoute/AdminPrivateRoute';

// User pages
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import BookingPage from '../pages/BookingPage';
import BookingLinesPage from '../pages/BookingLinesPage';
import BookingLineDetailsPage from '../pages/BookingLineDetailsPage';
import AllBookingsPage from '../pages/AllBookingsPage';
import BookingSetsPage from '../pages/BookingSets/BookingSetsList';
import UploadPage from '../pages/UploadPage';
import CommPage from '../pages/CommPage';
import PodsPage from '../pages/PodsPage';
import ReportPage from '../pages/report/ReportPage';
import BokPage from '../pages/BokPage';
import FilesPage from '../pages/FilesPage';
import ZohoPage from '../pages/ZohoPage';
import ZohoDetailsPage from '../pages/ZohoDetailsPage';

// Admin pages
import Main from '../pages/admin/Main';
import Login from '../pages/admin/views/Login';
import Dashboard from '../pages/admin/views/Dashboard';
import EmailTemplates from '../pages/admin/views/EmailTemplates/EmailTemplates';
import AddEmailTemplates from '../pages/admin/views/EmailTemplates/AddEmailTemplates';
import EditEmailTemplates from '../pages/admin/views/EmailTemplates/EditEmailTemplates';
import Users from '../pages/admin/views/Users/Users';
import AddUser from '../pages/admin/views/Users/AddUser';
import EditUser from '../pages/admin/views/Users/EditUser';
import CronOptions from '../pages/admin/views/CronOptions/CronOptions';
import FreightProviders from '../pages/admin/views/FreightProviders/FreightProviders';
import AddFreightProviders from '../pages/admin/views/FreightProviders/AddFreightProviders';
import EditFreightProviders from '../pages/admin/views/FreightProviders/EditFreightProviders';
import SqlQueries from '../pages/admin/views/SqlQueries';
import SqlQueriesAction from '../pages/admin/views/SqlQueries/SqlQueriesAction';
import PricingOnlyList from '../pages/admin/views/PricingOnly/List';
import PricingOnlyUpload from '../pages/admin/views/PricingOnly/Upload';
import PricingRuleList from '../pages/admin/views/PricingRule/List';
import PricingRuleUpload from '../pages/admin/views/PricingRule/Upload';
import PricingRuleStatus from '../pages/admin/views/PricingRule/Status';
import Vehicles from '../pages/admin/views/Vehicles/Vehicles';
import Timings from '../pages/admin/views/Timings/Timings';
import Availabilities from '../pages/admin/views/Availabilities/Availabilities';
import Costs from '../pages/admin/views/Costs/Costs';
import Clients from '../pages/admin/views/Clients/Clients';

import CustomerLogin from '../pages/admin/customerdashboard/Login';
import CustomerDashboard from '../pages/admin/customerdashboard/Dashboard';
import ClientRas from '../pages/admin/customerdashboard/ClientRas';
import ClientRasAction from '../pages/admin/customerdashboard/ClientRas/ClientRasAction';
export const AppRouter = () => (
    <BrowserRouter history={createBrowserHistory()}>
        <Fragment>
            <Header />
            <Switch>
                <Route exact path='/' component={HomePage} />
                <Route exact path='/home' component={HomePage} />
                <Route exact path='/bok' component={BokPage} />
                <Route exact path='/files' component={FilesPage} />
                <Route exact path='/login' component={LoginPage} />
                <Route exact path='/forgot-password' component={ForgotPasswordPage} />
                <Route path='/reset-password' component={ResetPasswordPage} />
                <PrivateRoute exact path='/booking' component={BookingPage} />
                <PrivateRoute exact path='/bookinglines' component={BookingLinesPage} />
                <PrivateRoute exact path='/bookinglinedetails' component={BookingLineDetailsPage} />
                <PrivateRoute exact path='/allbookings' component={AllBookingsPage} />
                <PrivateRoute exact path='/bookingsets' component={BookingSetsPage} />
                <PrivateRoute exact path='/upload' component={UploadPage} />
                <PrivateRoute exact path='/comm' component={CommPage} />
                <PrivateRoute exact path='/pods' component={PodsPage} />
                <PrivateRoute exact path='/zoho' component={ZohoPage} />
                <PrivateRoute exact path='/zohodetails' component={ZohoDetailsPage} />
                <PrivateRoute exact path='/reports' component={ReportPage} />
                <Main>
                    <Route exact path='/admin' component={ Login } />
                    <Route exact path='/admin/login' component={ Login} />
                    <AdminPrivateRoute exact path='/admin/dashboard' component={Dashboard} />
                    <AdminPrivateRoute exact path='/admin/users' component={Users} />
                    <AdminPrivateRoute exact path='/admin/users/add' component={AddUser} />
                    <AdminPrivateRoute exact path='/admin/users/edit/:id' component={EditUser} />
                    <AdminPrivateRoute exact path='/admin/emails' component={EmailTemplates} />
                    <AdminPrivateRoute exact path='/admin/emails/add' component={AddEmailTemplates} />
                    <AdminPrivateRoute exact path='/admin/emails/edit/:id' component={EditEmailTemplates} />
                    <AdminPrivateRoute exact path='/admin/sqlqueries' component={SqlQueries} />
                    <AdminPrivateRoute exact path='/admin/sqlqueries/add' component={SqlQueriesAction} />
                    <AdminPrivateRoute exact path='/admin/sqlqueries/edit/:id' component={SqlQueriesAction} />
                    <AdminPrivateRoute exact path='/admin/sqlqueries/duplicate/:id' component={SqlQueriesAction} />
                    <AdminPrivateRoute exact path='/admin/crons' component={CronOptions} />
                    <AdminPrivateRoute exact path='/admin/providers' component={FreightProviders} />
                    <AdminPrivateRoute exact path='/admin/providers/add' component={AddFreightProviders} />
                    <AdminPrivateRoute exact path='/admin/providers/edit/:id' component={EditFreightProviders} />
                    <AdminPrivateRoute exact path='/admin/pricing-only' component={PricingOnlyList} />
                    <AdminPrivateRoute exact path='/admin/pricing-only/upload' component={PricingOnlyUpload} />
                    <AdminPrivateRoute exact path='/admin/vehicles' component={Vehicles} />
                    <AdminPrivateRoute exact path='/admin/timings' component={Timings} />
                    <AdminPrivateRoute exact path='/admin/availabilities' component={Availabilities} />
                    <AdminPrivateRoute exact path='/admin/costs' component={Costs} />
                    <AdminPrivateRoute exact path='/admin/pricing-rule' component={PricingRuleList} />
                    <AdminPrivateRoute exact path='/admin/pricing-rule/upload' component={PricingRuleUpload} />
                    <AdminPrivateRoute exact path='/admin/pricing-rule/status' component={PricingRuleStatus} />
                    <AdminPrivateRoute exact path='/admin/clients' component={Clients} />

                    <Route exact path='/customerdashboard' component={ CustomerLogin } />
                    <Route exact path='/customerdashboard/login' component={ CustomerLogin} />
                    <AdminPrivateRoute exact path='/customerdashboard/dashboard' component={CustomerDashboard} />
                    <AdminPrivateRoute exact path='/customerdashboard/client-ras' component={ClientRas} />
                    <AdminPrivateRoute exact path='/customerdashboard/client-ras/add' component={ClientRasAction} />
                    <AdminPrivateRoute exact path='/customerdashboard/client-ras/edit/:id' component={ClientRasAction} />
                    <AdminPrivateRoute exact path='/customerdashboard/client-ras/duplicate/:id' component={ClientRasAction} />
                </Main>

                <Redirect to='/' />
            </Switch>
            <Footer />
        </Fragment>
    </BrowserRouter>
);

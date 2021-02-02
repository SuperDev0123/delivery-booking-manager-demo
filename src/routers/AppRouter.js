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
import BokPricePage from '../pages/customer/BokPricePage';
import BokStatusPage from '../pages/customer/BokStatusPage';
import BookingPage from '../pages/BookingPage';
import BookingLinesPage from '../pages/BookingLinesPage';
import BookingLineDetailsPage from '../pages/BookingLineDetailsPage';
import AllBookingsPage from '../pages/AllBookingsPage';
import BookingSetsPage from '../pages/BookingSets/BookingSetsList';
import UploadPage from '../pages/UploadPage';
import PodsPage from '../pages/PodsPage';
import ReportPage from '../pages/report/ReportPage';
import BokPage from '../pages/BokPage';
import FilesPage from '../pages/FilesPage';
import ZohoPage from '../pages/ZohoPage';
import ZohoDetailsPage from '../pages/ZohoDetailsPage';

// Admin pages
import Main from '../pages/admin/Main';
import Login from '../pages/admin/AdminViews/Login';
import Dashboard from '../pages/admin/AdminViews/Dashboard';
import TotalDeliveries from '../pages/admin/AdminViews/Chart/TotalDeliveries';
import OnTimeLateDeliveries from '../pages/admin/AdminViews/Chart/OnTimeLateDeliveries';
import DeliveriesByClient from '../pages/admin/AdminViews/Chart/DeliveriesByClient';

import EmailTemplates from '../pages/admin/AdminViews/EmailTemplates/EmailTemplates';
import AddEmailTemplates from '../pages/admin/AdminViews/EmailTemplates/AddEmailTemplates';
import EditEmailTemplates from '../pages/admin/AdminViews/EmailTemplates/EditEmailTemplates';
import Users from '../pages/admin/AdminViews/Users/Users';
import AddUser from '../pages/admin/AdminViews/Users/AddUser';
import EditUser from '../pages/admin/AdminViews/Users/EditUser';
import CronOptions from '../pages/admin/AdminViews/CronOptions/CronOptions';
import FreightProviders from '../pages/admin/AdminViews/FreightProviders/FreightProviders';
import AddFreightProviders from '../pages/admin/AdminViews/FreightProviders/AddFreightProviders';
import EditFreightProviders from '../pages/admin/AdminViews/FreightProviders/EditFreightProviders';
import SqlQueries from '../pages/admin/AdminViews/SqlQueries';
import SqlQueriesAction from '../pages/admin/AdminViews/SqlQueries/SqlQueriesAction';
import PricingOnlyList from '../pages/admin/AdminViews/PricingOnly/List';
import PricingOnlyUpload from '../pages/admin/AdminViews/PricingOnly/Upload';
import PricingRuleList from '../pages/admin/AdminViews/PricingRule/List';
import PricingRuleUpload from '../pages/admin/AdminViews/PricingRule/Upload';
import PricingRuleStatus from '../pages/admin/AdminViews/PricingRule/Status';
import Vehicles from '../pages/admin/AdminViews/Vehicles/Vehicles';
import Timings from '../pages/admin/AdminViews/Timings/Timings';
import Availabilities from '../pages/admin/AdminViews/Availabilities/Availabilities';
import FPCosts from '../pages/admin/AdminViews/FP/Costs';
import Clients from '../pages/admin/AdminViews/Clients/Clients';
import AddAugmentAddress from '../pages/admin/views/AugmentAddress/AddAugmentAddress';
import EditAugmentAddress from '../pages/admin/views/AugmentAddress/EditAugmentAddress';
import AddClient from '../pages/admin/AdminViews/Clients/AddClient';
import EditClient from '../pages/admin/AdminViews/Clients/EditClient';
import ClientEmployees from '../pages/admin/AdminViews/ClientEmployees/ClientEmployees';
import AddClientEmployee from '../pages/admin/AdminViews/ClientEmployees/AddClientEmployee';
import EditClientEmployee from '../pages/admin/AdminViews/ClientEmployees/EditClientEmployee';

import CustomerClientEmployees from '../pages/admin/CustomerViews/ClientEmployees/ClientEmployees';
import CustomerAddClientEmployee from '../pages/admin/CustomerViews/ClientEmployees/AddClientEmployee';
import CustomerEditClientEmployee from '../pages/admin/CustomerViews/ClientEmployees/EditClientEmployee';
import CustomerClientProduct from '../pages/admin/CustomerViews/ClientProduct';

// Customer Dashboard pages
import CustomerLogin from '../pages/admin/CustomerViews/Login';
import CustomerDashboard from '../pages/admin/CustomerViews/Dashboard';
import ClientRas from '../pages/admin/CustomerViews/ClientRas';
import ClientRasAction from '../pages/admin/CustomerViews/ClientRas/ClientRasAction';
export const AppRouter = () => (
    <BrowserRouter history={createBrowserHistory()}>
        <Fragment>
            <Header />
            <Switch>
                <Route exact path='/' component={HomePage} />
                <Route exact path='/home' component={HomePage} />
                <Route exact path='/files' component={FilesPage} />
                <Route exact path='/login' component={LoginPage} />
                <Route exact path='/forgot-password' component={ForgotPasswordPage} />
                <Route path='/reset-password' component={ResetPasswordPage} />

                <Route exact path='/bok' component={BokPage} />
                <Route exact path='/price/:id' component={BokPricePage} />
                <Route exact path='/order/:id' component={BokPricePage} />
                <Route exact path='/status/:id' component={BokStatusPage} />
                
                <PrivateRoute exact path='/booking' component={BookingPage} />
                <PrivateRoute exact path='/bookinglines' component={BookingLinesPage} />
                <PrivateRoute exact path='/bookinglinedetails' component={BookingLineDetailsPage} />
                <PrivateRoute exact path='/allbookings' component={AllBookingsPage} />
                <PrivateRoute exact path='/bookingsets' component={BookingSetsPage} />
                <PrivateRoute exact path='/upload' component={UploadPage} />
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
                    <AdminPrivateRoute exact path='/admin/fp-costs' component={FPCosts} />
                    <AdminPrivateRoute exact path='/admin/pricing-rule' component={PricingRuleList} />
                    <AdminPrivateRoute exact path='/admin/pricing-rule/upload' component={PricingRuleUpload} />
                    <AdminPrivateRoute exact path='/admin/pricing-rule/status' component={PricingRuleStatus} />
                    <AdminPrivateRoute exact path='/admin/clients' component={Clients} />
                    <AdminPrivateRoute exact path='/admin/clients/add' component={AddClient} />
                    <AdminPrivateRoute exact path='/admin/clients/edit/:id' component={EditClient} />

                    <AdminPrivateRoute exact path='/admin/clientemployees' component={ClientEmployees} />
                    <AdminPrivateRoute exact path='/admin/clientemployees/add' component={AddClientEmployee} />
                    <AdminPrivateRoute exact path='/admin/clientemployees/edit/:id' component={EditClientEmployee} />
                    
                    <AdminPrivateRoute exact path='/admin/chart/totaldeliveries' component={TotalDeliveries} />
                    <AdminPrivateRoute exact path='/admin/chart/ontimelatedeliveries' component={OnTimeLateDeliveries} />
                    <AdminPrivateRoute exact path='/admin/chart/deliveriesbyclient' component={DeliveriesByClient} />
                    <AdminPrivateRoute exact path='/admin/augmentaddress' component={AugmentAddress} />
                    <AdminPrivateRoute exact path='/admin/augmentaddress/add' component={AddAugmentAddress} />
                    <AdminPrivateRoute exact path='/admin/augmentaddress/edit/:id' component={EditAugmentAddress} />

                    <Route exact path='/customerdashboard' component={ CustomerLogin } />
                    <Route exact path='/customerdashboard/login' component={ CustomerLogin} />
                    <AdminPrivateRoute exact path='/customerdashboard/dashboard' component={CustomerDashboard} />
                    <AdminPrivateRoute exact path='/customerdashboard/client-ras' component={ClientRas} />
                    <AdminPrivateRoute exact path='/customerdashboard/client-ras/add' component={ClientRasAction} />
                    <AdminPrivateRoute exact path='/customerdashboard/client-ras/edit/:id' component={ClientRasAction} />
                    <AdminPrivateRoute exact path='/customerdashboard/client-ras/duplicate/:id' component={ClientRasAction} />
                    <AdminPrivateRoute exact path='/customerdashboard/clientemployees' component={CustomerClientEmployees} />
                    <AdminPrivateRoute exact path='/customerdashboard/clientemployees/add' component={CustomerAddClientEmployee} />
                    <AdminPrivateRoute exact path='/customerdashboard/clientemployees/edit/:id' component={CustomerEditClientEmployee} />
                    <AdminPrivateRoute exact path='/customerdashboard/clientproducts' component={CustomerClientProduct} />
                </Main>

                <Redirect to='/' />
            </Switch>
            <Footer />
        </Fragment>
    </BrowserRouter>
);

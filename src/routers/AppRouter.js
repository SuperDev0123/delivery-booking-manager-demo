import React, { Fragment } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
// import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';

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
import UploadPage from '../pages/UploadPage';
import CommPage from '../pages/CommPage';
import PodsPage from '../pages/PodsPage';
import ReportPage from '../pages/report/ReportPage';
import BokPage from '../pages/BokPage';
import FilesPage from '../pages/FilesPage';
import { PrivateRoute } from '../shared/PrivateRoute/PrivateRoute';
import { AdminRoute } from '../shared/AdminRoute/AdminRoute';
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
import SqlQueries from '../pages/admin/views/SqlQueries/SqlQueries';
import AddSqlQuery from '../pages/admin/views/SqlQueries/AddSqlQuery';
import EditSqlQuery from '../pages/admin/views/SqlQueries/EditSqlQuery';
import PricingOnlyList from '../pages/admin/views/PricingOnly/List';
import PricingOnlyUpload from '../pages/admin/views/PricingOnly/Upload';

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
                <PrivateRoute exact path='/upload' component={UploadPage} />
                <PrivateRoute exact path='/comm' component={CommPage} />
                <PrivateRoute exact path='/pods' component={PodsPage} />
                <PrivateRoute exact path='/zoho' component={ZohoPage} />
                <PrivateRoute exact path='/zohodetails' component={ZohoDetailsPage} />
                <PrivateRoute exact path='/reports' component={ReportPage} />
                <Main>
                    <Route exact path='/admin' component={ Login } />
                    <Route exact path='/admin/login' component={ Login} />
                    <Route exact path='/admin/dashboard' component={ Dashboard} />
                    <AdminRoute exact path='/admin/sqlqueries' component={SqlQueries} />
                    <AdminRoute exact path='/admin/sqlqueries/add' component={AddSqlQuery} />
                    <AdminRoute exact path='/admin/sqlqueries/edit/:id' component={EditSqlQuery} />
                    <AdminRoute exact path='/admin/emails' component={EmailTemplates} />
                    <AdminRoute exact path='/admin/emails/add' component={AddEmailTemplates} />
                    <AdminRoute exact path='/emails/edit/:id' component={EditEmailTemplates} />
                    <AdminRoute exact path='/admin/users' component={Users} />
                    <AdminRoute exact path='/admin/users/add' component={AddUser} />
                    <AdminRoute exact path='/admin/users/edit/:id' component={EditUser} />
                    <AdminRoute exact path='/admin/crons' component={CronOptions} />
                    <AdminRoute exact path='/admin/providers' component={FreightProviders} />
                    <AdminRoute exact path='/admin/providers/add' component={AddFreightProviders} />
                    <AdminRoute exact path='/admin/providers/edit/:id' component={EditFreightProviders} />
                    <AdminRoute exact path='/admin/pricing-only' component={PricingOnlyList} />
                    <AdminRoute exact path='/admin/pricing-only/upload' component={PricingOnlyUpload} />
                </Main>
                <Redirect to='/' />
            </Switch>
            <Footer />
        </Fragment>
    </BrowserRouter>
);

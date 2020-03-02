import React, { Fragment } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import Header from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';
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
import { PrivateRoute } from '../shared/PrivateRoute/PrivateRoute';
import ZohoPage from '../pages/ZohoPage';
import ZohoDetailsPage from '../pages/ZohoDetailsPage';

import Main from '../components/Main';
import Login from '../components/views/Login';
import Dashboard from '../components/views/Dashboard';
import EmailTemplates from '../components/views/EmailTemplates/EmailTemplates';
import AddEmailTemplates from '../components/views/EmailTemplates/AddEmailTemplates';
import EditEmailTemplates from '../components/views/EmailTemplates/EditEmailTemplates';
import Users from '../components/views/Users/Users';
import AddUser from '../components/views/Users/AddUser';
import EditUser from '../components/views/Users/EditUser';
import CronOptions from '../components/views/CronOptions/CronOptions';
import FreightProviders from '../components/views/FreightProviders/FreightProviders';
import AddFreightProviders from '../components/views/FreightProviders/AddFreightProviders';
import EditFreightProviders from '../components/views/FreightProviders/EditFreightProviders';
import SqlQueries from '../components/views/SqlQueries/SqlQueries';
import AddSqlQuery from '../components/views/SqlQueries/AddSqlQuery';
import EditSqlQuery from '../components/views/SqlQueries/EditSqlQuery';
// import { PrivateRoute } from './PrivateRoute';

export const AppRouter = () => (
    <BrowserRouter history={createBrowserHistory()}>
        <Fragment>
            <Header />
            <Switch>
                <Route exact path='/' component={HomePage} />
                <Route exact path='/admin'>
                    <Main>
                        <Route exact path='/' component={Login} />
                        <Route exact path='/login' component={Login} />
                        <PrivateRoute exact path='/dashboard' component={Dashboard} />
                        <PrivateRoute exact path='/sqlqueries' component={SqlQueries} />
                        <PrivateRoute exact path='/sqlqueries/add' component={AddSqlQuery} />
                        <PrivateRoute exact path='/sqlqueries/edit/:id' component={EditSqlQuery} />
                        <PrivateRoute exact path='/emails' component={EmailTemplates} />
                        <PrivateRoute exact path='/emails/add' component={AddEmailTemplates} />
                        <PrivateRoute exact path='/emails/edit/:id' component={EditEmailTemplates} />
                        <PrivateRoute exact path='/users' component={Users} />
                        <PrivateRoute exact path='/users/add' component={AddUser} />
                        <PrivateRoute exact path='/users/edit/:id' component={EditUser} />
                        <PrivateRoute exact path='/crons' component={CronOptions} />
                        <PrivateRoute exact path='/providers' component={FreightProviders} />
                        <PrivateRoute exact path='/providers/add' component={AddFreightProviders} />
                        <PrivateRoute exact path='/providers/edit/:id' component={EditFreightProviders} />
                    </Main>
                </Route>
                <Route exact path='/home' component={HomePage} />
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
                <Route exact path='/bok' component={BokPage} />
                <Redirect to='/' />
            </Switch>
            <Footer />
        </Fragment>
    </BrowserRouter>
);

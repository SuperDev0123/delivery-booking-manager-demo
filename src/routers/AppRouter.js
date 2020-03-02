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

export const AppRouter = () => (
    <BrowserRouter history={createBrowserHistory()}>
        <Fragment>
            <Header />
            <Switch>
                <Route exact path='/' component={HomePage} />
                <Route exact path='/admin' component={Main} />
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

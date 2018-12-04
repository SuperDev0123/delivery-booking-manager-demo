import React, { Fragment } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import Header from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import BookingPage from '../pages/BookingPage';
import AllBookingsPage from '../pages/AllBookingsPage';
import UploadPage from '../pages/UploadPage';
import { AboutPage } from '../pages/AboutPage';
import { PrivateRoute } from '../shared/PrivateRoute/PrivateRoute';

export const AppRouter = () => (
    <BrowserRouter>
        <Fragment>
            <Header />
            <Switch>
                <Route exact path='/' component={HomePage} />
                <Route exact path='/home' component={HomePage} />
                <Route exact path='/login' component={LoginPage} />
                <Route exact path='/about' component={AboutPage} />
                <PrivateRoute exact path='/booking' component={BookingPage} />
                <PrivateRoute exact path='/allbookings' component={AllBookingsPage} />
                <Route exact path='/upload' component={UploadPage} />
                <Redirect to='/' />
            </Switch>
            <Footer />
        </Fragment>
    </BrowserRouter>
);
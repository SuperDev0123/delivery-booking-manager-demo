import React, { Fragment } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import { Header } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import { AboutPage } from '../pages/AboutPage';
import { ZipCodesPage } from '../pages/ZipCodesPage';

export const AppRouter = () => (
    <BrowserRouter>
        <Fragment>
            <Header />
            <Switch>
                <Route exact path='/' component={HomePage} />
                <Route exact path='/home' component={HomePage} />
                <Route exact path='/login' component={LoginPage} />
                <Route exact path='/zipcodes' component={ZipCodesPage} />
                <Route exact path='/about' component={AboutPage} />
                <Redirect to="/" />
            </Switch>
            <Footer />
        </Fragment>
    </BrowserRouter>
);
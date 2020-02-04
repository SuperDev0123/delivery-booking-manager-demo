import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import './styles/app.scss';
import 'babel-polyfill';

import bugsnag from '@bugsnag/js';
import bugsnagReact from '@bugsnag/plugin-react';


if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    ReactDOM.render( <App /> , document.getElementById('app'));
} 
else {
    const bugsnagClient = bugsnag('30538436eab90ba75465f678a49e4390');
    bugsnagClient.use(bugsnagReact, React);
    const ErrorBoundary = bugsnagClient.getPlugin('react');
    ReactDOM.render(<ErrorBoundary> <App /> </ErrorBoundary>, document.getElementById('app'));
}



/* bugsnagClient.notify(new Error('Test error')); */
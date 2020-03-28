import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import './styles/app.scss';
import 'babel-polyfill';
import './assets/styles/vendor.scss';
import './assets/styles/main.scss';
ReactDOM.render(<App />, document.getElementById('app'));

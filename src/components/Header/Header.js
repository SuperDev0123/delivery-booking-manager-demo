import React from 'react';

import logo from '../../public/images/logo-2.png';

export const Header = () => (
    <header>
        <nav className="navbar navbar-expand bg-nav pl-md-5 ml-md-0">
            <a href="/" className="navbar-brand mr-sm-0">
                <img src={logo} className="head-logo" alt="logo" />
            </a>

            <ul className="navbar-nav flex-row ml-auto d-md-flex">
                <li className="nav-item dropdown show">
                    <a className="nav-item nav-link dropdown-toggle mr-md-2" href="#" id="bd-versions" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                        <i className="fa fa-user" aria-hidden="true"></i>
                    </a>
                    <div className="dropdown-menu dropdown-menu-right" aria-labelledby="bd-versions">
                        <a className="dropdown-item cut-user-name">
                            <i>Logged in as</i>
                        </a>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item" href="/share">Upload Files</a>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item" href="/booking">Booking</a>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item" href="/allbookings">All Bookings</a>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item">Logout</a>
                    </div>
                </li>
                <li className="nav-item">
                    <a href="/login" className="btn btn-outline-light my-2 my-lg-0 login">Login</a>
                </li>
            </ul>
        </nav>
    </header>
);
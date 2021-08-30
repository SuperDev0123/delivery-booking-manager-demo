import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { getUser, logout } from '../../state/services/authService';

import logo from '../../public/images/logo-2.png';

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            clientname: '',
        };
    }

    static propTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        getUser: PropTypes.func.isRequired,
        logout: PropTypes.func.isRequired,
    };

    componentDidMount() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const token = localStorage.getItem('token');

        if (isLoggedIn && token && token.length > 0)
            this.props.getUser(token);
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { username, clientname, isLoggedIn } = newProps;

        if (username)
            this.setState({username});

        if (clientname)
            this.setState({clientname});

        this.setState({isLoggedIn});
    }

    logout() {
        this.props.logout();
        this.props.history.push('/');
    }

    render() {
        const { username, clientname } = this.state;
        const currentRoute = this.props.location.pathname;
        const isLoggedIn = localStorage.getItem('isLoggedIn');

        if (currentRoute.indexOf('admin') > -1 || currentRoute.indexOf('customerdashboard') > -1 || currentRoute.indexOf('status') > -1) 
            return null;
        
        return (
            <header>
                {currentRoute === '/booking' ||
                currentRoute === '/allbookings' ||
                currentRoute === '/bookingsets' ||
                currentRoute === '/bookinglines' ||
                currentRoute === '/bookinglinedetails' ||
                currentRoute === '/pods' ||
                currentRoute === '/zoho' ||
                currentRoute === '/reports' ?
                    <nav className="qbootstrap-nav" role="navigation">
                        <div className="col-md-12" id="headr">
                            <div className="top">
                                <div className="row">
                                    <div className="col-md-8 col-sm-12 col-lg-8 col-xs-12 col-md-push-1 ">
                                        <h3 className="label_hel"><a href="/">Company: {clientname ? clientname : '---'}    User: {username ? username : '---'}</a></h3>
                                        <h3 className="label_hel"></h3>
                                    </div>
                                    <div className="col-md-4 col-sm-12 col-lg-4 col-xs-12 text-right col-lg-pull-1">
                                        <a href="" className="none">Login Info Client</a>
                                        <span className="none">|</span>
                                        <a href="" className="none">Accounts</a>
                                        <span className="none">|</span>
                                        <a href="" className="none">Client Mode</a>
                                        <span className="none">|</span>
                                        <a href="/">Home</a>
                                    </div>
                                </div>
                                <div className="line"></div>
                            </div>
                        </div>
                    </nav>
                    :
                    <nav className="navbar navbar-expand bg-nav pl-md-5 ml-md-0">
                        <a href="/" className="navbar-brand mr-sm-0">
                            <img src={logo} className="head-logo" alt="logo" />
                        </a>

                        <ul className="navbar-nav flex-row ml-auto d-md-flex">
                            {clientname && isLoggedIn === 'true' ?
                                <li className="nav-item dropdown show">
                                    <a className="nav-item nav-link dropdown-toggle mr-md-2" href="#" id="bd-versions" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                        <i className="fa fa-user" aria-hidden="true"></i>
                                    </a>
                                    <div className="dropdown-menu dropdown-menu-right" aria-labelledby="bd-versions">
                                        <a className="dropdown-item cut-user-name">
                                            <i>Logged in as {username}</i>
                                        </a>
                                        {clientname === 'dme' && <div className='dropdown-divider'></div>}
                                        {clientname === 'dme' && <a className='dropdown-item' href="/admin">DME Admin</a>}
                                        {clientname != 'dme' && <a className='dropdown-item' href="/customerdashboard">Admin</a>}
                                        {clientname === 'dme' && <div className="dropdown-divider"></div>}
                                        {clientname === 'dme' && <a className="dropdown-item" href="/upload">Upload Files</a>}
                                        {(clientname === 'dme' || clientname === 'Tempo Pty Ltd') && <div className="dropdown-divider"></div>}
                                        {(clientname === 'dme' || clientname === 'Tempo Pty Ltd') && <a className="dropdown-item" href="/files">Files</a>}
                                        <div className="dropdown-divider"></div>
                                        <a className="dropdown-item" href="/booking">Booking</a>
                                        <div className="dropdown-divider"></div>
                                        <a className="dropdown-item" href="/allbookings">All Bookings</a>
                                        {clientname === 'dme' && <div className='dropdown-divider'></div>}
                                        {clientname === 'dme' && <a className='dropdown-item' href="/reports">Reports</a>}
                                        <div className="dropdown-divider"></div>
                                        <a className="dropdown-item" href="/" onClick={() => this.logout()}>Logout</a>
                                    </div>
                                </li>
                                :
                                <li className="nav-item">
                                    {currentRoute.indexOf('/price/') === 0 || currentRoute.indexOf('/status/') === 0 || currentRoute.indexOf('/label/') === 0 ?
                                        null
                                        :
                                        <a href="/login" className="btn btn-outline-light my-2 my-lg-0 login">Login</a>
                                    }
                                </li>
                            }
                        </ul>
                    </nav>
                }
            </header>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        username: state.auth.username,
        clientname: state.auth.clientname,
        isLoggedIn: state.auth.isLoggedIn,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getUser: (token) => dispatch(getUser(token)),
        logout: () => dispatch(logout()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));

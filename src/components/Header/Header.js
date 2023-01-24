import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getUser, logout, getDMEClients } from '../../state/services/authService';
import { getStatusPageUrl } from '../../state/services/bookingService';
// import { openTab } from '../../commons/browser';

import logo from '../../public/images/logo-2.png';
import QuickQuotePopover from '../Popovers/QuickQuotePopover';
import SimpleTooltipComponent from '../Tooltip/SimpleTooltipComponent';

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            findKeyword: '',
            isOpenQuickQuote: false,
        };
    }

    static propTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        clientname: PropTypes.string,
        dmeClients: PropTypes.array,

        // Functions
        getUser: PropTypes.func.isRequired,
        logout: PropTypes.func.isRequired,
        getStatusPageUrl: PropTypes.func.isRequired,
        getDMEClients: PropTypes.func.isRequired,
    };

    componentDidMount() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const token = localStorage.getItem('token');

        if (isLoggedIn && token && token.length > 0)
            this.props.getUser(token);
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { username, clientname, isLoggedIn, dmeClients } = newProps;
        if (isLoggedIn && (!dmeClients || !dmeClients.length)) {
            this.props.getDMEClients();
        }
        if (username)
            this.setState({ username });

        if (clientname)
            this.setState({ clientname });

        // if (statusPageUrl) {
        //     console.log('@1 - ', statusPageUrl);
        //     if (statusPageUrl === 'not_found')
        //         this.notify('Not found with "' + this.state.findKeyword + '"');
        //     else
        //         openTab(statusPageUrl);

        //     this.setState({isFindingBooking: false});
        // }
        this.setState({ isLoggedIn });
    }

    notify = (text) => toast(text);

    logout() {
        this.props.logout();
        this.props.history.push('/');
    }

    onOpenQuickQuote(e) {
        e.preventDefault();
        e.stopPropagation();
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
            this.setState({ isOpenQuickQuote: !this.state.isOpenQuickQuote });
        }
    }

    render() {
        const { username, isOpenQuickQuote } = this.state;
        const { clientname, dmeClients } = this.props;
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
                    currentRoute === '/reports' ||
                    currentRoute === '/warehouse-label' ?
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
                                        {(username !== 'anchor_packaging_afs' &&  username !== 'tempo_calm') && <a id="Popover" href='#' onClick={(e) => this.onOpenQuickQuote(e)} className='popover-btn'>Quick Quote</a>}
                                        {(username !== 'anchor_packaging_afs' &&  username !== 'tempo_calm') && <QuickQuotePopover isOpen={isOpenQuickQuote} setIsOpen={(val) => { this.setState({ isOpenQuickQuote: val }); }} dmeClients={dmeClients} />}
                                        {(username !== 'anchor_packaging_afs' &&  username !== 'tempo_calm') && <span>|</span>}
                                        <a href="/">Home</a>
                                    </div>
                                </div>
                                <div className="line"></div>
                            </div>
                        </div>
                    </nav>
                    :
                    <nav className="navbar navbar-expand bg-nav pl-md-5 ml-md-0">
                        <div className="col-sm-6">
                            <a href="/" className="navbar-brand mr-sm-0">
                                <img src={logo} className="head-logo" alt="logo" />
                            </a>
                            <h5>Tel: (02) 8311 1500</h5>
                        </div>
                        <div className="col-sm-6 d-flex justify-content-between" >
                            {(username !== 'anchor_packaging_afs' &&  username !== 'tempo_calm') &&
                                <div id={'booking-column-header-tooltip-LoginRequired'}>
                                    {isLoggedIn !== 'true' && <SimpleTooltipComponent text={'Login Required'} />}
                                    <a id="Popover" className={`btn btn-outline-light my-2 my-lg-0 login ${isLoggedIn !== 'true' && 'disabled'}`} onClick={(e) => this.onOpenQuickQuote(e)}>
                                        Quick Quote
                                    </a>
                                    <QuickQuotePopover isOpen={isOpenQuickQuote} setIsOpen={(val) => { this.setState({ isOpenQuickQuote: val }); }} dmeClients={dmeClients} />
                                </div>
                            }
                            <ul className="navbar-nav flex-row ml-auto d-md-flex">
                                {clientname && isLoggedIn === 'true' ?
                                    <li className="nav-item dropdown show">
                                        <a className="nav-item nav-link dropdown-toggle mr-md-2" href="#" id="bd-versions" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                            <i className="fa fa-user" aria-hidden="true"></i>
                                        </a>
                                        {(username === 'anchor_packaging_afs' || username === 'tempo_calm') ?
                                            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="bd-versions">
                                                <a className="dropdown-item cut-user-name">
                                                    <i>Logged in as {username}</i>
                                                </a>
                                                <div className='dropdown-divider'></div>
                                                <a className='dropdown-item' href="/warehouse-label">Labels</a>
                                                <div className="dropdown-divider"></div>
                                                <a className="dropdown-item" href="/" onClick={() => this.logout()}>Logout</a>
                                            </div>
                                            :
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
                                                <a className="dropdown-item" href="/bok">Find Order</a>
                                                <div className="dropdown-divider"></div>
                                                <a className="dropdown-item" href="/booking">Booking</a>
                                                <div className="dropdown-divider"></div>
                                                <a className="dropdown-item" href="/allbookings">All Bookings</a>
                                                {clientname === 'dme' && <div className='dropdown-divider'></div>}
                                                {clientname === 'dme' && <a className='dropdown-item' href="/reports">Reports</a>}
                                                <a className='dropdown-item' href="/prebooking-errors">Booking Errors</a>
                                                <div className="dropdown-divider"></div>
                                                <a className="dropdown-item" href="/" onClick={() => this.logout()}>Logout</a>
                                            </div>
                                        }
                                    </li>
                                    :
                                    <li className="nav-item">
                                        {
                                            currentRoute.indexOf('/status/') === 0 ||
                                            currentRoute.indexOf('/label/') === 0 ?
                                                null : <a href="/login" className="btn btn-outline-light my-2 my-lg-0 login">Login</a>
                                        }
                                    </li>
                                }
                            </ul>
                        </div>
                    </nav>
                }
                <ToastContainer />
            </header>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        username: state.auth.username,
        clientname: state.auth.clientname,
        isLoggedIn: state.auth.isLoggedIn,
        statusPageUrl: state.booking.statusPageUrl,
        dmeClients: state.auth.dmeClients,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getUser: (token) => dispatch(getUser(token)),
        logout: () => dispatch(logout()),
        getStatusPageUrl: (findKeyword) => dispatch(getStatusPageUrl(findKeyword)),
        getDMEClients: () => dispatch(getDMEClients()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));

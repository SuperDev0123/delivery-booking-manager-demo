import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import { logout } from '../../../state/services/authService';

import imgProfile from '../../../public/images/profile.jpg';

class SidebarPush extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dropdownOpen: false,
            collapse: {
                dashboard: this.activeRoute('dashboard'),
                providers: this.activeRoute(['providers', 'providers/add', 'providers/edit']),
                providersCollapsed: true,
                pricingOnlyCollapsed: true,
            }
        };
        this.toggle = this.toggle.bind(this);
    }

    static propTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        handleLoginCheck: PropTypes.func.isRequired,
        logout: PropTypes.func.isRequired,
    };

    activeRoute(getPath) {
        getPath = Array.isArray(getPath) ? getPath : [getPath];

        for (let i in getPath) {
            if ('/admin/' + getPath[i] === this.props.location.pathname)
                return true;
        }

        return false;
    }

    toggle() {
        const { dropdownOpen } = this.state;
        this.setState({ dropdownOpen: !dropdownOpen });
    }

    logout() {
        this.props.logout();
        this.props.history.push('/admin');
    }

    render() {
        const { dropdownOpen } = this.state;

        return (
            <aside className="sidebar sidebar-left">
                <div className="sidebar-profile">
                    <div className="avatar">
                        <img className="img-circle profile-image" src={imgProfile} />
                        <i className="on border-dark animated bounceIn"></i>
                    </div>
                    <div className="profile-body dropdown">
                        <Dropdown isOpen={dropdownOpen} toggle={this.toggle}>
                            <DropdownToggle caret>
                                Master Admin
                            </DropdownToggle>
                            <DropdownMenu>
                                <ul className="animated" role="menu" style={{
                                    listStyle: 'none',
                                    padding: '15px'
                                }}>
                                    <li className="profile-progress">
                                        <h5>
                                            <span>80%</span>
                                            <small> Profile complete</small>
                                        </h5>
                                        <div className="progress progress-xs">
                                            <div className="progress-bar progress-bar-primary" style={{
                                                'width': '60%'
                                            }}></div>
                                        </div>
                                    </li>
                                    <li className="divider"></li>
                                    <li>
                                        <a href='#' onClick={e => e.preventDefault()}>
                                            <span className="icon">
                                                <i className="fa fa-user"></i>
                                            </span><small>My Account</small></a>
                                    </li>
                                    <li>
                                        <a href='#' onClick={e => e.preventDefault()}>
                                            <span className="icon">
                                                <i className="fa fa-envelope"></i>
                                            </span><small>Messages</small></a>
                                    </li>
                                    <li>
                                        <a href='#' onClick={e => e.preventDefault()}>
                                            <span className="icon">
                                                <i className="fa fa-cog"></i>
                                            </span><small>Settings</small></a>
                                    </li>
                                    <li className="divider"></li>
                                    <li>
                                        <a href='#' onClick={e => { e.preventDefault(); this.logout(); }}>
                                            <span className="icon">
                                                <i className="fa fa-sign-out"></i>
                                            </span><small>Logout</small></a>
                                    </li>
                                </ul>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
                <nav className="sidebarNav">
                    <h5 className="sidebar-header">Navigation</h5>
                    <ul className="nav nav-pills nav-stacked">
                        <li className={this.activeRoute('dashboard') ? 'active' : ''}>
                            <Link to="/admin/dashboard" title="dashboard">
                                <i className="fa fa-fw fa-tachometer"></i>
                                <span className="menu-title">Dashboard</span>
                            </Link>
                        </li>
                        <li className={this.activeRoute('users') ? 'active' : ''}>
                            <Link to="/admin/users" title="Users">
                                <i className="fa fa-fw fa-users"></i>
                                <span className="menu-title">Users</span>
                            </Link>
                        </li>
                        <li className={this.activeRoute('emails') ? 'active' : ''}>
                            <Link to="/admin/emails" title="Email Templates">
                                <i className="fa fa-fw fa-envelope"></i>
                                <span className="menu-title">Email Templates</span>
                            </Link>
                        </li>
                        <li className={this.activeRoute('crons') ? 'active' : ''}>
                            <Link to="/admin/crons" title="Cron Options">
                                <i className="fa fa-fw fa-tasks"></i>
                                <span className="menu-title">Cron Options</span>
                            </Link>
                        </li>
                        <li style={{ 'color': '#B3B8C3' }} className={this.activeRoute('providers') || this.activeRoute('providers/add') ? 'active' : ''}>
                            <a onClick={() => this.setState({ providersCollapsed: !this.state.providersCollapsed })}>
                                <i className="fa fa-bars fa-fw"></i>
                                <span className="menu-title">Freight Providers</span>
                            </a>
                            <ul className={classNames({ 'nav-sub': true, 'collapse': !this.state.providersCollapsed })}>
                                <li>
                                    <Link title="View All Freight Providers" to="/admin/providers" className={this.activeRoute(['providers']) ? 'active' : ''}>
                                        <span className="submenu-title">All</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link title="Add New Freight Providers" to="/admin/providers/add" className={this.activeRoute(['providers/add']) ? 'active' : ''}>
                                        <span className="submenu-title">Add New</span>
                                    </Link>
                                </li>
                            </ul>
                        </li>
                        <li className={this.activeRoute('sqltool') ? 'active' : ''}>
                            <Link to="/admin/sqlqueries" title="SQL Tool">
                                <i className="fa fa-fw fa-database"></i>
                                <span className="menu-title">SQL Tool</span>
                            </Link>
                        </li>
                        <li style={{ 'color': '#B3B8C3' }} className={this.activeRoute('pricing-only') || this.activeRoute('pricing-only/upload') ? 'active' : ''}>
                            <a onClick={() => this.setState({ pricingOnlyCollapsed: !this.state.pricingOnlyCollapsed })}>
                                <i className="fa fa-usd fa-fw"></i>
                                <span className="menu-title">Pricing Only</span>
                            </a>
                            <ul className={classNames({ 'nav-sub': true, 'collapse': !this.state.pricingOnlyCollapsed })}>
                                <li>
                                    <Link
                                        title="View All Pricing result list"
                                        to="/admin/pricing-only"
                                        className={this.activeRoute(['pricing-only']) ? 'active' : ''}
                                    >
                                        <span className="submenu-title">List</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        title="Upload new Pricing sheet"
                                        to="/admin/pricing-only/upload"
                                        className={this.activeRoute(['pricing-only/upload']) ? 'active' : ''}
                                    >
                                        <span className="submenu-title">Upload sheet</span>
                                    </Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </nav>
            </aside>
        );
    }
}

SidebarPush.contextTypes = {
    router: PropTypes.object
};

const mapDispatchToProps = (dispatch) => {
    return {
        logout: () => dispatch(logout()),
    };
};

export default withRouter(connect(mapDispatchToProps)(SidebarPush));

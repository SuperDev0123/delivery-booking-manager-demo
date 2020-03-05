import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';

import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import imgProfile from '../../public/images/profile.jpg';

class SidebarPush extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dropdownOpen:false,
            collapse: {
                dashboard: this.activeRoute('dashboard'),
                providers: this.activeRoute(['providers', 'providers/add', 'providers/edit']),
                providersCollapsed: true
            }
        };
        this.toggle = this.toggle.bind(this);
    }

    static propTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        handleLoginCheck: PropTypes.func.isRequired,
    };


    activeRoute(getPath) {
        getPath = Array.isArray(getPath) ? getPath : [getPath];
        for (let i in getPath) {
            if ('/'+getPath[i] === this.props.location.pathname)
                return true;
        }
        return false;
    }

    toggle(){
        const { dropdownOpen } = this.state;
        this.setState({dropdownOpen:!dropdownOpen});
    }

    logout() {
        localStorage.setItem('isLoggedIn', 'false');
        localStorage.setItem('token', '');
        this.props.handleLoginCheck();
        this.props.history.push('/');
    }

    render() { 
        const { dropdownOpen } = this.state;
        return (
            <aside className="sidebar sidebar-left">
                <div className="sidebar-profile">
                    <div className="avatar">
                        <img className="img-circle profile-image" src={imgProfile}/>
                        <i className="on border-dark animated bounceIn"></i>
                    </div>
                    <div className="profile-body dropdown">
                        <Dropdown isOpen={dropdownOpen} toggle={this.toggle}>
                            <DropdownToggle caret>
                            Master Admin
                            </DropdownToggle>
                            <DropdownMenu>
                                <ul className="animated" role="menu" style={{listStyle: 'none',
                                    padding: '15px'}}>
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
                                        <a href='#' onClick={e => {e.preventDefault();this.logout();}}>
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
                                <span>Dashboard</span>
                            </Link>
                        </li>
                        <li className={this.activeRoute('emails') ? 'active' : ''}>
                            <Link to="/admin/users" title="Users">
                                <i className="fa fa-fw fa-users"></i>
                                <span>Users</span>
                            </Link>
                        </li>
                        <li className={this.activeRoute('emails') ? 'active' : ''}>
                            <Link to="/admin/emails" title="Email Templates">
                                <i className="fa fa-fw fa-envelope"></i>
                                <span>Email Templates</span>
                            </Link>
                        </li>
                        <li className={this.activeRoute('crons') ? 'active' : ''}>
                            <Link to="/admin/crons" title="Cron Options">
                                <i className="fa fa-fw fa-tasks"></i>
                                <span>Cron Options</span>
                            </Link>
                        </li>
                        <li className={this.activeRoute('providers') || this.activeRoute('providers/add') ? 'active' : ''}>
                            <a onClick={() => { this.setState({ providersCollapsed: !this.state.providersCollapsed }); return false; }}>
                                <i className="fa fa-bars fa-fw"></i>
                                <span>Freight Providers</span>
                            </a>
                            <ul className={classNames({ 'nav-sub': true, 'collapse': !this.state.providersCollapsed })}>
                                <li>
                                    <Link title="View All Freight Providers" to="/admin/providers" className={this.activeRoute(['providers']) ? 'active' : ''}>
                                        <span>View All</span>
                                    </Link>
                                </li>   
                                <li>
                                    <Link title="Add New Freight Providers" to="/admin/providers/add" className={this.activeRoute(['providers/add']) ? 'active' : ''}>
                                        <span>Add New</span>
                                    </Link>
                                </li>
                            </ul>
                        </li>

                        <li className={this.activeRoute('sqltool') ? 'active' : ''}>
                            <Link to="/admin/sqlqueries" title="SQL Tool">
                                <i className="fa fa-fw fa-database"></i>
                                <span>SQL Tool</span>
                            </Link>
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

export default withRouter(SidebarPush);

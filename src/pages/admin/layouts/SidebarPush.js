import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import { getUser, verifyToken, logout } from '../../../state/services/authService';

import imgProfile from '../../../public/images/profile.jpg';

class SidebarPush extends React.Component {
    constructor(props) {
        super(props);


        let baseUrl = '/admin';
        if (this.props.history.location.pathname.indexOf('admin') > -1)
            baseUrl =  '/admin';
        else if (this.props.history.location.pathname.indexOf('customerdashboard') > -1)
            baseUrl = '/customerdashboard';

        this.state = {
            dropdownOpen: false,
            collapse: {
                dashboard: this.activeRoute('dashboard'),
                providers: this.activeRoute(['providers', 'providers/add', 'providers/edit']),
                providersCollapsed: true,
                clientProductsCollapsed: true,
                pricingOnlyCollapsed: true,
                pricingRuleCollapsed: true,
                logsCollapsed: true,
                augmentCollapsed: true,
                reportCollapsed: true,
            },
            baseUrl:baseUrl
        };
        this.toggle = this.toggle.bind(this);
    }

    static propTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        getUser: PropTypes.func.isRequired,
        verifyToken: PropTypes.func.isRequired,
        logout: PropTypes.func.isRequired,
    };

    componentDidMount() {
        const token = localStorage.getItem('token');

        const {baseUrl} = this.state;
        
        console.log(baseUrl);
        if (token && token.length > 0) {
            this.props.verifyToken();
            this.props.getUser(token);
        } else {
            this.props.logout();
            this.props.history.push(baseUrl);
        }
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { clientname } = newProps;

        if (this.props.history.location.pathname.indexOf('admin') > -1) {
            if (clientname && clientname !== 'dme') {
                this.props.logout();
                this.props.history.push('/admin');
            }
        }
        else if (this.props.history.location.pathname.indexOf('customerdashboard') > -1) {
            if (clientname && clientname === 'dme') {
                this.props.logout();
                this.props.history.push('/customerdashboard');
            }
        }
    }

    activeRoute(getPath) {
        getPath = Array.isArray(getPath) ? getPath : [getPath];

        if (this.props.history.location.pathname.indexOf('admin') > -1) {
            for (let i in getPath) {
                if ('/admin/' + getPath[i] === this.props.location.pathname)
                    return true;
            }
        }
        else if (this.props.history.location.pathname.indexOf('customerdashboard') > -1) {
            for (let i in getPath) {
                if ('/customerdashboard/' + getPath[i] === this.props.location.pathname)
                    return true;
            }
        }

        return false;
    }

    toggle() {
        const { dropdownOpen } = this.state;
        this.setState({ dropdownOpen: !dropdownOpen });
    }

    logout() {
        this.props.logout();

        const {baseUrl} = this.state;
        
        this.props.history.push(baseUrl);
    }


    render() {
        const { dropdownOpen, providersCollapsed, pricingOnlyCollapsed, pricingRuleCollapsed, clientProductsCollapsed, baseUrl, augmentCollapsed, logsCollapsed, reportCollapsed } = this.state;

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
                                            <span className="icon text-center">
                                                <i className="fa fa-info"></i>
                                            </span><small>My Account</small>
                                        </a>
                                    </li>
                                    <li>
                                        <a href='#' onClick={e => e.preventDefault()}>
                                            <span className="icon">
                                                <i className="fa fa-envelope"></i>
                                            </span><small>Messages</small></a>
                                    </li>
                                    <li>
                                        <a href='/'>
                                            <span className="icon">
                                                <i className="fa fa-envelope"></i>
                                            </span><small>Main Menu</small></a>
                                    </li>
                                    <li>
                                        <a href='#' onClick={e => e.preventDefault()}>
                                            <span className="icon">
                                                <i className="fa fa-cog"></i>
                                            </span><small>Settings</small></a>
                                    </li>
                                    <li className="divider"></li>
                                    <li>
                                        <a href='/home'>
                                            <span className="icon"><i className="fa fa-user"></i></span>
                                            <small>Switch to User mode</small>
                                        </a>
                                    </li>
                                    <li>
                                        <a href='#' onClick={e => { e.preventDefault(); this.logout(); }}>
                                            <span className="icon">
                                                <i className="fa fa-sign-out-alt"></i>
                                            </span><small>Logout</small>
                                        </a>
                                    </li>
                                </ul>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
                <div>
                    {baseUrl === '/admin'? <nav className="sidebarNav">
                        <h5 className="sidebar-header">Navigation</h5>
                        <ul className="nav nav-pills nav-stacked">
                            <li className={this.activeRoute('dashboard') ? 'active' : ''}>
                                <Link to={`${baseUrl}/dashboard`} title="dashboard">
                                    <i className="fa fa-fw fa-tachometer"></i>
                                    <span className="menu-title">Dashboard</span>
                                </Link>
                            </li>
                            <li className={this.activeRoute('users') ? 'active' : ''}>
                                <Link to={`${baseUrl}/users`} title="Users">
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
                                <a onClick={() => this.setState({ providersCollapsed: !providersCollapsed })}>
                                    <i className="fa fa-bars fa-fw"></i>
                                    <span className="menu-title">Freight Providers</span>
                                </a>
                                <ul className={classNames({ 'nav-sub': true, 'collapse': !providersCollapsed })}>
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
                                    <li>
                                        <Link title="Add New Freight Providers" to="/admin/providers/statusmapping" className={this.activeRoute(['providers/statusmapping']) ? 'active' : ''}>
                                            <span className="submenu-title">Status Mapping</span>
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
                                <a onClick={() => this.setState({ pricingOnlyCollapsed: !pricingOnlyCollapsed })}>
                                    <i className="fa fa-fw fa-dollar-sign"></i>
                                    <span className="menu-title">Quote Shipping Histories</span>
                                </a>
                                <ul className={classNames({ 'nav-sub': true, 'collapse': !pricingOnlyCollapsed })}>
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

                            <li className={this.activeRoute('vehicles') ? 'active' : ''}>
                                <Link to="/admin/vehicles" title="Vehicles">
                                    <i className="fa fa-fw fa-truck"></i>
                                    <span className="menu-title">Vehicles</span>
                                </Link>
                            </li>
                            <li className={this.activeRoute('timings') ? 'active none' : 'none'}>
                                <Link to="/admin/timings" title="Timings">
                                    <i className="fa fa-fw fa-bell"></i>
                                    <span className="menu-title">Timings</span>
                                </Link>
                            </li>
                            <li className={this.activeRoute('availabilities') ? 'active' : ''}>
                                <Link to="/admin/availabilities" title="Availabilities">
                                    <i className="fa fa-fw fa-clock"></i>
                                    <span className="menu-title">Availabilities</span>
                                </Link>
                            </li>
                            <li className={this.activeRoute('fp-costs') ? 'active' : ''}>
                                <Link to="/admin/fp-costs" title="FP Costs">
                                    <i className="fa fa-fw fa-coins"></i>
                                    <span className="menu-title">FP Costs</span>
                                </Link>
                            </li>
                            <li className={this.activeRoute('clients') ? 'active' : ''}>
                                <Link to="/admin/clients" title="Clients">
                                    <i className="fa fa-fw fa-coins"></i>
                                    <span className="menu-title">Clients</span>
                                </Link>
                            </li>

                            <li
                                style={{ 'color': '#B3B8C3' }}
                                className={
                                    this.activeRoute('pricing-rule') ||
                                    this.activeRoute('pricing-rule/upload') ||
                                    this.activeRoute('pricing-rule/status') ? 'active' : ''}
                            >
                                <a onClick={() => this.setState({ pricingRuleCollapsed: !pricingRuleCollapsed })}>
                                    <i className="fa fa-usd fa-funnel-dollar"></i>
                                    <span className="menu-title">Pricing Rule</span>
                                </a>
                                <ul className={classNames({ 'nav-sub': true, 'collapse': !pricingRuleCollapsed })}>
                                    <li>
                                        <Link
                                            title="View All Pricing Rule"
                                            to="/admin/pricing-rule"
                                            className={this.activeRoute(['pricing-rule']) ? 'active' : ''}
                                        >
                                            <span className="submenu-title">List</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            title="Upload new Pricing Rule sheet"
                                            to="/admin/pricing-rule/upload"
                                            className={this.activeRoute(['pricing-rule/upload']) ? 'active' : ''}
                                        >
                                            <span className="submenu-title">Upload sheet</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            title="Importing Statues"
                                            to="/admin/pricing-rule/status"
                                            className={this.activeRoute(['pricing-rule/status']) ? 'active' : ''}
                                        >
                                            <span className="submenu-title">Status</span>
                                        </Link>
                                    </li>
                                </ul>
                            </li>

                            <li style={{ 'color': '#B3B8C3' }} className={this.activeRoute('augmentaddress') || this.activeRoute('augmentaddress/add') ? 'active' : ''}>
                                <a onClick={() => this.setState({ augmentCollapsed: !augmentCollapsed })}>
                                    <i className="fa fa-bars fa-fw"></i>
                                    <span className="menu-title">Augment Address Rules</span>
                                </a>
                                <ul className={classNames({ 'nav-sub': true, 'collapse': !augmentCollapsed })}>
                                    <li>
                                        <Link title="View All Augment Address Rules" to="/admin/augmentaddress" className={this.activeRoute(['augmentaddress']) ? 'active' : ''}>
                                            <span className="submenu-title">All</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link title="Add New Augment Address Rule" to="/admin/augmentaddress/add" className={this.activeRoute(['augmentaddress/add']) ? 'active' : ''}>
                                            <span className="submenu-title">Add New</span>
                                        </Link>
                                    </li>
                                </ul>
                            </li>

                            <li className={this.activeRoute('clientemployees') ? 'active' : ''}>
                                <Link to="/admin/clientemployees" title="Client Employees">
                                    <i className="fa fa-fw fa-users"></i>
                                    <span className="menu-title">Client Employees</span>
                                </Link>
                            </li>

                            <li style={{ 'color': '#B3B8C3' }} className={this.activeRoute('logs/quickview') || this.activeRoute('logs/download') ? 'active' : ''}>
                                <a onClick={() => this.setState({ logsCollapsed: !logsCollapsed })}>
                                    <i className="fa fa-bars fa-fw"></i>
                                    <span className="menu-title">Logs</span>
                                </a>
                                <ul className={classNames({ 'nav-sub': true, 'collapse': !logsCollapsed })}>
                                    <li>
                                        <Link title="View last 300 lines of log" to="/admin/logs/quickview" className={this.activeRoute(['logs/quickview']) ? 'active' : ''}>
                                            <span className="submenu-title">Quick View</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link title="Download log files" to="/admin/logs/download" className={this.activeRoute(['logs/download']) ? 'active' : ''}>
                                            <span className="submenu-title">Download</span>
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            <li style={{ 'color': '#B3B8C3' }} className={this.activeRoute('reports/quote') || this.activeRoute('reports/quote') ? 'active' : ''}>
                                <a onClick={() => this.setState({ reportCollapsed: !reportCollapsed })}>
                                    <i className="fa fa-bars fa-fw"></i>
                                    <span className="menu-title">Reports</span>
                                </a>
                                <ul className={classNames({ 'nav-sub': true, 'collapse': !reportCollapsed })}>
                                    <li>
                                        <Link title="Quote" to="/admin/reports/quote" className={this.activeRoute(['reports/quote']) ? 'active' : ''}>
                                            <span className="submenu-title">Quote report</span>
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </nav>: <nav className="sidebarNav">
                        <h5 className="sidebar-header">Navigation</h5>
                        <ul className="nav nav-pills nav-stacked">
                            <li className={this.activeRoute('dashboard') ? 'active' : ''}>
                                <Link to={`${baseUrl}/dashboard`} title="dashboard">
                                    <i className="fa fa-fw fa-tachometer"></i>
                                    <span className="menu-title">Dashboard</span>
                                </Link>
                            </li>

                            <li className={this.activeRoute('clientemployees') ? 'active' : ''}>
                                <Link to={`${baseUrl}/clientemployees`} title="Client Employees">
                                    <i className="fa fa-fw fa-users"></i>
                                    <span className="menu-title">Client Employees</span>
                                </Link>
                            </li>

                            <li className={this.activeRoute('client-ras') ? 'active' : ''}>
                                <Link to={`${baseUrl}/client-ras`} title="Return Authorization">
                                    <i className="fa fa-fw fa-tachometer"></i>
                                    <span className="menu-title">Return Authorization</span>
                                </Link>
                            </li>
                            <li style={{ 'color': '#B3B8C3' }} className={this.activeRoute('clientproducts') || this.activeRoute('clientproducts/import') ? 'active' : ''}>
                                <a onClick={() => this.setState({ clientProductsCollapsed: !clientProductsCollapsed })} style={{ 'cursor': 'pointer' }}>
                                    <i className="fas fa-archive"></i>
                                    <span className="menu-title">Client Products</span>
                                </a>
                                <ul className={classNames({ 'nav-sub': true, 'collapse': !clientProductsCollapsed })}>
                                    <li>
                                        <Link title="View All Augment Address Rules" to={`${baseUrl}/clientproducts`} className={this.activeRoute(['clientproducts']) ? 'active' : ''}>
                                            <i className="fas fa-list"></i>
                                            <span className="submenu-title">List</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link title="Add New Augment Address Rule" to={`${baseUrl}/clientproducts/import`} className={this.activeRoute(['clientproducts/import']) ? 'active' : ''}>
                                            <i className="fas fa-upload"></i>
                                            <span className="submenu-title">Import</span>
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </nav>}
                </div>
            </aside>
        );
    }
}

SidebarPush.contextTypes = {
    router: PropTypes.object
};

const mapStateToProps = (state) => {
    return {
        redirect: state.auth.redirect,
        clientname: state.auth.clientname,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        logout: () => dispatch(logout()),
        verifyToken: () => dispatch(verifyToken()),
        getUser: (token) => dispatch(getUser(token)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SidebarPush));

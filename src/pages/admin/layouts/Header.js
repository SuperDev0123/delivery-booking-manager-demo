import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
const $ = window.$;

class Header extends Component {
    static propTypes = {
        sidebarPush: PropTypes.func.isRequired,
    };

    sidebarOverlay() {
        $('#sidebar-right').toggleClass('sidebar-right-open');
        $('#toggle-right .fa').toggleClass('fa-indent fa-dedent');
    }

    render() {
        const { sidebarPush } = this.props;

        return (
            <header id="header">
                <div className="brand">
                    <Link to="/admin" className="logo">
                        <span>DME</span>ADMIN
                    </Link>
                </div>
                <ul className="nav navbar-nav navbar-left">
                    <li className="toggle-navigation toggle-left">
                        <button className="sidebar-toggle" id="toggle-left" onClick={sidebarPush} >
                            <i className="fa fa-bars"></i>
                        </button>
                    </li>
                </ul>
            </header>
        );
    }
}

export default Header;

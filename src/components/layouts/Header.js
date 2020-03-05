import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
const $ = window.$;

class Header extends Component {
    static propTypes = {
        sidebarPush: PropTypes.func.isRequired,
    };

  
    sidebarOverlay (){
        $('#sidebar-right').toggleClass('sidebar-right-open');
        $('#toggle-right .fa').toggleClass('fa-indent fa-dedent');
    }
  
    render () {
        return (
            <header id="header">
                <div className="brand">
                    <Link to="/" className="logo">
                        <span>DME</span>ADMIN
                    </Link>
                </div>
                <ul className="nav navbar-nav navbar-left">
                    <li className="toggle-navigation toggle-left">
                        <button className="sidebar-toggle" id="toggle-left" onClick={this.props.sidebarPush} >
                            <i className="fa fa-bars"></i>
                        </button>
                    </li>
                    {/* <li className="toggle-profile hidden-xs">
                        <button type="button" className="btn btn-default" id="toggle-profile">
                            <i className="icon-user"></i>
                        </button>
                    </li> */}
                    {/* <li className="hidden-xs">
                        <input type="text" className="search" placeholder="Search project..."/>
                        <button type="submit" className="btn btn-sm btn-search">
                            <i className="fa fa-search"></i>
                        </button>
                    </li> */}
                </ul>
                {/* <ul className="nav navbar-nav navbar-right">
                    <li className="toggle-navigation toggle-right">
                        <button className="sidebar-toggle" id="toggle-right" onClick={this.sidebarOverlay} >
                            <i className="fa fa-indent"></i>
                        </button>
                    </li>
                </ul> */}
            </header>
        );
    }
}

export default Header;

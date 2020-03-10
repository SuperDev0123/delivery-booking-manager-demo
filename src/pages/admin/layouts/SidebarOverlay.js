import React, { Component } from 'react';

class SidebarOverlay extends Component {
    render () {
        return (
            <aside id="sidebar-right" >
                <h4 className="sidebar-title">contact List</h4>
                <div id="contact-list-wrapper">
                    <div className="heading">
                        <ul>
                            <li className="new-contact">
                                <a href='#' onClick={e => e.preventDefault()}>
                                    <i className="fa fa-plus"></i>
                                </a>
                            </li>
                            <li>
                                <input type="text" className="search" placeholder="Search"/>
                                <button type="submit" className="btn btn-sm btn-search">
                                    <i className="fa fa-search"></i>
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div id="contact-list"></div>
                    <div id="contact-user">
                        <div className="chat-user active">
                            <span>
                                <i className="icon-bubble"></i>
                            </span>
                        </div>
                        <div className="email-user">
                            <span>
                                <i className="icon-envelope-open"></i>
                            </span>
                        </div>
                        <div className="call-user">
                            <span>
                                <i className="icon-call-out"></i>
                            </span>
                        </div>
                    </div>
                </div>
            </aside>
        );
    }
}

export default SidebarOverlay;

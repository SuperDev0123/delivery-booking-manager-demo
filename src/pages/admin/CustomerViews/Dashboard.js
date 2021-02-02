import React, { Component } from 'react';

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: ''
        };
    }

    render() {
        return (
            <div id="main-wrapper" className="theme-default admin-theme">
                <div className="pageheader">
                    <h1>Dashboard</h1>
                    <p className="description">Welcome to DME Customer Dashboard</p>

                    <p>
                        DME CUSTOMER DASHBOARD
                        IN DEVELOPMENT
                    </p>
                </div>
            </div>
        );
    }
}

export default Dashboard;

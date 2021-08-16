import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class Footer extends Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        location: PropTypes.object.isRequired,
    };

    render() {
        const currentRoute = this.props.location.pathname;
        if (currentRoute.indexOf('admin') > -1 || currentRoute.indexOf('customerdashboard') > -1 || currentRoute.indexOf('/status/') > -1) 
            return null;
        else return (
            <footer className="bg-dark text-center px-3 text-white fixed-bottom">
                <span>
                    {'© 2020 Limited. All rights reserved. "Deliver-Me" and "Beautiful business" are trademarks of Deliver-Me Limited.'}
                </span>
            </footer>
        );
    }
}

export default withRouter(connect(null, {})(Footer));
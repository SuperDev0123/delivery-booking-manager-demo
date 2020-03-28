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
        console.log('currentRoute', currentRoute);
        if (currentRoute.indexOf('admin') > -1)
            return null;
        else return (
            <footer className="bg-dark text-center px-3 text-white">
                <span>
                    {'© 2018 Limited. All rights reserved. "Deliver-Me" and "Beautiful business" are trademarks of Deliver-Me Limited.'}
                </span>
            </footer>
        );
    }
}

export default withRouter(connect(null, {})(Footer));

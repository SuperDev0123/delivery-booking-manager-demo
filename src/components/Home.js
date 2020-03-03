import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

// import '../assets/styles/vendor.scss';
// import '../assets/styles/main.scss';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import '../styles/app.scss';

class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
    
        };

    }

    static propTypes = {
        children: PropTypes.object.isRequired,
    }

    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}

export default withRouter(connect(null, {})(Home));

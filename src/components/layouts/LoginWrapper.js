import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PageWrapper from './PageWrapper';

class LoginWrapper extends Component{

    static propTypes = {
        handleLoginCheck: PropTypes.func.isRequired,
        children: PropTypes.object.isRequired,
    };

    render() {
        return (
            <PageWrapper handleLoginCheck={this.props.handleLoginCheck}>
                {this.props.children}
            </PageWrapper>      
        );
    }
}

export default LoginWrapper;

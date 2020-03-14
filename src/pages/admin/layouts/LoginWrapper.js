import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PageWrapper from './PageWrapper';

class LoginWrapper extends Component {
    static propTypes = {
        children: PropTypes.object.isRequired,
    };

    render() {
        const { children } = this.props;

        return (
            <PageWrapper>
                {children}
            </PageWrapper>
        );
    }
}

export default LoginWrapper;

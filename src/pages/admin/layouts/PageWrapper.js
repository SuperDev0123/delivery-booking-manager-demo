import React, { Component } from 'react';
import PropTypes from 'prop-types';

class PageWrapper extends Component {
    static propTypes = {
        handleLoginCheck: PropTypes.func.isRequired
    };

    static propTypes = {
        children: PropTypes.object.isRequired,
    };

    render () {
        const children = React.Children.map(this.props.children, child => {
            return React.cloneElement(child, { handleLoginCheck: () => this.props.handleLoginCheck});
        });
        return (
            <section className="main-content-wrapper">
                {children}
            </section>
        );
    }
}

export default PageWrapper;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import PageWrapper from './PageWrapper';
import SidebarPush from './SidebarPush';

class MainWrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDesktop: false,
            sidebarClass: 'sidebar-opened',
        };
    }

    static propTypes = {
        children: PropTypes.object.isRequired,
    };

    componentDidMount() {
        this.updatePredicate();
        window.addEventListener('resize', this.updatePredicate);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updatePredicate);
    }

    updatePredicate = () => {
        this.setState({ isDesktop: window.innerWidth > 767 });
    }

    sidebarPush = () => {
        const { sidebarClass, isDesktop } = this.state;

        if (sidebarClass === '') {
            (isDesktop)
                ? this.setState({ sidebarClass: 'sidebar-mini' })
                : this.setState({ sidebarClass: 'sidebar-opened' });
        } else {
            this.setState({ sidebarClass: '' });
        }
    }
    
    render() {
        const { children } = this.props;
        const { sidebarClass } = this.state;

        return (
            <div id="main-wrapper" className={'theme-default admin-theme ' + sidebarClass}>
                <Header sidebarPush={this.sidebarPush} />
                <SidebarPush />
                <PageWrapper>
                    {children}
                </PageWrapper>
            </div>
        );
    }
}

export default MainWrapper;

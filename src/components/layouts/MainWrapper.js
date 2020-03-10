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
            sidebarClass: ''
        };

    }

    static propTypes = {
        handleLoginCheck: PropTypes.func.isRequired,
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
        if(this.state.sidebarClass === ''){
            (this.state.isDesktop) ? this.setState({ sidebarClass: 'sidebar-mini' }) : this.setState({ sidebarClass: 'sidebar-opened' });
        }else{
            this.setState({ sidebarClass: '' });
        }  
    }
    render() {
        return (
            <div id="main-wrapper" className={'theme-default admin-theme ' + this.state.sidebarClass}>
                <Header sidebarPush={this.sidebarPush} />
                <SidebarPush handleLoginCheck={this.props.handleLoginCheck} />
                <PageWrapper handleLoginCheck={this.props.handleLoginCheck}>
                    {this.props.children}
                </PageWrapper>
            </div>
        );
    }
}

export default MainWrapper;

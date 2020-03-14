import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import MainWrapper from './layouts/MainWrapper';
import LoginWrapper from './layouts/LoginWrapper';
import SidebarOverlay from './layouts/SidebarOverlay';

import { verifyToken, cleanRedirectState } from '../../state/services/adminAuthService';
import '../../assets/styles/vendor.scss';
import '../../assets/styles/main.scss';

class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            isLoggedIn: false
        };
        this.loginCheck = this.loginCheck.bind(this);
    }

    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.object.isRequired,
        children: PropTypes.object.isRequired,
    }

    componentDidMount() {
        console.log('componentDidMount');
        const token = localStorage.getItem('admin_token');
        console.log('admin_token', token);
        if (token && token.length > 0) {
            console.log('verifyToken');
            this.props.verifyToken();
        } else {
            console.log('Redirect');
            // localStorage.setItem('isAdminLoggedIn', 'false');
            // this.props.cleanRedirectState();
            this.props.history.push('/admin/login');
        }
        this.setState({ isLoggedIn: (!localStorage.getItem('admin_token') || localStorage.getItem('admin_token') == 'false') ? false : true });
    }

    loginCheck() {
        const token = localStorage.getItem('admin_token');
        console.log('loginCheck', token);

        if (token && token.length > 0) {
            this.props.verifyToken();
        } else {
            localStorage.setItem('isAdminLoggedIn', 'false');
        }
        this.setState({ isLoggedIn: (!localStorage.getItem('admin_token') || localStorage.getItem('admin_token') == 'false') ? false : true });
    }

    render() {
        const isLoggedIn = this.state.isLoggedIn;

        return (
            <React.Fragment>
                {isLoggedIn ? (
                    <React.Fragment>
                        <MainWrapper handleLoginCheck={this.loginCheck}>
                            {this.props.children}
                        </MainWrapper>
                        <SidebarOverlay />
                    </React.Fragment>
                ) : (
                    <LoginWrapper handleLoginCheck={this.loginCheck}>
                        {this.props.children}
                    </LoginWrapper>
                )}
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        redirect: state.adminAuth.redirect,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));

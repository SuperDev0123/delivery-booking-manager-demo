import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import MainWrapper from './layouts/MainWrapper';
import LoginWrapper from './layouts/LoginWrapper';
import SidebarOverlay from './layouts/SidebarOverlay';

import { verifyToken, cleanRedirectState } from '../state/services/authService'; 

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
        const token = localStorage.getItem('token');

        if (token && token.length > 0) {
            this.props.verifyToken();
        } else {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/');
        }
        this.setState({ isLoggedIn: (!localStorage.getItem('token') || localStorage.getItem('token') == 'false')?false:true  });
    }

    loginCheck() {
        const token = localStorage.getItem('token');

        if (token && token.length > 0) {
            this.props.verifyToken();
        } else {
            localStorage.setItem('isLoggedIn', 'false');
        }
        this.setState({ isLoggedIn: (!localStorage.getItem('token') || localStorage.getItem('token') == 'false')?false:true  });
    }

    render() {
        const isLoggedIn = this.state.isLoggedIn;
        return (
            <div>
                { isLoggedIn ? (
                    <div>
                        <MainWrapper handleLoginCheck={this.loginCheck}>
                            {this.props.children}
                        </MainWrapper>
                        <SidebarOverlay />
                    </div>
                ) : (
                    <LoginWrapper handleLoginCheck={this.loginCheck}>
                        {this.props.children}
                    </LoginWrapper>
                )}

            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        redirect: state.auth.redirect,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));

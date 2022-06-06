import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import MainWrapper from './layouts/MainWrapper';
import LoginWrapper from './layouts/LoginWrapper';

import { verifyToken } from '../../state/services/authService';
import '../../assets/styles/vendor.scss';
import '../../assets/styles/main.scss';

class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.bool.isRequired,
        children: PropTypes.array.isRequired,
    }

    componentDidMount() {
        const token = localStorage.getItem('token');

        if (this.props.history.location.pathname.indexOf('admin') > -1) {
            
            if (token && token.length > 0) {
                this.props.verifyToken();
            } else {
                localStorage.setItem('isLoggedIn', 'false');
                this.props.history.push('/admin');
            }
        }
        else if (this.props.history.location.pathname.indexOf('customerdashboard') > -1) {
            if (token && token.length > 0) {
                this.props.verifyToken();
            } else {
                localStorage.setItem('isLoggedIn', 'false');
                this.props.history.push('/customerdashboard');
            }
        }
    }

    render() {
        const token = localStorage.getItem('token');

        if (this.props.history.location.pathname.indexOf('admin') > -1 || this.props.history.location.pathname.indexOf('customerdashboard') > -1)
            return (
                <React.Fragment>
                    {token ? (
                        <React.Fragment>
                            <MainWrapper>
                                {this.props.children}
                            </MainWrapper>
                        </React.Fragment>
                    ) : (
                        <LoginWrapper>
                            {this.props.children}
                        </LoginWrapper>
                    )}
                </React.Fragment>
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
        verifyToken: () => dispatch(verifyToken())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));

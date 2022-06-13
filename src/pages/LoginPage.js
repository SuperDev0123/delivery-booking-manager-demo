import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LoadingOverlay from 'react-loading-overlay';

import { getToken, getUser, resetErrorMsg } from '../state/services/authService';

class LoginPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            loading: false,
            errorMessage: '',
        };
    }

    static propTypes = {
        getToken: PropTypes.func.isRequired,
        getUser: PropTypes.func.isRequired,
        resetErrorMsg: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        token: PropTypes.string
    };

    UNSAFE_componentWillReceiveProps(newProps) {
        const { token, username, errorMessage } = newProps;

        if (token != this.props.token) {
            this.props.getUser(token);
        }

        if (username) {
            this.props.history.push('/home');
            this.setState({loading: false});
        }


        if (errorMessage) {
            this.setState({errorMessage, loading: false});
        }
    }

    onInputChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    onSubmit(event) {
        event.preventDefault();
        const { username, password } = this.state;
        this.props.resetErrorMsg();
        this.props.getToken(username, password);
        this.setState({errorMessage: null, loading: true });
    }

    render() {
        const { errorMessage } = this.state;

        return (
            <section className="theme-bg">
                <LoadingOverlay
                    active={this.state.loading}
                    spinner
                    text='Loading...'
                >

                    <div className="container h-100vh">
                        <div className="row justify-content-md-center mt-md-5 mt-sm-0">
                            <div className=" col-md-4 col-sm-12 theme-bg rounded-left">

                                <form onSubmit={(e) => this.onSubmit(e)} className="form-signin text-center">
                                    <h1 className="h4 mb-5 mt-5 font-weight-normal">Welcome to Deliver-Me </h1>
                                    <div className="input-group input-group-text bg-white borderB">
                                        <span className="input-group-addon bg-white">
                                            <i className="fa fa-envelope text-lightgray"></i>
                                        </span>
                                        <input name="username" className="form-control border-0 txtFocus inputSpace" type="text" placeholder="User Name" value={this.state.username} onChange={(e) => this.onInputChange(e)} />
                                    </div>
                                    <div className="input-group input-group-text bg-white borderT">
                                        <span className="input-group-addon bg-white">
                                            <i className="fa fa-lock text-lightgray"></i>
                                        </span>
                                        <input name="password" className="form-control border-0 txtFocus inputSpace" type="password" placeholder="Password" value={this.state.password} onChange={(e) => this.onInputChange(e)} />
                                    </div>
                                    {
                                        errorMessage &&
                                            <p className="error-message">{ errorMessage }</p>
                                    }
                                    <button className="btn btn-lg btn-info mt-md-2 btn-block">Sign in</button>
                                    <p className="mt-5 mb-0"><a href="/forgot-password" className="text-offlight">Forgot your password?</a></p>
                                </form>

                            </div>
                            <div className="col-md-5 col-sm-12 bg-light login-info-center rounded-right rounded-sm-0">
                                <div className="login-info-center">
                                    <div className="login-info-divider mt-5"></div>
                                    <h1 className="login-info-title">Your Freight - Your Delivery</h1>
                                    <div className="login-info-divider mb-5"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </LoadingOverlay>
            </section>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        username: state.auth.username,
        errorMessage: state.auth.errorMessage,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getToken: (username, password) => dispatch(getToken(username, password)),
        getUser: (token) => dispatch(getUser(token)),
        resetErrorMsg: () => dispatch(resetErrorMsg()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LoadingOverlay from 'react-loading-overlay';

import { getUser, resetPassword } from '../state/services/authService';

class ForgotPasswordPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            loading: false,
        };
    }

    static propTypes = {
        getUser: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        resetPassword: PropTypes.func.isRequired,
    };

    UNSAFE_componentWillReceiveProps(newProps) {
        const { token, username, errorMessage, successMessage } = newProps;

        if (token)
            this.props.getUser(token);

        if (username) {
            this.props.history.push('/home');
            this.setState({loading: false});
        }

        if (errorMessage)
            this.setState({errorMessage, loading: false});this.setState({successMessage, loading: false});

        if (successMessage)
            this.setState({successMessage, loading: false});this.setState({errorMessage, loading: false});
    }

    onInputChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    onSubmit(event) {
        if (typeof window !== 'undefined') {
            var path = location.protocol + '//' + location.host; // (or whatever)
        } else {
            // work out what you want to do server-side...
        }
        console.log(path);
        const { username } = this.state;
        this.props.resetPassword(username, path);
        this.setState({loading: true});
        event.preventDefault();
    }

    render() {
        const { username, errorMessage, successMessage } = this.state;
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
                                    <h1 className="h4 mb-5 mt-5 font-weight-normal">Forgot Your Password? </h1>
                                    <p>Please enter your email address below to receive a password reset link.</p>
                                    <div className="input-group input-group-text bg-white borderB">
                                        <span className="input-group-addon bg-white">
                                            <i className="fa fa-envelope text-lightgray"></i>
                                        </span>
                                        <input name="username" className="form-control border-0 txtFocus inputSpace" type="text" placeholder="Email Address" value={this.state.username} onChange={(e) => this.onInputChange(e)} />
                                    </div>
                                    {
                                        errorMessage &&
                                            <p className="error-message">{ errorMessage }</p>
                                    }
                                    {
                                        successMessage &&
                                            <p style={{color:'green'}} className="success-message">{ successMessage }</p>
                                    }
                                    <button disabled={username === ''} className="btn btn-lg btn-info mt-md-2 btn-block">Submit</button>
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
        successMessage: state.auth.successMessage
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        resetPassword: (username, path) => dispatch(resetPassword(username, path)),
        getUser: (token) => dispatch(getUser(token)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordPage);

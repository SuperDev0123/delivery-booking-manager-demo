import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LoadingOverlay from 'react-loading-overlay';

import { getUser, resetPasswordConfirm } from '../state/services/authService';

class ResetPasswordPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            token: '',
            password: '',
            rpassword: '',
            loading: false,
        };
    }

    static propTypes = {
        resetPasswordConfirm: PropTypes.func.isRequired,
        getUser: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
    };

    UNSAFE_componentWillReceiveProps(newProps) {
        const { token, errorMessage, successMessage } = newProps;

        if (token)
            this.props.getUser(token);

        if (errorMessage)
            this.setState({errorMessage, loading: false});this.setState({successMessage, loading: false});

        if (successMessage)
            this.setState({successMessage, loading: false});this.setState({errorMessage, loading: false});
    }

    onInputChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    onSubmit(event) {
        const params = new URLSearchParams(this.props.location.search);
        const token = params.get('token');
        const email = params.get('email');
        const { password } = this.state;
        this.props.resetPasswordConfirm(token, email, password);
        this.setState({loading: true});
        event.preventDefault();
    }

    render() {
        const { errorMessage, successMessage, password, rpassword } = this.state;

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
                                    <h1 className="h4 mb-5 mt-5 font-weight-normal">Reset Password </h1>
                                    <div className="input-group input-group-text bg-white borderB">
                                        <span className="input-group-addon bg-white">
                                            <i className="fa fa-envelope text-lightgray"></i>
                                        </span>
                                        <input
                                            name="password"
                                            className="form-control border-0 txtFocus inputSpace"
                                            type="password"
                                            placeholder="New Password"
                                            value={password}
                                            onChange={(e) => this.onInputChange(e)}
                                        />
                                    </div>
                                    <div className="input-group input-group-text bg-white borderT">
                                        <span className="input-group-addon bg-white">
                                            <i className="fa fa-envelope text-lightgray"></i>
                                        </span>
                                        <input
                                            name="rpassword"
                                            className="form-control border-0 txtFocus inputSpace"
                                            type="password"
                                            placeholder="Confirm New Password"
                                            value={rpassword}
                                            onChange={(e) => this.onInputChange(e)}
                                        />
                                    </div>
                                    {
                                        errorMessage &&
                                            <p className="error-message">{ errorMessage }</p>
                                    }
                                    {
                                        successMessage &&
                                            <p style={{color:'green'}} className="success-message">{ successMessage }</p>
                                    }
                                    <button
                                        disabled={!password || password!==rpassword || successMessage}
                                        className="btn btn-lg btn-info mt-md-2 btn-block"
                                    >
                                        Submit
                                    </button>
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
        errorMessage: state.auth.errorMessage,
        successMessage: state.auth.successMessage
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        resetPasswordConfirm: (token, email, password) => dispatch(resetPasswordConfirm(token, email, password)),
        getUser: (token) => dispatch(getUser(token)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetPasswordPage);

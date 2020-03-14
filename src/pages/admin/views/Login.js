import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getToken, getUser, verifyToken, cleanRedirectState, logout } from '../../../state/services/authService';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
        };
    }

    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        getToken: PropTypes.func.isRequired,
        logout: PropTypes.func.isRequired,
        getUser: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
    };

    componentDidMount() {
        const token = localStorage.getItem('token');

        if (token && token.length > 0) {
            this.props.verifyToken();
        } else {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/admin');
        }

        if (token) {
            this.props.getUser(token);
        }
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { token, username, clientname, errorMessage } = newProps;

        if (token) {
            this.props.getUser(token);
        }

        if (username && clientname && clientname === 'dme') {
            this.props.history.push('/admin/dashboard');
        } else {
            this.props.logout();
            this.setState({ errorMessage: 'Invalid username or password!'});
        }

        if (errorMessage) {
            this.setState({ errorMessage });
        }
    }

    onInputChange(event) {
        this.setState({ [event.target.name]: event.target.value, errorMessage: null });
    }

    onSubmit(event) {
        const { username, password } = this.state;
        this.props.getToken(username, password);
        event.preventDefault();
    }

    render() {
        const { errorMessage, username, password } = this.state;

        return (
            <section className="admin-login container animated fadeInUp">
                <div className="row">
                    <div className="col-md-6 col-md-offset-3">
                        <div id="login-wrapper">
                            <header>
                                <div className="brand">
                                    <a href="/admin" className="logo">
                                        <i className="fa fa-user"></i>    <span>DME</span>ADMIN
                                    </a>
                                </div>
                            </header>
                            <div className="panel panel-primary">
                                <div className="panel-heading">
                                    <h6 className="">
                                        Sign In
                                    </h6>
                                </div>
                                <div className="panel-body">
                                    <form onSubmit={(e) => this.onSubmit(e)} className="form-horizontal" role="form">
                                        <div className="form-group">
                                            <div className="col-md-12">
                                                <input
                                                    name="username"
                                                    type="text"
                                                    className="form-control"
                                                    id="email"
                                                    placeholder="Username"
                                                    value={username}
                                                    onChange={(e) => this.onInputChange(e)}
                                                />
                                                <i className="fa fa-user"></i>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-md-12">
                                                <input
                                                    name="password"
                                                    type="password"
                                                    className="form-control"
                                                    id="password"
                                                    placeholder="Password"
                                                    value={password}
                                                    onChange={(e) => this.onInputChange(e)}
                                                />
                                                <i className="fa fa-lock"></i>
                                            </div>
                                        </div>
                                        {username && password && errorMessage &&
                                            <p className="error-message">{errorMessage}</p>
                                        }
                                        <a
                                            href="/forget-password"
                                            className="help-block"
                                        >
                                            Forgot Your Password?
                                        </a>
                                        <div className="form-group">
                                            <div className="col-md-12">
                                                <button className="btn btn-primary btn-block">Sign in</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        username: state.auth.username,
        clientname: state.auth.clientname,
        errorMessage: state.auth.errorMessage,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        getToken: (username, password) => dispatch(getToken(username, password)),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        getUser: (token) => dispatch(getUser(token)),
        logout: () => dispatch(logout()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);

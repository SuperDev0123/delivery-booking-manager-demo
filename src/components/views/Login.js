import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LoadingOverlay from 'react-loading-overlay';

import { getToken, getUser } from '../../state/services/authService';
import { verifyToken, cleanRedirectState } from '../../state/services/authService';  

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            loading: false,
        };
        console.log(props);
        //this.props.handleLoginCheck = this.props.handleLoginCheck.bind(this);
    }

    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        getToken: PropTypes.func.isRequired,
        getUser: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        handleLoginCheck: PropTypes.func.isRequired,
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
    
        if (token)
            this.props.getUser(token);
            //this.props.handleLoginCheck();

        /*if (username) {
            this.props.history.push('/dashboard');
            this.setState({loading: false});
        }*/
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { token, username, errorMessage } = newProps;

        if (token)
            this.props.getUser(token);

        if (username) {
            
            this.props.history.push('/dashboard');
            this.setState({loading: false});
        }

        if (errorMessage)
            this.setState({errorMessage, loading: false});
    }

    onInputChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    onSubmit(event) {
        const { username, password } = this.state;
        this.props.getToken(username, password);
        this.setState({loading: true});
        event.preventDefault();
    }

    render() {
        console.log('Login');
        const { errorMessage } = this.state;

        return (
            <section className="container animated fadeInUp">
                <LoadingOverlay
                    active={this.state.loading}
                    spinner
                    text='Loading...'
                />
                <div className="row">
                    <div className="col-md-6 col-md-offset-3">
                        <div id="login-wrapper">
                            <header>
                                <div className="brand">
                                    <a href="index.html" className="logo">
                                        <i className="icon-layers"></i>
                                        <span>DME</span> ADMIN</a>
                                </div>
                            </header>
                            <div className="panel panel-primary">
                                <div className="panel-heading">
                                    <h6 className="">
                                        Sign In
                                    </h6>
                                </div>
                                <div className="panel-body">
                                    <p> Login to access your account.</p>
                                    <form onSubmit={(e) => this.onSubmit(e)} className="form-horizontal" role="form">
                                        <div className="form-group">
                                            <div className="col-md-12">
                                                <input name="username" type="text" className="form-control" id="email" placeholder="Username" value={this.state.username} onChange={(e) => this.onInputChange(e)} />
                                                <i className="fa fa-user"></i>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-md-12">
                                                <input name="password" type="password" className="form-control" id="password" placeholder="Password" value={this.state.password} onChange={(e) => this.onInputChange(e)}  />
                                                <i className="fa fa-lock"></i>
                                                <a href="javascript:void(0)" className="help-block">Forgot Your Password?</a>
                                            </div>
                                        </div>
                                        {
                                            errorMessage &&
                                                <p className="error-message">{ errorMessage }</p>
                                        }
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
        errorMessage: state.auth.errorMessage,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        getToken: (username, password) => dispatch(getToken(username, password)),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        getUser: (token) => dispatch(getUser(token)),
        //handleLoginCheck: () => dispatch(handleLoginCheck())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);

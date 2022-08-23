import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LoadingOverlay from 'react-loading-overlay';
import { withRouter, Link } from 'react-router-dom';

import { verifyToken, cleanRedirectState } from '../../../../state/services/authService';
import { getAllUsers, getUserDetails, updateUserDetails } from '../../../../state/services/userService';

class AddUser extends Component {
    constructor(props) {
        super(props);

        this.state = {
            first_name: '',
            last_name: '',
            user_name: '',
            user_email: '',
            loading: false,
            userDetails: {},
        };
    }

    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.bool.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
        urlAdminHome: PropTypes.string.isRequired,
        match: PropTypes.object.isRequired,
        getUserDetails: PropTypes.func.isRequired,
        updateUserDetails: PropTypes.func.isRequired,
        getAllUsers: PropTypes.func.isRequired,
    }

    componentDidMount() {
        const token = localStorage.getItem('token');
        const userId = this.props.match.params.id;

        if (token && token.length > 0) {
            this.props.verifyToken();
        } else {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/admin');
        }
        this.props.getUserDetails(userId);
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { redirect, userDetails } = newProps;
        const currentRoute = this.props.location.pathname;
        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/admin');
        }

        if (userDetails) {
            const { first_name, last_name, username, email } = userDetails;
            this.setState({ userDetails, first_name, last_name, user_name: username, user_email: email });
        }
    }

    onInputChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    onSubmit(event) {
        this.setState({ loading: true });
        const { first_name, last_name, user_email, userDetails } = this.state;
        this.props.updateUserDetails({ id: userDetails.id, first_name, last_name, user_email });
        this.setState({ loading: false });
        this.props.getAllUsers();
        this.props.history.push('/admin/users');
        event.preventDefault();
    }

    render() {
        return (
            <div>
                <div className="pageheader">
                    <h1>Add User</h1>
                    <div className="breadcrumb-wrapper hidden-xs">
                        <span className="label">You are here:</span>
                        <ol className="breadcrumb">
                            <li><Link to={this.props.urlAdminHome}>Home</Link>
                            </li>
                            <li><Link to="/admin/users">Edit Users</Link></li>
                            <li className="active">Add New</li>
                        </ol>
                    </div>
                </div>
                <section id="main-content" className="animated fadeInUp">
                    <LoadingOverlay
                        active={this.state.loading}
                        spinner
                        text='Loading...'
                    />
                    <div className="row">
                        <div className="col-md-6">
                            <div className="panel panel-default">
                                <div className="panel-heading">
                                    <h3 className="panel-title">Add New</h3>
                                    <div className="actions pull-right">

                                    </div>
                                </div>
                                <div className="panel-body">
                                    <form onSubmit={(e) => this.onSubmit(e)} role="form">
                                        <div className="form-group">
                                            <label htmlFor="first_name">First Name</label>
                                            <input name="first_name" type="text" className="form-control" id="first_name" placeholder="Enter First Name" value={this.state.first_name} onChange={(e) => this.onInputChange(e)} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="last_name">Last Name</label>
                                            <input name="last_name" type="text" className="form-control" id="last_name" placeholder="Enter Last Name" value={this.state.last_name} onChange={(e) => this.onInputChange(e)} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="user_name">User Name</label>
                                            <input name="user_name" type="text" className="form-control" id="user_name" placeholder="Enter User Name" value={this.state.user_name} onChange={(e) => this.onInputChange(e)} readOnly />
                                            <i>*This field cannot be changed</i>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="user_email">Email</label>
                                            <input name="user_email" type="email" className="form-control" id="user_email" placeholder="Enter Email" value={this.state.user_email} onChange={(e) => this.onInputChange(e)} />
                                        </div>
                                        <button type="submit" className="btn btn-primary mt-5 mb-5">Submit</button>
                                    </form>


                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        redirect: state.auth.redirect,
        username: state.auth.username,
        urlAdminHome: state.url.urlAdminHome,
        userDetails: state.user.userDetails,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        getUserDetails: (userId) => dispatch(getUserDetails(userId)),
        updateUserDetails: (user) => dispatch(updateUserDetails(user)),
        getAllUsers: () => dispatch(getAllUsers()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddUser));

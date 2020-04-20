import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

export function AdminPrivateRoute({ component: Component, ...rest }) {
    return (
        <Route
            {...rest}
            render = {props =>
                isLogged() === 'true' ? 
                    (
                        <Component {...props} />
                    ) 
                    : 
                    (
                        <Redirect
                            to={{
                                pathname: '/admin/login',
                                state: { from: props.location }
                            }}
                        />
                    )
            }
        />
    );
}

AdminPrivateRoute.propTypes = {
    location: PropTypes.object,
    component: PropTypes.object.isRequired,
};

const isLogged = () => {
    return localStorage.getItem('isLoggedIn');
};

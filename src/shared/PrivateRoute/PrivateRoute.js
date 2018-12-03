import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

export function PrivateRoute({ component: Component, ...rest }) {
    return (
        <Route
            {...rest}
            render={props =>
                isLogged() === 'true' ? 
                    (
                        <Component {...props} />
                    ) 
                    : 
                    (
                        <Redirect
                            to={{
                                pathname: '/login',
                                state: { from: props.location }
                            }}
                        />
                    )
            }
        />
    );
}

PrivateRoute.propTypes = {
    location: PropTypes.object.isRequired,
    component: PropTypes.object.isRequired,
};

const isLogged = () =>
{
    return localStorage.getItem('isLoggedIn');
};
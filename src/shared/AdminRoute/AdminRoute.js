import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

export function AdminRoute({ component: Component, ...rest }) {
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
                                pathname: '/admin/login',
                                state: { from: props.location }
                            }}
                        />
                    )
            }
        />
    );
}

AdminRoute.propTypes = {
    location: PropTypes.object.isRequired,
    component: PropTypes.object.isRequired,
};

const isLogged = () => {
    return localStorage.getItem('isLoggedIn');
};

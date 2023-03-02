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
                                search: `?redirect_url=${encodeURIComponent(location.pathname + location.search)}`,
                                state: { from: props.location }
                            }}
                        />
                    )
            }
        />
    );
}

PrivateRoute.propTypes = {
    location: PropTypes.object,
    component: PropTypes.func.isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.number.isRequired
        })
    }),
};

const isLogged = () => {
    const token = localStorage.getItem('token');
    if (!token || token.length == 0) {
        return 'false';
    }
    return localStorage.getItem('isLoggedIn');
};

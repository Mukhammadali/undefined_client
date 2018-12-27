import React from 'react';
import { Redirect, Route } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      rest.authenticated ? <Component {...props} /> : <Redirect to="/auth" />
    }
  />
);

export default PrivateRoute;

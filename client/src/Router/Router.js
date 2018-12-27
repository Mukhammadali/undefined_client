import React from 'react';
import { Route, Redirect, Switch, BrowserRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { CLIENT_LOGGED_IN } from '../apollo/global/queries';
import { Error404 } from '../components';
import Auth from '../views/Auth';
import ProtectedRoutes from './ProtectedRoutes';
import PrivateRoute from './PrivateRoute';

const Router = ({ data }) => {
  const { loggedIn } = data;
  console.log('loggedIn', loggedIn);
  return (
    <BrowserRouter>
      <div
        style={{
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
          background: '#fff',
        }}
      >
        <Switch>
          <Route exact path="/">
            {loggedIn ? (
              <Redirect to="/main" />
            ) : (
              <Redirect to="/auth/login" />
            )}
          </Route>
          {/* '/main/*' -> Private Route */}
          <PrivateRoute
            path="/main"
            authenticated={loggedIn}
            component={ProtectedRoutes}
          />
          {/* '/auth' -> Public Route */}
          <Route path="/auth" component={Auth} />
          {/* if path does not match above then show Error404 */}
          <Route component={Error404} />
        </Switch>
      </div>
    </BrowserRouter>
  );
};

Router.propTypes = {
  data: PropTypes.object.isRequired,
};

export default graphql(CLIENT_LOGGED_IN)(Router);

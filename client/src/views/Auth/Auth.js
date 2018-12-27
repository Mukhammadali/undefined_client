import React, { memo } from 'react';
import { Route, Switch, Redirect, } from 'react-router-dom';
import { Error404 } from '../../components';
import { graphql } from 'react-apollo';
import { CLIENT_LOGGED_IN } from '../../apollo/global/queries';
import LogIn from './LogIn';

const Auth = memo(props => (
  <React.Fragment>
    <Switch>
      {props.data.loggedIn && <Redirect to="/main" />}
      <Route exact path="/auth">
        <Redirect to="/auth/login" />
      </Route>
      <Route exact path="/auth/login" component={LogIn} />
      <Route component={Error404} />
    </Switch>
  </React.Fragment>
));

export default graphql(CLIENT_LOGGED_IN)(Auth);

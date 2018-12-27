import React, { memo } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import styled from 'styled-components';
import { mediaQuery } from 'src/lib/constants';
import { Error404 } from 'src/components';
import { graphql } from 'react-apollo';
import { CLIENT_GET_LOGGED_IN } from 'src/graphql/global/queries';
import LogIn from './LogIn';

const Auth = memo(props => (
  <StyledLayout>
    <Switch>
      {props.data.loggedIn && <Redirect to="/main/class" />}
      <Route exact path="/auth">
        <Redirect to="/auth/login" />
      </Route>
      <Route exact path="/auth/login" component={LogIn} />
      <Route component={Error404} />
    </Switch>
  </StyledLayout>
));

export default graphql(CLIENT_GET_LOGGED_IN)(Auth);

const StyledLayout = styled.div`
  padding: 30px ${mediaQuery.small`
    padding: 8px;
    `};
`;

import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Error404 } from '../../../components';
import ManageServices from '../../../views/ManageServices';

const ProviderRoutes = props => {
  const { role, user } = props;
  console.log('CLASS_ROUTED');
  return (
    <Switch>
      <Route exact path="/main">
        <Redirect to="/main/manage-services" />
      </Route>
      <Route path="/main/manage-services">
        <ManageServices user={user} title="Manage Services"/>
      </Route>
      <Route path="/main/option-1">
        <div>Option 2</div>
      </Route>
      <Route path="/main/option-2">
        <div>Option 3</div>
      </Route>
      <Route component={Error404} />
    </Switch>
  );
};

export default ProviderRoutes;

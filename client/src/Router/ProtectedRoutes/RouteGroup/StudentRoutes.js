import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import { Error404 } from '../../../components';
import ManageServices from '../../../views/ManageServices';
import MyServices from '../../../views/MyServices';

const StudentRoutes = props => {
  const { user } = props;
  console.log('props', props);
  return (
    <Switch>
      <Route exact path="/main">
        <Redirect to="/main/enroll-voluntary-service" />
      </Route>
      <Route exact path="/main/enroll-voluntary-service">
        <ManageServices user={user} title="Enroll Voluntary Service"/>
      </Route>
      <Route exact path="/main/my-voluntary-services">
        <MyServices user={user} title="My Voluntary Services"/>
      </Route>
      <Route exact path="/main/option-2">
        <div>Option 3</div>
      </Route>
      <Route component={Error404} />
    </Switch>
  );
};

export default StudentRoutes;

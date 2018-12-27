import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router-dom';
import { compose, lifecycle } from 'recompose'
import { Error404 } from '../../../components';
import ManageServices from '../../../views/ManageServices';

const ProviderRoutes = props => {
  const { role, user } = props;
  return (
    <Switch>
      <Route exact path="/main">
        <Redirect to="/main/manage-services" />
      </Route>
      <Route exact path="/main/manage-services">
        <ManageServices user={user} title="Manage Services"/>
      </Route>
      <Route exact path="/main/registered-students">
        <div>Registered Students</div>
      </Route>
      <Route exact path="/main/option-2">
        <div>Option 3</div>
      </Route>
      <Route component={Error404} />
    </Switch>
  );
};

export default compose(
  lifecycle({
    async componentDidMount(){
      const { web3: { contract, accounts }, user } = this.props;
      console.log('user', user);
      try {
        const doesUserExist = await contract.methods.serviceProviders(user.userId).call();
        console.log('doesUserExist', doesUserExist);
        if (doesUserExist.id === '0' && user.role === 'provider') {
          await contract.methods.setServiceProvider(user.userId, user.userName).send({ from: accounts[0] });
        }
      } catch (err) {
        console.error(err)
      }
    }
  })
)(ProviderRoutes);

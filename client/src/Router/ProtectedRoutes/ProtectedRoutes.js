import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router-dom';
import { compose } from 'recompose';
import { withApollo, graphql } from 'react-apollo';

import { Layout, handleQueryLoadingError } from '../../components';
import { ME_QUERY } from '../../apollo/user/queries';
import { StudentRoutes, ProviderRoutes } from './RouteGroup';
import AppContext from '../../AppContext';

const ProtectedRoutes = ({ data }) => {
  const { role } = data.me;
  console.log('data', data);
  return (
    <AppContext.Consumer>
      {web3 => (
        <Layout user={data.me}>
          <Switch>
            {role === 'student' && <StudentRoutes user={data.me} web3={web3} />}
            {role === 'provider' && <ProviderRoutes user={data.me} web3={web3} />}
          </Switch>
        </Layout>
      )}
    </AppContext.Consumer>
  );
};

ProtectedRoutes.propTypes = {
  data: PropTypes.object.isRequired,
};

export default compose(
  withApollo,
  graphql(ME_QUERY),
  handleQueryLoadingError()
)(ProtectedRoutes);

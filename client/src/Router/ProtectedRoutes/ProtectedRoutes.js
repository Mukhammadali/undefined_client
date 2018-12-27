import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router-dom';
import { compose } from 'recompose';
import { withApollo, graphql } from 'react-apollo';

import { Layout, handleQueryLoadingError } from '../../components';
import { ME_QUERY } from '../../apollo/user/queries';
import { StudentRoutes, ProviderRoutes } from './RouteGroup';

const ProtectedRoutes = ({ data }) => {
  const { role } = data.me;
  console.log('data', data);
  return (
    <Layout user={data.me}>
      <Switch>
        {role === 'student' && <StudentRoutes user={data.me}/>}
        {role === 'provider' && <ProviderRoutes user={data.me}/>}
      </Switch>
    </Layout>
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

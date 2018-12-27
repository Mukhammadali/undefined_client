import { ApolloClient, InMemoryCache, ApolloLink, HttpLink } from 'apollo-boost';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { withClientState } from 'apollo-link-state';
import { message } from 'antd';

import resolvers from './apollo/resolvers';
import defaults from './apollo/defaults';
import { getToken } from './lib/utils/authUtils';
import config from './config';
import './App.css';
const StateLink = withClientState({ resolvers, cache, defaults });

const authLink = setContext(async (req, { headers }) => {
  const token = await getToken();
  return {
    ...headers,
    headers: { authorization: token ? `Bearer ${token}` : '' },
  };
});

const cache = new InMemoryCache({
  dataIdFromObject: o => o._id || o.id,
});



const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (networkError) {
    if (!networkError.result) {
      message.error('Failed! Server seems offline!');
    } else {
      console.error('NETWORK_ERROR', networkError.result); // eslint-disable-line
      message.error(`Server Error: ${networkError.result.errors[0].message}`);
    }
  }
  if (graphQLErrors) {
    graphQLErrors.map(error => {
      console.error(`APOLLO_ERROR: message -> ${error.message}, more ->`, error)// eslint-disable-line
    });
  }
});

const link = new HttpLink({ uri: config.GRAPHQL_ENDPOINT });


const client = new ApolloClient({
  link: ApolloLink.from([authLink, errorLink, StateLink, link]),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
  },
});

export const unsubscribeApollo = client.onResetStore(StateLink.writeDefaults);

export default client;

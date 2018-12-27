import { gql } from 'apollo-boost';

export const CLIENT_LOGGED_IN = gql`
  {
    loggedIn @client
  }
`;

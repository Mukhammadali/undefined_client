import { gql } from 'apollo-boost';

export const CLIENT_LOG_IN = gql`
  mutation clientLogIn($token: String!) {
    clientLogIn(token: $token) @client
  }
`;

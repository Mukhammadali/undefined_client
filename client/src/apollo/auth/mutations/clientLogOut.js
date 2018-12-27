import { gql } from 'apollo-boost';

export const CLIENT_LOG_OUT = gql`
  mutation clientLogOut {
    clientLogOut @client
  }
`;

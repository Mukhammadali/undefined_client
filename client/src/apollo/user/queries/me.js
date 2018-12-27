import { gql } from 'apollo-boost';

export const ME_QUERY = gql`
  query me {
    me {
      id
      userId
      userName
      role
      createdDate
    }
  }
`;

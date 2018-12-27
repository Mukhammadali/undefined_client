import { gql } from 'apollo-boost';

export const loginMutation = gql`
  mutation login($userId: String!, $password: String!) {
    login(userId: $userId, password: $password) {
      jwt
    }
  }
`;

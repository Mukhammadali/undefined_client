import { gql } from 'apollo-boost';

export const TOGGLE_USER_CREATED_MUTATION = gql`
  mutation toggleUserCreated{
    toggleUserCreated {
      id
      userId
      userName
      role
      createdDate
      isUserCreated
    }
  }

`;
import { gql } from 'apollo-boost';

export const CLIENT_STORE_CONTRACT = gql`
  mutation clientStoreContract($contract: JSON!) {
    clientStoreContract(contract: $contract) @client
  }
`;

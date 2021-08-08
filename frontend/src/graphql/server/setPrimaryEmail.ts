import { gql } from '@apollo/client';

export const SET_PRIMARY_EMAIL = gql`
  mutation SetPrimaryEmail($selectedEmail: String!, $username: String!) {
    setPrimaryEmail(selectedEmail: $selectedEmail, username: $username)
  }
`;

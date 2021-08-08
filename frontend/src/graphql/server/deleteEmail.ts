import { gql } from '@apollo/client';

export const DELETE_EMAIL = gql`
  mutation DeleteEmail($selectedEmail: String!, $username: String!) {
    deleteEmail(selectedEmail: $selectedEmail, username: $username)
  }
`;

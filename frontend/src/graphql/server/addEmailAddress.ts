import { gql } from '@apollo/client';

export const ADD_EMAIL_ADDRESS = gql`
  mutation AddEmailAddress($email: String!, $username: String!) {
    addEmail(email: $email, username: $username)
  }
`;

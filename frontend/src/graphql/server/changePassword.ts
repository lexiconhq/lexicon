import { gql } from '@apollo/client';

export const CHANGE_PASSWORD = gql`
  mutation ChangeNewPassword($email: String!) {
    changePassword(login: $email)
  }
`;

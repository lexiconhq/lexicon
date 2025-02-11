import { gql } from '@apollo/client';

export const CHANGE_PASSWORD = gql`
  mutation ChangeNewPassword($changePasswordInput: ChangePasswordInput!) {
    changePassword(changePasswordInput: $changePasswordInput)
      @rest(
        type: "ChangePasswordOutput"
        path: "/session/forgot_password.json"
        method: "POST"
        bodyKey: "changePasswordInput"
      )
  }
`;

import { gql } from '@apollo/client';

export const USER_STATUS_FRAGMENT = gql`
  fragment UserStatusFragment on UserStatus {
    emoji
    description
    endsAt
  }
`;

export const EDIT_USER_STATUS = gql`
  mutation editUserStatus($editUserStatusInput: EditUserStatusInput!) {
    editUserStatus(editUserStatusInput: $editUserStatusInput)
      @rest(
        type: "String"
        path: "/user-status.json"
        method: "PUT"
        bodyKey: "editUserStatusInput"
      )
  }
`;

export const DELETE_USER_STATUS = gql`
  mutation deleteUserStatus {
    deleteUserStatus
      @rest(type: "String", path: "/user-status.json", method: "DELETE")
  }
`;

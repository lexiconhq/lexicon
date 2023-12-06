import { gql } from '@apollo/client';

export const USER_STATUS_FRAGMENT = gql`
  fragment UserStatusFragment on UserStatus {
    emoji
    description
    endsAt
  }
`;

export const EDIT_USER_STATUS = gql`
  mutation editUserStatus(
    $description: String!
    $endsAt: String
    $emoji: String!
  ) {
    editUserStatus(description: $description, emoji: $emoji, endsAt: $endsAt)
  }
`;

export const DELETE_USER_STATUS = gql`
  mutation deleteUserStatus {
    deleteUserStatus
  }
`;

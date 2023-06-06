import { gql } from '@apollo/client';

export const USER_ACTIONS_FRAGMENT = gql`
  fragment UserActionFragment on UserActions {
    actionType
    avatarTemplate
    categoryId
    createdAt
    excerpt
    postId
    postNumber
    title
    topicId
    username
    hidden
  }
`;

export const USER_ACTIVITY = gql`
  ${USER_ACTIONS_FRAGMENT}
  query UserActivity($username: String!, $offset: Int!, $filter: String) {
    userActivity(username: $username, offset: $offset, filter: $filter) {
      ...UserActionFragment
    }
  }
`;

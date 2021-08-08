import { gql } from '@apollo/client';

export const USER_ACTIVITY = gql`
  query UserActivity($username: String!, $offset: Int!, $filter: String) {
    userActivity(username: $username, offset: $offset, filter: $filter) {
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
    }
  }
`;

import { gql } from '@apollo/client';

export const FLAG_POST = gql`
  mutation FlagPost($postId: Int!, $postAction: Int!, $message: String) {
    flagPost(
      postId: $postId
      postActionTypeId: $postAction
      message: $message
    ) {
      id
      name
      username
      avatarTemplate
      createdAt
      cooked
      raw
      postNumber
      postType
      replyCount
      replyToPostNumber
      topicId
      displayUsername
      canEdit
      actionsSummary {
        id
      }
      moderator
      admin
      staff
      userId
      linkCounts {
        url
      }
    }
  }
`;

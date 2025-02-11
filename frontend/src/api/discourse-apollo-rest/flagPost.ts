import { gql } from '@apollo/client';

export const FLAG_POST = gql`
  mutation FlagPost($flagPostInput: FlagPostInput!) {
    flagPost(flagPostInput: $flagPostInput)
      @rest(
        type: "Post"
        path: "/post_actions.json"
        method: "POST"
        bodyKey: "flagPostInput"
      ) {
      id
      name
      username
      avatar: avatarTemplate
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

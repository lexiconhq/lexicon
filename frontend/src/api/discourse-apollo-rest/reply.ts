import { gql } from '@apollo/client';

export const REPLY_TOPIC = gql`
  mutation ReplyTopic($replyInput: ReplyInput!) {
    replyPost(replyInput: $replyInput)
      @rest(
        type: "Post"
        path: "/posts.json"
        method: "POST"
        bodyKey: "replyInput"
      ) {
      id
      postNumber
    }
  }
`;

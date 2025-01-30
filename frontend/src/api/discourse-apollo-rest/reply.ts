import { gql } from '@apollo/client';

export const REPLY_PRIVATE_MESSAGE = gql`
  mutation ReplyPrivateMessage(
    $replyInput: ReplyInput!
    $file: File
    $type: UploadTypeEnum
    $userId: Int
  ) {
    replyPrivateMessage(
      replyInput: $replyInput
      file: $file
      type: $type
      userId: $userId
    ) @client {
      id
      postNumber
    }
  }
`;

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

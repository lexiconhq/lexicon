import { gql } from '@apollo/client';

export const REPLY = gql`
  mutation Reply(
    $replyInput: ReplyInput!
    $file: File
    $type: UploadTypeEnum
    $userId: Int
  ) {
    reply(replyInput: $replyInput, file: $file, type: $type, userId: $userId) {
      id
      userId
      createdAt
      raw
      postNumber
    }
  }
`;

export const REPLY_TOPIC = gql`
  mutation ReplyTopic(
    $content: String!
    $topicId: Int!
    $replyToPostNumber: Int
  ) {
    reply(
      replyInput: {
        raw: $content
        topicId: $topicId
        replyToPostNumber: $replyToPostNumber
      }
    ) {
      commentId: id
      postNumber
    }
  }
`;

import { gql } from '@apollo/client';

export const REPLY = gql`
  mutation Reply(
    $replyInput: ReplyInput!
    $file: Upload
    $type: UploadTypeEnum
    $userId: Int
  ) {
    reply(replyInput: $replyInput, file: $file, type: $type, userId: $userId) {
      id
      userId
      createdAt
      raw
    }
  }
`;

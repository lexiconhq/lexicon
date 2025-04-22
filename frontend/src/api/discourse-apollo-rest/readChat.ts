import { gql } from '@apollo/client';

export const MARK_READ_CHAT = gql`
  mutation MarkReadChat(
    $channelId: Int!
    $markReadChatInput: MarkReadChatInput!
  ) {
    markReadChat(channelId: $channelId, markReadChatInput: $markReadChatInput)
      @rest(
        type: "MarkReadChatOutput"
        path: "/chat/api/channels/{args.channelId}/read.json"
        method: "PUT"
        bodyKey: "markReadChatInput"
      )
  }
`;

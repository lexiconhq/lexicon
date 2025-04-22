import { gql } from '@apollo/client';

export const REPLY_Chat = gql`
  mutation ReplyChat($channelId: Int!, $replyChatInput: ReplyChatInput!) {
    replyChat(channelId: $channelId, replyChatInput: $replyChatInput)
      @rest(
        type: "ReplyChatOutput"
        path: "/chat/{args.channelId}.json"
        method: "POST"
        bodyKey: "replyChatInput"
      ) {
      messageId
    }
  }
`;

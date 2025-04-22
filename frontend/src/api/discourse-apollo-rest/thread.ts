import { gql } from '@apollo/client';

import { CHAT_FRAGMENT } from './chatChannel';

export const GET_THREAD_MESSAGES = gql`
  ${CHAT_FRAGMENT}
  query GetThreadMessages(
    $channelId: Int!
    $threadId: Int!
    $limit: Int
    $direction: DirectionPagination
    $targetMessageId: Int
    $getThreadMessagesPath: PathBuilder
  ) {
    getThreadMessages(
      limit: $limit
      channelId: $channelId
      threadId: $threadId
      direction: $direction
      targetMessageId: $targetMessageId
    )
      @rest(
        type: "GetThreadMessagesOutput"
        path: ""
        pathBuilder: $getThreadMessagesPath
      ) {
      messages @type(name: "ChatMessage") {
        ...ChatFragment
      }
      meta {
        targetMessageId
        canLoadMoreFuture
        canLoadMorePast
      }
    }
  }
`;

export const GET_THREAD_DETAIL = gql`
  query GetThreadDetail($channelId: Int!, $threadId: Int!) {
    getThreadDetail(channelId: $channelId, threadId: $threadId)
      @rest(
        type: "GetThreadDetailOutput"
        path: "/chat/api/channels/{args.channelId}/threads/{args.threadId}"
        method: "GET"
      ) {
      thread @type(name: "ThreadDetail") {
        id
        originalMessage @type(name: "OriginalMessage") {
          id
          markdownContent
          time
          user {
            id
            name
            username
            avatar: avatarTemplate
          }
          mentionedUsers {
            id
            name
            username
          }
        }
      }
    }
  }
`;

export const CREATE_THREAD = gql`
  mutation createThread(
    $channelId: Int!
    $createThreadInput: CreateThreadInput!
  ) {
    createThread(channelId: $channelId, createThreadInput: $createThreadInput)
      @rest(
        type: "CreateThreadInputOutput"
        path: "/chat/api/channels/{args.channelId}/threads"
        method: "POST"
        bodyKey: "createThreadInput"
      ) {
      id
      lastMessageId
    }
  }
`;

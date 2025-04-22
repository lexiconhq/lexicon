import { gql } from '@apollo/client';

export const CHAT_FRAGMENT = gql`
  fragment ChatFragment on ChatMessage {
    id
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
    markdownContent
    threadId
    replyCount
    uploads {
      id
    }
  }
`;

export const CHANNEL_LIST_FRAGMENT = gql`
  fragment ChannelListFragment on ChannelList {
    id
    title
    status
    description
    color
    canJoinChannel
    lastMessageId
    lastReadMessageId
    isFollowingChannel
    threadingEnabled
    membershipsCount
  }
`;

/**
 * `isPolling` param is used for differentiate between regular and polling query.
 * We only want the polling query to update the `messages` field and not the `canLoadMorePast` and `canLoadMoreFuture` fields.
 * Those two fields should only be updated from the regular query, so in the cache handler
 * we then check the `isPolling` flag to determine whether to replace the cache or not.
 */
export const GET_CHAT_CHANNEL_MESSAGES = gql`
  ${CHAT_FRAGMENT}
  query GetChatChannelMessages(
    $channelId: Int!
    $pageSize: Int!
    $targetMessageId: Int
    $direction: DirectionPagination
    $isPolling: Boolean
    $chatChannelMessagesPath: PathBuilder
  ) {
    getChatChannelMessages(
      channelId: $channelId
      pageSize: $pageSize
      targetMessageId: $targetMessageId
      direction: $direction
    )
      @rest(
        type: "ChatChannelMessages"
        path: ""
        pathBuilder: $chatChannelMessagesPath
      ) {
      messages @type(name: "ChatMessage") {
        ...ChatFragment
      }
      canLoadMorePast
      canLoadMoreFuture
    }
  }
`;

export const GET_CHAT_CHANNEL_DETAIL = gql`
  ${CHANNEL_LIST_FRAGMENT}
  query GetChatChannelDetail($channelId: Int!) {
    getChatChannelDetail(channelId: $channelId)
      @rest(
        type: "ChatChannelDetailOutput"
        path: "/chat/api/channels/{args.channelId}.json"
      ) {
      channel @type(name: "ChannelList") {
        ...ChannelListFragment
      }
    }
  }
`;

export const GET_CHAT_CHANNELS = gql`
  ${CHANNEL_LIST_FRAGMENT}
  query GetChatChannels(
    $limit: Int
    $offset: Int
    $status: ChatChannelStatus
    $filter: String
    $getChatChannelsPath: PathBuilder
  ) {
    getChatChannels(
      limit: $limit
      offset: $offset
      status: $status
      filter: $filter
    )
      @rest(
        type: "GetChatChannelsOutput"
        path: ""
        pathBuilder: $getChatChannelsPath
      ) {
      channels @type(name: "ChannelList") {
        ...ChannelListFragment
      }
      meta {
        loadMoreUrl
      }
    }
  }
`;

export const JOIN_CHANNEL = gql`
  mutation JoinChannel($channelId: Int!, $joinChannelInput: EmptyInput) {
    joinChannel(channelId: $channelId, joinChannelInput: $joinChannelInput)
      @rest(
        type: "JoinLeaveChannelOutput"
        path: "/chat/api/channels/{args.channelId}/memberships/me.json"
        method: "POST"
        bodyKey: "joinChannelInput"
      ) {
      chatChannelId
    }
  }
`;

export const LEAVE_CHANNEL = gql`
  mutation LeaveChannel($channelId: Int!) {
    leaveChannel(channelId: $channelId)
      @rest(
        type: "JoinLeaveChannelOutput"
        path: "/chat/api/channels/{args.channelId}/memberships/me/follows.json"
        method: "DELETE"
      ) {
      chatChannelId
    }
  }
`;

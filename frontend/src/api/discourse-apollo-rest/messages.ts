import { gql } from '@apollo/client';

import { POLL_FRAGMENT } from './poll';

// TODO: Make a fragment
export const MESSAGE_LIST = gql`
  query MessageList($username: String!, $page: Int) {
    privateMessageList(username: $username, page: $page) @client {
      primaryGroups
      topicList {
        topics {
          id
          title
          unseen
          allowedUserCount
          highestPostNumber
          lastReadPostNumber
          lastPostedAt
          lastPosterUsername
          participants {
            userId
            extras
          }
          posters {
            userId
          }
        }
      }
      users {
        id
        username
        name
        avatar: avatarTemplate
      }
    }
  }
`;

export const MESSAGE = gql`
  query Message(
    $username: String!
    $page: Int
    $messageType: String
    $messagePath: PathBuilder
  ) {
    privateMessageQuery(
      username: $username
      page: $page
      messageType: $messageType
    ) @rest(type: "PrivateMessageOutput", pathBuilder: $messagePath, path: "") {
      primaryGroups
      topicList {
        topics {
          id
          title
          unseen
          allowedUserCount
          highestPostNumber
          lastReadPostNumber
          lastPostedAt
          lastPosterUsername
          participants {
            userId
            extras
          }
          posters {
            userId
          }
        }
      }
      users {
        id
        username
        name
        avatarTemplate
      }
    }
  }
`;

export const GET_MESSAGE_DETAIL = gql`
  ${POLL_FRAGMENT}
  query GetMessageDetail(
    $topicId: Int!
    $postIds: [Int!]
    $postNumber: Int
    $messageDetailPath: PathBuilder
  ) {
    # If require we can change 'privateMessageDetailQuery' to be the same like prose 'privateMessageDetail'.
    # For now we use different name because cache. 'privateMessageDetail' already used.
    privateMessageDetailQuery(
      topicId: $topicId
      postIds: $postIds
      postNumber: $postNumber
    )
      @rest(
        type: "PrivateMessageDetailOutput"
        pathBuilder: $messageDetailPath
        path: ""
      ) {
      id
      title
      postStream {
        posts {
          id
          username
          actionCode
          actionCodeWho
          markdownContent
          mentions
          createdAt
          postNumber
          polls @type(name: "Poll") {
            ...PollFragment
          }
          pollsVotes {
            pollName
            pollOptionIds
          }
        }
        stream
      }
      details {
        allowedUsers {
          id
          username
          avatarTemplate
        }
        participants {
          id
          username
          avatar: avatarTemplate
        }
        createdBy {
          id
          username
        }
      }
    }
  }
`;

export const LEAVE_MESSAGE = gql`
  mutation LeaveMessage(
    $leaveMessageInput: LeaveMessageInput!
    $topicId: Int!
  ) {
    leaveMessage(leaveMessageInput: $leaveMessageInput, topicId: $topicId)
      @rest(
        type: "String"
        path: "/t/{args.topicId}/remove-allowed-user.json"
        method: "PUT"
        bodyKey: "leaveMessageInput"
      )
  }
`;

export const NEW_PRIVATE_MESSAGE = gql`
  mutation NewPrivateMessage(
    $newPrivateMessageInput: NewPrivateMessageInput!
    $newPrivateMessageBodyBuilder: BodyBuilder
  ) {
    newPrivateMessage(newPrivateMessageInput: $newPrivateMessageInput)
      @rest(
        type: "Post"
        path: "/posts.json"
        method: "POST"
        bodyBuilder: $newPrivateMessageBodyBuilder
      ) {
      id
      name
      username
      avatarTemplate
      createdAt
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
        canAct: acted
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

import { gql } from '@apollo/client';

export const MESSAGE = gql`
  query Message($username: String!, $page: Int) {
    privateMessage(username: $username, page: $page) {
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

export const NEW_PRIVATE_MESSAGE = gql`
  mutation NewPrivateMessage($newPrivateMessageInput: NewPrivateMessageInput!) {
    newPrivateMessage(newPrivateMessageInput: $newPrivateMessageInput) {
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
        canAct
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

export const GET_MESSAGE_DETAIL = gql`
  query GetMessageDetail($topicId: Int!, $postIds: [Int!], $postNumber: Int) {
    privateMessageDetail(
      topicId: $topicId
      postIds: $postIds
      postNumber: $postNumber
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
      }
    }
  }
`;

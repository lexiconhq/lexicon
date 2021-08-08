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

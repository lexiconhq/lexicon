import { gql } from '@apollo/client';

export const NOTIFICATION = gql`
  query Notification($page: Int!) {
    notification(page: $page) {
      notifications {
        id
        notificationType
        seen: read
        createdAt
        topicId
        title: fancyTitle
        postNumber
        data {
          ... on BadgeNotification {
            badgeId
            badgeName
            badgeSlug
            badgeTitle
          }
          ... on ActionPostNotification {
            topicTitle
            originalPostId
            originalPostType
            originalUsername
            revisionNumber
            displayUsername
            count
          }
          ... on AdminMessageNotification {
            groupId
            groupName
            inboxCount
            username
          }
          ... on AdminMessageInvitation {
            topicTitle
            displayUsername
          }
          ... on InviteeAccept {
            displayUsername
          }
          ... on UnknownNotification {
            text
          }
        }
      }
      totalRowsNotifications
      seenNotificationId
      loadMoreNotifications
    }
  }
`;

export const MARK_READ = gql`
  mutation MarkRead($notificationId: Int) {
    markRead(notificationId: $notificationId)
  }
`;

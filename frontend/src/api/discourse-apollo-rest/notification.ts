import { gql } from '@apollo/client';

export const NOTIFICATION = gql`
  query Notification($page: Int!, $notificationsPath: PathBuilder) {
    # If require we can change activity same like prose userActivity. For now we use different name because cache. userActivity already used.
    notificationQuery(page: $page)
      @rest(type: "Notifications", path: "", pathBuilder: $notificationsPath) {
      notifications @type(name: "NotificationsData") {
        id
        notificationType
        seen: read
        createdAt
        topicId
        title: fancyTitle
        postNumber
        # The type for data previously is a union type, but since apollo rest link doesn't support union type yet, we merge all the fields and make it all nullable.
        data {
          displayUsername
          count
          originalPostId
          originalPostType
          originalUsername
          revisionNumber
          topicTitle
          groupId
          groupName
          inboxCount
          username
          badgeId
          badgeName
          badgeSlug
          badgeTitle
          text
          chatMessageId
          chatChannelId
          chatThreadId
          mentionedByUsername
          chatChannelTitle
        }
      }
      totalRowsNotifications
      seenNotificationId
      loadMoreNotifications
    }
  }
`;

export const MARK_READ = gql`
  mutation MarkRead($markReadInput: MarkReadInput) {
    markRead(markReadInput: $markReadInput)
      @rest(
        type: "String"
        path: "/notifications/mark-read.json"
        method: "PUT"
        bodyKey: "markReadInput"
      )
  }
`;

export const PUSH_NOTIF = gql`
  mutation PushNotifications($input: PushNotificationsInput!) {
    pushNotifications(input: $input)
      @rest(
        type: "String"
        path: "/lexicon/push_notifications/subscribe.json"
        method: "POST"
        bodyKey: "input"
      )
  }
`;

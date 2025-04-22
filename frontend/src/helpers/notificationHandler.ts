import { Alert } from 'react-native';

import { FIRST_POST_NUMBER } from '../constants';
import {
  Notification as NotificationDataType,
  NotificationType,
  RawNotificationsType,
  RootStackParamList,
} from '../types';

type NotificationTypename =
  | 'BadgeNotification'
  | 'ActionPostNotification'
  | 'AdminMessageNotification'
  | 'AdminMessageInvitation'
  | 'InviteeAccept'
  | 'ChatNotification'
  | 'UnknownNotification';

function getNotificationTypename(
  item: Record<string, string | number | boolean | null>,
): NotificationTypename {
  switch (true) {
    case item.badgeId != null:
      return 'BadgeNotification';
    case item.originalPostId != null:
      return 'ActionPostNotification';
    case item.groupId != null:
      return 'AdminMessageNotification';
    case item.topicTitle != null:
      return 'AdminMessageInvitation';
    case item.displayUsername != null:
      return 'InviteeAccept';
    case item.chatChannelId != null:
      return 'ChatNotification';
    default:
      return 'UnknownNotification';
  }
}

export function notificationHandler(
  data: Array<RawNotificationsType>,
  navToPostDetail: (params: RootStackParamList['PostDetail']) => void,
  navToMessageDetail: (params: RootStackParamList['MessageDetail']) => void,
  navToUserInformation: (params: RootStackParamList['UserInformation']) => void,
  navToChat: (
    params: Omit<
      RootStackParamList['ChatChannelDetail'],
      'memberCount' | 'threadEnabled'
    >,
  ) => void,
  navToThread: (params: RootStackParamList['ThreadDetail']) => void,
): Array<NotificationDataType> {
  let tempNotification: Array<NotificationDataType> = [];

  data.forEach((item) => {
    const { data, notificationType: notifType } = item;
    const notificationType = notifType ?? 0;
    const typename = getNotificationTypename(data);

    const onPress = (
      topicId: number | undefined,
      // TODO : Use this after badge screen merged
      // badgeId: number | undefined,
    ) => {
      if (
        (typename === 'ActionPostNotification' ||
          typename === 'AdminMessageInvitation') &&
        topicId
      ) {
        switch (notificationType) {
          case NotificationType.Mention:
          case NotificationType.ReplyPost:
          case NotificationType.QuotePost:
          case NotificationType.EditPost:
          case NotificationType.LikePost:
          case NotificationType.ReplyMessage:
          case NotificationType.MovePost:
          case NotificationType.LinkPost:
          case NotificationType.InviteTopic:
          case NotificationType.GroupMention:
          case NotificationType.WatchingTopic:
          case NotificationType.TopicReminder:
          case NotificationType.WatchingCategoryOrTag:
          case NotificationType.BookmarkReminder: {
            return navToPostDetail({
              topicId,
              postNumber: item.postNumber ?? undefined,
            });
          }
          case NotificationType.SendMessage:
          case NotificationType.InviteMessage: {
            return navToMessageDetail({
              id: topicId,
              postNumber: item.postNumber ?? FIRST_POST_NUMBER,
              hyperlinkUrl: '',
              hyperlinkTitle: '',
            });
          }
          default: {
            return;
          }
        }
      } else if (typename === 'InviteeAccept') {
        return navToUserInformation({
          username: data.displayUsername || '',
        });
      } else if (
        typename === 'ChatNotification' &&
        data.chatChannelId &&
        data.chatMessageId
      ) {
        return data.chatThreadId
          ? navToThread({
              channelId: data.chatChannelId,
              threadId: data.chatThreadId,
              threadTargetMessageId: data.chatMessageId,
            })
          : navToChat({
              channelId: data.chatChannelId,
              channelTitle: data.chatChannelTitle || '',
              targetMessageId: data.chatMessageId,
            });
      } else if (
        notificationType === NotificationType.PostApproved &&
        topicId
      ) {
        return navToPostDetail({
          topicId,
          postNumber: item.postNumber ?? undefined,
        });
      } else {
        Alert.alert(t('Warning'), t('This feature not available yet'), [
          { text: t('Mark as Read') },
        ]);
      }
    };

    const { id, seen, createdAt } = item;
    let count;
    let message = '';

    switch (notificationType) {
      case NotificationType.CodeReviewCommitApproved: {
        message = t('Your code review commit has been approved');
        break;
      }
      case NotificationType.MembershipRequestAccepted: {
        message = t('Your membership request has been accepted');
        break;
      }
      case NotificationType.MembershipRequestConsolidated: {
        message = t('Your membership request has been consolidated');
        break;
      }
      case NotificationType.VotesReleased: {
        message = t('Votes released');
        break;
      }
      case NotificationType.EventReminder: {
        message = t('Event reminder');
        break;
      }
      case NotificationType.EventInvitation: {
        message = t('Invited you to join an event');
        break;
      }
      default: {
        message = t(`Unknown notification ({notificationType})`, {
          notificationType,
        });
      }
    }

    switch (typename) {
      case 'ActionPostNotification':
        count = data.count || 0;
      // eslint-disable-next-line no-fallthrough
      case 'AdminMessageInvitation': {
        const { topicTitle } = data;
        switch (notificationType) {
          // TODO : Do more research about more notificationTypes
          case NotificationType.Mention:
          case NotificationType.GroupMention: {
            message = t('Mentioned you in ') + topicTitle;
            break;
          }
          case NotificationType.ReplyPost: {
            message = t('Replied to your post on ') + topicTitle;
            break;
          }
          case NotificationType.QuotePost: {
            message = t('Quote your post on ') + topicTitle;
            break;
          }
          case NotificationType.EditPost: {
            message = t('Edited your post on ') + topicTitle;
            break;
          }
          case NotificationType.LikePost: {
            message = t('Liked your post on ') + topicTitle;
            break;
          }
          case NotificationType.SendMessage: {
            message = t('Sent you a message');
            break;
          }
          case NotificationType.InviteMessage:
          case NotificationType.InviteTopic: {
            message = t('Invited you to join ') + topicTitle;
            break;
          }
          case NotificationType.ReplyMessage: {
            message = t('Replied to post on ') + topicTitle;
            break;
          }
          case NotificationType.MovePost: {
            message = t('Moved your post from {topicTitle}', {
              topicTitle,
            });
            break;
          }
          case NotificationType.LinkPost: {
            message = t('Linked your post on ') + topicTitle;
            break;
          }
          case NotificationType.WatchingTopic: {
            message = t('Watching ') + topicTitle;
            break;
          }
          case NotificationType.TopicReminder: {
            message = t('Topic reminder on ') + topicTitle;
            break;
          }
          case NotificationType.LikeMultiplePosts: {
            message = t('Liked {count} of your posts', { count });
            break;
          }
          case NotificationType.BookmarkReminder: {
            message = t('Bookmark reminder on ') + topicTitle;
            break;
          }
          case NotificationType.WatchingCategoryOrTag: {
            message = topicTitle || '';
            break;
          }
        }

        const name =
          typename === 'ActionPostNotification'
            ? data.originalUsername
            : data.displayUsername;

        const postId =
          typename === 'ActionPostNotification'
            ? data.originalPostId || undefined
            : undefined;

        tempNotification.push({
          id,
          topicId: item.topicId ?? undefined,
          postId,
          name: name || '',
          message,
          createdAt,
          seen,
          notificationType,
          onPress,
        });
        break;
      }
      case 'AdminMessageNotification': {
        const { groupName, inboxCount } = data;
        const message = t('{inboxCount} messages in this inbox', {
          inboxCount,
        });

        tempNotification.push({
          id,
          name: groupName || '',
          message,
          createdAt,
          seen,
          notificationType,
          onPress,
        });
        break;
      }
      case 'BadgeNotification': {
        tempNotification.push({
          id,
          badgeId: data.badgeId || undefined,
          name: data.badgeName || '',
          message: 'Got a new badge',
          createdAt,
          seen,
          notificationType,
          onPress,
        });
        break;
      }
      case 'InviteeAccept': {
        tempNotification.push({
          id,
          name: data.displayUsername || '',
          message: `${data.displayUsername} accepted your invitation.`,
          createdAt,
          seen,
          notificationType,
          onPress,
        });
        break;
      }
      case 'ChatNotification': {
        const { chatChannelTitle, mentionedByUsername } = data;
        switch (notificationType) {
          case NotificationType.ChatMention: {
            message = t('Mentioned you in ') + chatChannelTitle;
            break;
          }
        }
        tempNotification.push({
          id,
          name: mentionedByUsername || '',
          message,
          createdAt,
          seen,
          notificationType,
          onPress,
        });
        break;
      }
      default: {
        let name = t('Unknown');

        if (notificationType === NotificationType.PostApproved) {
          name = t('Admin');
          message = t('Your post on {topicTitle} has been approved', {
            topicTitle: item.title,
          });
        }

        tempNotification.push({
          id,
          topicId: item.topicId ?? undefined,
          postId: item.postNumber ?? undefined,
          name,
          message,
          createdAt,
          seen,
          notificationType,
          onPress,
        });
        break;
      }
    }
  });

  return tempNotification;
}

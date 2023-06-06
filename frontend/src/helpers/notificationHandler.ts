/* eslint no-underscore-dangle: 0 */
import { Alert } from 'react-native';

import { FIRST_POST_NUMBER } from '../constants';
import {
  Notification as NotificationDataType,
  RawNotificationsType,
  StackParamList,
} from '../types';

enum NotificationType {
  Mention = 1,
  ReplyPost = 2,
  QuotePost = 3,
  EditPost = 4,
  LikePost = 5,
  SendMessage = 6,
  InviteMessage = 7,
  // InviteeAccepted = 8,
  ReplyMessage = 9,
  MovePost = 10,
  LinkPost = 11,
  // ObtainBadge = 12,
  InviteTopic = 13,
  Custom = 14,
  GroupMention = 15,
  // ModeratorsInbox = 16,
  WatchingTopic = 17,
  TopicReminder = 18,
  LikeMultiplePosts = 19,
  PostApproved = 20,
  CodeReviewCommitApproved = 21,
  MembershipRequestAccepted = 22,
  MembershipRequestConsolidated = 23,
  BookmarkReminder = 24,
  Reaction = 25,
  VotesReleased = 26,
  EventReminder = 27,
  EventInvitation = 28,
}

export function notificationHandler(
  data: Array<RawNotificationsType>,
  navToPostDetail: (params: StackParamList['PostDetail']) => void,
  navToMessageDetail: (params: StackParamList['MessageDetail']) => void,
  navToUserInformation: (params: StackParamList['UserInformation']) => void,
): Array<NotificationDataType> {
  let tempNotification: Array<NotificationDataType> = [];

  data.forEach((item) => {
    const { data, notificationType: notifType } = item;
    const notificationType = notifType ?? 0;

    const onPress = (
      topicId: number | undefined,
      // TODO : Use this after badge screen merged
      // badgeId: number | undefined,
    ) => {
      if (
        (data.__typename === 'ActionPostNotification' ||
          data.__typename === 'AdminMessageInvitation') &&
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
      } else if (data.__typename === 'InviteeAccept') {
        return navToUserInformation({
          username: data.displayUsername,
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

    switch (data.__typename) {
      case 'ActionPostNotification':
        count = data.count || 0;
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
            message = t('Replied to your post on ') + topicTitle;
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
        }

        const name =
          data.__typename === 'ActionPostNotification'
            ? data.originalUsername
            : data.displayUsername;

        const postId =
          data.__typename === 'ActionPostNotification'
            ? data.originalPostId
            : undefined;

        tempNotification.push({
          id,
          topicId: item.topicId ?? undefined,
          postId,
          name,
          message,
          createdAt,
          hasIcon: notificationType === 6 || notificationType === 7,
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
          name: groupName,
          message,
          createdAt,
          hasIcon: false,
          seen,
          notificationType,
          onPress,
        });
        break;
      }
      case 'BadgeNotification': {
        tempNotification.push({
          id,
          badgeId: data.badgeId,
          name: data.badgeName,
          message: 'Got a new badge',
          createdAt,
          hasIcon: false,
          seen,
          notificationType,
          onPress,
        });
        break;
      }
      case 'InviteeAccept': {
        tempNotification.push({
          id,
          name: data.displayUsername,
          message: `${data.displayUsername} accepted your invitation.`,
          createdAt,
          hasIcon: false,
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
          hasIcon: false,
          seen,
          notificationType,
          onPress,
        });
      }
    }
  });

  return tempNotification;
}

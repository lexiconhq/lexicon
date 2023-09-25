import * as Notifications from 'expo-notifications';
import * as Linking from 'expo-linking';

import { NotificationType } from '../types';

// Only for developing in Expo
export const EXPO_PREFIX = Linking.createURL('/');

type DiscourseNotificationData = {
  type: string; // This is a numeric string representing `NotificationType`
  discourse_url: string;
  is_pm: boolean;
};

// TODO: #1198: replace this and its related type with proper `zod` types and `safeParse`

function isNotificationFromDiscourse(
  data: unknown,
): data is DiscourseNotificationData {
  if (typeof data !== 'object' || data == null) {
    return false;
  }

  if (!('is_pm' in data) || typeof data.is_pm !== 'boolean') {
    return false;
  }

  if (!('discourse_url' in data) || typeof data.discourse_url !== 'string') {
    return false;
  }
  if (!('type' in data) || typeof data.type !== 'string') {
    return false;
  }

  return true;
}

export const handleUrl = (response: Notifications.NotificationResponse) => {
  const { data }: { data: unknown } = response.notification.request.content;

  if (!isNotificationFromDiscourse(data)) {
    return EXPO_PREFIX;
  }

  const { type, discourse_url: discourseUrl, is_pm: isPm } = data;
  const notificationType = Number.parseInt(type, 10);
  if (Number.isNaN(notificationType)) {
    return EXPO_PREFIX;
  }

  const sceneUrl = isPm
    ? `message-detail${discourseUrl}`
    : `post-detail${discourseUrl}`;

  let url = '';

  switch (notificationType) {
    case NotificationType.Mention:
    case NotificationType.ReplyPost:
    case NotificationType.LikePost:
    case NotificationType.QuotePost:
    case NotificationType.LinkPost:
    case NotificationType.ReplyMessage:
    case NotificationType.ChatMention:
    case NotificationType.GroupMention:
    case NotificationType.SendMessage:
      url = sceneUrl;
      break;
    case NotificationType.EditPost:
    case NotificationType.MovePost:
    case NotificationType.InviteTopic:
    case NotificationType.WatchingTopic:
    case NotificationType.TopicReminder:
    case NotificationType.BookmarkReminder:
    case NotificationType.InviteMessage:
      break;
  }

  return `${EXPO_PREFIX}${url}`;
};

// Subscribe function
export const onSubscribe = (listener: (url: string) => void) => {
  const onReceiveURL = ({ url }: { url: string }) => {
    listener(url);
  };
  // Listen to incoming links from deep linking
  const event = Linking.addEventListener('url', onReceiveURL);

  // Listen to expo push notifications
  const subscription = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      let url = handleUrl(response);

      // Let React Navigation handle the URL
      listener(url);
    },
  );

  return () => {
    // Clean up the event listeners
    event.remove();
    subscription.remove();
  };
};

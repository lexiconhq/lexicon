import * as Notifications from 'expo-notifications';
import * as Linking from 'expo-linking';

import { NotificationType } from '../types';

// Only for developing in Expo
export const EXPO_PREFIX = Linking.createURL('/');

export const handleUrl = (response: Notifications.NotificationResponse) => {
  const { data } = response.notification.request.content;
  const { type, discourse_url: discourseUrl, is_pm: isPm } = data;

  // Any custom logic to see whether the URL needs to be handled
  let url = '';
  switch (type) {
    case NotificationType.Mention:
      url = isPm
        ? `message-detail${discourseUrl}`
        : `post-detail${discourseUrl}`;
      break;
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
    case NotificationType.BookmarkReminder:
      url = `post-detail${discourseUrl}`;
      break;
    case NotificationType.SendMessage:
    case NotificationType.InviteMessage:
    case NotificationType.ChatMention:
      url = `message-detail${discourseUrl}`;
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
    event.remove();
    subscription.remove();
  };
};

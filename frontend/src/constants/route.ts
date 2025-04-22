import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';

import { DiscourseNotificationData, NotificationType } from '../types';

// Only for developing in Expo
export const EXPO_PREFIX = Linking.createURL('/');

export const handleUrl = (response: Notifications.NotificationResponse) => {
  const { data }: { data: unknown } = response.notification.request.content;

  const notificationResult = DiscourseNotificationData.safeParse(data);

  if (!notificationResult.success) {
    return EXPO_PREFIX;
  }

  const {
    type,
    discourse_url: discourseUrl,
    is_pm: isPm,
    is_chat: isChat,
    is_thread: isThread,
  } = notificationResult.data;

  const sceneUrl = isChat
    ? `${isThread ? 'thread' : 'chat'}-detail${discourseUrl}`
    : isPm
    ? `message-detail${discourseUrl}`
    : `post-detail${discourseUrl}`;

  let url = '';

  switch (type) {
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

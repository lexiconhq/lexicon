import { PathConfigMap } from '@react-navigation/native';

import { ObjectValues, RootStackParamList } from '../types';

/**
 * A mapping of all inbound deep links supported by the Mobile App.
 */

export enum DeepRoutes {
  'message-detail' = 'message-detail',
  'post-detail' = 'post-detail',
  'chat-detail' = 'chat-detail',
  'thread-detail' = 'thread-detail',
}

export type DeepLinkRoute = ObjectValues<typeof DeepRoutes>;

/**
 * Exclude any other known deep links
 */
export type PostOrMessageDetailRoute = Extract<
  DeepLinkRoute,
  'message-detail' | 'post-detail'
>;

export type ChatOrThreadRoute = Extract<
  DeepLinkRoute,
  'chat-detail' | 'thread-detail'
>;

export function isRouteAvailable(route: string): route is DeepLinkRoute {
  return isPostOrMessageDetail(route) || isChatOrThread(route);
}

export function isPostOrMessageDetail(
  route: string,
): route is PostOrMessageDetailRoute {
  return (
    route === DeepRoutes['message-detail'] ||
    route === DeepRoutes['post-detail']
  );
}

export function isChatOrThread(route: string): route is ChatOrThreadRoute {
  return (
    route === DeepRoutes['chat-detail'] || route === DeepRoutes['thread-detail']
  );
}

export const DEEP_LINK_SCREEN_CONFIG: PathConfigMap<RootStackParamList> = {
  // Route `message-detail` and `post-detail` to their respective
  // closest screens as a fallback.
  Messages: DeepRoutes['message-detail'],
  TabNav: {
    path: DeepRoutes['post-detail'],
  },

  // Route to the specific detail scenes when the path is provided
  // with the needed parameters.

  MessageDetail: {
    path: `${DeepRoutes['message-detail']}/t/:slug/:id/:postNumber`,
  },
  PostDetail: {
    path: `${DeepRoutes['post-detail']}/t/:slug/:topicId/:postNumber?`,
  },

  ChatChannelDetail: {
    path: `${DeepRoutes['chat-detail']}/c/:channelId/:messageId`,
  },
  ThreadDetail: {
    path: `${DeepRoutes['thread-detail']}/c/:channelId/:threadId/:messageId`,
  },
};

import { PathConfigMap } from '@react-navigation/native';

import { ObjectValues, RootStackParamList } from '../types';

/**
 * A mapping of all inbound deep links supported by the Mobile App.
 */
export const deepRoutes = {
  'message-detail': 'message-detail',
  'post-detail': 'post-detail',
} as const;

export type DeepLinkRoute = ObjectValues<typeof deepRoutes>;

/**
 * Exclude any other known deep links
 */
export type PostOrMessageDetailRoute = Extract<
  DeepLinkRoute,
  'message-detail' | 'post-detail'
>;

export function isPostOrMessageDetail(
  route: string,
): route is PostOrMessageDetailRoute {
  return (
    route === deepRoutes['message-detail'] ||
    route === deepRoutes['post-detail']
  );
}

export const DEEP_LINK_SCREEN_CONFIG: PathConfigMap<RootStackParamList> = {
  Main: {
    initialRouteName: 'InstanceLoading',
    screens: {
      // Route `message-detail` and `post-detail` to their respective
      // closest screens as a fallback.
      Messages: deepRoutes['message-detail'],
      TabNav: {
        path: deepRoutes['post-detail'],
        screens: { screen: 'Home' },
      },

      // Route to the specific detail scenes when the path is provided
      // with the needed parameters.
      MessageDetail: {
        path: `${deepRoutes['message-detail']}/:id/:postNumber`,
        exact: true,
      },
      PostDetail: {
        path: `${deepRoutes['post-detail']}/:topicId/:postNumber?`,
        exact: true,
      },
    },
  },
};

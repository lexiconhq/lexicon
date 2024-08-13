import { PathConfigMap } from '@react-navigation/native';

import { ObjectValues, RootStackParamList } from '../types';

/**
 * A mapping of all inbound deep links supported by the Mobile App.
 */

export enum DeepRoutes {
  'message-detail' = 'message-detail',
  'post-detail' = 'post-detail',
  'activate-account' = 'activate-account',
  'email-login' = 'email-login',
}

export type DeepLinkRoute = ObjectValues<typeof DeepRoutes>;

/**
 * Exclude any other known deep links
 */
export type PostOrMessageDetailRoute = Extract<
  DeepLinkRoute,
  'message-detail' | 'post-detail'
>;
export type EmailLoginOrActivateAccountRoute = Extract<
  DeepLinkRoute,
  'email-login' | 'activate-account'
>;

export function isRouteAvailable(route: string): route is DeepLinkRoute {
  return isPostOrMessageDetail(route) || isEmailLoginOrActivateAccount(route);
}

export function isPostOrMessageDetail(
  route: string,
): route is PostOrMessageDetailRoute {
  return (
    route === DeepRoutes['message-detail'] ||
    route === DeepRoutes['post-detail']
  );
}
export function isEmailLoginOrActivateAccount(
  route: string,
): route is EmailLoginOrActivateAccountRoute {
  return (
    route === DeepRoutes['activate-account'] ||
    route === DeepRoutes['email-login']
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
  // Two paths will redirect to the Login screen, `activate-account` and `email-login`,
  // but we only listed the `email-login` because each screen has only one path.
  // So for `activate-account, we handle the redirect manually through `getStateFromPath`,
  // according to this comment https://github.com/react-navigation/react-navigation/issues/9328#issuecomment-1158694831
  Login: {
    path: `${DeepRoutes['email-login']}/:emailToken`,
  },
};

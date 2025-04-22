import {
  ChatOrThreadRoute,
  DeepRoutes,
  FIRST_POST_NUMBER,
  PostOrMessageDetailRoute,
} from '../constants';
import { reset } from '../navigation/NavigationService';
import {
  ChatChannelDetailParams,
  MessageDetailParams,
  Routes,
  ThreadParams,
} from '../types';

import { parseInt } from './parser';

export type DetailParamsOutcome = 'valid-params' | 'invalid-post-number';

/**
 * This function is exclusively for the PostDetail and MessageDetail
 * deep link routes.
 *
 * It accepts an array of path parameters with the leading route already
 * stripped off.
 *
 * It is shared between these two routes because they are effectively the same.
 *
 * If this function is unable to even parse a `topicId`, it will return `undefined`.
 *
 * Otherwise, it will attempt to parse and return the `topicId` and `postNumber`.
 *
 * The `postNumber` is guaranteed to be a valid `postNumber`, meaning it is never less
 * than `FIRST_POST_NUMBER`. If `postNumber` is not present or invalid, it will be replaced
 * with `FIRST_POST_NUMBER`.
 *
 * The `outcome` field in the return type is used to communicate whether or not
 * a replacement to `postNumber` was necessary, or if a valid `postNumber` was received.
 *
 */
export function getValidDetailParams(params: Array<string>):
  | {
      topicId: number;
      postNumber: number;
      outcome: DetailParamsOutcome;
    }
  | undefined {
  // `/:topicId/:postNumber?`
  // Return `undefined` (failure) if no parameters were passed.
  // Otherwise we receive at least 1 parameter, representing the `topicId`.
  if (params.length < 1) {
    return;
  }

  const [, , ...otherParams] = params;
  const [topicId, postNumber] = otherParams.map((param) => {
    return parseInt(param);
  });

  // If we can't even extract a valid, positive number for `topicId` (non-negative and greater than 0),
  // just bail out as a full failure.
  if (!topicId || topicId < 0) {
    return;
  }

  // If `unknownPostNumber` is falsy (0, undefined), or if it is less than `FIRST_POST_NUMBER`,
  // (-1, -2, etc.), normalize it to `FIRST_POST_NUMBER`.
  if (!postNumber || postNumber < FIRST_POST_NUMBER) {
    return {
      topicId,
      postNumber: FIRST_POST_NUMBER,
      outcome: 'invalid-post-number',
    };
  }

  return { topicId, postNumber, outcome: 'valid-params' };
}

/**
 * Parses chat-related deep link parameters.
 *
 * This function is used for deep linking into chat details or thread details.
 * It expects the path parameters with the leading route already stripped off.
 *
 * The expected formats are:
 * - `/c/:channelId/:messageId` (direct chat message)
 * - `/c/:channelId/:threadId/:messageId` (message inside a thread)
 *
 * If `channelId` or `messageId` are missing or invalid, it returns `undefined`.
 *
 * If `threadId` is missing, it assumes the format is `/c/:channelId/:messageId`
 * and returns `threadId` as `undefined`.
 */
export function getValidChatDetailParams(params: Array<string>):
  | {
      channelId: number;
      messageId: number;
      threadId?: number;
    }
  | undefined {
  const [, ...otherParams] = params;
  if (otherParams.length < 2 || otherParams.length > 3) {
    return;
  }
  const parsedParams = otherParams.map((param) => parseInt(param));

  const [channelId, firstParam, secondParam] = parsedParams;

  if (!channelId || channelId <= 0) {
    return;
  }

  if (otherParams.length === 2) {
    // Format: /:channelId/:messageId
    if (!firstParam || firstParam <= 0) {
      return;
    }

    return {
      channelId,
      messageId: firstParam,
    };
  }

  if (otherParams.length === 3) {
    // Format: /:channelId/:threadId/:messageId
    if (!firstParam || firstParam <= 0 || !secondParam || secondParam <= 0) {
      return;
    }

    return {
      channelId,
      threadId: firstParam,
      messageId: secondParam,
    };
  }

  return;
}

export function navigatePostOrMessageDetail(
  route: PostOrMessageDetailRoute,
  pathParams: Array<string>,
  isTablet?: boolean,
  isTabletLandscape?: boolean,
) {
  let navigationRoutes = postOrMessageDetailPathToRoutes({
    route,
    pathParams,
    isTablet,
    isTabletLandscape,
  });

  reset({
    index: navigationRoutes.length - 1,
    routes: navigationRoutes,
  });

  return;
}

type PostOrMessageDetailPathToRoutesParams = {
  route: PostOrMessageDetailRoute;
  pathParams: Array<string>;
  isTablet?: boolean;
  isTabletLandscape?: boolean;
};

export function postOrMessageDetailPathToRoutes({
  route,
  pathParams,
  isTablet,
  isTabletLandscape,
}: PostOrMessageDetailPathToRoutesParams): Routes {
  const detailParams = getValidDetailParams(pathParams);
  if (!detailParams) {
    return route === DeepRoutes['message-detail']
      ? generateRouteMessage({ isTablet, isTabletLandscape })
      : [{ name: 'TabNav', state: { routes: [{ name: 'Home' }] } }];
  }
  const { topicId, postNumber } = detailParams;
  if (route === DeepRoutes['message-detail']) {
    const messageParams: MessageDetailParams = {
      id: topicId,
      postNumber,
      hyperlinkTitle: '',
      hyperlinkUrl: '',
      source: 'deeplink',
    };

    return [
      ...generateRouteMessage({ isTablet, isTabletLandscape }),
      { name: 'MessageDetail', params: messageParams },
    ];
  } else {
    return [
      { name: 'TabNav', state: { routes: [{ name: 'Home' }] } },
      {
        name: 'PostDetail',
        params: { topicId, postNumber, source: 'deeplink' },
      },
    ];
  }
}

type ChatOrThreadPathToRoutesParams = Pick<
  PostOrMessageDetailPathToRoutesParams,
  'pathParams'
> & {
  route: ChatOrThreadRoute;
};

export function navigateChatOrThread({
  route,
  pathParams,
}: ChatOrThreadPathToRoutesParams) {
  let navigationRoutes = chatOrThreadPathToRoutes({
    route,
    pathParams,
  });

  reset({
    index: navigationRoutes.length - 1,
    routes: navigationRoutes,
  });

  return;
}

/**
 * Generates a navigation route based on the given chat or thread path parameters.
 *
 * This function determines whether the user should be navigated to a chat channel
 * or a specific thread within a chat channel, based on the provided `route` and `pathParams`.
 *
 * @param {Object} param0 - The input parameters.
 * @param {DeepRoutes} param0.route - The deep link route name (e.g., 'thread-detail' or 'chat-detail').
 * @param {string[]} param0.pathParams - The extracted path parameters from the deep link.
 * @returns {Routes} An array of navigation routes leading to the appropriate screen.
 *
 * If the `pathParams` are invalid, it defaults to navigating to the Chat tab.
 * If `route` is 'thread-detail' and `threadId` is present, it navigates to `ThreadDetail`.
 * Otherwise, it navigates only to `ChatChannelDetail`.
 */

export function chatOrThreadPathToRoutes({
  route,
  pathParams,
}: ChatOrThreadPathToRoutesParams): Routes {
  const detailParams = getValidChatDetailParams(pathParams);
  if (!detailParams) {
    // If the parameters are invalid, navigate to the Chat tab as the default fallback
    return [{ name: 'TabNav', state: { routes: [{ name: 'Chat' }] } }];
  }
  const { messageId, threadId, channelId } = detailParams;
  const channelParams: ChatChannelDetailParams = {
    channelId,
    lastMessageId: messageId,
  };
  // If the route is for a thread and threadId exists, navigate to ThreadDetail
  if (route === DeepRoutes['thread-detail'] && threadId) {
    const threadParams: ThreadParams = {
      channelId,
      threadId,
      threadTargetMessageId: messageId,
    };

    return [
      // Navigate to the Chat tab first
      { name: 'TabNav', state: { routes: [{ name: 'Chat' }] } },
      // Then navigate to the ChatChannelDetail screen
      { name: 'ChatChannelDetail', params: channelParams },
      // Finally, open the specific ThreadDetail screen
      { name: 'ThreadDetail', params: threadParams },
    ];
  } else {
    // If it's not a thread, just navigate to the ChatChannelDetail screen
    return [
      { name: 'TabNav', state: { routes: [{ name: 'Chat' }] } },
      {
        name: 'ChatChannelDetail',
        params: channelParams,
      },
    ];
  }
}

export function extractPathname(url: string) {
  /**
   * This function is used to check whether or not a slash appeard in the URL after the hostname.
   *
   * For example this URL: 'https://test-url.com'.
   * It doesn't have a '/' after the hostname, so we know that this URL doesn't have a path.
   *
   * But with this URL: 'https://test-url.com/t'.
   * It has a '/' after the hostname, so ther is a posibility that the URL have a path.
   *
   * The plus 2 is used to skip the '//' after 'https:'.
   */
  const slashIndex = url.indexOf('/', url.indexOf('//') + 2);

  if (slashIndex === -1) {
    return '';
  }

  const [pathname] = url.slice(slashIndex + 1).split('?');
  let regex = /t\/([a-z'-]+)\/\d+(\/\d)?/;
  if (!regex.test(pathname)) {
    return '';
  }

  return pathname;
}

export function isRouteBesidePost(route: string) {
  return route !== DeepRoutes['post-detail'];
}

/**
 * Generates the appropriate navigation route based on the device type.
 * On tablets, the navigation route differs between portrait and landscape modes:
 * - In portrait mode, it navigates to the Profile stack navigator first, then to the Messages scene.
 * - In landscape mode, it navigates to the Profile drawer navigator first, then to the Messages scene.
 *
 * On phones, the navigation remains within the rootStackNavigator after tap the Profile tab.
 *
 * @param {boolean} isTablet - Indicates whether the device is a tablet.
 * @param {boolean} isTabletLandscape - Indicates whether the device is a tablet and orientation landscape.
 * @returns {Routes} The generated navigation route.
 */
export function generateRouteMessage({
  isTablet,
  isTabletLandscape,
}: {
  isTablet?: boolean;
  isTabletLandscape?: boolean;
}): Routes {
  if (!isTablet) {
    return [
      { name: 'TabNav', state: { routes: [{ name: 'Profile' }] } },
      { name: 'Messages' },
    ];
  } else if (isTabletLandscape) {
    return [
      { name: 'TabNav', state: { routes: [{ name: 'Profile' }] } },
      {
        name: 'TabNav',
        state: {
          routes: [
            { name: 'Profile', state: { routes: [{ name: 'Messages' }] } },
          ],
        },
      },
    ];
  } else {
    return [
      {
        name: 'TabNav',
        state: {
          routes: [
            {
              name: 'Profile',
              state: {
                routes: [{ name: 'ProfileScreen' }, { name: 'Messages' }],
              },
            },
          ],
        },
      },
    ];
  }
}

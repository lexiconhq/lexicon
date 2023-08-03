import {
  FIRST_POST_NUMBER,
  deepRoutes,
  PostOrMessageDetailRoute,
} from '../constants';
import { reset } from '../navigation/NavigationService';
import { MessageDetailParams, Routes } from '../types';

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
    const parsed = Number.parseInt(param, 10);
    return Number.isNaN(parsed) ? undefined : parsed;
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

export function navigatePostOrMessageDetail(
  route: PostOrMessageDetailRoute,
  pathParams: Array<string>,
) {
  let navigationRoutes = postOrMessageDetailPathToRoutes({ route, pathParams });

  reset({
    index: navigationRoutes.length - 1,
    routes: navigationRoutes,
  });

  return;
}

type postOrMessageDetailPathToRoutesParams = {
  route: PostOrMessageDetailRoute;
  pathParams: Array<string>;
};
export function postOrMessageDetailPathToRoutes({
  route,
  pathParams,
}: postOrMessageDetailPathToRoutesParams): Routes {
  const detailParams = getValidDetailParams(pathParams);
  if (!detailParams) {
    return route === deepRoutes['message-detail']
      ? [
          { name: 'TabNav', state: { routes: [{ name: 'Profile' }] } },
          { name: 'Messages' },
        ]
      : [{ name: 'TabNav', state: { routes: [{ name: 'Home' }] } }];
  }
  const { topicId, postNumber } = detailParams;
  if (route === deepRoutes['message-detail']) {
    const messageParams: MessageDetailParams = {
      id: topicId,
      postNumber,
      hyperlinkTitle: '',
      hyperlinkUrl: '',
      source: 'deeplink',
    };

    return [
      { name: 'TabNav', state: { routes: [{ name: 'Profile' }] } },
      { name: 'Messages' },
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
  return route !== deepRoutes['post-detail'];
}

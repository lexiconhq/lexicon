import {
  FIRST_POST_NUMBER,
  deepRoutes,
  PostOrMessageDetailRoute,
} from '../constants';
import { navigate } from '../navigation/NavigationService';
import { MessageDetailParams, RootStackParamList } from '../types';

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
function getValidDetailParams(params: Array<string>):
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

  const [topicId, postNumber] = params.map((param) => {
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
  const detailParams = getValidDetailParams(pathParams);

  // We weren't able to extract any meaningful information from the parameters.
  // Navigate to the closest valid screen.
  if (!detailParams) {
    const closestScreen: RootStackParamList['Main'] =
      route === deepRoutes['message-detail']
        ? { screen: 'Messages' }
        : { screen: 'TabNav', params: { screen: 'Home' } };

    navigate(['Main', closestScreen]);
    return;
  }

  // We were able to extract enough params to navigate to the target
  // screen. `outcome` contains the specifics of how much was extracted.
  const { topicId, postNumber } = detailParams;

  let targetScreen: RootStackParamList['Main'];
  if (route === deepRoutes['message-detail']) {
    const messageParams: MessageDetailParams = {
      id: topicId,
      postNumber,
      hyperlinkTitle: '',
      hyperlinkUrl: '',
      source: 'deeplink',
    };

    targetScreen = { screen: 'MessageDetail', params: messageParams };
  } else {
    targetScreen = {
      screen: 'PostDetail',
      params: { topicId, postNumber, source: 'deeplink' },
    };
  }

  navigate(['Main', targetScreen]);
  return;
}

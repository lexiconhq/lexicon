import { ActionSummary, Post } from '../generated/server';

import { ActionsSummaryType } from './postDetailContentHandler';

export type PostActionsSummary = Post['actionsSummary'];

type UpdateLikePropsParams = {
  liked: boolean;
  previousCount: number;
};

type UpdateSummaryParams = {
  cachedActionsSummary: PostActionsSummary;
  previousCount?: number;
  liked: boolean;
};

export function getUpdatedLikeCount(params: UpdateLikePropsParams) {
  const { liked, previousCount } = params;
  return liked ? previousCount + 1 : Math.max(0, previousCount - 1);
}

export function getLikeActionSummary(actionsSummary: PostActionsSummary) {
  const likeAction = actionsSummary?.find(
    ({ id }: { id: number }) => id === ActionsSummaryType.Like,
  );
  return {
    liked: likeAction?.acted ?? false,
    likeCount: likeAction?.count ?? 0,
  };
}

export const firstLikeActivitySummary: ActionSummary = {
  __typename: 'ActionSummary',
  id: ActionsSummaryType.Like,
  acted: true,
  count: 1,
};

export function getUpdatedSummaryOnToggleLike(params: UpdateSummaryParams) {
  let { cachedActionsSummary, previousCount, liked } = params;

  if (!cachedActionsSummary) {
    return [firstLikeActivitySummary];
  }

  const likeActionIndex = cachedActionsSummary.findIndex(
    ({ id }: { id: number }) => id === ActionsSummaryType.Like,
  );

  // Like action index is null or not found means existing post does not have any likes
  if (likeActionIndex === -1) {
    return [...cachedActionsSummary, firstLikeActivitySummary];
  }

  const actionsSummary = [...cachedActionsSummary];
  const prevLikeActionSummary = cachedActionsSummary[likeActionIndex];

  // Get previous like count from cache if previousCount param is undefined
  if (!previousCount) {
    previousCount = prevLikeActionSummary.count ?? 0;
  }

  actionsSummary[likeActionIndex] = {
    ...prevLikeActionSummary,
    acted: liked,
    count: getUpdatedLikeCount({ liked, previousCount }),
  };

  return actionsSummary;
}

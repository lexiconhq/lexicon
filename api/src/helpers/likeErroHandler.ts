import { AxiosError } from 'axios';

import { LIKE_ACTION_ID } from '../constants';
import { ActionsSummary } from '../types';

export type LikableEntity = 'post' | 'topic';
type Params = {
  actionsSummary: ActionsSummary | null;
  likableEntity: LikableEntity;
  like: boolean;
};

/**
 * Custom Like Error Handler-
 * Discourse provides unhelpful error message for this matter.
 * This function checks the actions summary of the post
 * to find the reason why the like action failed.
 */
export function likeErrorHandler(e: AxiosError, params: Params) {
  let { actionsSummary, likableEntity, like } = params;

  const likeActionSummary = actionsSummary?.find(
    (actionSummary: { id: number }) => actionSummary.id === LIKE_ACTION_ID,
  );

  // Like action summary is not provided for the post author
  if (!likeActionSummary) {
    throw new Error(
      `You're not permitted to do like actions to your own ${likableEntity}`,
    );
  }

  const { acted: prevLiked = false, canUndo: canUnlike = false } =
    likeActionSummary;

  // Proposed action and current like state is the same
  if (like === prevLiked) {
    throw new Error(
      like
        ? `You've liked this ${likableEntity} before`
        : `You can't unlike a ${likableEntity} you haven't liked before`,
    );
  }
  // Already passed the time limit to unlike
  if (!like && !canUnlike) {
    throw new Error(
      `You've passed the time limit to unlike this ${likableEntity}`,
    );
  }

  // Throw handled error from Discourse, such as too many actions error
  throw e;
}

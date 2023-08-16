// TODO: #1173: this file was implemented purely for compatibility with the existing behavior
// As part of #1173, please remove all of it.
// Note: did not implement unit tests for this code due to its similarity to
// `getTopicAuthor` and the fact that we'll be removing it as part of #1173.
import { TopicPoster } from '../types';

import { getPosterTypeDetails } from './getPosterTypeDetails';

export function getFrequentPoster(
  posters: Readonly<Array<TopicPoster>>,
): TopicPoster | undefined {
  return posters.find((poster) => {
    const { isFrequentPoster } = getPosterTypeDetails(poster.description);
    return isFrequentPoster;
  });
}

export function getFrequentPosterUserId(
  posters: Readonly<Array<TopicPoster>>,
): number | undefined {
  const author = getFrequentPoster(posters);

  return author?.userId ?? author?.user?.id;
}

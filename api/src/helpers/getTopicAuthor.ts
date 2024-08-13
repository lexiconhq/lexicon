import { PosterUnion, TopicPoster } from '../types';

import { getPosterTypeDetails } from './getPosterTypeDetails';

/**
 * Deprecated type TopicPoster which will be remove in version 3
 */

export function getTopicAuthor(
  posters: Readonly<Array<PosterUnion | TopicPoster>>,
): PosterUnion | TopicPoster | undefined {
  return posters.find((poster) => {
    const { isAuthor } = getPosterTypeDetails(poster.description);
    return isAuthor;
  });
}

export function getTopicAuthorUserId(
  posters: Readonly<Array<PosterUnion | TopicPoster>>,
): number | undefined {
  const author = getTopicAuthor(posters);

  if (author) {
    if ('userId' in author) {
      return author.userId || undefined;
    } else if ('user' in author) {
      return author.user?.id;
    }
  }
}

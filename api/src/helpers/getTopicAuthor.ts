import { PosterUnion } from '../types';

import { getPosterTypeDetails } from './getPosterTypeDetails';

export function getTopicAuthor(
  posters: Readonly<Array<PosterUnion>>,
): PosterUnion | undefined {
  return posters.find((poster) => {
    const { isAuthor } = getPosterTypeDetails(poster.description);
    return isAuthor;
  });
}

export function getTopicAuthorUserId(
  posters: Readonly<Array<PosterUnion>>,
): number | undefined {
  const author = getTopicAuthor(posters);

  if (author) {
    if ('userId' in author) {
      return author.userId;
    } else if ('user' in author) {
      return author.user.id;
    }
  }
}

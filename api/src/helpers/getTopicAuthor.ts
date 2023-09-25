import { TopicPoster } from '../types';

import { getPosterTypeDetails } from './getPosterTypeDetails';

export function getTopicAuthor(
  posters: Readonly<Array<TopicPoster>>,
): TopicPoster | undefined {
  return posters.find((poster) => {
    const { isAuthor } = getPosterTypeDetails(poster.description);
    return isAuthor;
  });
}

export function getTopicAuthorUserId(
  posters: Readonly<Array<TopicPoster>>,
): number | undefined {
  const author = getTopicAuthor(posters);

  return author?.userId ?? author?.user?.id;
}

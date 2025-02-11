import { TopicPoster } from '../../generatedAPI/server';

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

  if (author) {
    if ('userId' in author) {
      return author.userId || undefined;
    } else if ('user' in author) {
      return author.user?.id;
    }
  }
}

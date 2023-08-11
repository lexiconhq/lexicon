import camelcaseKey from 'camelcase-keys';
import {
  FieldResolver,
  queryField,
  arg,
  intArg,
  stringArg,
  nullable,
} from 'nexus';

import {
  errorHandler,
  fetchLikeActivities,
  parseTopicUrl,
} from '../../helpers';
import { Context, Topic, UserIcon } from '../../types';
import { ACCEPTED_LANGUAGE, FIRST_POST_NUMBER } from '../../constants';

let topicsQueryResolver: FieldResolver<'Query', 'topics'> = async (
  _,
  { page, username, ...filterInput },
  { client, isAuth }: Context,
) => {
  const config = {
    headers: {
      'Accept-Language': ACCEPTED_LANGUAGE,
    },
    params: {
      page: page || 0,
    },
  };
  try {
    let { data: topicResult } = await client.get(
      `/${parseTopicUrl(filterInput)}.json`,
      config,
    );

    const topics = camelcaseKey(topicResult, { deep: true });
    if (isAuth && username) {
      // Determine `liked` value based on whether users like the first post of the topic
      const activities = await fetchLikeActivities({ username, client });

      // TODO: Do more research to find the best solution #783
      const likedFirstPostInTopics = new Set();
      activities.forEach(({ postNumber, topicId }) => {
        if (postNumber === FIRST_POST_NUMBER) {
          likedFirstPostInTopics.add(topicId);
        }
      });
      topics.topicList.topics = topics.topicList.topics.map((topic: Topic) => {
        const { id, liked } = topic;

        let updatedLiked = liked ? likedFirstPostInTopics.has(id) : false;
        return { ...topic, liked: updatedLiked };
      });
    }

    let { users }: { users: Array<UserIcon> } = topics;
    topics.topicList.topics = topics.topicList.topics.map((topic: Topic) => {
      const { posters } = topic;
      let postersWithUser = posters.map((poster) => {
        return {
          ...poster,
          user: poster.user ?? users.find(({ id }) => id === poster.userId),
        };
      });
      return { ...topic, posters: postersWithUser };
    });

    return topics;
  } catch (error) {
    throw errorHandler(error);
  }
};

let topicsQuery = queryField('topics', {
  type: 'TopicsOutput',
  args: {
    sort: arg({ type: 'TopicsSortEnum' }),
    categoryId: nullable(intArg()),
    topPeriod: nullable(arg({ type: 'TopPeriodEnum' })),
    tag: nullable(stringArg()),
    page: nullable(intArg()),
    username: nullable(stringArg()),
  },
  resolve: topicsQueryResolver,
});

export { topicsQuery };

import { RestLink } from 'apollo-link-rest';

import { SearchPost } from '../../generatedAPI/server';
import { formatPostTitle } from '../../helpers/formatPostTitle';
import { normalizeTopicTags } from '../../helpers/normalizeTopicTags';
import { getNormalizedUrlTemplate } from '../discourse-apollo-rest/utils';

export const searchOutputPatcher: RestLink.FunctionalTypePatcher = (data) => {
  if (!data.topics) {
    data.topics = [];
  }
  data.topics = data.topics.map(
    (topic: {
      title?: string;
      tags?: Parameters<typeof normalizeTopicTags>[0];
    }) => ({
      ...topic,
      title: topic.title ? formatPostTitle(topic.title) : topic.title,
      tags: normalizeTopicTags(topic.tags),
    }),
  );
  if (!data.posts) {
    data.posts = [];
  }
  data.posts = data.posts.map((post: SearchPost) => {
    return {
      ...post,
      __typename: 'SearchPost',
      avatarTemplate: getNormalizedUrlTemplate({ instance: post }),
    };
  });
  return data;
};

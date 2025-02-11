import { RestLink } from 'apollo-link-rest';

import { SearchPost } from '../../generatedAPI/server';
import { getNormalizedUrlTemplate } from '../discourse-apollo-rest/utils';

export const searchOutputPatcher: RestLink.FunctionalTypePatcher = (data) => {
  if (!data.topics) {
    data.topics = [];
  }
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

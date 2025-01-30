import { RestLink } from 'apollo-link-rest';

export const aboutPatcher: RestLink.FunctionalTypePatcher = (data) => {
  return {
    __typename: 'About',
    topicCount:
      data.about.stats.topicCount || data.about.stats.topicsCount || 0,
    postCount: data.about.stats.postCount || data.about.stats.postsCount || 0,
  };
};

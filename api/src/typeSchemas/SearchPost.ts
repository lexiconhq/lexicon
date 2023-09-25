import { objectType } from 'nexus';

import { getNormalizedUrlTemplate } from '../resolvers/utils';

export let SearchPost = objectType({
  name: 'SearchPost',
  definition(t) {
    t.int('id');
    t.string('avatarTemplate', {
      resolve: (searchPost) => getNormalizedUrlTemplate(searchPost),
      sourceType: 'string',
    });
    t.string('blurb');
    t.string('createdAt');
    t.nullable.string('name');
    t.string('username');
    t.int('likeCount');
    t.int('postNumber');
    t.int('topicId');
  },
});

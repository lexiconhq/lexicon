import { objectType } from 'nexus';

import { getNormalizedUrlTemplate } from '../resolvers/utils';

export let SearchUser = objectType({
  name: 'SearchUser',
  definition(t) {
    t.string('avatarTemplate', {
      resolve: (searchUser) => getNormalizedUrlTemplate(searchUser),
      sourceType: 'string',
    });
    t.nullable.string('name');
    t.string('username');
  },
});

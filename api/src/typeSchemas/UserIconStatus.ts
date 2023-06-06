import { objectType } from 'nexus';

import { getNormalizedUrlTemplate } from '../resolvers/utils';

export let UserIconStatus = objectType({
  name: 'UserIconStatus',
  definition(t) {
    t.int('id');
    t.string('username');
    t.nullable.string('name');
    t.string('avatarTemplate', {
      resolve: (userIconStatus) => getNormalizedUrlTemplate(userIconStatus),
      sourceType: 'string',
    });
    t.boolean('moderator');
    t.boolean('admin');
  },
});

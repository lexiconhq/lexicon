import { objectType } from 'nexus';

import { getNormalizedUrlTemplate } from '../resolvers/utils';

export let UserIcon = objectType({
  name: 'UserIcon',
  definition(t) {
    t.int('id');
    t.string('username');
    t.nullable.string('name');
    t.string('avatarTemplate', {
      resolve: (userIcon) => getNormalizedUrlTemplate(userIcon),
      sourceType: 'string',
    });
  },
});

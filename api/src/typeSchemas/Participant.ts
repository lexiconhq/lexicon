import { objectType } from 'nexus';

import { getNormalizedUrlTemplate } from '../resolvers/utils';

export let Participant = objectType({
  name: 'Participant',
  definition(t) {
    t.int('id');
    t.string('username');
    t.nullable.string('name');
    t.string('avatarTemplate', {
      resolve: (participant) => getNormalizedUrlTemplate(participant),
      sourceType: 'string',
    });
    t.int('postCount');
    t.nullable.string('primaryGroupName');
    t.nullable.string('primaryGroupFlairUrl');
    t.nullable.string('primaryGroupFlairColor');
    t.nullable.string('primaryGroupFlairBgColor');
  },
});

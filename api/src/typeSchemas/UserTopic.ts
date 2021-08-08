import { objectType } from '@nexus/schema';

export let UserTopic = objectType({
  name: 'UserTopic',
  definition(t) {
    t.int('id');
    t.string('title');
    t.string('fancyTitle');
    t.string('slug');
    t.int('postsCount');
  },
});

import { objectType } from 'nexus';

export let BasicTopic = objectType({
  name: 'BasicTopic',
  definition(t) {
    t.string('fancyTitle');
    t.int('id');
    t.int('postsCount');
    t.string('slug');
    t.string('title');
  },
});

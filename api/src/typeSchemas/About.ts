import { objectType } from '@nexus/schema';

export let About = objectType({
  name: 'About',
  definition(t) {
    t.int('topicCount');
    t.int('postCount');
  },
});

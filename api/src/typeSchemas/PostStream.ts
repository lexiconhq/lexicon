import { objectType } from '@nexus/schema';

export let PostStream = objectType({
  name: 'PostStream',
  definition(t) {
    t.field('posts', { type: 'Post', list: true });
    t.int('stream', { nullable: true, list: true });
  },
});

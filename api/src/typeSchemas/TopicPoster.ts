import { objectType } from 'nexus';

export let TopicPoster = objectType({
  name: 'TopicPoster',
  definition(t) {
    t.nullable.string('extras');
    t.string('description');
    t.nullable.int('userId');
    t.nullable.field('user', { type: 'UserIcon' });
  },
});

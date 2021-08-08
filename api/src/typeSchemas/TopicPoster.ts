import { objectType } from '@nexus/schema';

export let TopicPoster = objectType({
  name: 'TopicPoster',
  definition(t) {
    t.string('extras', { nullable: true });
    t.string('description');
    t.int('userId', { nullable: true });
    t.field('user', { type: 'UserIcon', nullable: true });
  },
});

import { objectType } from '@nexus/schema';

export let TopicsOutput = objectType({
  name: 'TopicsOutput',
  definition(t) {
    t.field('users', { type: 'UserIcon', list: true, nullable: true });
    t.field('topicList', { type: 'TopicList', nullable: true });
  },
});

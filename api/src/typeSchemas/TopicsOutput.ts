import { objectType } from 'nexus';

export let TopicsOutput = objectType({
  name: 'TopicsOutput',
  definition(t) {
    t.nullable.list.field('users', { type: 'UserIcon' });
    t.nullable.field('topicList', { type: 'TopicList' });
  },
});

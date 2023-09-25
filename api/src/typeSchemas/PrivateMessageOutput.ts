import { objectType } from 'nexus';

export let PrivateMessageOutput = objectType({
  name: 'PrivateMessageOutput',
  definition(t) {
    t.nullable.list.int('primaryGroups');
    t.field('topicList', { type: 'TopicList' });
    t.nullable.list.field('users', { type: 'UserIcon' });
  },
});

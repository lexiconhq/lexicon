import { objectType } from '@nexus/schema';

export let PrivateMessageOutput = objectType({
  name: 'PrivateMessageOutput',
  definition(t) {
    t.int('primaryGroups', { nullable: true, list: true });
    t.field('topicList', { type: 'TopicList' });
    t.field('users', { type: 'UserIcon', list: true, nullable: true });
  },
});

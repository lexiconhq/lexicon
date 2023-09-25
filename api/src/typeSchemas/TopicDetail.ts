import { objectType } from 'nexus';

export let TopicDetail = objectType({
  name: 'TopicDetail',
  definition(t) {
    t.int('notificationLevel');
    t.list.field('participants', { type: 'Participant' });
    t.nullable.list.field('allowedUsers', { type: 'UserIcon' });
    t.field('createdBy', { type: 'UserIcon' });
    t.field('lastPoster', { type: 'UserIcon' });
    t.nullable.boolean('canEdit');
  },
});

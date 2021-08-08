import { objectType } from '@nexus/schema';

export let TopicDetail = objectType({
  name: 'TopicDetail',
  definition(t) {
    t.int('notificationLevel');
    t.field('participants', { type: 'Participant', list: true });
    t.field('allowedUsers', { type: 'UserIcon', list: true, nullable: true });
    t.field('createdBy', { type: 'UserIcon' });
    t.field('lastPoster', { type: 'UserIcon' });
    t.boolean('canEdit', { nullable: true });
  },
});

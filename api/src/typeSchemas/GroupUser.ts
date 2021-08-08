import { objectType } from '@nexus/schema';

export let GroupUser = objectType({
  name: 'GroupUser',
  definition(t) {
    t.int('groupId');
    t.int('userId');
    t.int('notificationLevel');
    t.boolean('owner', { nullable: true }); // If Admin change it's null
  },
});

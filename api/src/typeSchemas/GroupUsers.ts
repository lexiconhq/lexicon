import { objectType } from '@nexus/schema';

export let GroupUsers = objectType({
  name: 'GroupUsers',
  definition(t) {
    t.int('groupId');
    t.int('notificationLevel');
    t.boolean('owner');
    t.int('userId');
  },
});

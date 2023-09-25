import { objectType } from 'nexus';

export let GroupUser = objectType({
  name: 'GroupUser',
  definition(t) {
    t.int('groupId');
    t.int('userId');
    t.int('notificationLevel');

    // If this change is done by an admin, the value is null.
    t.nullable.boolean('owner');
  },
});

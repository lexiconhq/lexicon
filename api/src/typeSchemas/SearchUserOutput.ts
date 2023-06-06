import { objectType } from 'nexus';

export let SearchUserOutput = objectType({
  name: 'SearchUserOutput',
  definition(t) {
    t.list.field('users', { type: 'SearchUser' });

    // Nullable because groups are not visible to unauthenticated users.
    t.nullable.list.field('groups', { type: 'SearchGroup' });
  },
});

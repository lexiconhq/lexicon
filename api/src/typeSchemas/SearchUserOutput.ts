import { objectType } from '@nexus/schema';

export let SearchUserOutput = objectType({
  name: 'SearchUserOutput',
  definition(t) {
    t.field('groups', { type: 'SearchGroup', list: true, nullable: true }); // You can't see groups if not logged in
    t.field('users', { type: 'SearchUser', list: true });
  },
});

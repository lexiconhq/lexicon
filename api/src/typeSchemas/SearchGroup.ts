import { objectType } from '@nexus/schema';

export let SearchGroup = objectType({
  name: 'SearchGroup',
  definition(t) {
    t.string('fullName', { nullable: true });
    t.string('name');
  },
});

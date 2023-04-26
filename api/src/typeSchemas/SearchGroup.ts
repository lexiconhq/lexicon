import { objectType } from 'nexus';

export let SearchGroup = objectType({
  name: 'SearchGroup',
  definition(t) {
    t.nullable.string('fullName');
    t.string('name');
  },
});

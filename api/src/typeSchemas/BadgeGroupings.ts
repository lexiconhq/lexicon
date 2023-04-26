import { objectType } from 'nexus';

export let BadgeGroupings = objectType({
  name: 'BadgeGroupings',
  definition(t) {
    t.nullable.string('description');
    t.int('id');
    t.string('name');
    t.int('position');
    t.boolean('system');
  },
});

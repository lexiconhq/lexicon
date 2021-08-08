import { objectType } from '@nexus/schema';

export let BadgeType = objectType({
  name: 'BadgeType',
  definition(t) {
    t.int('id');
    t.string('name');
    t.int('sortOrder');
  },
});

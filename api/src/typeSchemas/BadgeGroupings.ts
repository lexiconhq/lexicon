import { objectType } from '@nexus/schema';

export let BadgeGroupings = objectType({
  name: 'BadgeGroupings',
  definition(t) {
    t.string('description', { nullable: true }),
      t.int('id'),
      t.string('name'),
      t.int('position'),
      t.boolean('system');
  },
});

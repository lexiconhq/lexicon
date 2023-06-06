import { objectType } from 'nexus';

export let Badge = objectType({
  name: 'Badge',
  definition(t) {
    t.int('id');
    t.string('name');
    t.string('description');
    t.int('grantCount');
    t.boolean('allowTitle');
    t.boolean('multipleGrant');
    t.string('icon');
    t.nullable.string('image');
    t.boolean('listable');
    t.boolean('enabled');
    t.int('badgeGroupingId');
    t.boolean('system');
    t.string('slug');
    t.boolean('manuallyGrantable');
    t.int('badgeTypeId');
    t.nullable.boolean('hasBadge');
    t.nullable.string('longDescription');
  },
});

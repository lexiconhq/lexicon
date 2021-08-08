import { objectType } from '@nexus/schema';

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
    t.string('image', { nullable: true });
    t.boolean('listable');
    t.boolean('enabled');
    t.int('badgeGroupingId');
    t.boolean('system');
    t.string('slug');
    t.boolean('manuallyGrantable');
    t.int('badgeTypeId');
    t.boolean('hasBadge', { nullable: true });
    t.string('longDescription', { nullable: true });
  },
});

import { objectType } from 'nexus';

export let BadgeNotification = objectType({
  name: 'BadgeNotification',
  definition(t) {
    t.int('badgeId');
    t.string('badgeName');
    t.nullable.string('badgeSlug');
    t.nullable.boolean('badgeTitle');
    t.string('username');
  },
});

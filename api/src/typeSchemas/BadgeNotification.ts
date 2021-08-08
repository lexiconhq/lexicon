import { objectType } from '@nexus/schema';

export let BadgeNotification = objectType({
  name: 'BadgeNotification',
  definition(t) {
    t.int('badgeId');
    t.string('badgeName');
    t.string('badgeSlug', { nullable: true });
    t.boolean('badgeTitle', { nullable: true });
    t.string('username');
  },
});

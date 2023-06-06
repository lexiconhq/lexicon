import { objectType } from 'nexus';

export let SingleBadgeOutput = objectType({
  name: 'SingleBadgeOutput',
  definition(t) {
    t.list.field('badgeTypes', { type: 'BadgeType' });
    t.field('badge', { type: 'Badge' });
  },
});

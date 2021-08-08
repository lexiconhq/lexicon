import { objectType } from '@nexus/schema';

export let SingleBadgeOutput = objectType({
  name: 'SingleBadgeOutput',
  definition(t) {
    t.field('badgeTypes', { type: 'BadgeType', list: true });
    t.field('badge', { type: 'Badge' });
  },
});

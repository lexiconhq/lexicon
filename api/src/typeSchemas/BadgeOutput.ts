import { objectType } from '@nexus/schema';

export let BadgeOutput = objectType({
  name: 'BadgeOutput',
  definition(t) {
    t.field('badgeGroupings', { type: 'BadgeGroupings', list: true });
    t.field('badgeTypes', { type: 'BadgeType', list: true });
    t.field('badges', { type: 'Badge', list: true });
  },
});

import { objectType } from 'nexus';

export let BadgeOutput = objectType({
  name: 'BadgeOutput',
  definition(t) {
    t.list.field('badgeGroupings', { type: 'BadgeGroupings' });
    t.list.field('badgeTypes', { type: 'BadgeType' });
    t.list.field('badges', { type: 'Badge' });
  },
});

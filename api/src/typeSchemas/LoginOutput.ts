import { objectType } from 'nexus';

export let LoginOutput = objectType({
  name: 'LoginOutput',
  definition(t) {
    t.list.field('userBadges', { type: 'UserBadge' });
    t.nullable.list.field('badges', { type: 'Badge' });
    t.nullable.list.field('badgeTypes', { type: 'BadgeType' });
    t.nullable.list.field('users', { type: 'UserIconStatus' });
    t.nullable.list.field('topics', { type: 'UserTopic' });
    t.field('user', { type: 'UserLite' });
    // Auth
    t.string('token');
  },
});

import { objectType } from 'nexus';

export let UserProfileOutput = objectType({
  name: 'UserProfileOutput',
  definition(t) {
    t.list.field('userBadges', { type: 'UserBadge' });
    t.nullable.list.field('badges', { type: 'Badge' });
    t.nullable.list.field('badgeTypes', { type: 'BadgeType' });
    t.nullable.list.field('users', { type: 'UserIconStatus' });
    t.nullable.list.field('topics', { type: 'UserTopic' });
    t.field('user', { type: 'UserUnion' });
    t.boolean('unreadNotification');
  },
});

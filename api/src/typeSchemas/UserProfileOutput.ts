import { objectType } from '@nexus/schema';

export let UserProfileOutput = objectType({
  name: 'UserProfileOutput',
  definition(t) {
    t.field('userBadges', { type: 'UserBadge', list: true });
    t.field('badges', { type: 'Badge', list: true, nullable: true });
    t.field('badgeTypes', { type: 'BadgeType', list: true, nullable: true });
    t.field('users', { type: 'UserIconStatus', list: true, nullable: true });
    t.field('topics', { type: 'UserTopic', list: true, nullable: true });
    t.field('user', { type: 'UserUnion' });
    t.boolean('unreadNotification');
  },
});

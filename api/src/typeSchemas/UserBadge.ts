import { objectType } from '@nexus/schema';

export let UserBadge = objectType({
  name: 'UserBadge',
  definition(t) {
    t.int('id');
    t.string('grantedAt');
    t.string('createdAt');
    t.int('count');
    t.int('postId', { nullable: true });
    t.int('postNumber', { nullable: true });
    t.int('badgeId');
    t.int('userId');
    t.int('grantedById');
    t.int('topicId', { nullable: true });
  },
});

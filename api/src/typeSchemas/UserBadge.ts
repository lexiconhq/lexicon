import { objectType } from 'nexus';

export let UserBadge = objectType({
  name: 'UserBadge',
  definition(t) {
    t.int('id');
    t.string('grantedAt');
    t.string('createdAt');
    t.int('count');
    t.nullable.int('postId');
    t.nullable.int('postNumber');
    t.int('badgeId');
    t.int('userId');
    t.int('grantedById');
    t.nullable.int('topicId');
  },
});

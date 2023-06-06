import { objectType } from 'nexus';

import { getNormalizedUrlTemplate } from '../resolvers/utils';

export let UserActions = objectType({
  name: 'UserActions',
  definition(t) {
    t.string('actingAvatarTemplate', {
      resolve: (userActions) =>
        getNormalizedUrlTemplate(userActions, 'actingAvatar'),
      sourceType: 'string',
    });
    t.nullable.string('actingName');
    t.int('actingUserId');
    t.nullable.int('actionCode');
    t.int('actionType');
    t.boolean('archived');
    t.string('avatarTemplate', {
      resolve: (userActions) => getNormalizedUrlTemplate(userActions),
      sourceType: 'string',
    });
    t.nullable.int('categoryId');
    t.boolean('closed');
    t.string('createdAt');
    t.boolean('deleted');
    t.string('excerpt');
    t.nullable.boolean('hidden');
    t.nullable.string('name');
    t.nullable.int('postId');
    t.int('postNumber');
    t.nullable.int('postType');
    t.string('slug');
    t.nullable.string('targetName');
    t.int('targetUserId');
    t.string('targetUsername');
    t.string('title');
    t.int('topicId');
    t.int('userId');
    t.string('username');
  },
});

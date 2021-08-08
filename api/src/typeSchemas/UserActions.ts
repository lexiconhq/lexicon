import { objectType } from '@nexus/schema';

import { PROSE_DISCOURSE_UPLOAD_HOST } from '../constants';

export let UserActions = objectType({
  name: 'UserActions',
  definition(t) {
    t.string('actingAvatarTemplate', (userActions) => {
      let { actingAvatarTemplate } =
        'actingAvatarTemplate' in userActions
          ? userActions
          : { actingAvatarTemplate: '' };
      return actingAvatarTemplate.includes('http')
        ? actingAvatarTemplate
        : PROSE_DISCOURSE_UPLOAD_HOST.concat(actingAvatarTemplate);
    });
    t.string('actingName', { nullable: true });
    t.int('actingUserId');
    t.int('actionCode', { nullable: true });
    t.int('actionType');
    t.boolean('archived');
    t.string('avatarTemplate', (userActions) => {
      let { avatarTemplate } =
        'avatarTemplate' in userActions ? userActions : { avatarTemplate: '' };
      return avatarTemplate.includes('http')
        ? avatarTemplate
        : PROSE_DISCOURSE_UPLOAD_HOST.concat(avatarTemplate);
    });
    t.int('categoryId', { nullable: true });
    t.boolean('closed');
    t.string('createdAt');
    t.boolean('deleted');
    t.string('excerpt');
    t.string('hidden', { nullable: true });
    t.string('name', { nullable: true });
    t.int('postId', { nullable: true });
    t.int('postNumber');
    t.int('postType', { nullable: true });
    t.string('slug');
    t.string('targetName', { nullable: true });
    t.int('targetUserId');
    t.string('targetUsername');
    t.string('title');
    t.int('topicId');
    t.int('userId');
    t.string('username');
  },
});

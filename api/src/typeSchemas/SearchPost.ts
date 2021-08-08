import { objectType } from '@nexus/schema';

import { PROSE_DISCOURSE_UPLOAD_HOST } from '../constants';

export let SearchPost = objectType({
  name: 'SearchPost',
  definition(t) {
    t.int('id');
    t.string('avatarTemplate', (searchPost) => {
      let { avatarTemplate } =
        'avatarTemplate' in searchPost ? searchPost : { avatarTemplate: '' };
      return avatarTemplate.includes('http')
        ? avatarTemplate
        : PROSE_DISCOURSE_UPLOAD_HOST.concat(avatarTemplate);
    });
    t.string('blurb');
    t.string('createdAt');
    t.string('name', { nullable: true });
    t.string('username');
    t.int('likeCount');
    t.int('postNumber');
    t.int('topicId');
  },
});

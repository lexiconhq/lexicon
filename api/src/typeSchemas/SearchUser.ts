import { objectType } from '@nexus/schema';

import { PROSE_DISCOURSE_UPLOAD_HOST } from '../constants';

export let SearchUser = objectType({
  name: 'SearchUser',
  definition(t) {
    t.string('avatarTemplate', (searchUser) => {
      let { avatarTemplate } =
        'avatarTemplate' in searchUser ? searchUser : { avatarTemplate: '' };
      return avatarTemplate.includes('http')
        ? avatarTemplate
        : PROSE_DISCOURSE_UPLOAD_HOST.concat(avatarTemplate);
    });
    t.string('name', { nullable: true });
    t.string('username');
  },
});

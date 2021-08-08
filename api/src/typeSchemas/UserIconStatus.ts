import { objectType } from '@nexus/schema';

import { PROSE_DISCOURSE_UPLOAD_HOST } from '../constants';

export let UserIconStatus = objectType({
  name: 'UserIconStatus',
  definition(t) {
    t.int('id');
    t.string('username');
    t.string('name', { nullable: true });
    t.string('avatarTemplate', (userIconStatus) => {
      let { avatarTemplate } =
        'avatarTemplate' in userIconStatus
          ? userIconStatus
          : { avatarTemplate: '' };
      return avatarTemplate.includes('http')
        ? avatarTemplate
        : PROSE_DISCOURSE_UPLOAD_HOST.concat(avatarTemplate);
    });
    t.boolean('moderator');
    t.boolean('admin');
  },
});

import { objectType } from '@nexus/schema';

import { PROSE_DISCOURSE_UPLOAD_HOST } from '../constants';

export let UserIcon = objectType({
  name: 'UserIcon',
  definition(t) {
    t.int('id');
    t.string('username');
    t.string('name', { nullable: true });
    t.string('avatarTemplate', (userIcon) => {
      let { avatarTemplate } =
        'avatarTemplate' in userIcon ? userIcon : { avatarTemplate: '' };
      return avatarTemplate.includes('http')
        ? avatarTemplate
        : PROSE_DISCOURSE_UPLOAD_HOST.concat(avatarTemplate);
    });
  },
});

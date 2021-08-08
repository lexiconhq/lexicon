import { objectType } from '@nexus/schema';

import { PROSE_DISCOURSE_UPLOAD_HOST } from '../constants';

export let Participant = objectType({
  name: 'Participant',
  definition(t) {
    t.int('id');
    t.string('username');
    t.string('name', { nullable: true });
    t.string('avatarTemplate', (participant) => {
      let { avatarTemplate } =
        'avatarTemplate' in participant ? participant : { avatarTemplate: '' };
      return avatarTemplate.includes('http')
        ? avatarTemplate
        : PROSE_DISCOURSE_UPLOAD_HOST.concat(avatarTemplate);
    });
    t.int('postCount');
    t.string('primaryGroupName', { nullable: true });
    t.string('primaryGroupFlairUrl', { nullable: true });
    t.string('primaryGroupFlairColor', { nullable: true });
    t.string('primaryGroupFlairBgColor', { nullable: true });
  },
});

import { objectType } from '@nexus/schema';

export let AdminMessageInvitation = objectType({
  name: 'AdminMessageInvitation',
  definition(t) {
    t.string('displayUsername');
    t.string('topicTitle');
  },
});

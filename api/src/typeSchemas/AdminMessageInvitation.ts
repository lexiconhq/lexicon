import { objectType } from 'nexus';

export let AdminMessageInvitation = objectType({
  name: 'AdminMessageInvitation',
  definition(t) {
    t.string('displayUsername');
    t.string('topicTitle');
  },
});

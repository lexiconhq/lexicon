import { objectType } from '@nexus/schema';

export let InviteeAccept = objectType({
  name: 'InviteeAccept',
  definition(t) {
    t.string('displayUsername');
  },
});

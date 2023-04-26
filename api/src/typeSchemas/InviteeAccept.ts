import { objectType } from 'nexus';

export let InviteeAccept = objectType({
  name: 'InviteeAccept',
  definition(t) {
    t.string('displayUsername');
  },
});

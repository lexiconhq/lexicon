import { objectType } from '@nexus/schema';

export let ChangeUsernameOutput = objectType({
  name: 'ChangeUsernameOutput',
  definition(t) {
    t.int('id');
    t.string('username');
  },
});

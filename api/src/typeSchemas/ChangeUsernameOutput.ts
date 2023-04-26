import { objectType } from 'nexus';

export let ChangeUsernameOutput = objectType({
  name: 'ChangeUsernameOutput',
  definition(t) {
    t.int('id');
    t.string('username');
  },
});

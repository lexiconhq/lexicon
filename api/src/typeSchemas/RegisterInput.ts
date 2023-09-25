import { inputObjectType } from 'nexus';

export let RegisterInput = inputObjectType({
  name: 'RegisterInput',
  definition(t) {
    t.string('email');
    t.string('username');
    t.string('password');
    t.nullable.string('name');
  },
});

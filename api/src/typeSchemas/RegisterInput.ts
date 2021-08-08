import { inputObjectType } from '@nexus/schema';

export let RegisterInput = inputObjectType({
  name: 'RegisterInput',
  definition(t) {
    t.string('email', { required: true });
    t.string('username', { required: true });
    t.string('password', { required: true });
    t.string('name');
  },
});

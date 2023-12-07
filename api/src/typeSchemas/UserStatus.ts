import { objectType } from 'nexus';

export let UserStatus = objectType({
  name: 'UserStatus',
  definition(t) {
    t.string('description');
    t.string('emoji');
    t.nullable.string('endsAt');
  },
});

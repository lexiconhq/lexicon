import { objectType } from 'nexus';

export let RefreshTokenOutput = objectType({
  name: 'RefreshTokenOutput',
  definition(t) {
    t.int('id');
    t.string('username');
    t.nullable.string('name');
    // Auth
    t.string('token');
  },
});

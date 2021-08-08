import { objectType } from '@nexus/schema';

export let RefreshTokenOutput = objectType({
  name: 'RefreshTokenOutput',
  definition(t) {
    t.int('id');
    t.string('username');
    t.string('name', { nullable: true });
    // Auth
    t.string('token');
  },
});

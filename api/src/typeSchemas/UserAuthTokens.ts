import { objectType } from 'nexus';

export let UserAuthTokens = objectType({
  name: 'UserAuthTokens',
  definition(t) {
    t.string('browser');
    t.string('clientIp');
    t.string('createdAt');
    t.string('device');
    t.string('icon');
    t.int('id');
    t.boolean('isActive');
    t.string('location');
    t.string('os');
    t.string('seenAt');
  },
});

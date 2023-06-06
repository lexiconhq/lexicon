import { objectType } from 'nexus';

export let UserAuthToken = objectType({
  name: 'UserAuthToken',
  definition(t) {
    t.int('id');
    t.string('clientIp');
    t.string('location');
    t.string('browser');
    t.string('device');
    t.string('os');
    t.string('icon');
    t.string('createdAt');
    t.string('seenAt');
    t.boolean('isActive');
  },
});

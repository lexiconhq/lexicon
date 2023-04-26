import { objectType } from 'nexus';

export let HealthCheck = objectType({
  name: 'HealthCheck',
  definition(t) {
    t.boolean('isDiscourseReachable');
    t.string('discourseHost');
    t.nullable.string('discourseError');
  },
});

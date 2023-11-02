import { objectType } from 'nexus';

export let PollOption = objectType({
  name: 'PollOption',
  definition(t) {
    t.string('id');
    t.string('html');
    t.nullable.int('votes');
  },
});

import { objectType } from 'nexus';

export let RegisterOutput = objectType({
  name: 'RegisterOutput',
  definition(t) {
    t.boolean('success');
    t.string('message');
  },
});
// isDeveloper will be removed since we won't use it for now.
// There's params value and errors but the message already say the error if it's error.

import { objectType } from '@nexus/schema';

export let RemindersFrequency = objectType({
  name: 'RemindersFrequency',
  definition(t) {
    t.string('name');
    t.int('value');
  },
});

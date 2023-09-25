import { objectType } from 'nexus';

export let TagFilter = objectType({
  name: 'TagFilter',
  definition(t) {
    t.string('id');
    t.string('name');
    t.int('topicCount');
    t.boolean('staff');
  },
});

import { objectType } from '@nexus/schema';

export let TagFilter = objectType({
  name: 'TagFilter',
  definition(t) {
    t.string('id');
    t.string('name');
    t.int('topicCount');
    t.boolean('staff');
  },
});

import { objectType } from 'nexus';

export let TopicFlagTypes = objectType({
  name: 'TopicFlagTypes',
  definition(t) {
    t.string('description');
    t.int('id');
    t.nullable.boolean('isCustomFlag');
    t.nullable.boolean('isFlag');
    t.nullable.string('longForm');
    t.string('name');
    t.string('nameKey');
    t.nullable.string('shortDescription');
  },
});

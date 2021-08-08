import { objectType } from '@nexus/schema';

export let TopicFlagTypes = objectType({
  name: 'TopicFlagTypes',
  definition(t) {
    t.string('description');
    t.int('id');
    t.boolean('isCustomFlag', { nullable: true });
    t.boolean('isFlag', { nullable: true });
    t.string('longForm', { nullable: true });
    t.string('name');
    t.string('nameKey');
    t.string('shortDescription', { nullable: true });
  },
});

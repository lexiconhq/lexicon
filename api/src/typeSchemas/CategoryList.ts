import { objectType } from '@nexus/schema';

export let CategoryList = objectType({
  name: 'CategoryList',
  definition(t) {
    t.boolean('canCreateCategory');
    t.boolean('canCreateTopic');
    t.field('categories', { type: 'Categories', list: true });
    t.boolean('draft', { nullable: true });
    t.string('draftKey');
    t.int('draftSequence', { nullable: true });
  },
});

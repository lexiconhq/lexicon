import { objectType } from 'nexus';

export let CategoryList = objectType({
  name: 'CategoryList',
  definition(t) {
    t.boolean('canCreateCategory');
    t.boolean('canCreateTopic');
    t.list.field('categories', { type: 'Categories' });
    t.nullable.boolean('draft');
    t.string('draftKey');
    t.nullable.int('draftSequence');
  },
});

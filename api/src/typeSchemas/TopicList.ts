import { objectType } from 'nexus';

export let TopicList = objectType({
  name: 'TopicList',
  definition(t) {
    t.boolean('canCreateTopic');
    t.nullable.boolean('draft');
    t.string('draftKey');
    t.nullable.int('draftSequence');
    t.nullable.string('forPeriod');
    t.int('perPage');
    t.list.string('topTags');
    t.nullable.list.field('tags', { type: 'TagFilter' });
    t.nullable.list.field('topics', { type: 'Topic' });
  },
});

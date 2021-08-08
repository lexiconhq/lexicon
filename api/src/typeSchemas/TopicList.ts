import { objectType } from '@nexus/schema';

export let TopicList = objectType({
  name: 'TopicList',
  definition(t) {
    t.boolean('canCreateTopic');
    t.boolean('draft', { nullable: true });
    t.string('draftKey');
    t.int('draftSequence', { nullable: true });
    t.string('forPeriod', { nullable: true });
    t.int('perPage');
    t.string('topTags', { list: true });
    t.field('tags', { type: 'TagFilter', list: true, nullable: true });
    t.field('topics', { type: 'Topic', list: true, nullable: true });
  },
});

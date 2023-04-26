import { interfaceType, objectType } from 'nexus';

export const BaseTopicDetailOutput = interfaceType({
  name: 'BaseTopicDetailOutput',
  definition(t) {
    t.int('id');
    t.nullable.string('title');
    t.nullable.string('fancyTitle');
    t.nullable.int('postsCount');
    t.nullable.list.list.int('timelineLookup');
    t.nullable.string('slug');
    t.nullable.int('replyCount');
    t.nullable.int('highestPostNumber');
    t.nullable.int('currentPostNumber');
    t.nullable.string('createdAt');
    t.nullable.string('lastPostedAt');
    t.nullable.string('archetype');
    t.nullable.boolean('pinned');
    t.nullable.boolean('visible');
    t.nullable.boolean('closed');
    t.nullable.boolean('archived');
    t.nullable.boolean('bookmarked');
    t.nullable.boolean('liked');
    t.nullable.list.string('tags');
    t.nullable.int('views');
    t.nullable.int('likeCount');
    t.nullable.boolean('hasSummary');
    t.nullable.int('categoryId');
    t.nullable.boolean('pinnedGlobally');
    t.nullable.string('pinnedAt');
    t.nullable.string('pinnedUntil');
    t.nullable.int('wordCount');
    t.nullable.string('deletedAt');
    t.nullable.int('userId');
    t.nullable.string('draftKey');
    t.nullable.list.field('actionsSummary', { type: 'ActionSummary' });
    t.nullable.int('chunkSize');
    t.nullable.int('messageBusLastId');
    t.nullable.int('participantCount');
    t.nullable.boolean('showReadIndicator');
    t.nullable.field('details', { type: 'TopicDetail' });
    t.nullable.list.field('suggestedTopics', { type: 'Topic' });
    t.field('postStream', { type: 'PostStream' });
  },
  resolveType: () => null,
});

export let TopicDetailOutput = objectType({
  name: 'TopicDetailOutput',
  definition(t) {
    t.implements(BaseTopicDetailOutput);
  },
});

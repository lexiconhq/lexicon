import { objectType } from '@nexus/schema';

export let TopicDetailOutput = objectType({
  name: 'TopicDetailOutput',
  definition(t) {
    t.int('id');
    t.string('title', { nullable: true });
    t.string('fancyTitle', { nullable: true });
    t.int('postsCount', { nullable: true });
    t.int('timelineLookup', { list: [true, true], nullable: true });
    t.string('slug', { nullable: true });
    t.int('replyCount', { nullable: true });
    t.int('highestPostNumber', { nullable: true });
    t.int('currentPostNumber', { nullable: true });
    t.string('createdAt', { nullable: true });
    t.string('lastPostedAt', { nullable: true });
    t.string('archetype', { nullable: true });
    t.boolean('pinned', { nullable: true });
    t.boolean('visible', { nullable: true });
    t.boolean('closed', { nullable: true });
    t.boolean('archived', { nullable: true });
    t.boolean('bookmarked', { nullable: true });
    t.boolean('liked', { nullable: true });
    t.string('tags', { nullable: true, list: true });
    t.int('views', { nullable: true });
    t.int('likeCount', { nullable: true });
    t.boolean('hasSummary', { nullable: true });
    t.int('categoryId', { nullable: true });
    t.boolean('pinnedGlobally', { nullable: true });
    t.string('pinnedAt', { nullable: true });
    t.string('pinnedUntil', { nullable: true });
    t.int('wordCount', { nullable: true });
    t.string('deletedAt', { nullable: true });
    t.int('userId', { nullable: true });
    t.string('draftKey', { nullable: true });
    t.field('actionsSummary', {
      type: 'ActionSummary',
      list: true,
      nullable: true,
    });
    t.int('chunkSize', { nullable: true });
    t.int('messageBusLastId', { nullable: true });
    t.int('participantCount', { nullable: true });
    t.boolean('showReadIndicator', { nullable: true });
    t.field('details', { type: 'TopicDetail', nullable: true });
    t.field('suggestedTopics', { type: 'Topic', list: true, nullable: true });
    t.field('postStream', { type: 'PostStream' });
  },
});

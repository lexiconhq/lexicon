import { objectType } from '@nexus/schema';

export let SearchTopic = objectType({
  name: 'SearchTopic',
  definition(t) {
    t.int('id');
    t.string('title');
    t.string('fancyTitle');
    t.string('slug');
    t.int('postsCount');
    t.int('replyCount');
    t.int('highestPostNumber');
    t.string('createdAt');
    t.string('lastPostedAt', { nullable: true });
    t.boolean('bumped');
    t.string('bumpedAt');
    t.string('archetype', { nullable: true });
    t.boolean('unseen');
    t.boolean('pinned');
    t.string('excerpt', { nullable: true }); // Must be activated
    t.boolean('visible');
    t.boolean('closed');
    t.boolean('archived');
    t.boolean('bookmarked', { nullable: true });
    t.boolean('liked', { nullable: true });
    t.string('tags', { nullable: true, list: true });
    t.int('categoryId', { nullable: true });
    t.int('lastReadPostNumber', { nullable: true }); // Only available when logged in
    t.int('newPosts', { nullable: true }); // Only available when logged in
    t.int('notificationLevel', { nullable: true }); // Only available when logged in
    t.int('unread', { nullable: true }); // Only available when logged in
  },
});

/**
 * Missing Properties(still don't know what it is):
 * unpinned
 */

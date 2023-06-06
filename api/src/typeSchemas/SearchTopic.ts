import { objectType } from 'nexus';

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
    t.nullable.string('lastPostedAt');
    t.boolean('bumped');
    t.string('bumpedAt');
    t.nullable.string('archetype');
    t.boolean('unseen');
    t.boolean('pinned');

    // Nullable because this is a feature that must be turned in
    // in Discourse in order to be set.
    t.nullable.string('excerpt');

    t.boolean('visible');
    t.boolean('closed');
    t.boolean('archived');
    t.nullable.boolean('bookmarked');
    t.nullable.boolean('liked');
    t.nullable.list.string('tags');
    t.nullable.int('categoryId');

    // The below properties are only available when logged in.
    t.nullable.int('lastReadPostNumber');
    t.nullable.int('newPosts');
    t.nullable.int('notificationLevel');
    t.nullable.int('unread');
  },
});

/**
 * Missing Properties(still don't know what it is):
 * unpinned
 */

import { objectType } from '@nexus/schema';

export let UserFeaturedTopic = objectType({
  name: 'UserFeaturedTopic',
  definition(t) {
    t.int('id');
    t.int('userId');
    t.int('lastPostUserId');
    t.int('featuredUser1Id', { nullable: true });
    t.int('featuredUser2Id', { nullable: true });
    t.int('featuredUser3Id', { nullable: true });
    t.int('featuredUser4Id', { nullable: true });
    t.int('deletedById', { nullable: true });
    t.string('title');
    t.string('fancyTitle');
    t.string('slug');
    t.int('postsCount');
    t.int('replyCount');
    t.int('highestPostNumber');
    t.string('createdAt');
    t.string('lastPostedAt');
    t.string('updatedAt', { nullable: true });
    t.string('bumpedAt');
    t.string('archetype');
    t.string('pinnedAt', { nullable: true });
    t.string('pinnedUntil', { nullable: true });
    t.string('excerpt', { nullable: true }); // Must be activated
    t.boolean('visible');
    t.boolean('closed');
    t.boolean('archived');
    t.int('views');
    t.int('likeCount');
    t.int('incomingLinkCount');
    t.int('moderatorPostsCount');
    t.int('notifyModeratorsCount');
    t.int('spamCount');
    t.int('wordCount');
    t.int('participantCount');
    t.int('highestStaffPostNumber');
    t.float('score');
    t.float('reviewableScore');
    t.float('percentRank');
    t.int('categoryId', { nullable: true });
    t.boolean('pinnedGlobally');
  },
});
/**
 * Missing Properties(still don't know what it is):
 * subtype
 * image_upload_id
 * featured_link
 */

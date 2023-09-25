import { objectType } from 'nexus';

export let UserFeaturedTopic = objectType({
  name: 'UserFeaturedTopic',
  definition(t) {
    t.int('id');
    t.int('userId');
    t.int('lastPostUserId');
    t.nullable.int('featuredUser1Id');
    t.nullable.int('featuredUser2Id');
    t.nullable.int('featuredUser3Id');
    t.nullable.int('featuredUser4Id');
    t.nullable.int('deletedById');
    t.string('title');
    t.string('fancyTitle');
    t.string('slug');
    t.int('postsCount');
    t.int('replyCount');
    t.int('highestPostNumber');
    t.string('createdAt');
    t.string('lastPostedAt');
    t.nullable.string('updatedAt');
    t.string('bumpedAt');
    t.string('archetype');
    t.nullable.string('pinnedAt');
    t.nullable.string('pinnedUntil');
    t.nullable.string('excerpt'); // Must be activated
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
    t.nullable.int('categoryId');
    t.boolean('pinnedGlobally');
  },
});
/**
 * Missing Properties(still don't know what it is):
 * subtype
 * image_upload_id
 * featured_link
 */

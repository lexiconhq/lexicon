import { objectType } from '@nexus/schema';

type Poster = {
  description: string;
};

export let Topic = objectType({
  name: 'Topic',
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
    t.string('archetype');
    t.string('imageUrl', { nullable: true });
    t.boolean('unseen');
    t.boolean('pinned');
    t.string('excerpt', { nullable: true }); // Must be activated
    t.boolean('visible');
    t.boolean('closed');
    t.boolean('archived');
    t.boolean('bookmarked', { nullable: true });
    t.boolean('liked', { nullable: true });
    t.string('tags', { nullable: true, list: true });
    t.int('views');
    t.int('likeCount');
    t.int('allowedUserCount', { nullable: true }); // On PM
    t.int('lastReadPostNumber', { nullable: true }); // Only available when logged in
    t.int('newPosts', { nullable: true }); // Only available when logged in
    t.int('notificationLevel', { nullable: true }); // Only available when logged in
    t.int('unread', { nullable: true }); // Only available when logged in
    t.boolean('hasSummary', { nullable: true }); // Nullable in suggested topic
    t.string('lastPosterUsername', { nullable: true }); // recomended topic doesn't have dis
    t.int('categoryId', { nullable: true });
    t.boolean('pinnedGlobally', { nullable: true }); // Nullable in suggested topic
    t.field('posters', { type: 'TopicPoster', list: true });
    t.field('participants', {
      type: 'MessageParticipant',
      list: true,
      nullable: true,
    });
    t.int('authorUserId', {
      nullable: true,
      resolve: ({ posters }) => {
        const author = posters.find((p: Poster) =>
          p.description.toLowerCase().includes('original poster'),
        );

        return author?.userId || author?.user?.id || null;
      },
    });
    t.int('frequentPosterUserId', {
      nullable: true,
      resolve: ({ posters }) => {
        const frequentPoster = posters.find((p: Poster) =>
          p.description.toLowerCase().includes('frequent poster'),
        );

        return frequentPoster?.userId || frequentPoster?.user?.id || null;
      },
    });
    // Note: Comment out for maybe next phase
    // t.int('recentPosterUserId', {
    //   nullable: true,
    //   resolve: ({ posters }) => {
    //     const recentPoster = posters.find((p: Poster) =>
    //       p.description.toLowerCase().includes('most recent poster'),
    //     );

    //     return recentPoster?.userId || recentPoster?.user?.id || null;
    //   },
    // });
  },
});
/**
 * Missing Properties(still don't know what it is):
 * featuredLink
 * imageUrl
 * unpinned
 */

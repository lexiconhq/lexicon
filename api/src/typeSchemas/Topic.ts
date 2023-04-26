import { objectType } from 'nexus';

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
    t.nullable.string('lastPostedAt');
    t.boolean('bumped');
    t.string('bumpedAt');
    t.string('archetype');
    t.nullable.string('imageUrl');
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
    t.int('views');
    t.int('likeCount');

    // For PMs
    t.nullable.int('allowedUserCount');

    // The following properties are only available when logged in.
    t.nullable.int('lastReadPostNumber');
    t.nullable.int('newPosts');
    t.nullable.int('notificationLevel');
    t.nullable.int('unread');
    t.nullable.int('categoryId');

    // The following fields are nullable when the topic is being
    // presented as a suggested topic.
    t.nullable.string('lastPosterUsername');
    t.nullable.boolean('pinnedGlobally');
    t.nullable.boolean('hasSummary');

    t.list.field('posters', { type: 'TopicPoster' });
    t.nullable.list.field('participants', {
      type: 'MessageParticipant',
    });
    t.nullable.int('authorUserId', {
      resolve: ({ posters }) => {
        const author = posters.find((p: Poster) =>
          p.description.toLowerCase().includes('original poster'),
        );

        return author?.userId || author?.user?.id || null;
      },
    });
    t.nullable.int('frequentPosterUserId', {
      resolve: ({ posters }) => {
        const frequentPoster = posters.find((p: Poster) =>
          p.description.toLowerCase().includes('frequent poster'),
        );

        return frequentPoster?.userId || frequentPoster?.user?.id || null;
      },
    });
    // Note: Comment out for maybe next phase
    // t.nullable.int('recentPosterUserId', {
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

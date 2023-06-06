import { objectType } from 'nexus';

import { generateMarkdownContent, getMention } from '../helpers';
import { getNormalizedUrlTemplate } from '../resolvers/utils';

export let Post = objectType({
  name: 'Post',
  definition(t) {
    t.int('id');
    t.nullable.string('name');
    t.string('username');
    t.string('avatarTemplate', {
      resolve: (post) => getNormalizedUrlTemplate(post),
      sourceType: 'string',
    });
    t.string('createdAt');
    t.string('cooked');
    t.nullable.list.string('mentions', {
      resolve: (post) => getMention(post.cooked) || null,
    });
    t.nullable.string('raw'); // from Post(mutation) doesn't have raw even with include_raw: true
    t.nullable.string('markdownContent', {
      resolve: (post) => {
        let { raw = '' } = 'raw' in post ? post : {};
        let { cooked = '' } = 'cooked' in post ? post : {};

        if (!raw) {
          return null;
        }
        if (!cooked) {
          return raw;
        }
        return generateMarkdownContent(raw, cooked);
      },
    });
    t.int('postNumber');
    t.int('postType');
    t.string('updatedAt');
    t.int('replyCount');
    t.nullable.int('replyToPostNumber');
    t.int('quoteCount');
    t.int('incomingLinkCount');
    t.int('reads');
    t.float('score');
    t.boolean('yours');
    t.int('topicId');
    t.string('topicSlug');
    t.nullable.string('displayUsername');
    t.nullable.string('primaryGroupName');
    t.nullable.string('primaryGroupFlairUrl');
    t.nullable.string('primaryGroupFlairColor');
    t.nullable.string('primaryGroupFlairBgColor');
    t.int('version');
    t.boolean('canEdit');
    t.boolean('canDelete');
    t.boolean('canRecover');
    t.boolean('canWiki');
    t.nullable.boolean('bookmarked');
    t.nullable.list.field('actionsSummary', {
      type: 'ActionSummary',
    });
    t.boolean('moderator');
    t.boolean('admin');
    t.boolean('staff');
    t.int('userId');

    // Nullable because when getting a post, there is no draft sequence.
    t.nullable.int('draftSequence');

    t.boolean('hidden');
    t.int('trustLevel');
    t.boolean('userDeleted');
    t.boolean('canViewEditHistory');
    t.boolean('wiki');
    t.nullable.int('reviewableId');
    t.nullable.float('reviewableScoreCount');
    t.nullable.float('reviewableScorePendingCount');

    // The post can have an link, such as an image link
    t.nullable.list.field('linkCounts', { type: 'LinkCount' });

    t.nullable.string('actionCode');
    t.nullable.string('actionCodeWho');
  },
});

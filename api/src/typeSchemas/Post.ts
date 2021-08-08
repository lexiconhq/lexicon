import { objectType } from '@nexus/schema';

import { PROSE_DISCOURSE_UPLOAD_HOST } from '../constants';
import { getMention, getPostImageUrl } from '../helpers';

export let Post = objectType({
  name: 'Post',
  definition(t) {
    t.int('id');
    t.string('name', { nullable: true });
    t.string('username');
    t.string('avatarTemplate', (post) => {
      let { avatarTemplate } =
        'avatarTemplate' in post ? post : { avatarTemplate: '' };
      return avatarTemplate.includes('http')
        ? avatarTemplate
        : PROSE_DISCOURSE_UPLOAD_HOST.concat(avatarTemplate);
    });
    t.string('createdAt');
    t.string('cooked');

    t.list.string('listOfCooked', {
      resolve: (post) => getPostImageUrl(post.cooked) || null,
      nullable: true,
    });
    t.list.string('listOfMention', {
      resolve: (post) => getMention(post.cooked) || null,
      nullable: true,
    });
    t.string('raw', { nullable: true }); // from Post(mutation) doesn't have raw even with include_raw: true
    t.int('postNumber');
    t.int('postType');
    t.string('updatedAt');
    t.int('replyCount');
    t.int('replyToPostNumber', { nullable: true });
    t.int('quoteCount');
    t.int('incomingLinkCount');
    t.int('reads');
    t.float('score');
    t.boolean('yours');
    t.int('topicId');
    t.string('topicSlug');
    t.string('displayUsername', { nullable: true });
    t.string('primaryGroupName', { nullable: true });
    t.string('primaryGroupFlairUrl', { nullable: true });
    t.string('primaryGroupFlairColor', { nullable: true });
    t.string('primaryGroupFlairBgColor', { nullable: true });
    t.int('version');
    t.boolean('canEdit');
    t.boolean('canDelete');
    t.boolean('canRecover');
    t.boolean('canWiki');
    t.boolean('bookmarked', { nullable: true });
    t.field('actionsSummary', {
      type: 'ActionSummary',
      list: true,
      nullable: true,
    });
    t.boolean('moderator');
    t.boolean('admin');
    t.boolean('staff');
    t.int('userId');
    t.int('draftSequence', { nullable: true }); // Get Post doesn't have draft sequence
    t.boolean('hidden');
    t.int('trustLevel');
    t.boolean('userDeleted');
    t.boolean('canViewEditHistory');
    t.boolean('wiki');
    t.int('reviewableId', { nullable: true });
    t.float('reviewableScoreCount', { nullable: true });
    t.float('reviewableScorePendingCount', { nullable: true });
    t.field('linkCounts', { type: 'LinkCount', list: true, nullable: true }); // if post have link like image link
    t.string('actionCode', { nullable: true });
    t.string('actionCodeWho', { nullable: true });
  },
});

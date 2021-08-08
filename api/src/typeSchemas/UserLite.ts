import { objectType } from '@nexus/schema';

import { PROSE_DISCOURSE_UPLOAD_HOST } from '../constants';

export let UserLite = objectType({
  name: 'UserLite',
  definition(t) {
    t.int('id');
    t.string('username');
    t.string('name', { nullable: true });
    t.string('avatarTemplate', (userLite) => {
      let { avatarTemplate } =
        'avatarTemplate' in userLite ? userLite : { avatarTemplate: '' };
      return avatarTemplate.includes('http')
        ? avatarTemplate
        : PROSE_DISCOURSE_UPLOAD_HOST.concat(avatarTemplate);
    });
    t.string('lastPostedAt', { nullable: true }); // New user doens't have last Posted
    t.string('lastSeenAt', { nullable: true }); // New user doens't have last Posted
    t.string('createdAt');
    t.boolean('ignored');
    t.boolean('muted');
    t.boolean('canIgnoreUser');
    t.boolean('canMuteUser');
    t.boolean('canSendPrivateMessages');
    t.boolean('canSendPrivateMessageToUser');
    t.int('trustLevel');
    t.boolean('moderator');
    t.boolean('admin');
    t.string('title', { nullable: true });
    t.int('badgeCount');
    t.int('timeRead');
    t.int('recentTimeRead');
    t.int('primaryGroupId', { nullable: true });
    t.string('primaryGroupName', { nullable: true });
    t.string('primaryGroupFlairUrl', { nullable: true });
    t.string('primaryGroupFlairBgColor', { nullable: true });
    t.string('primaryGroupFlairColor', { nullable: true });
    t.field('featuredTopic', { type: 'UserFeaturedTopic', nullable: true });
    t.string('bioRaw', { nullable: true });
    t.string('bioExcerpt', { nullable: true });
    t.string('bioCooked', { nullable: true });
    t.string('website', { nullable: true });
    t.string('websiteName', { nullable: true });
    t.string('location', { nullable: true });
    t.boolean('canEdit');
    t.boolean('canEditUsername');
    t.boolean('canEditEmail');
    t.boolean('canEditName');
    t.int('uploadedAvatarId', { nullable: true });
    t.int('pendingCount');
    t.int('profileViewCount');
    t.boolean('canUploadProfileHeader');
    t.boolean('canUploadUserCardBackground');
    t.int('mailingListPostsPerDay');
    t.string('dateOfBirth', { nullable: true });
    t.int('featuredUserBadgeIds', { nullable: true, list: true });
    t.field('invitedBy', { type: 'UserIcon', nullable: true });
    t.field('groups', { type: 'Group', list: true });
    t.field('remindersFrequency', {
      type: 'RemindersFrequency',
      list: true,
      nullable: true,
    }); // User from login endpoint doesn't have this
  },
});
/**
 * Missing params:
 * custom_fields
 */

import { objectType } from '@nexus/schema';

import { PROSE_DISCOURSE_UPLOAD_HOST } from '../constants';

export let UserDetail = objectType({
  name: 'UserDetail',
  definition(t) {
    t.int('id');
    t.string('username');
    t.string('name', { nullable: true });
    t.string('email');
    t.string('avatarTemplate', (userDetail) => {
      let { avatarTemplate } =
        'avatarTemplate' in userDetail ? userDetail : { avatarTemplate: '' };
      return avatarTemplate.includes('http')
        ? avatarTemplate
        : PROSE_DISCOURSE_UPLOAD_HOST.concat(avatarTemplate);
    });
    t.string('lastPostedAt', { nullable: true }); // New user doens't have last Posted
    t.string('lastSeenAt', { nullable: true });
    t.string('createdAt');
    t.string('secondaryEmails', { list: true, nullable: true });
    t.string('unconfirmedEmails', { list: true, nullable: true });
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
    t.string('bioExcerpt', { nullable: true });
    t.string('bioCooked', { nullable: true });
    t.string('bioRaw', { nullable: true });
    t.string('dateOfBirth', { nullable: true });
    t.string('website', { nullable: true });
    t.string('websiteName', { nullable: true });
    t.string('location', { nullable: true });
    t.boolean('canEdit');
    t.boolean('canEditUsername');
    t.boolean('canEditEmail');
    t.boolean('canEditName');
    t.boolean('canChangeBio');
    t.boolean('canChangeLocation');
    t.boolean('canChangeWebsite');
    t.int('uploadedAvatarId', { nullable: true });
    t.boolean('hasTitleBadges');
    t.boolean('secondFactorEnabled');
    t.boolean('secondFactorBackupEnabled', { nullable: true }); // If Admin change it's null
    t.int('pendingCount');
    t.int('profileViewCount');
    t.boolean('canUploadProfileHeader');
    t.boolean('canUploadUserCardBackground');
    t.string('locale', { nullable: true });
    t.int('mailingListPostsPerDay');
    t.int('mutedCategoryIds', { list: true });
    t.int('regularCategoryIds', { list: true });
    t.int('trackedCategoryIds', { list: true });
    t.int('watchedCategoryIds', { list: true });
    t.int('watchedFirstPostCategoryIds', { list: true });
    t.string('watchedTags', { list: true });
    t.string('watchingFirstPostTags', { list: true });
    t.string('trackedTags', { list: true });
    t.string('mutedTags', { list: true });
    t.string('systemAvatarTemplate', (userDetail) => {
      let { systemAvatarTemplate } =
        'systemAvatarTemplate' in userDetail
          ? userDetail
          : { systemAvatarTemplate: '' };
      return systemAvatarTemplate.includes('http')
        ? systemAvatarTemplate
        : PROSE_DISCOURSE_UPLOAD_HOST.concat(systemAvatarTemplate);
    });
    t.string('mutedUsernames', { list: true });
    t.string('ignoredUsernames', { list: true });
    t.string('allowedPmUsernames', { list: true });
    t.int('featuredUserBadgeIds', { nullable: true, list: true });
    t.field('invitedBy', { type: 'UserIcon', nullable: true });
    t.field('groups', { type: 'Group', list: true });
    t.field('groupUsers', { type: 'GroupUser', list: true });
    t.field('remindersFrequency', {
      type: 'RemindersFrequency',
      list: true,
      nullable: true,
    });
    t.field('userAuthTokens', { type: 'UserAuthToken', list: true });
    t.field('userOption', { type: 'UserOption' });
  },
});
/**
 * Missing params:
 * custom_fields
 * associated_accounts
 * system_avatar_upload_id
 * user_api_keys
 */

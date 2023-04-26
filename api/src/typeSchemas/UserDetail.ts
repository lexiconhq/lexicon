import { objectType } from 'nexus';

import { getNormalizedUrlTemplate } from '../resolvers/utils';

export let UserDetail = objectType({
  name: 'UserDetail',
  definition(t) {
    t.int('id');
    t.string('username');
    t.nullable.string('name');
    t.string('email');
    t.string('avatarTemplate', {
      resolve: (userDetail) => getNormalizedUrlTemplate(userDetail),
      sourceType: 'string',
    });
    t.nullable.string('lastPostedAt'); // New user doens't have last Posted
    t.nullable.string('lastSeenAt');
    t.string('createdAt');
    t.nullable.list.string('secondaryEmails');
    t.nullable.list.string('unconfirmedEmails');
    t.boolean('ignored');
    t.boolean('muted');
    t.boolean('canIgnoreUser');
    t.boolean('canMuteUser');
    t.boolean('canSendPrivateMessages');
    t.boolean('canSendPrivateMessageToUser');
    t.int('trustLevel');
    t.boolean('moderator');
    t.boolean('admin');
    t.nullable.string('title');
    t.int('badgeCount');
    t.int('timeRead');
    t.int('recentTimeRead');
    t.nullable.int('primaryGroupId');
    t.nullable.string('primaryGroupName');
    t.nullable.string('primaryGroupFlairUrl');
    t.nullable.string('primaryGroupFlairBgColor');
    t.nullable.string('primaryGroupFlairColor');
    t.nullable.field('featuredTopic', { type: 'UserFeaturedTopic' });
    t.nullable.string('bioExcerpt');
    t.nullable.string('bioCooked');
    t.nullable.string('bioRaw');
    t.nullable.string('dateOfBirth');
    t.nullable.string('website');
    t.nullable.string('websiteName');
    t.nullable.string('location');
    t.boolean('canEdit');
    t.boolean('canEditUsername');
    t.boolean('canEditEmail');
    t.boolean('canEditName');
    t.boolean('canChangeBio');
    t.boolean('canChangeLocation');
    t.boolean('canChangeWebsite');
    t.nullable.int('uploadedAvatarId');
    t.boolean('hasTitleBadges');
    t.boolean('secondFactorEnabled');
    t.nullable.boolean('secondFactorBackupEnabled'); // If Admin change it's null
    t.int('pendingCount');
    t.int('profileViewCount');
    t.boolean('canUploadProfileHeader');
    t.boolean('canUploadUserCardBackground');
    t.nullable.string('locale');
    t.int('mailingListPostsPerDay');
    t.list.int('mutedCategoryIds');
    t.list.int('regularCategoryIds');
    t.list.int('trackedCategoryIds');
    t.list.int('watchedCategoryIds');
    t.list.int('watchedFirstPostCategoryIds');
    t.list.string('watchedTags');
    t.list.string('watchingFirstPostTags');
    t.list.string('trackedTags');
    t.list.string('mutedTags');
    t.string('systemAvatarTemplate', {
      resolve: (userDetail) =>
        getNormalizedUrlTemplate(userDetail, 'systemAvatar'),
    });
    t.list.string('mutedUsernames');
    t.list.string('ignoredUsernames');
    t.list.string('allowedPmUsernames');
    t.nullable.list.int('featuredUserBadgeIds');
    t.nullable.field('invitedBy', { type: 'UserIcon' });
    t.list.field('groups', { type: 'Group' });
    t.list.field('groupUsers', { type: 'GroupUser' });
    t.nullable.list.field('remindersFrequency', {
      type: 'RemindersFrequency',
    });
    t.list.field('userAuthTokens', { type: 'UserAuthToken' });
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

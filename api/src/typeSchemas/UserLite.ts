import { objectType } from 'nexus';

import { getNormalizedUrlTemplate } from '../resolvers/utils';

export let UserLite = objectType({
  name: 'UserLite',
  definition(t) {
    t.int('id');
    t.string('username');
    t.nullable.string('name');
    t.string('avatarTemplate', {
      resolve: (userLite) => getNormalizedUrlTemplate(userLite),
      sourceType: 'string',
    });

    // The following 2 fields aren't present for new users, because the user
    // won't have posted anything yet to have "last posted" fields.
    t.nullable.string('lastPostedAt');
    t.nullable.string('lastSeenAt');

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
    t.nullable.string('bioRaw');
    t.nullable.string('bioExcerpt');
    t.nullable.string('bioCooked');
    t.nullable.string('website');
    t.nullable.string('websiteName');
    t.nullable.string('location');
    t.boolean('canEdit');
    t.boolean('canEditUsername');
    t.boolean('canEditEmail');
    t.boolean('canEditName');
    t.nullable.int('uploadedAvatarId');
    t.int('pendingCount');
    t.int('profileViewCount');
    t.boolean('canUploadProfileHeader');
    t.boolean('canUploadUserCardBackground');
    t.int('mailingListPostsPerDay');
    t.nullable.string('dateOfBirth');
    t.nullable.list.int('featuredUserBadgeIds');
    t.nullable.field('invitedBy', { type: 'UserIcon' });
    t.list.field('groups', { type: 'Group' });

    // Nullable because a user from the login endpoint won't have this set.
    t.nullable.list.field('remindersFrequency', {
      type: 'RemindersFrequency',
    });
  },
});
/**
 * Missing params:
 * custom_fields
 */

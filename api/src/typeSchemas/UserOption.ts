import { objectType } from 'nexus';

export let UserOption = objectType({
  name: 'UserOption',
  definition(t) {
    t.int('userId');
    t.boolean('mailingListMode');
    t.int('mailingListModeFrequency');
    t.boolean('emailDigests');
    t.int('emailLevel');
    t.int('emailMessagesLevel');
    t.boolean('externalLinksInNewTab');
    t.boolean('dynamicFavicon');
    t.boolean('enableQuoting');
    t.boolean('enableDefer');
    t.int('digestAfterMinutes');
    t.boolean('automaticallyUnpinTopics');
    t.int('autoTrackTopicsAfterMsecs');
    t.int('notificationLevelWhenReplying');
    t.int('newTopicDurationMinutes');
    t.int('emailPreviousReplies');
    t.boolean('emailInReplyTo');
    t.int('likeNotificationFrequency');
    t.boolean('includeTl0InDigests');
    t.list.int('themeIds');
    t.int('themeKeySeq');
    t.boolean('allowPrivateMessages');
    t.boolean('enableAllowedPmUsers');
    t.boolean('hideProfileAndPresence');
    t.string('textSize');
    t.int('textSizeSeq');
    t.string('titleCountMode');
    t.string('timezone');
    t.boolean('skipNewUserTips');
  },
});
/**
 * Missing params:
 * color_scheme_id
 * dark_scheme_id
 * homepage_id
 */

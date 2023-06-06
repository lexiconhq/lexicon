import { objectType } from 'nexus';

export let UserOptions = objectType({
  name: 'UserOptions',
  definition(t) {
    t.boolean('allowPrivateMessages');
    t.int('autoTrackTopicsAfterMsecs');
    t.boolean('automaticallyUnpinTopics');
    t.nullable.int('colorSchemeId');
    t.nullable.int('darkSchemeId');
    t.int('digestAfterMinutes');
    t.boolean('dynamicFavicon');
    t.boolean('emailDigests');
    t.boolean('emailInReplyTo');
    t.int('emailLevel');
    t.int('emailMessagesLevel');
    t.int('emailPreviousReplies');
    t.boolean('enableAllowedPmUsers');
    t.boolean('enableDefer');
    t.boolean('enableQuoting');
    t.boolean('externalLinksInNewTab');
    t.boolean('hideProfileAndPresence');
    t.nullable.int('homepageId');
    t.boolean('includeTl0InDigests');
    t.int('likeNotificationFrequency');
    t.boolean('mailingListMode');
    t.int('mailingListFrequency');
    t.int('newTopicDurationMinutes');
    t.int('notificationLevelWhenReplying');
    t.boolean('skipNewUserTips');
    t.string('textSize');
    t.int('textSizeSeq');
  },
});

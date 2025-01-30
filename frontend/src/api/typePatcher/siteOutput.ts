import { RestLink } from 'apollo-link-rest';

import { discourseHost, UNCATEGORIZED_CATEGORY_ID } from '../../constants';

export const siteOutputPatcher: RestLink.FunctionalTypePatcher = (data) => {
  const topicFlagTypes = data.topicFlagTypes.filter(
    (flag: { id: string; nameKey: string }) =>
      flag.id != null && flag.nameKey != null,
  );

  const postActionTypes = data.postActionTypes.filter(
    (flag: { id: string; nameKey: string }) =>
      flag.id != null && flag.nameKey != null,
  );

  return {
    ...data,
    __typename: 'SiteOutput',
    canCreateTag: data.canCreateTag || false,
    canTagTopics: data.canTagTopics || false,
    uncategorizedCategoryId:
      data.uncategorizedCategoryId ?? UNCATEGORIZED_CATEGORY_ID,
    topicFlagTypes,
    postActionTypes,
    discourseBaseUrl: discourseHost,
    enableLexiconPushNotifications:
      data?.lexicon?.settings.lexicon_push_notifications_enabled || false,
  };
};

export const SiteSettingsOutputPatcher: RestLink.FunctionalTypePatcher = (
  data,
) => {
  const {
    inviteOnly = false,
    allowNewRegistrations = true,
    enableSso = false,
    authorizedExtensions = '',
    minSearchTermLength: minSearchLength = 0,
    taggingEnabled = false,
    maxTagsPerTopic = 0,
    maxTagLength = 0,
    maxUsernameLength = 0,
    minUsernameLength = 0,
    minPasswordLength = 0,
    fullNameRequired = false,
    defaultComposerCategory = '',
    allowUncategorizedTopics = false,
    enableUserStatus: allowUserStatus = false,
    externalEmojiUrl = '',
    emojiSet = '',
    pollEnabled: allowPoll = true,
    pollMinimumTrustLevelToCreate: pollCreateMinimumTrustLevel = 1,
    loginRequired = false,
  } = data;
  return {
    ...data,
    __typename: 'SiteSettingsOutput',
    canSignUp: !inviteOnly && allowNewRegistrations && !enableSso,
    authorizedExtensions,
    minSearchLength,
    taggingEnabled,
    maxTagsPerTopic,
    maxTagLength,
    maxUsernameLength,
    minUsernameLength,
    minPasswordLength,
    fullNameRequired,
    defaultComposerCategory,
    allowUncategorizedTopics,
    allowUserStatus,
    externalEmojiUrl,
    emojiSet,
    allowPoll,
    pollCreateMinimumTrustLevel,
    loginRequired,
  };
};

import { mockCategories } from './categories';

export const SITE = {
  canCreateTag: true,
  canTagTopics: true,
  uncategorizedCategoryId: 1,
  groups: [],
  topicFlagTypes: [],
  postActionTypes: [],
  lexicon: {
    settings: {
      lexicon_push_notifications_enabled: false,
    },
  },
};

export const SITE_SETTINGS = {
  inviteOnly: false,
  allowNewRegistrations: false,
  enableSso: false,
  canSignUp: false,
  authorizedExtensions: '',
  minSearchTermLength: 3,
  taggingEnabled: true,
  maxTagLength: 10,
  maxTagsPerTopic: 5,
  maxUsernameLength: 15,
  minUsernameLength: 1,
  minPasswordLength: 2,
  fullNameRequired: false,
  allowUncategorizedTopics: false,
  defaultComposerCategory: mockCategories[0].id,
  enableUserStatus: true,
  emojiSet: 'twitter',
  externalEmojiUrl: '',
  pollEnabled: true,
  pollMinimumTrustLevelToCreate: 1,
  loginRequired: true,
};

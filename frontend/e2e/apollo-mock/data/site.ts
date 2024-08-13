import { MOCK_SERVER_PORT } from '../../global';

import { mockCategories } from './categories';

export const siteSetting = {
  canCreateTag: true,
  canTagTopics: true,
  canSignUp: false,
  authorizedExtensions: '',
  uncategorizedCategoryId: 1,
  minSearchLength: 3,
  taggingEnabled: true,
  maxTagLength: 10,
  maxTagsPerTopic: 5,
  maxUsernameLength: 15,
  minUsernameLength: 1,
  minPasswordLength: 2,
  fullNameRequired: false,
  topicFlagTypes: [],
  postActionTypes: [],
  allowUncategorizedTopics: false,
  defaultComposerCategory: mockCategories[0].id,
  groups: [],
  allowUserStatus: true,
  emojiSet: 'twitter',
  externalEmojiUrl: '',
  /**
   * This local url used for android
   */
  discourseBaseUrl: `http://10.0.2.2:${MOCK_SERVER_PORT}`,
  allowPoll: true,
  pollCreateMinimumTrustLevel: 1,
  enableLexiconPushNotifications: false,
};

import { gql } from '@apollo/client';

export const SITE = gql`
  query Site {
    site {
      canCreateTag
      canTagTopics
      canSignUp
      authorizedExtensions
      uncategorizedCategoryId
      minSearchLength
      taggingEnabled
      maxTagLength
      maxTagsPerTopic
      maxUsernameLength
      minUsernameLength
      minPasswordLength
      fullNameRequired
      allowUncategorizedTopics
      defaultComposerCategory
      topicFlagTypes {
        description
        id
        isCustomFlag
        isFlag
        longForm
        name
        nameKey
        shortDescription
      }
      postActionTypes {
        description
        id
        isCustomFlag
        isFlag
        longForm
        name
        nameKey
        shortDescription
      }
      groups {
        id
        name
      }
      allowUserStatus
      emojiSet
      externalEmojiUrl
      discourseBaseUrl
      allowPoll
      pollCreateMinimumTrustLevel
      enableLexiconPushNotifications
    }
  }
`;

export const PLUGIN_STATUS = gql`
  query PluginStatus {
    pluginStatus {
      appleLoginEnabled
      loginLinkEnabled
    }
  }
`;

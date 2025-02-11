import { gql } from '@apollo/client';

export const SITE = gql`
  query Site {
    site @rest(type: "SiteOutput", path: "/site.json") {
      canCreateTag
      canTagTopics
      uncategorizedCategoryId
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
      discourseBaseUrl
      enableLexiconPushNotifications
      siteSettings
        @rest(type: "SiteSettingsOutput", path: "/site/settings.json") {
        canSignUp
        authorizedExtensions
        minSearchLength
        taggingEnabled
        maxTagsPerTopic
        maxTagLength
        maxUsernameLength
        minUsernameLength
        minPasswordLength
        fullNameRequired
        defaultComposerCategory
        allowUncategorizedTopics
        allowUserStatus
        emojiSet
        externalEmojiUrl
        allowPoll
        pollCreateMinimumTrustLevel
        loginRequired
      }
    }
  }
`;

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
    }
  }
`;

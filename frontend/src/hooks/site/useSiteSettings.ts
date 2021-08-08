import { useQuery } from '@apollo/client';

import { DEFAULT_CHANNEL } from '../../constants';
import { Site } from '../../generated/server/Site';
import { SITE } from '../../graphql/server/site';

export function useSiteSettings() {
  let { data, loading, error, refetch } = useQuery<Site>(SITE, {
    notifyOnNetworkStatusChange: true,
  });

  const {
    canTagTopics,
    canCreateTag,
    canSignUp,
    authorizedExtensions,
    uncategorizedCategoryId = DEFAULT_CHANNEL.id,
    minSearchLength,
    taggingEnabled,
    maxTagLength,
    maxTagsPerTopic,
    maxUsernameLength,
    minUsernameLength,
    minPasswordLength,
    fullNameRequired,
    topicFlagTypes,
    postActionTypes,
  } = data?.site || {};

  return {
    canTagTopics,
    canCreateTag,
    canSignUp,
    authorizedExtensions,
    uncategorizedCategoryId,
    minSearchLength,
    taggingEnabled,
    maxTagLength,
    maxTagsPerTopic,
    maxUsernameLength,
    minUsernameLength,
    minPasswordLength,
    fullNameRequired,
    topicFlagTypes,
    postActionTypes,
    loading,
    error,
    refetch,
  };
}

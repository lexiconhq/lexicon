import { QueryHookOptions } from '@apollo/client';

import { SiteQuery, SiteDocument } from '../../generated/server';
import { useQuery } from '../../utils';

export function useSiteSettings(options?: QueryHookOptions<SiteQuery>) {
  let { data, loading, error, refetch } = useQuery<SiteQuery>(
    SiteDocument,
    {
      notifyOnNetworkStatusChange: true,
      nextFetchPolicy: 'cache-and-network',
      ...options,
    },
    'HIDE_ALERT',
  );

  const {
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
    defaultComposerCategory,
    allowUncategorizedTopics,
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
    allowUncategorizedTopics,
    defaultComposerCategory,
    loading,
    error,
    refetch,
  };
}

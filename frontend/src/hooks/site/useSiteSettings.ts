import { QueryHookOptions } from '@apollo/client';

import { DEFAULT_CHANNEL } from '../../constants';
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

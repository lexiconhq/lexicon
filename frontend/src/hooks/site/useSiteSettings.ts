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
    groups,
    allowUserStatus,
    allowPoll,
    pollCreateMinimumTrustLevel,
    enableLexiconPushNotifications,
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
    groups,
    allowUserStatus,
    allowPoll,
    pollCreateMinimumTrustLevel,
    enableLexiconPushNotifications,
    loading,
    error,
    refetch,
  };
}

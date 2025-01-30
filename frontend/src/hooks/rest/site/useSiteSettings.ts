import { LazyQueryHookOptions, QueryHookOptions } from '@apollo/client';

import {
  SiteDocument,
  SiteQuery,
  SiteQueryVariables,
} from '../../../generatedAPI/server';
import { useLazyQuery, useQuery } from '../../../utils';

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
    canCreateTag,
    canTagTopics,
    uncategorizedCategoryId,
    topicFlagTypes,
    postActionTypes,
    groups,
    enableLexiconPushNotifications,
    siteSettings,
  } = data?.site || {};

  const {
    canSignUp,
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
    allowPoll,
    pollCreateMinimumTrustLevel,
    loginRequired,
  } = siteSettings || {};

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
    loginRequired,
    loading,
    error,
    refetch,
  };
}

export function useGetSiteSettings(
  options?: LazyQueryHookOptions<SiteQuery, SiteQueryVariables>,
) {
  let [getSiteSettings, { data, loading, error, refetch }] = useLazyQuery<
    SiteQuery,
    SiteQueryVariables
  >(SiteDocument, { ...options }, 'HIDE_ALERT');

  return {
    getSiteSettings,
    data,
    loading,
    error,
    refetch,
  };
}

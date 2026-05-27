import { RestLink } from 'apollo-link-rest';

import { getNormalizedUrlTemplate } from '../discourse-apollo-rest/utils';

export const profileOutputPatcher: RestLink.FunctionalTypePatcher = (data) => {
  const user = data.user ?? {};

  data.user = {
    __typename: 'UserDetail',
    ...user,
    avatarTemplate: getNormalizedUrlTemplate({ instance: user }),
    email: user.email ?? '',
    ignored: user.ignored ?? false,
    ignoredUsernames: user.ignoredUsernames ?? [],
    canIgnoreUser: user.canIgnoreUser ?? user.canIgnoreUsers ?? false,
    mutedCategoryIds: user.mutedCategoryIds ?? [],
    mutedTags: user.mutedTags ?? [],
    mutedUsernames: user.mutedUsernames ?? [],
    trackedCategoryIds: user.trackedCategoryIds ?? [],
    trackedTags: user.trackedTags ?? [],
    watchedCategoryIds: user.watchedCategoryIds ?? [],
    watchedFirstPostCategoryIds: user.watchedFirstPostCategoryIds ?? [],
    watchingFirstPostTags: user.watchingFirstPostTags ?? [],
  };

  return data;
};

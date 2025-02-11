import { RestLink } from 'apollo-link-rest';

import { getNormalizedUrlTemplate } from '../discourse-apollo-rest/utils';

export const profileOutputPatcher: RestLink.FunctionalTypePatcher = (data) => {
  data.user = {
    __typename: 'UserDetail',
    ...data.user,
    avatarTemplate: getNormalizedUrlTemplate({ instance: data.user }),
  };

  return data;
};

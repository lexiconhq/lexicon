import { RestLink } from 'apollo-link-rest';

import { SearchUser } from '../../generatedAPI/server';
import { getNormalizedUrlTemplate } from '../discourse-apollo-rest/utils';

export const searchUserOutputPatcher: RestLink.FunctionalTypePatcher = (
  data,
) => {
  return {
    __typename: 'SearchUserOutput',
    ...data,
    users:
      data.users.length > 0
        ? data.users.map((user: SearchUser) => {
            return {
              ...user,
              avatarTemplate: getNormalizedUrlTemplate({ instance: user }),
            };
          })
        : [],
  };
};

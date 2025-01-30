import { RestLink } from 'apollo-link-rest';

import { userActivityMarkdownContent } from '../../helpers/api';
import { getNormalizedUrlTemplate } from '../discourse-apollo-rest/utils';

export const userActionsPatcher: RestLink.FunctionalTypePatcher = (data) => {
  let userActions = data;
  if (!userActions) {
    return data;
  }

  data = {
    ...userActions,
    __typename: 'UserActions',
    avatarTemplate: getNormalizedUrlTemplate({ instance: userActions }),
    markdownContent: userActivityMarkdownContent(userActions?.excerpt),
  };
  return data;
};

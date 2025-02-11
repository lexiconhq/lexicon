import { RestLink } from 'apollo-link-rest';

import { getNormalizedUrlTemplate } from '../discourse-apollo-rest/utils';

export const lookupUrlOutputPatcher: RestLink.FunctionalTypePatcher = (
  data,
) => {
  const url = getNormalizedUrlTemplate({ instance: data, variant: 'url' });

  return {
    ...data,
    url,
    __typename: 'LookupUrl',
  };
};

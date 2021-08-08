import { LazyQueryHookOptions } from '@apollo/client';

import {
  LookupUrls,
  LookupUrlsVariables,
} from '../../generated/server/LookupUrls';
import { LOOKUP_URLS } from '../../graphql/server/topics';
import { useLazyQuery } from '../../utils';

export function useLookupUrls(
  options?: LazyQueryHookOptions<LookupUrls, LookupUrlsVariables>,
) {
  const [getImageUrls] = useLazyQuery<LookupUrls, LookupUrlsVariables>(
    LOOKUP_URLS,
    { ...options },
  );

  return { getImageUrls };
}

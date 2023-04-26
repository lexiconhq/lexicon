import { LazyQueryHookOptions } from '@apollo/client';

import {
  LookupUrlsQuery,
  LookupUrlsQueryVariables,
  LookupUrlsDocument,
} from '../../generated/server';
import { useLazyQuery } from '../../utils';

export function useLookupUrls(
  options?: LazyQueryHookOptions<LookupUrlsQuery, LookupUrlsQueryVariables>,
) {
  const [getImageUrls] = useLazyQuery<
    LookupUrlsQuery,
    LookupUrlsQueryVariables
  >(LookupUrlsDocument, { ...options });

  return { getImageUrls };
}

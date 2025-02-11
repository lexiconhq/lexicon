import { LazyQueryHookOptions } from '@apollo/client';

import {
  LookupUrlsDocument,
  LookupUrlsQuery,
  LookupUrlsQueryVariables,
} from '../../../generatedAPI/server';
import { useLazyQuery } from '../../../utils';

export function useLookupUrls(
  options?: LazyQueryHookOptions<LookupUrlsQuery, LookupUrlsQueryVariables>,
) {
  const [getImageUrls, { loading }] = useLazyQuery<
    LookupUrlsQuery,
    LookupUrlsQueryVariables
  >(LookupUrlsDocument, { ...options });

  return { getImageUrls, loading };
}

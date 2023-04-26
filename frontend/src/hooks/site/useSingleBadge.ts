import { LazyQueryHookOptions } from '@apollo/client';

import {
  SingleBadgeQuery,
  SingleBadgeQueryVariables,
  SingleBadgeDocument,
} from '../../generated/server';
import { useLazyQuery } from '../../utils';

export function useSingleBadge(
  options?: LazyQueryHookOptions<SingleBadgeQuery, SingleBadgeQueryVariables>,
) {
  const [singleBadge] = useLazyQuery<
    SingleBadgeQuery,
    SingleBadgeQueryVariables
  >(SingleBadgeDocument, {
    ...options,
  });

  return { singleBadge };
}

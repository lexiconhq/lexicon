import { LazyQueryHookOptions } from '@apollo/client';

import {
  SingleBadge,
  SingleBadgeVariables,
} from '../../generated/server/SingleBadge';
import { SINGLE_BADGE } from '../../graphql/server/singleBadge';
import { useLazyQuery } from '../../utils';

export function useSingleBadge(
  options?: LazyQueryHookOptions<SingleBadge, SingleBadgeVariables>,
) {
  const [singleBadge] = useLazyQuery<SingleBadge, SingleBadgeVariables>(
    SINGLE_BADGE,
    {
      ...options,
    },
  );

  return { singleBadge };
}

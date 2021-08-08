import { MutationHookOptions } from '@apollo/client';

import {
  FlagPost as FlagPostType,
  FlagPostVariables,
} from '../../generated/server/FlagPost';
import { FLAG_POST } from '../../graphql/server/flagPost';
import { useMutation } from '../../utils';

export function useFlagPost(
  options?: MutationHookOptions<FlagPostType, FlagPostVariables>,
) {
  const [flag, { loading }] = useMutation<FlagPostType, FlagPostVariables>(
    FLAG_POST,
    {
      ...options,
    },
  );

  return { flag, loading };
}

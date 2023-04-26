import { MutationHookOptions } from '@apollo/client';

import {
  FlagPostMutation as FlagPostType,
  FlagPostMutationVariables,
  FlagPostDocument,
} from '../../generated/server';
import { useMutation } from '../../utils';

export function useFlagPost(
  options?: MutationHookOptions<FlagPostType, FlagPostMutationVariables>,
) {
  const [flag, { loading }] = useMutation<
    FlagPostType,
    FlagPostMutationVariables
  >(FlagPostDocument, {
    ...options,
  });

  return { flag, loading };
}

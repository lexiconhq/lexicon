import { MutationHookOptions } from '@apollo/client';

import {
  FlagPostDocument,
  FlagPostMutationVariables,
  FlagPostMutation as FlagPostType,
} from '../../../generatedAPI/server';
import { useMutation } from '../../../utils';

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

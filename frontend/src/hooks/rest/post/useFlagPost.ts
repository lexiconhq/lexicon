import { MutationHookOptions } from '@apollo/client';
import { useCallback } from 'react';

import { flagPostBodyBuilder } from '../../../api/bodyBuilder';
import {
  FlagPostDocument,
  FlagPostMutationVariables,
  FlagPostMutation as FlagPostType,
} from '../../../generatedAPI/server';
import { useMutation } from '../../../utils';

export function useFlagPost(
  options?: MutationHookOptions<FlagPostType, FlagPostMutationVariables>,
) {
  const [mutate, { loading }] = useMutation<
    FlagPostType,
    FlagPostMutationVariables
  >(FlagPostDocument, {
    ...options,
  });

  const flag = useCallback(
    (mutationOptions: Parameters<typeof mutate>[0]) =>
      mutate({
        ...mutationOptions,
        variables: {
          ...mutationOptions?.variables,
          flagPostBodyBuilder: flagPostBodyBuilder,
        },
      }),
    [mutate],
  );

  return { flag, loading };
}

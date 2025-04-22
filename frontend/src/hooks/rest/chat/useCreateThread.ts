import { MutationHookOptions } from '@apollo/client';

import {
  CreateThreadDocument,
  CreateThreadMutation as CreateThreadType,
  CreateThreadMutationVariables as CreateThreadVariables,
} from '../../../generatedAPI/server';
import { useMutation } from '../../../utils';

export function useCreateThread(
  options?: MutationHookOptions<CreateThreadType, CreateThreadVariables>,
) {
  const [createThread, { loading }] = useMutation<
    CreateThreadType,
    CreateThreadVariables
  >(CreateThreadDocument, { ...options });

  return { createThread, loading };
}

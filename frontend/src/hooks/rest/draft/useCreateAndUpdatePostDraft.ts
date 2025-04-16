import { MutationHookOptions } from '@apollo/client';

import {
  CreateAndUpdatePostDraftDocument,
  CreateAndUpdatePostDraftMutationVariables,
  CreateAndUpdatePostDraftMutation as CreateAndUpdatePostDraftType,
} from '../../../generatedAPI/server';
import { useMutation } from '../../../utils';

export function useCreateAndUpdatePostDraft(
  options?: MutationHookOptions<
    CreateAndUpdatePostDraftType,
    CreateAndUpdatePostDraftMutationVariables
  >,
) {
  const [createPostDraft, { loading, data }] = useMutation<
    CreateAndUpdatePostDraftType,
    CreateAndUpdatePostDraftMutationVariables
  >(CreateAndUpdatePostDraftDocument, {
    ...options,
  });

  return { createPostDraft, loading, data };
}

import { MutationHookOptions } from '@apollo/client';

import {
  EditPostMutation as EditPostType,
  EditPostMutationVariables,
  EditPostDocument,
} from '../../generated/server';
import { useMutation } from '../../utils';

export function useEditPost(
  options?: MutationHookOptions<EditPostType, EditPostMutationVariables>,
) {
  const [editPost, { loading }] = useMutation<
    EditPostType,
    EditPostMutationVariables
  >(EditPostDocument, { ...options });

  return { editPost, loading };
}

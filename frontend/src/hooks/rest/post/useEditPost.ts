import { MutationHookOptions } from '@apollo/client';

import {
  EditPostDocument,
  EditPostMutationVariables,
  EditPostMutation as EditPostType,
} from '../../../generatedAPI/server';
import { useMutation } from '../../../utils';

export function useEditPost(
  options?: MutationHookOptions<EditPostType, EditPostMutationVariables>,
) {
  const [editPost, { loading }] = useMutation<
    EditPostType,
    EditPostMutationVariables
  >(EditPostDocument, { ...options });

  return { editPost, loading };
}

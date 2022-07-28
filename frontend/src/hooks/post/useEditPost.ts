import { MutationHookOptions } from '@apollo/client';

import {
  EditPost as EditPostType,
  EditPostVariables,
} from '../../generated/server/GetTopicDetail';
import { EDIT_POST } from '../../graphql/server/getTopicDetail';
import { useMutation } from '../../utils';

export function useEditPost(
  options?: MutationHookOptions<EditPostType, EditPostVariables>,
) {
  const [editPost, { loading }] = useMutation<EditPostType, EditPostVariables>(
    EDIT_POST,
    { ...options },
  );

  return { editPost, loading };
}

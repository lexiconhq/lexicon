import { QueryHookOptions } from '@apollo/client';

import {
  PostQueryDocument,
  PostQueryVariables,
  PostQuery as PostType,
} from '../../../generatedAPI/server';
import { useLazyQuery } from '../../../utils';

export function usePost(
  options?: QueryHookOptions<PostType, PostQueryVariables>,
) {
  const [getPost, { loading }] = useLazyQuery<PostType, PostQueryVariables>(
    PostQueryDocument,
    { ...options },
  );

  return { getPost, loading };
}

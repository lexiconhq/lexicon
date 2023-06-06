import { MutationHookOptions } from '@apollo/client';

import {
  PostRawQuery as PostRawType,
  PostRawQueryVariables,
  PostRawDocument,
} from '../../generated/server';
import { useLazyQuery } from '../../utils';

export function usePostRaw(
  options?: MutationHookOptions<PostRawType, PostRawQueryVariables>,
) {
  const [postRaw, { loading }] = useLazyQuery<
    PostRawType,
    PostRawQueryVariables
  >(PostRawDocument, { ...options });

  return { postRaw, loading };
}

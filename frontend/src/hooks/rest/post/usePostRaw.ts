import { LazyQueryHookOptions } from '@apollo/client';

import {
  PostRawDocument,
  PostRawQueryVariables,
  PostRawQuery as PostRawType,
} from '../../../generatedAPI/server';
import { useLazyQuery } from '../../../utils';

export function usePostRaw(
  options?: LazyQueryHookOptions<PostRawType, PostRawQueryVariables>,
) {
  const [postRaw, { loading }] = useLazyQuery<
    PostRawType,
    PostRawQueryVariables
  >(PostRawDocument, { ...options });

  return { postRaw, loading };
}

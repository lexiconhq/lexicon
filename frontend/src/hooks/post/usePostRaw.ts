import { MutationHookOptions } from '@apollo/client';

import {
  PostRaw as PostRawType,
  PostRawVariables,
} from '../../generated/server/PostRaw';
import { POST_RAW } from '../../graphql/server/postRaw';
import { useLazyQuery } from '../../utils';

export function usePostRaw(
  options?: MutationHookOptions<PostRawType, PostRawVariables>,
) {
  const [postRaw, { loading }] = useLazyQuery<PostRawType, PostRawVariables>(
    POST_RAW,
    { ...options },
  );

  return { postRaw, loading };
}

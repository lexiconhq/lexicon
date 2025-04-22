import { LazyQueryHookOptions, useLazyQuery } from '@apollo/client';

import {
  GetThreadDetailDocument,
  GetThreadDetailQuery as GetThreadDetailType,
  GetThreadDetailQueryVariables as GetThreadDetailVariable,
} from '../../../generatedAPI/server';

export function useLazyGetThreadDetail(
  options?: LazyQueryHookOptions<GetThreadDetailType, GetThreadDetailVariable>,
) {
  const [getThreadDetail, { ...other }] = useLazyQuery<
    GetThreadDetailType,
    GetThreadDetailVariable
  >(GetThreadDetailDocument, {
    context: { queryDeduplication: true },
    ...options,
  });

  return {
    getThreadDetail,
    ...other,
  };
}

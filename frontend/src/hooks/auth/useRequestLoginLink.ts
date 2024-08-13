import { MutationHookOptions } from '@apollo/client';

import {
  RequestLoginLinkMutation as RequestLoginLinkType,
  RequestLoginLinkMutationVariables,
} from '../../generated/server';
import { REQUEST_LOGIN_LINK } from '../../graphql/server/auth';
import { useMutation } from '../../utils';

export function useRequestLoginLink(
  options?: MutationHookOptions<
    RequestLoginLinkType,
    RequestLoginLinkMutationVariables
  >,
) {
  const [requestLoginLink, { loading, error }] = useMutation<
    RequestLoginLinkType,
    RequestLoginLinkMutationVariables
  >(REQUEST_LOGIN_LINK, {
    ...options,
  });

  return { requestLoginLink, loading, error };
}

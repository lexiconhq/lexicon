import { MutationHookOptions } from '@apollo/client';

import { useMutation } from '../../utils';
import {
  EditUserStatusDocument,
  EditUserStatusMutation,
  EditUserStatusMutationVariables,
} from '../../generated/server';

export function useEditUserStatus(
  options?: MutationHookOptions<
    EditUserStatusMutation,
    EditUserStatusMutationVariables
  >,
) {
  const [editUserStatus, { loading }] = useMutation<
    EditUserStatusMutation,
    EditUserStatusMutationVariables
  >(EditUserStatusDocument, {
    ...options,
  });

  return { editUserStatus, loading };
}

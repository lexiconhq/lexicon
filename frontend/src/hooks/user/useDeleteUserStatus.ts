import { MutationHookOptions } from '@apollo/client';

import { useMutation } from '../../utils';
import {
  DeleteUserStatusDocument,
  DeleteUserStatusMutation,
  DeleteUserStatusMutationVariables,
} from '../../generated/server';

export function useDeleteUserStatus(
  options?: MutationHookOptions<
    DeleteUserStatusMutation,
    DeleteUserStatusMutationVariables
  >,
) {
  const [deleteUserStatus, { loading }] = useMutation<
    DeleteUserStatusMutation,
    DeleteUserStatusMutationVariables
  >(DeleteUserStatusDocument, {
    ...options,
  });

  return { deleteUserStatus, loading };
}

import { MutationHookOptions } from '@apollo/client';

import {
  DeleteUserStatusDocument,
  DeleteUserStatusMutation,
  DeleteUserStatusMutationVariables,
} from '../../../generatedAPI/server';
import { useMutation } from '../../../utils';

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

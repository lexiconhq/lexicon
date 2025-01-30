import { MutationHookOptions } from '@apollo/client';

import {
  EditUserStatusDocument,
  EditUserStatusMutation,
  EditUserStatusMutationVariables,
} from '../../../generatedAPI/server';
import { useMutation } from '../../../utils';

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

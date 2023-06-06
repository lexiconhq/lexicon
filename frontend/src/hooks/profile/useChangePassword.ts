import { MutationHookOptions } from '@apollo/client';

import {
  ChangeNewPasswordMutation as ChangeNewPasswordType,
  ChangeNewPasswordMutationVariables,
  ChangeNewPasswordDocument,
} from '../../generated/server';
import { useMutation } from '../../utils';

export function useChangePassword(
  options?: MutationHookOptions<
    ChangeNewPasswordType,
    ChangeNewPasswordMutationVariables
  >,
) {
  const [changeNewPassword, { loading, error }] = useMutation<
    ChangeNewPasswordType,
    ChangeNewPasswordMutationVariables
  >(ChangeNewPasswordDocument, {
    ...options,
  });

  return { changeNewPassword, loading, error };
}

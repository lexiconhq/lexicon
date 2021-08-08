import { MutationHookOptions } from '@apollo/client';

import {
  ChangeNewPassword as ChangeNewPasswordType,
  ChangeNewPasswordVariables,
} from '../../generated/server/ChangeNewPassword';
import { CHANGE_PASSWORD } from '../../graphql/server/changePassword';
import { useMutation } from '../../utils';

export function useChangePassword(
  options?: MutationHookOptions<
    ChangeNewPasswordType,
    ChangeNewPasswordVariables
  >,
) {
  const [changeNewPassword, { loading, error }] = useMutation<
    ChangeNewPasswordType,
    ChangeNewPasswordVariables
  >(CHANGE_PASSWORD, {
    ...options,
  });

  return { changeNewPassword, loading, error };
}

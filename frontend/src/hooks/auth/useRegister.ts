import { MutationHookOptions } from '@apollo/client';

import {
  Register as RegisterType,
  RegisterVariables,
} from '../../generated/server/Register';
import { REGISTER } from '../../graphql/server/auth';
import { useMutation } from '../../utils';

export function useRegister(
  options?: MutationHookOptions<RegisterType, RegisterVariables>,
) {
  const [register, { loading }] = useMutation<RegisterType, RegisterVariables>(
    REGISTER,
    { ...options },
  );

  return { register, loading };
}

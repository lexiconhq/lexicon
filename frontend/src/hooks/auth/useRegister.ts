import { MutationHookOptions } from '@apollo/client';

import {
  RegisterMutation as RegisterType,
  RegisterMutationVariables,
  RegisterDocument,
} from '../../generated/server';
import { useMutation } from '../../utils';

export function useRegister(
  options?: MutationHookOptions<RegisterType, RegisterMutationVariables>,
) {
  const [register, { loading }] = useMutation<
    RegisterType,
    RegisterMutationVariables
  >(RegisterDocument, { ...options });

  return { register, loading };
}

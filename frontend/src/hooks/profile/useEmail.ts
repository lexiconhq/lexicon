import { MutationHookOptions } from '@apollo/client';

import {
  AddEmailAddress as AddEmailAddressType,
  AddEmailAddressVariables,
} from '../../generated/server/AddEmailAddress';
import {
  DeleteEmail as DeleteEmailType,
  DeleteEmailVariables,
} from '../../generated/server/DeleteEmail';
import {
  SetPrimaryEmail as SetPrimaryEmailType,
  SetPrimaryEmailVariables,
} from '../../generated/server/SetPrimaryEmail';
import { ADD_EMAIL_ADDRESS } from '../../graphql/server/addEmailAddress';
import { DELETE_EMAIL } from '../../graphql/server/deleteEmail';
import { SET_PRIMARY_EMAIL } from '../../graphql/server/setPrimaryEmail';
import { useMutation } from '../../utils';

export function useAddEmail(
  options?: MutationHookOptions<AddEmailAddressType, AddEmailAddressVariables>,
) {
  const [addEmailAddress, { loading, error }] = useMutation<
    AddEmailAddressType,
    AddEmailAddressVariables
  >(ADD_EMAIL_ADDRESS, {
    ...options,
  });

  return { addEmailAddress, loading, error };
}

export function useDeleteEmail(
  options?: MutationHookOptions<DeleteEmailType, DeleteEmailVariables>,
) {
  const [deleteEmail, { loading }] = useMutation<
    DeleteEmailType,
    DeleteEmailVariables
  >(DELETE_EMAIL, {
    ...options,
  });

  return { deleteEmail, loading };
}

export function useSetPrimaryEmail(
  options?: MutationHookOptions<SetPrimaryEmailType, SetPrimaryEmailVariables>,
) {
  const [setPrimaryEmail, { loading }] = useMutation<
    SetPrimaryEmailType,
    SetPrimaryEmailVariables
  >(SET_PRIMARY_EMAIL, {
    ...options,
  });

  return { setPrimaryEmail, loading };
}

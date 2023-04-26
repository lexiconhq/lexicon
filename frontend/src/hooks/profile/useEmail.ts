import { MutationHookOptions } from '@apollo/client';

import {
  AddEmailAddressMutation as AddEmailAddressType,
  AddEmailAddressMutationVariables,
  AddEmailAddressDocument,
  DeleteEmailMutation as DeleteEmailType,
  DeleteEmailMutationVariables,
  DeleteEmailDocument,
  SetPrimaryEmailMutation as SetPrimaryEmailType,
  SetPrimaryEmailMutationVariables,
  SetPrimaryEmailDocument,
} from '../../generated/server';
import { useMutation } from '../../utils';

export function useAddEmail(
  options?: MutationHookOptions<
    AddEmailAddressType,
    AddEmailAddressMutationVariables
  >,
) {
  const [addEmailAddress, { loading, error }] = useMutation<
    AddEmailAddressType,
    AddEmailAddressMutationVariables
  >(AddEmailAddressDocument, {
    ...options,
  });

  return { addEmailAddress, loading, error };
}

export function useDeleteEmail(
  options?: MutationHookOptions<DeleteEmailType, DeleteEmailMutationVariables>,
) {
  const [deleteEmail, { loading }] = useMutation<
    DeleteEmailType,
    DeleteEmailMutationVariables
  >(DeleteEmailDocument, {
    ...options,
  });

  return { deleteEmail, loading };
}

export function useSetPrimaryEmail(
  options?: MutationHookOptions<
    SetPrimaryEmailType,
    SetPrimaryEmailMutationVariables
  >,
) {
  const [setPrimaryEmail, { loading }] = useMutation<
    SetPrimaryEmailType,
    SetPrimaryEmailMutationVariables
  >(SetPrimaryEmailDocument, {
    ...options,
  });

  return { setPrimaryEmail, loading };
}

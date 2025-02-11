import { MutationHookOptions } from '@apollo/client';

import { deleteEmailPathBuilder } from '../../../api/pathBuilder';
import {
  AddEmailAddressDocument,
  AddEmailAddressMutationVariables,
  AddEmailAddressMutation as AddEmailAddressType,
  DeleteEmailDocument,
  DeleteEmailMutationVariables,
  DeleteEmailMutation as DeleteEmailType,
  SetPrimaryEmailDocument,
  SetPrimaryEmailMutationVariables,
  SetPrimaryEmailMutation as SetPrimaryEmailType,
} from '../../../generatedAPI/server';
import { useMutation } from '../../../utils';

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

export function useDeleteEmail(
  options?: MutationHookOptions<DeleteEmailType, DeleteEmailMutationVariables>,
) {
  const [deleteEmailMutateFunc, { loading }] = useMutation<
    DeleteEmailType,
    DeleteEmailMutationVariables
  >(DeleteEmailDocument, {
    ...options,
  });

  /**
   * This function wraps deleteEmailMutateFunc to automatically add the deleteEmailPath
   * variable each time deleteEmail is called, so users don't need to specify
   * deleteEmailPath manually when calling the deleteEmail function.
   */
  const deleteEmail = (args: { variables: DeleteEmailMutationVariables }) => {
    return deleteEmailMutateFunc({
      ...args,
      variables: {
        ...args.variables,
        deleteEmailPath: deleteEmailPathBuilder,
      },
    });
  };

  return { deleteEmail, loading };
}

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

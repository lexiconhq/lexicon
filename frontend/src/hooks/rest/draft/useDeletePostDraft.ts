import { MutationHookOptions } from '@apollo/client';

import { deletePostDraftPathBuilder } from '../../../api/pathBuilder';
import {
  DeletePostDraftDocument,
  DeletePostDraftMutationVariables,
  DeletePostDraftMutation as DeletePostDraftType,
} from '../../../generatedAPI/server';
import { DeletePostDraftMutateFnInput } from '../../../types';
import { useMutation } from '../../../utils';

export function useDeletePostDraft(
  options?: MutationHookOptions<
    DeletePostDraftType,
    DeletePostDraftMutationVariables
  >,
) {
  let variables = options && options.variables;

  if (variables) {
    variables = {
      ...variables,
      deletePostDraftPath: deletePostDraftPathBuilder,
    };
  }

  const [deletePostDraftMutation, { loading }] = useMutation<
    DeletePostDraftType,
    DeletePostDraftMutationVariables
  >(DeletePostDraftDocument, {
    ...options,
    variables,
  });

  const deletePostDraft = (args: DeletePostDraftMutateFnInput) => {
    return deletePostDraftMutation({
      ...args,
      variables: {
        ...args.variables,
        deletePostDraftPath: deletePostDraftPathBuilder,
      },
    });
  };

  return { deletePostDraft, loading };
}

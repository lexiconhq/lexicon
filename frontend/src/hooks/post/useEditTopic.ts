import { MutationHookOptions } from '@apollo/client';

import {
  EditTopicMutation as EditTopicType,
  EditTopicMutationVariables,
  EditTopicDocument,
} from '../../generated/server';
import { useMutation } from '../../utils';

export function useEditTopic(
  options?: MutationHookOptions<EditTopicType, EditTopicMutationVariables>,
) {
  const [editTopic, { loading }] = useMutation<
    EditTopicType,
    EditTopicMutationVariables
  >(EditTopicDocument, {
    ...options,
  });

  return { editTopic, loading };
}

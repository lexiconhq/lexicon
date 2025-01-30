import { MutationHookOptions } from '@apollo/client';

import {
  EditTopicDocument,
  EditTopicMutationVariables,
  EditTopicMutation as EditTopicType,
} from '../../../generatedAPI/server';
import { useMutation } from '../../../utils';

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

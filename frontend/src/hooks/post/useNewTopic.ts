import { MutationHookOptions } from '@apollo/client';

import {
  NewTopicMutation as NewTopicType,
  NewTopicMutationVariables,
  NewTopicDocument,
} from '../../generated/server';
import { useMutation } from '../../utils';

export function useNewTopic(
  options?: MutationHookOptions<NewTopicType, NewTopicMutationVariables>,
) {
  const [newTopic, { loading }] = useMutation<
    NewTopicType,
    NewTopicMutationVariables
  >(NewTopicDocument, { ...options });

  return { newTopic, loading };
}

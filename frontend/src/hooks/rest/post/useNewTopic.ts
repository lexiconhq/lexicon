import { MutationHookOptions } from '@apollo/client';

import {
  NewTopicDocument,
  NewTopicMutationVariables,
  NewTopicMutation as NewTopicType,
} from '../../../generatedAPI/server';
import { useMutation } from '../../../utils';

export function useNewTopic(
  options?: MutationHookOptions<NewTopicType, NewTopicMutationVariables>,
) {
  const [newTopicMutateFunc, { loading }] = useMutation<
    NewTopicType,
    NewTopicMutationVariables
  >(NewTopicDocument, { ...options });

  /**
   * Wrapper function for the newTopic mutation, ensuring that each call includes a default
   * value for 'archetype'. For topics, 'archetype' is always set to 'regular'.
   */

  const newTopic = (args: { variables: NewTopicMutationVariables }) => {
    return newTopicMutateFunc({
      ...args,
      variables: {
        newTopicInput: {
          ...args.variables.newTopicInput,
          archetype: 'regular',
        },
      },
    });
  };

  return { newTopic, loading };
}

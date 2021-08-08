import { MutationHookOptions } from '@apollo/client';

import {
  NewTopic as NewTopicType,
  NewTopicVariables,
} from '../../generated/server/NewTopic';
import { NEW_TOPIC } from '../../graphql/server/newTopic';
import { useMutation } from '../../utils';

export function useNewTopic(
  options?: MutationHookOptions<NewTopicType, NewTopicVariables>,
) {
  const [newTopic, { loading }] = useMutation<NewTopicType, NewTopicVariables>(
    NEW_TOPIC,
    { ...options },
  );

  return { newTopic, loading };
}

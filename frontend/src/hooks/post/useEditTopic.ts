import { MutationHookOptions } from '@apollo/client';

import {
  EditTopic as EditTopicType,
  EditTopicVariables,
} from '../../generated/server/GetTopicDetail';
import { EDIT_TOPIC } from '../../graphql/server/getTopicDetail';
import { useMutation } from '../../utils';

export function useEditTopic(
  options?: MutationHookOptions<EditTopicType, EditTopicVariables>,
) {
  const [editTopic, { loading }] = useMutation<
    EditTopicType,
    EditTopicVariables
  >(EDIT_TOPIC, {
    ...options,
  });

  return { editTopic, loading };
}

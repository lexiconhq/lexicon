import { MutationHookOptions } from '@apollo/client';

import {
  NewPrivateMessageMutation as NewMessageType,
  NewPrivateMessageMutationVariables as NewMessageVariables,
  NewPrivateMessageDocument,
} from '../../generated/server';
import { useMutation } from '../../utils';

export function useNewMessage(
  options?: MutationHookOptions<NewMessageType, NewMessageVariables>,
) {
  const [newMessage, { loading }] = useMutation<
    NewMessageType,
    NewMessageVariables
  >(NewPrivateMessageDocument, { ...options });

  return { newMessage, loading };
}

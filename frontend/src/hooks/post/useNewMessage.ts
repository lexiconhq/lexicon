import { MutationHookOptions } from '@apollo/client';

import {
  NewPrivateMessage as NewMessageType,
  NewPrivateMessageVariables as NewMessageVariables,
} from '../../generated/server/Message';
import { NEW_PRIVATE_MESSAGE } from '../../graphql/server/message';
import { useMutation } from '../../utils';

export function useNewMessage(
  options?: MutationHookOptions<NewMessageType, NewMessageVariables>,
) {
  const [newMessage, { loading }] = useMutation<
    NewMessageType,
    NewMessageVariables
  >(NEW_PRIVATE_MESSAGE, { ...options });

  return { newMessage, loading };
}

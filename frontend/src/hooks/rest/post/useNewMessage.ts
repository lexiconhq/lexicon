import { MutationHookOptions } from '@apollo/client';

import { newPrivateMessageBodyBuilder } from '../../../api/bodyBuilder';
import {
  NewPrivateMessageMutation as NewMessageType,
  NewPrivateMessageMutationVariables as NewMessageVariables,
  NewPrivateMessageDocument,
} from '../../../generatedAPI/server';
import { useMutation } from '../../../utils';

export function useNewMessage(
  options?: MutationHookOptions<NewMessageType, NewMessageVariables>,
) {
  const [newMessageMutateFunc, { loading }] = useMutation<
    NewMessageType,
    NewMessageVariables
  >(NewPrivateMessageDocument, { ...options });

  const newMessage = (args: { variables: NewMessageVariables }) => {
    return newMessageMutateFunc({
      ...args,
      variables: {
        ...args.variables,
        newPrivateMessageBodyBuilder: newPrivateMessageBodyBuilder,
      },
    });
  };

  return { newMessage, loading };
}

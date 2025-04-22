import { MutationHookOptions } from '@apollo/client';

import {
  MarkReadChatDocument,
  MarkReadChatMutation as MarkReadChatType,
  MarkReadChatMutationVariables as MarkReadChatVariables,
} from '../../../generatedAPI/server';
import { useMutation } from '../../../utils';

export function useMarkReadChat(
  options?: MutationHookOptions<MarkReadChatType, MarkReadChatVariables>,
) {
  const [markReadChat, { loading }] = useMutation<
    MarkReadChatType,
    MarkReadChatVariables
  >(MarkReadChatDocument, { ...options });

  return { markReadChat, loading };
}

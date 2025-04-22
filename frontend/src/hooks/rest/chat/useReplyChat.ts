import { MutationHookOptions } from '@apollo/client';

import {
  ReplyChatDocument,
  ReplyChatMutation as ReplyChatType,
  ReplyChatMutationVariables as ReplyChatVariables,
} from '../../../generatedAPI/server';
import { useMutation } from '../../../utils';

export function useReplyChat(
  options?: MutationHookOptions<ReplyChatType, ReplyChatVariables>,
) {
  const [replyChat, { loading }] = useMutation<
    ReplyChatType,
    ReplyChatVariables
  >(ReplyChatDocument, { ...options });

  return { replyChat, loading };
}

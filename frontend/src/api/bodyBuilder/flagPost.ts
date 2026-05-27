import { RestLink } from 'apollo-link-rest';

type FlagPostBodyArgs = {
  flagPostInput: {
    id: number;
    postActionTypeId: number;
    message?: string;
    flagTopic?: boolean;
  };
};

export function flagPostBodyBuilder({
  args,
}: RestLink.RestLinkHelperProps<FlagPostBodyArgs>) {
  const { id, postActionTypeId, message, flagTopic } = args.flagPostInput;

  const body: Record<string, unknown> = {
    id,
    post_action_type_id: postActionTypeId,
    flag_topic: flagTopic === true,
  };

  if (message?.trim()) {
    body.message = message.trim();
  }

  return body;
}

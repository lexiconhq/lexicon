import { RestLink } from 'apollo-link-rest';

import { extractPollOptionIds } from '../../helpers/api';

export function votePollBodyBuilder({ args }: RestLink.RestLinkHelperProps) {
  const { pollName, postId, options } = args;

  let strippedOptions = extractPollOptionIds(options);

  return {
    post_id: postId,
    poll_name: pollName,
    options: strippedOptions,
  };
}

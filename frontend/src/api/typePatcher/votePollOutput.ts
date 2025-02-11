import { RestLink } from 'apollo-link-rest';

import { formatPollOptionId } from '../../helpers/api';

import { generatePollPatcher } from './helper';

export const PollVoteOutputPatcher: RestLink.FunctionalTypePatcher = (
  data,
  _,
  __,
  ctx,
) => {
  const { postId, pollName } = ctx.resolverParams.args;
  const votePollData = data.poll;

  let formattedPoll = generatePollPatcher({
    pollName,
    postId,
    poll: votePollData,
  });

  data.poll = formattedPoll;
  data.vote = data.vote.map((id: string) =>
    formatPollOptionId(postId, pollName, id),
  );

  return {
    __typename: 'PollVoteOutput',
    ...data,
  };
};

import { RestLink } from 'apollo-link-rest';

import { generatePollPatcher } from './helper';

export const pollActionPatcher: RestLink.FunctionalTypePatcher = (
  data,
  _,
  __,
  ctx,
) => {
  const isTogglePollStatus =
    ctx.resolverParams.fieldName === 'togglePollStatus';
  const { postId, pollName } = isTogglePollStatus
    ? ctx.resolverParams.args.input
    : ctx.resolverParams.args;
  const pollData = data.poll;

  let formattedPoll = generatePollPatcher({
    pollName,
    postId,
    poll: pollData,
  });

  data.poll = formattedPoll;

  return {
    __typename: isTogglePollStatus
      ? 'TogglePollStatusOutput'
      : 'UndoPollVoteOutput',
    ...data,
  };
};

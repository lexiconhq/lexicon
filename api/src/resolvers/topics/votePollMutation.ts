import camelcaseKey from 'camelcase-keys';
import snakecaseKey from 'snakecase-keys';
import { FieldResolver, mutationField, intArg, list, stringArg } from 'nexus';

import { errorHandler, formatPreloadedVoters } from '../../helpers';
import { Context } from '../../types';
import { CONTENT_JSON } from '../../constants';

export let votePollResolver: FieldResolver<'Mutation', 'votePoll'> = async (
  _,
  { postId, pollName, options },
  context: Context,
) => {
  const config = {
    headers: {
      'Content-Type': CONTENT_JSON,
    },
  };
  let votePollInputSnake = snakecaseKey({ postId, pollName, options });
  try {
    let { data } = await context.client.put(
      `/polls/vote.json`,
      votePollInputSnake,
      config,
    );

    let votePollData = camelcaseKey(data, { deep: true });
    let formattedPoll = {
      ...votePollData.poll,
      ...formatPreloadedVoters(votePollData.poll.preloadedVoters),
    };
    votePollData.poll = formattedPoll;

    return votePollData;
  } catch (e) {
    throw errorHandler(e);
  }
};

export let votePollMutation = mutationField('votePoll', {
  type: 'PollVoteOutput',
  args: {
    postId: intArg(),
    pollName: stringArg(),
    options: list(stringArg()),
  },
  resolve: votePollResolver,
});

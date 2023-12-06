import camelcaseKey from 'camelcase-keys';
import snakecaseKey from 'snakecase-keys';
import { FieldResolver, mutationField, intArg, stringArg } from 'nexus';

import { errorHandler, formatPreloadedVoters } from '../../helpers';
import { Context } from '../../types';
import { CONTENT_JSON } from '../../constants';

export let undoVotePollResolver: FieldResolver<
  'Mutation',
  'undoVotePoll'
> = async (_, { postId, pollName }, context: Context) => {
  let undoVoteInputSnake = snakecaseKey({ postId, pollName });
  const config = {
    headers: {
      'Content-Type': CONTENT_JSON,
    },
    data: undoVoteInputSnake,
  };

  try {
    let { data } = await context.client.delete(`/polls/vote.json`, {
      ...config,
    });

    let undoVotePollData = camelcaseKey(data.poll, { deep: true });
    let formattedPoll = {
      ...undoVotePollData,
      ...formatPreloadedVoters(undoVotePollData.preloadedVoters),
    };

    return formattedPoll;
  } catch (e) {
    throw errorHandler(e);
  }
};

export let undoVotePollMutation = mutationField('undoVotePoll', {
  type: 'Poll',
  args: {
    postId: intArg(),
    pollName: stringArg(),
  },
  resolve: undoVotePollResolver,
});

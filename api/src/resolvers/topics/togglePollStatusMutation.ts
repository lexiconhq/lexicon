import camelcaseKey from 'camelcase-keys';
import snakecaseKey from 'snakecase-keys';
import { FieldResolver, mutationField, intArg, stringArg, arg } from 'nexus';

import { errorHandler, formatPreloadedVoters } from '../../helpers';
import { Context } from '../../types';
import { CONTENT_JSON } from '../../constants';

export let togglePollStatusResolver: FieldResolver<
  'Mutation',
  'togglePollStatus'
> = async (_, { postId, pollName, status }, context: Context) => {
  const config = {
    headers: {
      'Content-Type': CONTENT_JSON,
    },
  };
  let toggleStatusInputSnake = snakecaseKey({ postId, pollName, status });
  try {
    let { data } = await context.client.put(
      '/polls/toggle_status.json',
      toggleStatusInputSnake,
      config,
    );

    let togglePollData = camelcaseKey(data, { deep: true });
    let formattedPoll = {
      ...togglePollData.poll,
      ...formatPreloadedVoters(togglePollData.poll.preloadedVoters),
    };
    togglePollData.poll = formattedPoll;

    return togglePollData.poll;
  } catch (e) {
    throw errorHandler(e);
  }
};

export let togglePollStatusMutation = mutationField('togglePollStatus', {
  type: 'Poll',
  args: {
    postId: intArg(),
    pollName: stringArg(),
    status: arg({ type: 'PollStatus' }),
  },
  resolve: togglePollStatusResolver,
});

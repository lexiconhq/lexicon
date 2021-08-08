import snakecaseKey from 'snakecase-keys';
import { FieldResolver, mutationField, intArg } from '@nexus/schema';

import { errorHandler, getTopicTimings } from '../../helpers';
import { Context } from '../../types';

export let timingsResolver: FieldResolver<'Mutation', 'timings'> = async (
  _,
  { postNumbers, topicId },
  context: Context,
) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  let timingsInputSnake = snakecaseKey(getTopicTimings(postNumbers, topicId));
  try {
    await context.client.post(
      '/topics/timings.json',
      JSON.stringify(timingsInputSnake),
      config,
    );
    return 'success';
  } catch (e) {
    throw errorHandler(e);
  }
};

export let timingsMutation = mutationField('timings', {
  type: 'String',
  args: {
    postNumbers: intArg({ list: true, required: true }),
    topicId: intArg({ required: true }),
  },
  resolve: timingsResolver,
});

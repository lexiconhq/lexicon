import snakecaseKey from 'snakecase-keys';
import { FieldResolver, mutationField, intArg, list } from 'nexus';

import { errorHandler, getTopicTimings } from '../../helpers';
import { Context } from '../../types';
import { CONTENT_JSON } from '../../constants';

export let timingsResolver: FieldResolver<'Mutation', 'timings'> = async (
  _,
  { postNumbers, topicId },
  context: Context,
) => {
  const config = {
    headers: {
      'Content-Type': CONTENT_JSON,
    },
  };
  let timingsInputSnake = snakecaseKey(getTopicTimings(postNumbers, topicId));
  try {
    await context.client.post(
      '/topics/timings.json',
      timingsInputSnake,
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
    postNumbers: list(intArg()),
    topicId: intArg(),
  },
  resolve: timingsResolver,
});

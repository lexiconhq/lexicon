import camelcaseKey from 'camelcase-keys';
import snakecaseKey from 'snakecase-keys';
import { FieldResolver, mutationField, arg } from 'nexus';

import { ACCEPTED_LANGUAGE, CONTENT_JSON } from '../../constants';
import { errorHandler } from '../../helpers';
import { Context } from '../../types';

export let newTopicResolver: FieldResolver<'Mutation', 'newTopic'> = async (
  _,
  { newTopicInput },
  context: Context,
) => {
  let topicInputSnake = snakecaseKey({
    ...newTopicInput,
    archetype: 'regular',
  });
  const config = {
    headers: {
      'Accept-Language': ACCEPTED_LANGUAGE,
      'Content-Type': CONTENT_JSON,
    },
  };
  try {
    let { data } = await context.client.post(
      '/posts.json',
      topicInputSnake,
      config,
    );
    return camelcaseKey(data, { deep: true });
  } catch (e) {
    errorHandler(e);
  }
};

export let newTopicMutation = mutationField('newTopic', {
  type: 'Post',
  args: {
    newTopicInput: arg({ type: 'NewTopicInput' }),
  },
  resolve: newTopicResolver,
});

import camelcaseKey from 'camelcase-keys';
import snakecaseKey from 'snakecase-keys';
import { FieldResolver, mutationField, arg, intArg } from '@nexus/schema';

import { errorHandler } from '../../helpers';
import { Context } from '../../types';
import { ACCEPTED_LANGUAGE, CONTENT_JSON } from '../../constants';

export let editTopicMutation: FieldResolver<'Mutation', 'editTopic'> = async (
  _,
  { topicInput, topicId },
  context: Context,
) => {
  let topic = snakecaseKey(topicInput);
  const config = {
    headers: {
      'Accept-Language': ACCEPTED_LANGUAGE,
      'Content-Type': CONTENT_JSON,
    },
  };
  try {
    let { data } = await context.client.put(
      `/t/-/${topicId}.json`,
      JSON.stringify(topic),
      config,
    );
    return camelcaseKey(data.basic_topic, { deep: true });
  } catch (e) {
    errorHandler(e);
  }
};

export let editTopic = mutationField('editTopic', {
  type: 'BasicTopic',
  args: {
    topicInput: arg({ type: 'EditTopicInput', required: true }),
    topicId: intArg({ required: true }),
  },
  resolve: editTopicMutation,
});

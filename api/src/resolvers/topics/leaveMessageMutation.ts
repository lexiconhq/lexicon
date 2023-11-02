import { FieldResolver, mutationField, intArg, stringArg } from 'nexus';

import { ACCEPTED_LANGUAGE, CONTENT_JSON } from '../../constants';
import { errorHandler } from '../../helpers';
import { Context } from '../../types';

export let leaveMessageResolver: FieldResolver<
  'Mutation',
  'leaveMessage'
> = async (_, { topicId, username }, context: Context) => {
  const config = {
    headers: {
      'Accept-Language': ACCEPTED_LANGUAGE,
      'Content-Type': CONTENT_JSON,
    },
  };

  try {
    await context.client.put(
      `/t/${topicId}/remove-allowed-user.json`,
      { username },
      config,
    );
    return 'success';
  } catch (e) {
    throw errorHandler(e);
  }
};

export let leaveMessageMutation = mutationField('leaveMessage', {
  type: 'String',
  args: {
    topicId: intArg(),
    username: stringArg(),
  },
  resolve: leaveMessageResolver,
});

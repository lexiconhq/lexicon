import {
  FieldResolver,
  mutationField,
  booleanArg,
  intArg,
  stringArg,
} from '@nexus/schema';

import { ACCEPTED_LANGUAGE, CONTENT_JSON } from '../../constants';
import { errorHandler } from '../../helpers';
import { Context } from '../../types';

export let leaveMessageResolver: FieldResolver<
  'Mutation',
  'leaveMessage'
> = async (_, { topicId, owner, username }, context: Context) => {
  const config = {
    headers: {
      'Accept-Language': ACCEPTED_LANGUAGE,
      'Content-Type': CONTENT_JSON,
    },
  };

  try {
    if (owner) {
      await context.client.delete(`/t/${topicId}.json`);
      return 'success';
    } else {
      await context.client.put(
        `/t/${topicId}/remove-allowed-user.json`,
        JSON.stringify({ username }),
        config,
      );
      return 'success';
    }
  } catch (e) {
    throw errorHandler(e);
  }
};

export let leaveMessageMutation = mutationField('leaveMessage', {
  type: 'String',
  args: {
    topicId: intArg({ required: true }),
    owner: booleanArg(),
    username: stringArg({ required: true }),
  },
  resolve: leaveMessageResolver,
});

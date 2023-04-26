import { FieldResolver, mutationField, intArg, nullable } from 'nexus';

import { ACCEPTED_LANGUAGE, CONTENT_JSON } from '../../constants';
import { errorHandler } from '../../helpers';
import { Context } from '../../types';

export let markReadMutation: FieldResolver<'Mutation', 'markRead'> = async (
  _,
  { notificationId },
  context: Context,
) => {
  const config = {
    headers: {
      'Accept-Language': ACCEPTED_LANGUAGE,
      'Content-Type': CONTENT_JSON,
    },
  };
  try {
    await context.client.put(
      `/notifications/mark-read.json`,
      { id: notificationId },
      config,
    );
  } catch (e) {
    errorHandler(e);
  }
  return 'success';
};

export let markRead = mutationField('markRead', {
  type: 'String',
  args: {
    notificationId: nullable(intArg()),
  },
  resolve: markReadMutation,
});

import { FieldResolver, mutationField, intArg } from '@nexus/schema';

import { CONTENT_JSON } from '../../constants';
import { errorHandler } from '../../helpers';
import { Context } from '../../types';

export let markReadMutation: FieldResolver<'Mutation', 'markRead'> = async (
  _,
  { notificationId },
  context: Context,
) => {
  const config = {
    headers: {
      'Content-Type': CONTENT_JSON,
    },
  };
  try {
    await context.client.put(
      `/notifications/mark-read.json`,
      JSON.stringify({ id: notificationId }),
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
    notificationId: intArg(),
  },
  resolve: markReadMutation,
});

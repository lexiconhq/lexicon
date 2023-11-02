import { stringify } from 'querystring';

import camelcaseKey from 'camelcase-keys';
import snakecaseKey from 'snakecase-keys';
import { FieldResolver, mutationField, arg } from 'nexus';

import { CONTENT_FORM_URLENCODED } from '../../constants';
import { errorHandler, formatPolls } from '../../helpers';
import { Context } from '../../types';

export let newPrivateMessageResolver: FieldResolver<
  'Mutation',
  'newPrivateMessage'
> = async (_, { newPrivateMessageInput }, context: Context) => {
  let pmInputSnake = snakecaseKey({
    ...newPrivateMessageInput,
    targetRecipients: newPrivateMessageInput.targetRecipients.join(','),
    archetype: 'private_message',
  });
  const config = {
    headers: {
      'Content-Type': CONTENT_FORM_URLENCODED,
    },
  };
  try {
    let { data } = await context.client.post(
      '/posts.json',
      stringify(pmInputSnake),
      config,
    );

    let newPrivateMessageData = camelcaseKey(data, { deep: true });
    const { formattedPolls, formattedPollsVotes } = formatPolls(
      newPrivateMessageData.polls,
      newPrivateMessageData.pollsVotes,
    );

    return {
      ...newPrivateMessageData,
      polls: formattedPolls,
      pollsVotes: formattedPollsVotes,
    };
  } catch (e) {
    errorHandler(e);
  }
};

export let newPrivateMessageMutation = mutationField('newPrivateMessage', {
  type: 'Post',
  args: {
    newPrivateMessageInput: arg({
      type: 'NewPrivateMessageInput',
    }),
  },
  resolve: newPrivateMessageResolver,
});

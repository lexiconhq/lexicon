import { stringify } from 'querystring';

import snakecaseKeys from 'snakecase-keys';
import { FieldResolver, mutationField, stringArg } from '@nexus/schema';

import { CONTENT_FORM_URLENCODED } from '../../constants';
import { errorHandler } from '../../helpers';
import { Context } from '../../types';

export let changeUsernameResolver: FieldResolver<
  'Mutation',
  'changeUsername'
> = async (_, { newUsername, oldUsername }, context: Context) => {
  const config = {
    headers: {
      'Content-Type': CONTENT_FORM_URLENCODED,
    },
  };
  let body = snakecaseKeys({ newUsername });
  try {
    let { data } = await context.client.put(
      `/u/${oldUsername}/preferences/username.json`,
      stringify(body),
      config,
    );
    return data;
  } catch (e) {
    errorHandler(e);
  }
};

export let changeUsernameMutation = mutationField('changeUsername', {
  type: 'ChangeUsernameOutput',
  args: {
    newUsername: stringArg({ required: true }),
    oldUsername: stringArg({ required: true }),
  },
  resolve: changeUsernameResolver,
});

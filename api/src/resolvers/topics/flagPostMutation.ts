import { stringify } from 'querystring';

import camelcaseKeys from 'camelcase-keys';
import {
  FieldResolver,
  mutationField,
  intArg,
  stringArg,
  nullable,
} from 'nexus';

import { ACCEPTED_LANGUAGE, CONTENT_FORM_URLENCODED } from '../../constants';
import { errorHandler } from '../../helpers';
import { Context } from '../../types';

export let flagPostResolver: FieldResolver<'Mutation', 'flagPost'> = async (
  _,
  { postId, postActionTypeId },
  context: Context,
) => {
  const config = {
    headers: {
      'Accept-Language': ACCEPTED_LANGUAGE,
      'Content-Type': CONTENT_FORM_URLENCODED,
    },
  };
  let body = {
    id: postId,
    post_action_type_id: postActionTypeId,
  };
  try {
    let { data } = await context.client.post(
      `/post_actions.json`,
      stringify(body),
      config,
    );
    return camelcaseKeys(data, { deep: true });
  } catch (e) {
    errorHandler(e);
  }
};

export let flagPostMutation = mutationField('flagPost', {
  type: 'Post',
  args: {
    postId: intArg(),
    postActionTypeId: intArg(),
    message: nullable(stringArg()),
    //you can add flagTopic in args
  },
  resolve: flagPostResolver,
});

import { stringify } from 'querystring';

import camelcaseKeys from 'camelcase-keys';
import {
  FieldResolver,
  mutationField,
  booleanArg,
  intArg,
} from '@nexus/schema';

import { ACCEPTED_LANGUAGE, CONTENT_FORM_URLENCODED } from '../../constants';
import { errorHandler } from '../../helpers';
import { Context } from '../../types';

export let likePostResolver: FieldResolver<'Mutation', 'likePost'> = async (
  _,
  { postId, unlike, postList },
  context: Context,
) => {
  let body = {
    // eslint-disable-next-line @typescript-eslint/camelcase
    post_action_type_id: 2,
  };
  const config = {
    headers: {
      'Accept-Language': ACCEPTED_LANGUAGE,
      'Content-Type': CONTENT_FORM_URLENCODED,
    },
    params: unlike && body,
  };

  const postConfig = {
    headers: {
      'Accept-Language': ACCEPTED_LANGUAGE,
    },
    // eslint-disable-next-line @typescript-eslint/camelcase
    params: { post_ids: null, include_raw: true },
  };

  try {
    if (postList) {
      let url = `/t/${postId}.json`;
      let { data: topicDetailResult } = await context.client.get(
        url,
        postConfig,
      );
      let selectedTopic = camelcaseKeys(topicDetailResult, { deep: true });
      let post = selectedTopic.postStream.posts[0];
      postId = post.id;
      let { canUndo, acted } = post.actionsSummary.find(
        (actionSummary: { id: number }) => actionSummary.id === 2,
      );
      if (!canUndo && acted) {
        throw new Error('Already passed the time limit to unlike');
      }
    }
    if (unlike) {
      let { data } = await context.client.delete(
        `/post_actions/${postId}.json`,
        config,
      );
      return camelcaseKeys(data, { deep: true });
    } else {
      Object.assign(body, { id: postId });
      let { data } = await context.client.post(
        `/post_actions.json`,
        stringify(body),
        config,
      );
      return camelcaseKeys(data, { deep: true });
    }
  } catch (e) {
    errorHandler(e);
  }
};

export let likePostMutation = mutationField('likePost', {
  type: 'Post',
  args: {
    postId: intArg({ required: true }),
    unlike: booleanArg(),
    postList: booleanArg(),
    //you can add flagTopic in args
  },
  resolve: likePostResolver,
});

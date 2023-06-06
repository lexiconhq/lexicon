import {
  FieldResolver,
  mutationField,
  booleanArg,
  intArg,
  nullable,
} from 'nexus';
import camelcaseKeys from 'camelcase-keys';
import { AxiosError } from 'axios';

import {
  ACCEPTED_LANGUAGE,
  CONTENT_JSON,
  errorTypes,
  LIKE_ACTION_ID,
} from '../../constants';
import {
  errorHandler,
  getUpdatedLikedTopic,
  fetchTopicDetail,
  fetchPost,
} from '../../helpers';
import { LikableEntity, likeErrorHandler } from '../../helpers/likeErroHandler';
import { ActionsSummary, Context, LikedTopic } from '../../types';

export let likeTopicOrPostResolver: FieldResolver<
  'Mutation',
  'likeTopicOrPost'
> = async (_, { postId, topicId, unlike }, { client }: Context) => {
  const body = {
    post_action_type_id: LIKE_ACTION_ID,
  };
  const config = {
    headers: {
      'Accept-Language': ACCEPTED_LANGUAGE,
      'Content-Type': CONTENT_JSON,
    },
    params: unlike ? body : undefined,
  };

  try {
    if ((!postId && !topicId) || (postId && topicId)) {
      throw new Error('Please provide either only the post ID or the topic ID');
    }

    let likableEntity: LikableEntity = 'post';
    let currentLikedTopicResponse: LikedTopic | null = null;
    let actionsSummary: ActionsSummary | null = null;

    // Get the first post actions summary and ID of the topic
    if (topicId) {
      const { likeCount, postStream } = await fetchTopicDetail({
        topicId,
        client,
      });
      likableEntity = 'topic';
      const post = postStream.posts[0];
      postId = post.id;
      if (!postId) {
        throw new Error('Unable to find the first post of this topic');
      }
      actionsSummary = post.actionsSummary;
      currentLikedTopicResponse = {
        postId,
        topicId,
        likeCount,
        id: postId,
        liked: !unlike,
      };
    }

    // Try-catch block to handle like mutation error
    try {
      // Unliking topic or post
      if (unlike) {
        let { data } = await client.delete(
          `/post_actions/${postId}.json`,
          config,
        );

        if (topicId && currentLikedTopicResponse) {
          return getUpdatedLikedTopic({
            currentLikedTopicResponse,
            isLiked: false,
          });
        }
        return camelcaseKeys(data, { deep: true });
      }

      // Liking topic or post
      let likeRequestData = { ...body, id: postId };
      let { data } = await client.post(
        `/post_actions.json`,
        likeRequestData,
        config,
      );

      if (topicId && currentLikedTopicResponse) {
        return getUpdatedLikedTopic({
          currentLikedTopicResponse,
          isLiked: true,
        });
      }
      return camelcaseKeys(data, { deep: true });
    } catch (unknownError) {
      const e = unknownError as AxiosError;
      let errorType = e?.response?.data?.error_type;
      // Let the error handler handle this
      if (errorType === errorTypes.unauthenticatedAccess) {
        throw e;
      }

      /**
       * Get actions summary from the specified post ID
       * only when content type is post, because we already have
       * the actionsSummary from topic detail when content
       * type is topic
       */
      if (likableEntity === 'post' && postId) {
        const post = await fetchPost({ client, postId });
        actionsSummary = post.actionsSummary;
      }
      likeErrorHandler(e, { actionsSummary, likableEntity, like: !unlike });
    }
  } catch (e) {
    errorHandler(e);
  }
};

export let likeTopicOrPostMutation = mutationField('likeTopicOrPost', {
  type: 'LikeOutputUnion',
  args: {
    postId: nullable(intArg()),
    topicId: nullable(intArg()),
    unlike: nullable(booleanArg()),
    //you can add flagTopic in args
  },
  resolve: likeTopicOrPostResolver,
});
